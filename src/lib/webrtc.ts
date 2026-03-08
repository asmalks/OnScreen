import { supabase } from './supabase';

const configuration: RTCConfiguration = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
    ],
};

export class WebRTCHost {
    private pc: RTCPeerConnection | null = null;
    private channel: ReturnType<typeof supabase.channel> | null = null;
    public stream: MediaStream | null = null;
    private iceCandidatesQueue: RTCIceCandidateInit[] = [];
    private remoteDescriptionSet = false;

    constructor(private sessionId: string, private onDeviceConnected: () => void) { }

    async startHosting(mediaStream: MediaStream) {
        this.stream = mediaStream;
        this.channel = supabase.channel(`session-${this.sessionId}`);

        this.channel.on('broadcast', { event: 'join' }, async (payload) => {
            console.log('Viewer joined!', payload);
            this.onDeviceConnected();
            this.remoteDescriptionSet = false;
            this.iceCandidatesQueue = [];

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
                this.remoteDescriptionSet = true;

                // Process any queued ICE candidates that arrived before the answer
                for (const candidate of this.iceCandidatesQueue) {
                    await this.pc.addIceCandidate(new RTCIceCandidate(candidate));
                }
                this.iceCandidatesQueue = [];
            }
        });

        this.channel.on('broadcast', { event: 'ice-candidate' }, async ({ payload }) => {
            if (payload.from === 'viewer' && this.pc && payload.candidate) {
                if (this.remoteDescriptionSet) {
                    await this.pc.addIceCandidate(new RTCIceCandidate(payload.candidate));
                } else {
                    this.iceCandidatesQueue.push(payload.candidate);
                }
            }
        });

        await this.channel.subscribe((status) => {
            if (status === 'SUBSCRIBED') {
                console.log(`Host subscribed to channel session-${this.sessionId}`);
            }
        });
    }

    stopHosting() {
        if (this.pc) {
            this.pc.close();
            this.pc = null;
        }
        if (this.channel) {
            supabase.removeChannel(this.channel);
            this.channel = null;
        }
    }
}

export class WebRTCViewer {
    private pc: RTCPeerConnection | null = null;
    private channel: ReturnType<typeof supabase.channel> | null = null;
    public onStream: ((stream: MediaStream) => void) | null = null;
    public onStatus: ((status: string) => void) | null = null;
    private iceCandidatesQueue: RTCIceCandidateInit[] = [];
    private remoteDescriptionSet = false;

    constructor(private sessionId: string) { }

    async joinSession() {
        this.channel = supabase.channel(`session-${this.sessionId}`);

        this.channel.on('broadcast', { event: 'offer' }, async ({ payload }) => {
            console.log('Received offer');
            this.onStatus?.("Checking Connection...");
            this.remoteDescriptionSet = false;
            this.iceCandidatesQueue = [];

            if (this.pc) this.pc.close();
            this.pc = new RTCPeerConnection(configuration);

            const remoteStream = new MediaStream();

            this.pc.ontrack = (event) => {
                console.log('Track received!', event.track.kind);
                remoteStream.addTrack(event.track);
                this.onStream?.(remoteStream);
                this.onStatus?.("Connected!");
            };

            this.pc.onicecandidate = (event) => {
                if (event.candidate) {
                    this.channel?.send({ type: 'broadcast', event: 'ice-candidate', payload: { candidate: event.candidate, from: 'viewer' } });
                }
            };

            await this.pc.setRemoteDescription(new RTCSessionDescription(payload.offer));
            this.remoteDescriptionSet = true;

            const answer = await this.pc.createAnswer();
            await this.pc.setLocalDescription(answer);

            this.channel?.send({ type: 'broadcast', event: 'answer', payload: { answer } });

            // Process any queued ICE candidates that arrived before the offer
            for (const candidate of this.iceCandidatesQueue) {
                await this.pc.addIceCandidate(new RTCIceCandidate(candidate));
            }
            this.iceCandidatesQueue = [];
        });

        this.channel.on('broadcast', { event: 'ice-candidate' }, async ({ payload }) => {
            if (payload.from === 'host' && this.pc && payload.candidate) {
                if (this.remoteDescriptionSet) {
                    await this.pc.addIceCandidate(new RTCIceCandidate(payload.candidate));
                } else {
                    this.iceCandidatesQueue.push(payload.candidate);
                }
            }
        });

        await this.channel.subscribe((status) => {
            if (status === 'SUBSCRIBED') {
                console.log(`Viewer subscribed to channel session-${this.sessionId}`);
                this.onStatus?.("Waiting for Host...");
                // Tell the host we joined so they can create an offer
                this.channel?.send({ type: 'broadcast', event: 'join', payload: {} });
            }
        });
    }

    leaveSession() {
        if (this.pc) {
            this.pc.close();
            this.pc = null;
        }
        if (this.channel) {
            supabase.removeChannel(this.channel);
            this.channel = null;
        }
    }
}
