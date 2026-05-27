import {
  toEntityId,
  type EntityId,
  type System,
  type World
} from '../../engine-core/src/index.js';
import { applyEasing } from './easing.js';
import {
  TWEEN_STATE_DELAY,
  TWEEN_STATE_DONE,
  TWEEN_STATE_PAUSED,
  TWEEN_STATE_PLAYING,
  TweenStore
} from './tween-store.js';
import type { TweenTargetComponent, TweenTargetField } from './tween-target.js';

export interface TweenTargetWriter {
  hasTarget(entity: EntityId, component: TweenTargetComponent): boolean;
  writeField(entity: EntityId, component: TweenTargetComponent, field: TweenTargetField, value: number): void;
}

export interface TweenSystemOptions {
  readonly tweens: TweenStore;
  readonly targets: TweenTargetWriter;
  readonly priority?: number;
}

export class TweenSystem implements System {
  readonly name = 'tween';
  readonly priority: number;

  private readonly tweens: TweenStore;
  private readonly targets: TweenTargetWriter;

  constructor(options: TweenSystemOptions) {
    this.tweens = options.tweens;
    this.targets = options.targets;
    this.priority = options.priority ?? -50;
  }

  fixedUpdate(world: World, fixedDeltaSeconds: number): void {
    const present = this.tweens.present;
    const state = this.tweens.state;

    for (let index = 0; index < present.length; index += 1) {
      if (present[index] !== 1) {
        continue;
      }

      const entity = toEntityId(index);

      if (!world.hasEntity(entity)) {
        continue;
      }

      const currentState = state[index];

      if (currentState === TWEEN_STATE_PAUSED || currentState === TWEEN_STATE_DONE) {
        continue;
      }

      this.advanceTween(entity, index, fixedDeltaSeconds);
    }
  }

  private advanceTween(entity: EntityId, index: number, deltaSeconds: number): void {
    const state = this.tweens.state;
    const component = this.tweens.targetComponent[index];
    const field = this.tweens.targetField[index];

    if (component === undefined || field === undefined || !this.targets.hasTarget(entity, component)) {
      return;
    }

    const delaySeconds = this.tweens.delaySeconds[index] ?? 0;
    let elapsed = this.tweens.elapsedSeconds[index] ?? 0;
    elapsed += deltaSeconds;

    if (state[index] === TWEEN_STATE_DELAY) {
      if (elapsed < delaySeconds) {
        this.tweens.elapsedSeconds[index] = elapsed;
        return;
      }

      elapsed -= delaySeconds;
      state[index] = TWEEN_STATE_PLAYING;
    }

    const duration = this.tweens.durationSeconds[index] ?? 0;
    const repeat = this.tweens.repeat[index] ?? 'once';
    const easing = this.tweens.easing[index] ?? 'linear';
    const fromValue = this.tweens.from[index] ?? 0;
    const toValue = this.tweens.to[index] ?? 0;
    let direction = this.tweens.direction[index] ?? 1;

    if (duration <= 0) {
      this.targets.writeField(entity, component, field, direction >= 0 ? toValue : fromValue);
      this.completeTween(index, state, fromValue, toValue);
      return;
    }

    let progress = elapsed / duration;

    if (progress >= 1) {
      if (repeat === 'once') {
        this.tweens.elapsedSeconds[index] = duration;
        this.targets.writeField(entity, component, field, direction >= 0 ? toValue : fromValue);
        state[index] = TWEEN_STATE_DONE;
        return;
      }

      if (repeat === 'loop') {
        const overflow = elapsed - duration;
        elapsed = overflow % duration;
        progress = elapsed / duration;
      } else {
        // ping-pong
        direction = direction >= 0 ? -1 : 1;
        this.tweens.direction[index] = direction;
        const overflow = elapsed - duration;
        elapsed = overflow % duration;
        progress = elapsed / duration;
      }
    }

    this.tweens.elapsedSeconds[index] = elapsed + (state[index] === TWEEN_STATE_PLAYING && elapsed === 0 ? 0 : 0);
    this.tweens.elapsedSeconds[index] = elapsed;

    const eased = applyEasing(easing, progress);
    const value = direction >= 0
      ? fromValue + (toValue - fromValue) * eased
      : toValue + (fromValue - toValue) * eased;
    this.targets.writeField(entity, component, field, value);
  }

  private completeTween(index: number, state: Uint8Array, fromValue: number, toValue: number): void {
    state[index] = TWEEN_STATE_DONE;
    this.tweens.elapsedSeconds[index] = this.tweens.durationSeconds[index] ?? 0;
    void fromValue;
    void toValue;
  }
}
