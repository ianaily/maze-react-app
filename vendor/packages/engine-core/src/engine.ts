import { EngineTime, type EngineTimeOptions } from './time.js';
import type { System } from './system.js';
import { World } from './world.js';

export interface EngineOptions extends EngineTimeOptions {
  readonly world?: World;
  readonly systems?: readonly System[];
}

export interface EngineStepResult {
  readonly fixedSteps: number;
  /** Wall-clock milliseconds spent inside `step()`. Includes both fixed and variable phases. */
  readonly totalMs: number;
  /** Milliseconds spent inside the fixed-step loop (sum of every sub-step). */
  readonly fixedMs: number;
  /** Milliseconds spent inside the variable `update` phase. */
  readonly variableMs: number;
}

export class Engine {
  readonly world: World;
  readonly time: EngineTime;

  private readonly systems: System[] = [];

  constructor(options: EngineOptions = {}) {
    this.world = options.world ?? new World();
    this.time = new EngineTime(options);

    for (const system of options.systems ?? []) {
      this.addSystem(system);
    }
  }

  addSystem(system: System): void {
    this.systems.push(system);
    this.systems.sort(compareSystems);
  }

  step(deltaSeconds: number): EngineStepResult {
    const stepStart = engineNow();
    this.time.addFrameDelta(deltaSeconds);

    let fixedSteps = 0;
    const fixedStart = engineNow();

    while (fixedSteps < this.time.maxSubSteps && this.time.consumeFixedStep()) {
      for (const system of this.systems) {
        system.fixedUpdate?.(this.world, this.time.fixedDeltaSeconds);
      }

      fixedSteps += 1;
    }

    const fixedMs = engineNow() - fixedStart;
    const variableStart = engineNow();

    for (const system of this.systems) {
      system.update?.(this.world, deltaSeconds);
    }

    const variableMs = engineNow() - variableStart;
    const totalMs = engineNow() - stepStart;

    return { fixedSteps, totalMs, fixedMs, variableMs };
  }

  runFixedTicks(tickCount: number): void {
    if (!Number.isInteger(tickCount) || tickCount < 0) {
      throw new Error(`Tick count must be a non-negative integer. Received: ${tickCount}`);
    }

    for (let index = 0; index < tickCount; index += 1) {
      this.step(this.time.fixedDeltaSeconds);
    }
  }
}

/**
 * Wall-clock timer used by EngineStepResult. Prefers `performance.now` when
 * available (sub-millisecond resolution in browsers and Node) and falls back
 * to `Date.now` in environments without it.
 */
const engineNow: () => number = (() => {
  if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
    return () => performance.now();
  }

  return () => Date.now();
})();

const compareSystems = (left: System, right: System): number => {
  const priorityDelta = left.priority - right.priority;

  if (priorityDelta !== 0) {
    return priorityDelta;
  }

  return left.name.localeCompare(right.name);
};
