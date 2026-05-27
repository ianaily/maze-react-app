import type { EntityId } from '../../engine-core/src/index.js';

export const CAMERA_TARGET_NONE = -1;

export class CameraStore {
  private presentBuffer: Uint8Array = new Uint8Array(0);
  private boundsEnabledBuffer: Uint8Array = new Uint8Array(0);

  readonly targetEntity: number[] = [];
  readonly smoothingTimeSeconds: number[] = [];
  readonly deadZoneWidth: number[] = [];
  readonly deadZoneHeight: number[] = [];
  readonly boundsMinX: number[] = [];
  readonly boundsMinY: number[] = [];
  readonly boundsMaxX: number[] = [];
  readonly boundsMaxY: number[] = [];
  readonly zoom: number[] = [];

  get present(): Uint8Array {
    return this.presentBuffer;
  }

  get boundsEnabled(): Uint8Array {
    return this.boundsEnabledBuffer;
  }

  add(
    entity: EntityId,
    options: {
      targetEntity?: EntityId;
      smoothingTimeSeconds?: number;
      deadZoneWidth?: number;
      deadZoneHeight?: number;
      bounds?: { readonly minX: number; readonly minY: number; readonly maxX: number; readonly maxY: number };
      zoom?: number;
    } = {}
  ): void {
    this.ensureCapacity(entity);

    this.present[entity] = 1;
    this.targetEntity[entity] = options.targetEntity ?? CAMERA_TARGET_NONE;
    this.smoothingTimeSeconds[entity] = options.smoothingTimeSeconds ?? 0;
    this.deadZoneWidth[entity] = options.deadZoneWidth ?? 0;
    this.deadZoneHeight[entity] = options.deadZoneHeight ?? 0;
    this.zoom[entity] = options.zoom ?? 1;

    if (options.bounds !== undefined) {
      this.boundsEnabled[entity] = 1;
      this.boundsMinX[entity] = options.bounds.minX;
      this.boundsMinY[entity] = options.bounds.minY;
      this.boundsMaxX[entity] = options.bounds.maxX;
      this.boundsMaxY[entity] = options.bounds.maxY;
    } else {
      this.boundsEnabled[entity] = 0;
      this.boundsMinX[entity] = 0;
      this.boundsMinY[entity] = 0;
      this.boundsMaxX[entity] = 0;
      this.boundsMaxY[entity] = 0;
    }
  }

  has(entity: EntityId): boolean {
    return this.present[entity] === 1;
  }

  remove(entity: EntityId): void {
    if (entity >= this.present.length) {
      return;
    }

    this.present[entity] = 0;
    this.boundsEnabled[entity] = 0;
    this.targetEntity[entity] = CAMERA_TARGET_NONE;
  }

  private ensureCapacity(entity: EntityId): void {
    if (entity < this.present.length) {
      return;
    }

    const nextLength = growCapacity(this.present.length, entity + 1);
    const nextPresent = new Uint8Array(nextLength);
    const nextBoundsEnabled = new Uint8Array(nextLength);
    nextPresent.set(this.present);
    nextBoundsEnabled.set(this.boundsEnabled);
    this.presentBuffer = nextPresent;
    this.boundsEnabledBuffer = nextBoundsEnabled;

    growNumberArray(this.targetEntity, nextLength, CAMERA_TARGET_NONE);
    growNumberArray(this.smoothingTimeSeconds, nextLength, 0);
    growNumberArray(this.deadZoneWidth, nextLength, 0);
    growNumberArray(this.deadZoneHeight, nextLength, 0);
    growNumberArray(this.boundsMinX, nextLength, 0);
    growNumberArray(this.boundsMinY, nextLength, 0);
    growNumberArray(this.boundsMaxX, nextLength, 0);
    growNumberArray(this.boundsMaxY, nextLength, 0);
    growNumberArray(this.zoom, nextLength, 1);
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
