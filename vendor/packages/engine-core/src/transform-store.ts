import type { EntityId } from './entity.js';

export class TransformStore {
  private presentBuffer: Uint8Array = new Uint8Array(0);

  readonly x: number[] = [];
  readonly y: number[] = [];
  readonly rotation: number[] = [];
  readonly scaleX: number[] = [];
  readonly scaleY: number[] = [];

  get present(): Uint8Array {
    return this.presentBuffer;
  }

  add(entity: EntityId): void {
    this.ensureCapacity(entity);

    this.present[entity] = 1;
    this.x[entity] = 0;
    this.y[entity] = 0;
    this.rotation[entity] = 0;
    this.scaleX[entity] = 1;
    this.scaleY[entity] = 1;
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

    growNumberArray(this.x, nextLength, 0);
    growNumberArray(this.y, nextLength, 0);
    growNumberArray(this.rotation, nextLength, 0);
    growNumberArray(this.scaleX, nextLength, 1);
    growNumberArray(this.scaleY, nextLength, 1);
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
