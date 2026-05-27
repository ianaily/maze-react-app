import type { EntityId } from '../../engine-core/src/index.js';
import type { EasingName } from './easing.js';
import type { TweenTargetComponent, TweenTargetField } from './tween-target.js';

export const TWEEN_STATE_IDLE = 0;
export const TWEEN_STATE_DELAY = 1;
export const TWEEN_STATE_PLAYING = 2;
export const TWEEN_STATE_DONE = 3;
export const TWEEN_STATE_PAUSED = 4;

export type TweenRepeatMode = 'once' | 'loop' | 'ping-pong';

export interface TweenDefinition {
  readonly targetComponent: TweenTargetComponent;
  readonly targetField: TweenTargetField;
  readonly from: number;
  readonly to: number;
  readonly durationSeconds: number;
  readonly easing: EasingName;
  readonly delaySeconds?: number;
  readonly repeat?: TweenRepeatMode;
  readonly autoplay?: boolean;
}

export class TweenStore {
  private presentBuffer: Uint8Array = new Uint8Array(0);
  private stateBuffer: Uint8Array = new Uint8Array(0);
  private directionBuffer: Int8Array = new Int8Array(0);

  readonly targetComponent: TweenTargetComponent[] = [];
  readonly targetField: TweenTargetField[] = [];
  readonly from: number[] = [];
  readonly to: number[] = [];
  readonly durationSeconds: number[] = [];
  readonly easing: EasingName[] = [];
  readonly delaySeconds: number[] = [];
  readonly elapsedSeconds: number[] = [];
  readonly repeat: TweenRepeatMode[] = [];

  get present(): Uint8Array {
    return this.presentBuffer;
  }

  get state(): Uint8Array {
    return this.stateBuffer;
  }

  /** +1 = from→to, -1 = to→from (used only by ping-pong). */
  get direction(): Int8Array {
    return this.directionBuffer;
  }

  add(entity: EntityId, definition: TweenDefinition): void {
    this.ensureCapacity(entity);

    this.presentBuffer[entity] = 1;
    this.targetComponent[entity] = definition.targetComponent;
    this.targetField[entity] = definition.targetField;
    this.from[entity] = definition.from;
    this.to[entity] = definition.to;
    this.durationSeconds[entity] = Math.max(definition.durationSeconds, 0);
    this.easing[entity] = definition.easing;
    this.delaySeconds[entity] = Math.max(definition.delaySeconds ?? 0, 0);
    this.elapsedSeconds[entity] = 0;
    this.repeat[entity] = definition.repeat ?? 'once';
    this.directionBuffer[entity] = 1;

    if (definition.autoplay === false) {
      this.stateBuffer[entity] = TWEEN_STATE_IDLE;
    } else {
      this.stateBuffer[entity] = (definition.delaySeconds ?? 0) > 0 ? TWEEN_STATE_DELAY : TWEEN_STATE_PLAYING;
    }
  }

  has(entity: EntityId): boolean {
    return this.presentBuffer[entity] === 1;
  }

  remove(entity: EntityId): void {
    if (entity >= this.presentBuffer.length) {
      return;
    }

    this.presentBuffer[entity] = 0;
    this.stateBuffer[entity] = TWEEN_STATE_IDLE;
  }

  trigger(entity: EntityId): void {
    if (this.presentBuffer[entity] !== 1) {
      return;
    }

    this.elapsedSeconds[entity] = 0;
    this.directionBuffer[entity] = 1;

    const delay = this.delaySeconds[entity] ?? 0;
    this.stateBuffer[entity] = delay > 0 ? TWEEN_STATE_DELAY : TWEEN_STATE_PLAYING;
  }

  pause(entity: EntityId): void {
    if (this.presentBuffer[entity] !== 1) {
      return;
    }

    if (this.stateBuffer[entity] === TWEEN_STATE_PLAYING || this.stateBuffer[entity] === TWEEN_STATE_DELAY) {
      this.stateBuffer[entity] = TWEEN_STATE_PAUSED;
    }
  }

  resume(entity: EntityId): void {
    if (this.presentBuffer[entity] !== 1 || this.stateBuffer[entity] !== TWEEN_STATE_PAUSED) {
      return;
    }

    const delay = this.delaySeconds[entity] ?? 0;
    const elapsed = this.elapsedSeconds[entity] ?? 0;
    this.stateBuffer[entity] = elapsed < delay ? TWEEN_STATE_DELAY : TWEEN_STATE_PLAYING;
  }

  stop(entity: EntityId): void {
    if (this.presentBuffer[entity] !== 1) {
      return;
    }

    this.stateBuffer[entity] = TWEEN_STATE_IDLE;
    this.elapsedSeconds[entity] = 0;
    this.directionBuffer[entity] = 1;
  }

  private ensureCapacity(entity: EntityId): void {
    if (entity < this.presentBuffer.length) {
      return;
    }

    const nextLength = growCapacity(this.presentBuffer.length, entity + 1);
    const nextPresent = new Uint8Array(nextLength);
    const nextState = new Uint8Array(nextLength);
    const nextDirection = new Int8Array(nextLength);
    nextPresent.set(this.presentBuffer);
    nextState.set(this.stateBuffer);
    nextDirection.set(this.directionBuffer);
    this.presentBuffer = nextPresent;
    this.stateBuffer = nextState;
    this.directionBuffer = nextDirection;

    growNumberArray(this.from, nextLength, 0);
    growNumberArray(this.to, nextLength, 0);
    growNumberArray(this.durationSeconds, nextLength, 0);
    growNumberArray(this.delaySeconds, nextLength, 0);
    growNumberArray(this.elapsedSeconds, nextLength, 0);
    growStringArray<TweenTargetComponent>(this.targetComponent, nextLength, 'transform');
    growStringArray<TweenTargetField>(this.targetField, nextLength, 'x');
    growStringArray<EasingName>(this.easing, nextLength, 'linear');
    growStringArray<TweenRepeatMode>(this.repeat, nextLength, 'once');
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
