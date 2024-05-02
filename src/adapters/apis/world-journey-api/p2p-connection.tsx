type OnMessage = (msg: string) => void;

export class P2pConnection {
  constructor(
    private p2pConn: RTCPeerConnection,
    private iceCandidates: RTCIceCandidate[],
    private dataChannel: RTCDataChannel | null,
    private isDataChannelReady: boolean,
    private onMessage: OnMessage
  ) {}

  static create(options: { onMessage: OnMessage }) {
    return new P2pConnection(new RTCPeerConnection(), [], null, false, options.onMessage);
  }

  public async createOffer(): Promise<[RTCSessionDescription | null, RTCIceCandidate[]]> {
    await new Promise((resolve) => {
      const dataChannel = this.p2pConn.createDataChannel('dataChannel');
      dataChannel.addEventListener('message', (evt: MessageEvent<string>) => {
        this.onMessage(evt.data);
      });
      dataChannel.addEventListener('open', () => {
        this.isDataChannelReady = true;
      });
      dataChannel.addEventListener('close', () => {
        this.isDataChannelReady = false;
      });
      this.dataChannel = dataChannel;

      this.p2pConn.onicecandidate = (e) => {
        if (!e.candidate) {
          resolve(true);
        } else {
          this.iceCandidates.push(e.candidate);
        }
      };
      this.p2pConn.createOffer().then((offer) => {
        return this.p2pConn.setLocalDescription(offer);
      });
    });

    return [this.p2pConn.localDescription, this.iceCandidates];
  }

  public async acceptAnswer(answer: RTCSessionDescription, remoteIceCandidates: RTCIceCandidate[]) {
    this.p2pConn.setRemoteDescription(answer);
    remoteIceCandidates.forEach((remoteIceCandidate) => {
      this.p2pConn.addIceCandidate(remoteIceCandidate);
    });
  }

  public async createAnswer(
    offer: RTCSessionDescription,
    remoteIceCandidates: RTCIceCandidate[]
  ): Promise<[RTCSessionDescription | null, RTCIceCandidate[]]> {
    this.p2pConn.setRemoteDescription(offer);
    this.p2pConn.addEventListener('datachannel', (dataChannelEvent) => {
      this.dataChannel = dataChannelEvent.channel;
      this.dataChannel.addEventListener('message', (evt) => {
        this.onMessage(evt.data);
      });
      this.dataChannel.addEventListener('open', () => {
        this.isDataChannelReady = true;
      });
      this.dataChannel.addEventListener('close', () => {
        this.isDataChannelReady = false;
      });
    });

    remoteIceCandidates.forEach((remoteIceCandidate) => {
      this.p2pConn.addIceCandidate(remoteIceCandidate);
    });

    await new Promise((resolve) => {
      this.p2pConn.onicecandidate = (e) => {
        if (!e.candidate) {
          resolve(true);
        } else {
          this.iceCandidates.push(e.candidate);
        }
      };
      this.p2pConn.createAnswer().then((answer) => {
        return this.p2pConn.setLocalDescription(answer);
      });
    });

    return [this.p2pConn.localDescription, this.iceCandidates];
  }

  public getLocalDescription(): RTCSessionDescription | null {
    return this.p2pConn.localDescription;
  }

  public getIceCandidates(): RTCIceCandidate[] {
    return this.iceCandidates;
  }

  /**
   * Send message to remote peer
   * @returns succeeded
   */
  public sendMessage(msg: string): boolean {
    if (!this.dataChannel) return false;
    if (this.dataChannel?.readyState !== 'open') return false;

    this.dataChannel.send(msg);
    return true;
  }
}
