import { toEntityId, type EntityId, type System, type World } from '../../engine-core/src/index.js';
import type {
  AssetCatalogDocument,
  AudioClipAssetDocument,
  AudioClipChannel
} from '../../engine-asset/src/index.js';
import { AUDIO_PLAYBACK_NONE, AudioStore } from './audio-store.js';
import { AudioMixer } from './audio-channels.js';
import type { AudioBackend, AudioPlaybackId } from './audio-backend.js';
import { findAudioClip } from './audio-catalog.js';

export interface AudioSystemOptions {
  readonly audio: AudioStore;
  readonly mixer: AudioMixer;
  readonly backend: AudioBackend;
  readonly priority?: number;
  readonly catalog?: () => AssetCatalogDocument | undefined;
}

export class AudioSystem implements System {
  readonly name = 'audio';
  readonly priority: number;

  private readonly store: AudioStore;
  private readonly mixer: AudioMixer;
  private readonly backend: AudioBackend;
  private readonly catalogSource: (() => AssetCatalogDocument | undefined) | undefined;

  constructor(options: AudioSystemOptions) {
    this.store = options.audio;
    this.mixer = options.mixer;
    this.backend = options.backend;
    this.priority = options.priority ?? 100;
    this.catalogSource = options.catalog;
  }

  update(world: World): void {
    const catalog = this.catalogSource?.();
    const present = this.store.present;

    for (let index = 0; index < present.length; index += 1) {
      if (present[index] !== 1) {
        continue;
      }

      const entityId = toEntityId(index);

      if (!world.hasEntity(entityId)) {
        continue;
      }

      this.syncEntity(entityId, catalog);
    }
  }

  startPending(catalog: AssetCatalogDocument | undefined = this.catalogSource?.()): void {
    const present = this.store.present;

    for (let index = 0; index < present.length; index += 1) {
      if (present[index] !== 1) {
        continue;
      }

      this.syncEntity(toEntityId(index), catalog);
    }
  }

  stopAll(): void {
    const playbacks = this.store.playbackId;

    for (let index = 0; index < playbacks.length; index += 1) {
      const playback = playbacks[index] ?? AUDIO_PLAYBACK_NONE;

      if (playback !== AUDIO_PLAYBACK_NONE) {
        this.backend.stop(playback);
      }

      playbacks[index] = AUDIO_PLAYBACK_NONE;
      this.store.started[index] = 0;
    }
  }

  private syncEntity(entity: EntityId, catalog: AssetCatalogDocument | undefined): void {
    if (this.store.autoplay[entity] !== 1 || this.store.started[entity] === 1) {
      return;
    }

    const clipId = this.store.clipId[entity] ?? '';

    if (clipId.length === 0) {
      return;
    }

    const clip = findAudioClip(catalog, clipId);

    if (clip === undefined || !this.backend.isLoaded(clip.id)) {
      return;
    }

    const channel = pickChannel(this.store.channelOverride[entity], clip);
    const clipVolume = this.store.volume[entity] ?? clip.defaultVolume ?? 1;
    const effective = this.mixer.effectiveVolume(channel, clipVolume);
    const loop = this.store.loop[entity] === 1 || clip.defaultLoop === true;

    const playback = this.backend.play({
      clip,
      channel,
      volume: effective,
      loop
    });

    if (playback === undefined) {
      return;
    }

    this.store.playbackId[entity] = playback;
    this.store.started[entity] = 1;
  }

  applyMixerToActive(): void {
    const playbacks = this.store.playbackId;

    for (let index = 0; index < playbacks.length; index += 1) {
      const playback = playbacks[index] ?? AUDIO_PLAYBACK_NONE;

      if (playback === AUDIO_PLAYBACK_NONE || this.store.present[index] !== 1) {
        continue;
      }

      const channel = pickChannelByOverride(this.store.channelOverride[index]);
      const clipVolume = this.store.volume[index] ?? 1;
      this.backend.setPlaybackVolume(playback as AudioPlaybackId, this.mixer.effectiveVolume(channel, clipVolume));
    }
  }
}

const pickChannel = (
  override: AudioClipChannel | undefined,
  clip: AudioClipAssetDocument
): AudioClipChannel => override ?? clip.channel ?? 'sfx';

const pickChannelByOverride = (override: AudioClipChannel | undefined): AudioClipChannel =>
  override ?? 'sfx';
