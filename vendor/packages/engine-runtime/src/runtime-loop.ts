import type { RuntimeSession } from './runtime-session.js';

export interface RuntimeLoopOptions {
  readonly onTick?: (deltaSeconds: number) => void;
  readonly onRender?: () => void;
  readonly onStats?: (stats: RuntimeLoopStats) => void;
  /** Seconds between consecutive `onStats` reports. Defaults to 1. */
  readonly statsIntervalSeconds?: number;
  readonly maxDeltaSeconds?: number;
  readonly schedule?: (callback: (timestamp: number) => void) => number;
  readonly cancel?: (handle: number) => void;
  readonly now?: () => number;
}

/**
 * Aggregated frame timings emitted periodically by `RuntimeLoop` so the
 * application can render a HUD or log a baseline number. Times are averages
 * over the reporting window; peak captures the worst single step.
 */
export interface RuntimeLoopStats {
  readonly frames: number;
  readonly averageFps: number;
  readonly averageStepMs: number;
  readonly peakStepMs: number;
  readonly averageFixedMs: number;
  readonly averageVariableMs: number;
  readonly averageRenderMs: number;
  readonly averageOnTickMs: number;
  readonly windowSeconds: number;
}

export interface RuntimeLoop {
  start(): void;
  stop(): void;
}

/**
 * Function that returns the session the loop should step on the next tick.
 * Used so a loop can outlive a single `RuntimeSession` (e.g. across
 * `BootedGame` scene transitions).
 */
export type RuntimeSessionSupplier = () => RuntimeSession;

export function createRuntimeLoop(
  session: RuntimeSession | RuntimeSessionSupplier,
  options: RuntimeLoopOptions = {}
): RuntimeLoop {
  const supplier: RuntimeSessionSupplier = typeof session === 'function'
    ? session
    : () => session;
  const maxDelta = options.maxDeltaSeconds ?? 0.1;
  const schedule = options.schedule ?? defaultSchedule;
  const cancel = options.cancel ?? defaultCancel;
  const now = options.now ?? defaultNow;

  let handle: number | undefined;
  let lastTimestamp: number | undefined;
  let running = false;

  const statsInterval = (options.statsIntervalSeconds ?? 1) * 1000;
  const reportStats = options.onStats;
  const statsAccumulator = {
    frames: 0,
    stepMsSum: 0,
    fixedMsSum: 0,
    variableMsSum: 0,
    renderMsSum: 0,
    onTickMsSum: 0,
    peakStepMs: 0,
    windowStartMs: 0
  };

  const tick = (timestamp?: number): void => {
    if (!running) {
      return;
    }

    const currentTimestamp = timestamp ?? now();
    const last = lastTimestamp;
    const delta = last === undefined ? 0 : Math.min(Math.max((currentTimestamp - last) / 1000, 0), maxDelta);
    lastTimestamp = currentTimestamp;

    const result = supplier().engine.step(delta);

    const tickStart = reportStats !== undefined ? now() : 0;
    options.onTick?.(delta);
    const tickMs = reportStats !== undefined ? now() - tickStart : 0;

    const renderStart = reportStats !== undefined ? now() : 0;
    options.onRender?.();
    const renderMs = reportStats !== undefined ? now() - renderStart : 0;

    if (reportStats !== undefined) {
      if (statsAccumulator.frames === 0) {
        statsAccumulator.windowStartMs = currentTimestamp;
      }

      statsAccumulator.frames += 1;
      statsAccumulator.stepMsSum += result.totalMs;
      statsAccumulator.fixedMsSum += result.fixedMs;
      statsAccumulator.variableMsSum += result.variableMs;
      statsAccumulator.renderMsSum += renderMs;
      statsAccumulator.onTickMsSum += tickMs;

      if (result.totalMs > statsAccumulator.peakStepMs) {
        statsAccumulator.peakStepMs = result.totalMs;
      }

      const windowMs = currentTimestamp - statsAccumulator.windowStartMs;

      if (windowMs >= statsInterval && statsAccumulator.frames > 0) {
        const frames = statsAccumulator.frames;
        const windowSeconds = windowMs / 1000;
        reportStats({
          frames,
          averageFps: windowSeconds > 0 ? frames / windowSeconds : 0,
          averageStepMs: statsAccumulator.stepMsSum / frames,
          peakStepMs: statsAccumulator.peakStepMs,
          averageFixedMs: statsAccumulator.fixedMsSum / frames,
          averageVariableMs: statsAccumulator.variableMsSum / frames,
          averageRenderMs: statsAccumulator.renderMsSum / frames,
          averageOnTickMs: statsAccumulator.onTickMsSum / frames,
          windowSeconds
        });

        statsAccumulator.frames = 0;
        statsAccumulator.stepMsSum = 0;
        statsAccumulator.fixedMsSum = 0;
        statsAccumulator.variableMsSum = 0;
        statsAccumulator.renderMsSum = 0;
        statsAccumulator.onTickMsSum = 0;
        statsAccumulator.peakStepMs = 0;
        statsAccumulator.windowStartMs = currentTimestamp;
      }
    }

    handle = schedule(tick);
  };

  return {
    start(): void {
      if (running) {
        return;
      }

      running = true;
      lastTimestamp = undefined;
      handle = schedule(tick);
    },
    stop(): void {
      running = false;

      if (handle !== undefined) {
        cancel(handle);
        handle = undefined;
      }

      lastTimestamp = undefined;
    }
  };
}

function defaultSchedule(callback: (timestamp: number) => void): number {
  if (typeof requestAnimationFrame === 'function') {
    return requestAnimationFrame(callback);
  }

  return setTimeout(() => callback(defaultNow()), 16) as unknown as number;
}

function defaultCancel(handle: number): void {
  if (typeof cancelAnimationFrame === 'function') {
    cancelAnimationFrame(handle);
    return;
  }

  clearTimeout(handle as unknown as ReturnType<typeof setTimeout>);
}

function defaultNow(): number {
  if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
    return performance.now();
  }

  return Date.now();
}
