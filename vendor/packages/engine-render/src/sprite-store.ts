import type { EntityId } from '../../engine-core/src/index.js';

export class SpriteStore {
  private presentBuffer: Uint8Array = new Uint8Array(0);

  readonly assetId: string[] = [];
  readonly width: number[] = [];
  readonly height: number[] = [];
  readonly offsetX: number[] = [];
  readonly offsetY: number[] = [];
  readonly alpha: number[] = [];

  get present(): Uint8Array {
    return this.presentBuffer;
  }

  add(entity: EntityId, assetId: string, width: number, height: number): void {
    if (assetId.length === 0) {
      throw new Error('Sprite asset id must not be empty.');
    }

    if (width <= 0 || height <= 0) {
      throw new Error('Sprite size must be positive.');
    }

    this.ensureCapacity(entity);

    this.present[entity] = 1;
    this.assetId[entity] = assetId;
    this.width[entity] = width;
    this.height[entity] = height;
    this.offsetX[entity] = 0;
    this.offsetY[entity] = 0;
    this.alpha[entity] = 1;
  }

  has(entity: EntityId): boolean {
    return this.present[entity] === 1;
  }

  remove(entity: EntityId): void {
    if (entity < this.present.length) {
      this.present[entity] = 0;
    }
  }

  private ensureCapacity(entity: EntityId): void {
    if (entity < this.present.length) {
      return;
    }

    const nextLength = growCapacity(this.present.length, entity + 1);
    const nextPresent = new Uint8Array(nextLength);
    nextPresent.set(this.present);
    this.presentBuffer = nextPresent;

    growStringArray(this.assetId, nextLength, '');
    growNumberArray(this.width, nextLength, 1);
    growNumberArray(this.height, nextLength, 1);
    growNumberArray(this.offsetX, nextLength, 0);
    growNumberArray(this.offsetY, nextLength, 0);
    growNumberArray(this.alpha, nextLength, 1);
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
