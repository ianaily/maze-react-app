import type { AudioClipAssetDocument, AudioClipChannel } from '../../engine-asset/src/index.js';

export interface AudioPlaybackOptions {
  readonly clip: AudioClipAssetDocument;
  readonly channel: AudioClipChannel;
  readonly volume: number;
  readonly loop: boolean;
}

export type AudioPlaybackId = number;

export interface AudioBackend {
  resume(): void;
  suspend(): void;
  load(clip: AudioClipAssetDocument): Promise<void>;
  isLoaded(clipId: string): boolean;
  play(options: AudioPlaybackOptions): AudioPlaybackId | undefined;
  stop(playback: AudioPlaybackId): void;
  setPlaybackVolume(playback: AudioPlaybackId, volume: number): void;
  stopAll(): void;
}
