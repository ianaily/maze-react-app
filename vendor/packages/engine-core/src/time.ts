export interface EngineTimeOptions {
  readonly fixedDeltaSeconds?: number;
  readonly maxSubSteps?: number;
  readonly timeScale?: number;
}

export class EngineTime {
  readonly fixedDeltaSeconds: number;
  readonly maxSubSteps: number;

  private accumulatorSeconds = 0;
  private timeScaleInternal: number;

  constructor(options: EngineTimeOptions = {}) {
    this.fixedDeltaSeconds = options.fixedDeltaSeconds ?? 1 / 60;
    this.maxSubSteps = options.maxSubSteps ?? 5;
    this.timeScaleInternal = clampTimeScale(options.timeScale ?? 1);
  }

  /**
   * Multiplier applied to every incoming frame delta before it accumulates
   * towards a fixed step. `0` freezes the world, `0.5` slow-mo, `2` fast-forward.
   * Clamped to `[0, +Infinity)`.
   */
  get timeScale(): number {
    return this.timeScaleInternal;
  }

  set timeScale(value: number) {
    this.timeScaleInternal = clampTimeScale(value);
  }

  addFrameDelta(deltaSeconds: number): void {
    if (!Number.isFinite(deltaSeconds) || deltaSeconds < 0) {
      throw new Error(`Frame delta must be a finite non-negative number. Received: ${deltaSeconds}`);
    }

    this.accumulatorSeconds += deltaSeconds * this.timeScaleInternal;
  }

  consumeFixedStep(): boolean {
    if (this.accumulatorSeconds + Number.EPSILON < this.fixedDeltaSeconds) {
      return false;
    }

    this.accumulatorSeconds -= this.fixedDeltaSeconds;
    return true;
  }

  reset(): void {
    this.accumulatorSeconds = 0;
  }
}

const clampTimeScale = (value: number): number => {
  if (!Number.isFinite(value) || value < 0) {
    return 0;
  }

  return value;
};
