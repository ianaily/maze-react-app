import type { EntityId } from '../../engine-core/src/index.js';

export const enum CharacterControllerMode {
  Platformer = 0,
  TopDown = 1
}

export class CharacterControllerStore {
  private presentBuffer: Uint8Array = new Uint8Array(0);
  private groundedBuffer: Uint8Array = new Uint8Array(0);
  private jumpRequestedBuffer: Uint8Array = new Uint8Array(0);

  readonly desiredMoveX: number[] = [];
  readonly desiredMoveY: number[] = [];
  readonly maxSpeed: number[] = [];
  readonly jumpSpeed: number[] = [];
  readonly mode: number[] = [];

  get present(): Uint8Array {
    return this.presentBuffer;
  }

  get grounded(): Uint8Array {
    return this.groundedBuffer;
  }

  get jumpRequested(): Uint8Array {
    return this.jumpRequestedBuffer;
  }

  add(entity: EntityId): void {
    this.ensureCapacity(entity);

    this.present[entity] = 1;
    this.grounded[entity] = 0;
    this.jumpRequested[entity] = 0;
    this.desiredMoveX[entity] = 0;
    this.desiredMoveY[entity] = 0;
    this.maxSpeed[entity] = 72;
    this.jumpSpeed[entity] = 170;
    this.mode[entity] = CharacterControllerMode.Platformer;
  }

  has(entity: EntityId): boolean {
    return this.present[entity] === 1;
  }

  remove(entity: EntityId): void {
    if (entity < this.present.length) {
      this.present[entity] = 0;
      this.grounded[entity] = 0;
      this.jumpRequested[entity] = 0;
      this.desiredMoveX[entity] = 0;
      this.desiredMoveY[entity] = 0;
    }
  }

  private ensureCapacity(entity: EntityId): void {
    if (entity < this.present.length) {
      return;
    }

    const nextLength = growCapacity(this.present.length, entity + 1);
    const nextPresent = new Uint8Array(nextLength);
    const nextGrounded = new Uint8Array(nextLength);
    const nextJumpRequested = new Uint8Array(nextLength);
    nextPresent.set(this.present);
    nextGrounded.set(this.grounded);
    nextJumpRequested.set(this.jumpRequested);
    this.presentBuffer = nextPresent;
    this.groundedBuffer = nextGrounded;
    this.jumpRequestedBuffer = nextJumpRequested;

    growNumberArray(this.desiredMoveX, nextLength, 0);
    growNumberArray(this.desiredMoveY, nextLength, 0);
    growNumberArray(this.maxSpeed, nextLength, 72);
    growNumberArray(this.jumpSpeed, nextLength, 170);
    growNumberArray(this.mode, nextLength, CharacterControllerMode.Platformer);
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
