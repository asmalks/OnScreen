import { supabase } from './supabase';

const configuration: RTCConfiguration = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
};

export class WebRTCHost {
    private pc: RTCPeerConnection | null = null;
    private channel: ReturnType<typeof supabase.channel> | null = null;
    public stream: MediaStream | null = null;

    constructor(private sessionId: string, private onDeviceConnected: () => void) { }

    async startHosting(mediaStream: MediaStream) {
        this.stream = mediaStream;
        this.channel = supabase.channel(`session-${this.sessionId}`);

        this.channel.on('broadcast', { event: 'join' }, async (payload) => {
            console.log('Viewer joined!', payload);
            this.onDeviceConnected();

            // Cleanup previous connection if multiple joins happen
            if (this.pc) this.pc.close();

            this.pc = new RTCPeerConnection(configuration);

            this.stream?.getTracks().forEach((track) => {
                if (this.stream) this.pc?.addTrack(track, this.stream);
            });

            this.pc.onicecandidate = (event) => {
                if (event.candidate) {
                    this.channel?.send({ type: 'broadcast', event: 'ice-candidate', payload: { candidate: event.candidate, from: 'host' } });
                }
            };

            const offer = await this.pc.createOffer();
            await this.pc.setLocalDescription(offer);

            this.channel?.send({ type: 'broadcast', event: 'offer', payload: { offer } });
        });

        this.channel.on('broadcast', { event: 'answer' }, async ({ payload }) => {
            console.log('Received answer:', payload);
            if (this.pc && payload.answer) {
                await this.pc.setRemoteDescription(new RTCSessionDescription(payload.answer));
            }
        });

        this.channel.on('broadcast', { event: 'ice-candidate' }, async ({ payload }) => {
            if (payload.from === 'viewer' && this.pc && payload.candidate) {
                await this.pc.addIceCandidate(new RTCIceCandidate(payload.candidate));
            }
        });

        await this.channel.subscribe((status) => {
            if (status === 'SUBSCRIBED') {
                console.log(`Host subscribed to channel session-${this.sessionId}`);
            }
        });
    }

    stopHosting() {
        this.stream?.getTracks().forEach(track => track.stop());
        this.pc?.close();
        this.channel?.unsubscribe();
    }
}

export class WebRTCViewer {
    private pc: RTCPeerConnection | null = null;
    private channel: ReturnType<typeof supabase.channel> | null = null;
    public onStream: ((stream: MediaStream) => void) | null = null;

    constructor(private sessionId: string) { }

    async joinSession() {
        this.channel = supabase.channel(`session-${this.sessionId}`);

        this.channel.on('broadcast', { event: 'offer' }, async ({ payload }) => {
            console.log('Received offer');
            this.pc = new RTCPeerConnection(configuration);

            this.pc.ontrack = (event) => {
                if (event.streams && event.streams[0]) {
                    this.onStream?.(event.streams[0]);
                }
            };

            this.pc.onicecandidate = (event) => {
                if (event.candidate) {
                    this.channel?.send({ type: 'broadcast', event: 'ice-candidate', payload: { candidate: event.candidate, from: 'viewer' } });
                }
            };

            await this.pc.setRemoteDescription(new RTCSessionDescription(payload.offer));
            const answer = await this.pc.createAnswer();
            await this.pc.setLocalDescription(answer);

            this.channel?.send({ type: 'broadcast', event: 'answer', payload: { answer } });
        });

        this.channel.on('broadcast', { event: 'ice-candidate' }, async ({ payload }) => {
            if (payload.from === 'host' && this.pc && payload.candidate) {
                await this.pc.addIceCandidate(new RTCIceCandidate(payload.candidate));
            }
        });

        await this.channel.subscribe((status) => {
            if (status === 'SUBSCRIBED') {
                console.log(`Viewer subscribed to channel session-${this.sessionId}`);
                this.channel?.send({ type: 'broadcast', event: 'join', payload: {} });
            }
        });
    }

    leaveSession() {
        this.pc?.close();
        this.channel?.unsubscribe();
    }
}
