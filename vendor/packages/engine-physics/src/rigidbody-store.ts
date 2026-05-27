import type { EntityId } from '../../engine-core/src/index.js';

export const enum RigidbodyType {
  Static = 0,
  Dynamic = 1
}

export class RigidbodyStore {
  private presentBuffer: Uint8Array = new Uint8Array(0);

  readonly type: number[] = [];
  readonly velocityX: number[] = [];
  readonly velocityY: number[] = [];
  readonly gravityScale: number[] = [];

  get present(): Uint8Array {
    return this.presentBuffer;
  }

  add(entity: EntityId, type: RigidbodyType = RigidbodyType.Dynamic): void {
    this.ensureCapacity(entity);

    this.present[entity] = 1;
    this.type[entity] = type;
    this.velocityX[entity] = 0;
    this.velocityY[entity] = 0;
    this.gravityScale[entity] = 1;
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

    growNumberArray(this.type, nextLength, RigidbodyType.Dynamic);
    growNumberArray(this.velocityX, nextLength, 0);
    growNumberArray(this.velocityY, nextLength, 0);
    growNumberArray(this.gravityScale, nextLength, 1);
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
