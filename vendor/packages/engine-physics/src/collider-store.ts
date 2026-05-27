import type { EntityId } from '../../engine-core/src/index.js';
import type { MutableAabb } from '../../engine-math/src/index.js';

export class ColliderStore {
  private presentBuffer: Uint8Array = new Uint8Array(0);
  private triggerBuffer: Uint8Array = new Uint8Array(0);

  readonly offsetX: number[] = [];
  readonly offsetY: number[] = [];
  readonly width: number[] = [];
  readonly height: number[] = [];
  readonly categoryBits: number[] = [];
  readonly maskBits: number[] = [];
  readonly minX: number[] = [];
  readonly minY: number[] = [];
  readonly maxX: number[] = [];
  readonly maxY: number[] = [];

  get present(): Uint8Array {
    return this.presentBuffer;
  }

  get isTrigger(): Uint8Array {
    return this.triggerBuffer;
  }

  add(entity: EntityId, width: number, height: number): void {
    if (width <= 0 || height <= 0) {
      throw new Error('Collider size must be positive.');
    }

    this.ensureCapacity(entity);

    this.present[entity] = 1;
    this.offsetX[entity] = 0;
    this.offsetY[entity] = 0;
    this.width[entity] = width;
    this.height[entity] = height;
    this.categoryBits[entity] = 1;
    this.maskBits[entity] = 0xffff_ffff;
    this.isTrigger[entity] = 0;
    this.minX[entity] = 0;
    this.minY[entity] = 0;
    this.maxX[entity] = width;
    this.maxY[entity] = height;
  }

  has(entity: EntityId): boolean {
    return this.present[entity] === 1;
  }

  remove(entity: EntityId): void {
    if (entity < this.present.length) {
      this.present[entity] = 0;
    }
  }

  writeBounds(entity: EntityId, out: MutableAabb): MutableAabb {
    out.minX = this.minX[entity] ?? 0;
    out.minY = this.minY[entity] ?? 0;
    out.maxX = this.maxX[entity] ?? 0;
    out.maxY = this.maxY[entity] ?? 0;
    return out;
  }

  private ensureCapacity(entity: EntityId): void {
    if (entity < this.present.length) {
      return;
    }

    const nextLength = growCapacity(this.present.length, entity + 1);
    const nextPresent = new Uint8Array(nextLength);
    nextPresent.set(this.present);
    this.presentBuffer = nextPresent;

    const nextIsTrigger = new Uint8Array(nextLength);
    nextIsTrigger.set(this.isTrigger);
    this.triggerBuffer = nextIsTrigger;

    growNumberArray(this.offsetX, nextLength, 0);
    growNumberArray(this.offsetY, nextLength, 0);
    growNumberArray(this.width, nextLength, 1);
    growNumberArray(this.height, nextLength, 1);
    growNumberArray(this.categoryBits, nextLength, 1);
    growNumberArray(this.maskBits, nextLength, 0xffff_ffff);
    growNumberArray(this.minX, nextLength, 0);
    growNumberArray(this.minY, nextLength, 0);
    growNumberArray(this.maxX, nextLength, 1);
    growNumberArray(this.maxY, nextLength, 1);
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
