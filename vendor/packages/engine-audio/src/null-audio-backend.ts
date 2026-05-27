import type { AudioClipAssetDocument } from '../../engine-asset/src/index.js';
import type {
  AudioBackend,
  AudioPlaybackId,
  AudioPlaybackOptions
} from './audio-backend.js';

export interface NullAudioPlaybackRecord {
  readonly id: AudioPlaybackId;
  readonly clipId: string;
  readonly channel: 'music' | 'sfx';
  volume: number;
  readonly loop: boolean;
  stopped: boolean;
}

export class NullAudioBackend implements AudioBackend {
  private readonly loaded = new Set<string>();
  private readonly playbacks = new Map<AudioPlaybackId, NullAudioPlaybackRecord>();
  private nextPlaybackId = 1;
  private suspended = false;

  readonly events: Array<{ readonly kind: 'play' | 'stop' | 'volume' | 'resume' | 'suspend'; readonly playbackId?: AudioPlaybackId; readonly clipId?: string }> = [];

  resume(): void {
    this.suspended = false;
    this.events.push({ kind: 'resume' });
  }

  suspend(): void {
    this.suspended = true;
    this.events.push({ kind: 'suspend' });
  }

  isSuspended(): boolean {
    return this.suspended;
  }

  async load(clip: AudioClipAssetDocument): Promise<void> {
    this.loaded.add(clip.id);
  }

  preload(clip: AudioClipAssetDocument): void {
    this.loaded.add(clip.id);
  }

  isLoaded(clipId: string): boolean {
    return this.loaded.has(clipId);
  }

  play(options: AudioPlaybackOptions): AudioPlaybackId | undefined {
    if (!this.loaded.has(options.clip.id)) {
      return undefined;
    }

    const id = this.nextPlaybackId;
    this.nextPlaybackId += 1;

    this.playbacks.set(id, {
      id,
      clipId: options.clip.id,
      channel: options.channel,
      volume: options.volume,
      loop: options.loop,
      stopped: false
    });

    this.events.push({ kind: 'play', playbackId: id, clipId: options.clip.id });
    return id;
  }

  stop(playback: AudioPlaybackId): void {
    const record = this.playbacks.get(playback);

    if (record === undefined || record.stopped) {
      return;
    }

    record.stopped = true;
    this.events.push({ kind: 'stop', playbackId: playback, clipId: record.clipId });
  }

  setPlaybackVolume(playback: AudioPlaybackId, volume: number): void {
    const record = this.playbacks.get(playback);

    if (record === undefined) {
      return;
    }

    record.volume = volume;
    this.events.push({ kind: 'volume', playbackId: playback, clipId: record.clipId });
  }

  stopAll(): void {
    for (const playback of this.playbacks.values()) {
      if (playback.stopped) {
        continue;
      }

      playback.stopped = true;
      this.events.push({ kind: 'stop', playbackId: playback.id, clipId: playback.clipId });
    }
  }

  activePlaybacks(): readonly NullAudioPlaybackRecord[] {
    return [...this.playbacks.values()].filter((entry) => !entry.stopped);
  }

  getPlayback(id: AudioPlaybackId): NullAudioPlaybackRecord | undefined {
    return this.playbacks.get(id);
  }
}
