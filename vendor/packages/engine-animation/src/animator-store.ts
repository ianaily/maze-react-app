import type { EntityId } from '../../engine-core/src/index.js';

export class AnimatorStore {
  private presentBuffer: Uint8Array = new Uint8Array(0);
  private playingBuffer: Uint8Array = new Uint8Array(0);

  readonly clipIndex: number[] = [];
  readonly elapsedSeconds: number[] = [];
  readonly frameIndex: number[] = [];
  readonly speed: number[] = [];

  get present(): Uint8Array {
    return this.presentBuffer;
  }

  get playing(): Uint8Array {
    return this.playingBuffer;
  }

  add(entity: EntityId, clipIndex: number): void {
    this.ensureCapacity(entity);

    this.present[entity] = 1;
    this.playing[entity] = 1;
    this.clipIndex[entity] = clipIndex;
    this.elapsedSeconds[entity] = 0;
    this.frameIndex[entity] = 0;
    this.speed[entity] = 1;
  }

  play(entity: EntityId, clipIndex: number, reset = true): void {
    this.ensureCapacity(entity);

    this.present[entity] = 1;
    this.playing[entity] = 1;
    this.clipIndex[entity] = clipIndex;

    if (reset) {
      this.elapsedSeconds[entity] = 0;
      this.frameIndex[entity] = 0;
    }

    if (this.speed[entity] === undefined) {
      this.speed[entity] = 1;
    }
  }

  stop(entity: EntityId): void {
    if (entity < this.playing.length) {
      this.playing[entity] = 0;
    }
  }

  has(entity: EntityId): boolean {
    return this.present[entity] === 1;
  }

  remove(entity: EntityId): void {
    if (entity < this.present.length) {
      this.present[entity] = 0;
      this.playing[entity] = 0;
    }
  }

  private ensureCapacity(entity: EntityId): void {
    if (entity < this.present.length) {
      return;
    }

    const nextLength = growCapacity(this.present.length, entity + 1);
    const nextPresent = new Uint8Array(nextLength);
    const nextPlaying = new Uint8Array(nextLength);
    nextPresent.set(this.present);
    nextPlaying.set(this.playing);
    this.presentBuffer = nextPresent;
    this.playingBuffer = nextPlaying;

    growNumberArray(this.clipIndex, nextLength, -1);
    growNumberArray(this.elapsedSeconds, nextLength, 0);
    growNumberArray(this.frameIndex, nextLength, 0);
    growNumberArray(this.speed, nextLength, 1);
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
