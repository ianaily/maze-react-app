import type { EntityId } from '../../engine-core/src/index.js';
import type { AudioClipChannel } from '../../engine-asset/src/index.js';

export const AUDIO_PLAYBACK_NONE = 0;

export class AudioStore {
  private presentBuffer: Uint8Array = new Uint8Array(0);
  private autoplayBuffer: Uint8Array = new Uint8Array(0);
  private loopBuffer: Uint8Array = new Uint8Array(0);
  private startedBuffer: Uint8Array = new Uint8Array(0);

  readonly clipId: string[] = [];
  readonly channelOverride: (AudioClipChannel | undefined)[] = [];
  readonly volume: number[] = [];
  readonly playbackId: number[] = [];

  get present(): Uint8Array {
    return this.presentBuffer;
  }

  get autoplay(): Uint8Array {
    return this.autoplayBuffer;
  }

  get loop(): Uint8Array {
    return this.loopBuffer;
  }

  get started(): Uint8Array {
    return this.startedBuffer;
  }

  add(
    entity: EntityId,
    clipId: string,
    options: { autoplay?: boolean; loop?: boolean; volume?: number; channel?: AudioClipChannel } = {}
  ): void {
    this.ensureCapacity(entity);

    this.present[entity] = 1;
    this.autoplay[entity] = options.autoplay === true ? 1 : 0;
    this.loop[entity] = options.loop === true ? 1 : 0;
    this.started[entity] = 0;
    this.clipId[entity] = clipId;
    this.channelOverride[entity] = options.channel;
    this.volume[entity] = options.volume ?? 1;
    this.playbackId[entity] = AUDIO_PLAYBACK_NONE;
  }

  has(entity: EntityId): boolean {
    return this.present[entity] === 1;
  }

  remove(entity: EntityId): void {
    if (entity >= this.present.length) {
      return;
    }

    this.present[entity] = 0;
    this.autoplay[entity] = 0;
    this.loop[entity] = 0;
    this.started[entity] = 0;
    this.clipId[entity] = '';
    this.channelOverride[entity] = undefined;
    this.volume[entity] = 1;
    this.playbackId[entity] = AUDIO_PLAYBACK_NONE;
  }

  private ensureCapacity(entity: EntityId): void {
    if (entity < this.present.length) {
      return;
    }

    const nextLength = growCapacity(this.present.length, entity + 1);
    const nextPresent = new Uint8Array(nextLength);
    const nextAutoplay = new Uint8Array(nextLength);
    const nextLoop = new Uint8Array(nextLength);
    const nextStarted = new Uint8Array(nextLength);
    nextPresent.set(this.present);
    nextAutoplay.set(this.autoplay);
    nextLoop.set(this.loop);
    nextStarted.set(this.started);
    this.presentBuffer = nextPresent;
    this.autoplayBuffer = nextAutoplay;
    this.loopBuffer = nextLoop;
    this.startedBuffer = nextStarted;

    growStringArray(this.clipId, nextLength, '');
    growOptionalChannelArray(this.channelOverride, nextLength);
    growNumberArray(this.volume, nextLength, 1);
    growNumberArray(this.playbackId, nextLength, AUDIO_PLAYBACK_NONE);
  }
}

const growCapacity = (current: number, required: number): number => {
  let next = Math.max(current, 8);

  while (next < required) {
    next *= 2;
  }

  return next;
};

const growNumberArray = (target: number[], length: number, fill: number): void => {
  for (let index = target.length; index < length; index += 1) {
    target[index] = fill;
  }
};

const growStringArray = (target: string[], length: number, fill: string): void => {
  for (let index = target.length; index < length; index += 1) {
    target[index] = fill;
  }
};

const growOptionalChannelArray = (
  target: (AudioClipChannel | undefined)[],
  length: number
): void => {
  for (let index = target.length; index < length; index += 1) {
    target[index] = undefined;
  }
};
