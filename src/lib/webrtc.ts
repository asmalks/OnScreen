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

    constructor(private sessionId: string, private onDeviceConnected: () => void, private onDebugLog?: (msg: string) => void) { }

    private log(msg: string) {
        console.log(msg);
        this.onDebugLog?.(`[HOST] ${msg}`);
    }

    async startHosting(mediaStream: MediaStream) {
        this.stream = mediaStream;
        this.log("Initializing host channel...");
        this.channel = supabase.channel(`session-${this.sessionId}`);

        this.channel.on('broadcast', { event: 'join' }, async (payload) => {
            this.log('Viewer joined! Creating offer...');
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
            this.log('Sending offer to viewer...');

            this.channel?.send({ type: 'broadcast', event: 'offer', payload: { offer } });
        });

        this.channel.on('broadcast', { event: 'answer' }, async ({ payload }) => {
            this.log('Received answer from viewer!');
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
                this.log('Host received ICE candidate');
                if (this.remoteDescriptionSet) {
                    await this.pc.addIceCandidate(new RTCIceCandidate(payload.candidate));
                } else {
                    this.iceCandidatesQueue.push(payload.candidate);
                }
            }
        });

        await this.channel.subscribe((status) => {
            this.log(`Host subscribe status: ${status}`);
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
    public onDebugLog: ((msg: string) => void) | null = null;
    private iceCandidatesQueue: RTCIceCandidateInit[] = [];
    private remoteDescriptionSet = false;

    constructor(private sessionId: string) { }

    private log(msg: string) {
        console.log(msg);
        this.onDebugLog?.(`[VIEWER] ${msg}`);
    }

    async joinSession() {
        this.log("Initializing viewer channel...");
        this.channel = supabase.channel(`session-${this.sessionId}`);

        this.channel.on('broadcast', { event: 'offer' }, async ({ payload }) => {
            this.log('Received offer! Creating answer...');
            this.onStatus?.("Checking Connection...");
            this.remoteDescriptionSet = false;
            this.iceCandidatesQueue = [];

            if (this.pc) this.pc.close();
            this.pc = new RTCPeerConnection(configuration);

            const remoteStream = new MediaStream();

            this.pc.ontrack = (event) => {
                this.log(`Track received! (${event.track.kind})`);
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
            this.log('Set remote description');

            const answer = await this.pc.createAnswer();
            await this.pc.setLocalDescription(answer);

            this.log('Sending answer to host...');
            this.channel?.send({ type: 'broadcast', event: 'answer', payload: { answer } });

            // Process any queued ICE candidates that arrived before the offer
            for (const candidate of this.iceCandidatesQueue) {
                await this.pc.addIceCandidate(new RTCIceCandidate(candidate));
            }
            this.iceCandidatesQueue = [];
        });

        this.channel.on('broadcast', { event: 'ice-candidate' }, async ({ payload }) => {
            if (payload.from === 'host' && this.pc && payload.candidate) {
                this.log('Viewer received ICE candidate');
                if (this.remoteDescriptionSet) {
                    await this.pc.addIceCandidate(new RTCIceCandidate(payload.candidate));
                } else {
                    this.iceCandidatesQueue.push(payload.candidate);
                }
            }
        });

        await this.channel.subscribe((status) => {
            this.log(`Viewer subscribe status: ${status}`);
            if (status === 'SUBSCRIBED') {
                this.onStatus?.("Waiting for Host...");
                this.log('Sending join event to host...');
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
