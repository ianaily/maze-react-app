import type { EntityId } from '../../engine-core/src/index.js';

export type ParticleEmitterShape = 'point' | 'line' | 'rect';

export interface ParticleEmitterDefinition {
  readonly shape: ParticleEmitterShape;
  /** Half-extents for line (X axis) and rect emitter shapes. Ignored for `point`. */
  readonly extentX?: number;
  readonly extentY?: number;
  readonly rate: number;
  readonly burstCount?: number;
  readonly eventName?: string;
  readonly lifetimeMinSeconds: number;
  readonly lifetimeMaxSeconds: number;
  readonly velocityMinX: number;
  readonly velocityMaxX: number;
  readonly velocityMinY: number;
  readonly velocityMaxY: number;
  readonly gravityScale: number;
  readonly startScale: number;
  readonly endScale: number;
  readonly startAlpha: number;
  readonly endAlpha: number;
  readonly spriteAssetId: string;
  readonly layer?: number;
  readonly autoplay?: boolean;
}

export class ParticleEmitterStore {
  private presentBuffer: Uint8Array = new Uint8Array(0);
  private activeBuffer: Uint8Array = new Uint8Array(0);

  readonly shape: ParticleEmitterShape[] = [];
  readonly extentX: number[] = [];
  readonly extentY: number[] = [];
  readonly rate: number[] = [];
  readonly burstCount: number[] = [];
  readonly eventName: string[] = [];
  readonly lifetimeMinSeconds: number[] = [];
  readonly lifetimeMaxSeconds: number[] = [];
  readonly velocityMinX: number[] = [];
  readonly velocityMaxX: number[] = [];
  readonly velocityMinY: number[] = [];
  readonly velocityMaxY: number[] = [];
  readonly gravityScale: number[] = [];
  readonly startScale: number[] = [];
  readonly endScale: number[] = [];
  readonly startAlpha: number[] = [];
  readonly endAlpha: number[] = [];
  readonly spriteAssetId: string[] = [];
  readonly layer: number[] = [];
  readonly spawnAccumulator: number[] = [];

  get present(): Uint8Array {
    return this.presentBuffer;
  }

  get active(): Uint8Array {
    return this.activeBuffer;
  }

  add(entity: EntityId, definition: ParticleEmitterDefinition): void {
    this.ensureCapacity(entity);

    this.presentBuffer[entity] = 1;
    this.activeBuffer[entity] = definition.autoplay === false ? 0 : 1;
    this.shape[entity] = definition.shape;
    this.extentX[entity] = Math.max(definition.extentX ?? 0, 0);
    this.extentY[entity] = Math.max(definition.extentY ?? 0, 0);
    this.rate[entity] = Math.max(definition.rate, 0);
    this.burstCount[entity] = Math.max(definition.burstCount ?? 0, 0);
    this.eventName[entity] = definition.eventName ?? '';
    this.lifetimeMinSeconds[entity] = Math.max(definition.lifetimeMinSeconds, 0);
    this.lifetimeMaxSeconds[entity] = Math.max(definition.lifetimeMaxSeconds, definition.lifetimeMinSeconds);
    this.velocityMinX[entity] = definition.velocityMinX;
    this.velocityMaxX[entity] = definition.velocityMaxX;
    this.velocityMinY[entity] = definition.velocityMinY;
    this.velocityMaxY[entity] = definition.velocityMaxY;
    this.gravityScale[entity] = definition.gravityScale;
    this.startScale[entity] = definition.startScale;
    this.endScale[entity] = definition.endScale;
    this.startAlpha[entity] = definition.startAlpha;
    this.endAlpha[entity] = definition.endAlpha;
    this.spriteAssetId[entity] = definition.spriteAssetId;
    this.layer[entity] = definition.layer ?? 0;
    this.spawnAccumulator[entity] = 0;
  }

  has(entity: EntityId): boolean {
    return this.presentBuffer[entity] === 1;
  }

  remove(entity: EntityId): void {
    if (entity >= this.presentBuffer.length) {
      return;
    }

    this.presentBuffer[entity] = 0;
    this.activeBuffer[entity] = 0;
  }

  setActive(entity: EntityId, active: boolean): void {
    if (this.presentBuffer[entity] !== 1) {
      return;
    }

    this.activeBuffer[entity] = active ? 1 : 0;
  }

  private ensureCapacity(entity: EntityId): void {
    if (entity < this.presentBuffer.length) {
      return;
    }

    const nextLength = growCapacity(this.presentBuffer.length, entity + 1);
    const nextPresent = new Uint8Array(nextLength);
    const nextActive = new Uint8Array(nextLength);
    nextPresent.set(this.presentBuffer);
    nextActive.set(this.activeBuffer);
    this.presentBuffer = nextPresent;
    this.activeBuffer = nextActive;

    growStringArray<ParticleEmitterShape>(this.shape, nextLength, 'point');
    growNumberArray(this.extentX, nextLength, 0);
    growNumberArray(this.extentY, nextLength, 0);
    growNumberArray(this.rate, nextLength, 0);
    growNumberArray(this.burstCount, nextLength, 0);
    growStringArray<string>(this.eventName, nextLength, '');
    growNumberArray(this.lifetimeMinSeconds, nextLength, 0);
    growNumberArray(this.lifetimeMaxSeconds, nextLength, 0);
    growNumberArray(this.velocityMinX, nextLength, 0);
    growNumberArray(this.velocityMaxX, nextLength, 0);
    growNumberArray(this.velocityMinY, nextLength, 0);
    growNumberArray(this.velocityMaxY, nextLength, 0);
    growNumberArray(this.gravityScale, nextLength, 0);
    growNumberArray(this.startScale, nextLength, 1);
    growNumberArray(this.endScale, nextLength, 1);
    growNumberArray(this.startAlpha, nextLength, 1);
    growNumberArray(this.endAlpha, nextLength, 0);
    growStringArray<string>(this.spriteAssetId, nextLength, '');
    growNumberArray(this.layer, nextLength, 0);
    growNumberArray(this.spawnAccumulator, nextLength, 0);
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

const growStringArray = <T extends string>(target: T[], length: number, fill: T): void => {
  for (let index = target.length; index < length; index += 1) {
    target[index] = fill;
  }
};
