import type { AudioClipAssetDocument } from '../../engine-asset/src/index.js';
import type {
  AudioBackend,
  AudioPlaybackId,
  AudioPlaybackOptions
} from './audio-backend.js';

export interface WebAudioBackendOptions {
  readonly context: AudioContext;
  readonly resolveSource?: (clip: AudioClipAssetDocument) => string;
  readonly fetch?: typeof fetch;
  readonly destination?: AudioNode;
}

interface ActivePlayback {
  readonly id: AudioPlaybackId;
  readonly source: AudioBufferSourceNode;
  readonly gain: GainNode;
}

export class WebAudioBackend implements AudioBackend {
  private readonly context: AudioContext;
  private readonly destination: AudioNode;
  private readonly resolveSource: (clip: AudioClipAssetDocument) => string;
  private readonly fetchImpl: typeof fetch;
  private readonly buffers = new Map<string, AudioBuffer>();
  private readonly pending = new Map<string, Promise<void>>();
  private readonly playbacks = new Map<AudioPlaybackId, ActivePlayback>();
  private nextPlaybackId = 1;

  constructor(options: WebAudioBackendOptions) {
    this.context = options.context;
    this.destination = options.destination ?? options.context.destination;
    this.resolveSource = options.resolveSource ?? ((clip) => clip.source);
    this.fetchImpl = options.fetch ?? fetch;
  }

  resume(): void {
    if (this.context.state === 'suspended') {
      void this.context.resume();
    }
  }

  suspend(): void {
    if (this.context.state === 'running') {
      void this.context.suspend();
    }
  }

  isLoaded(clipId: string): boolean {
    return this.buffers.has(clipId);
  }

  registerBuffer(clipId: string, buffer: AudioBuffer): void {
    this.buffers.set(clipId, buffer);
  }

  async load(clip: AudioClipAssetDocument): Promise<void> {
    if (this.buffers.has(clip.id)) {
      return;
    }

    const inflight = this.pending.get(clip.id);

    if (inflight !== undefined) {
      await inflight;
      return;
    }

    const promise = this.fetchAndDecode(clip);
    this.pending.set(clip.id, promise);

    try {
      await promise;
    } finally {
      this.pending.delete(clip.id);
    }
  }

  play(options: AudioPlaybackOptions): AudioPlaybackId | undefined {
    const buffer = this.buffers.get(options.clip.id);

    if (buffer === undefined) {
      return undefined;
    }

    const source = this.context.createBufferSource();
    source.buffer = buffer;
    source.loop = options.loop;

    const gain = this.context.createGain();
    gain.gain.value = options.volume;

    source.connect(gain);
    gain.connect(this.destination);

    const id = this.nextPlaybackId;
    this.nextPlaybackId += 1;

    source.onended = (): void => {
      this.playbacks.delete(id);
      source.disconnect();
      gain.disconnect();
    };

    source.start();
    this.playbacks.set(id, { id, source, gain });
    return id;
  }

  stop(playback: AudioPlaybackId): void {
    const active = this.playbacks.get(playback);

    if (active === undefined) {
      return;
    }

    try {
      active.source.stop();
    } catch {
      // already stopped; the onended handler clears state
    }
  }

  setPlaybackVolume(playback: AudioPlaybackId, volume: number): void {
    const active = this.playbacks.get(playback);

    if (active === undefined) {
      return;
    }

    active.gain.gain.value = volume;
  }

  stopAll(): void {
    for (const id of [...this.playbacks.keys()]) {
      this.stop(id);
    }
  }

  private async fetchAndDecode(clip: AudioClipAssetDocument): Promise<void> {
    const url = this.resolveSource(clip);
    const response = await this.fetchImpl(url);

    if (!response.ok) {
      throw new Error(`Failed to load audio clip "${clip.id}" from ${url}: ${response.status}`);
    }

    const data = await response.arrayBuffer();
    const buffer = await this.context.decodeAudioData(data);
    this.buffers.set(clip.id, buffer);
  }
}
