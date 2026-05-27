import { toEntityId, type EntityId, type System, type World } from '../../engine-core/src/index.js';
import type { AnimationLibrary } from './animation-clip.js';
import type { AnimatorStore } from './animator-store.js';

export interface AnimationEventDispatch {
  readonly entity: EntityId;
  readonly clipIndex: number;
  readonly eventName: string;
}

export interface AnimationSystemOptions {
  readonly library: AnimationLibrary;
  readonly animators: AnimatorStore;
  readonly priority?: number;
}

export class AnimationSystem implements System {
  readonly name = 'animation';
  readonly priority: number;
  readonly events: AnimationEventDispatch[] = [];

  private readonly library: AnimationLibrary;
  private readonly animators: AnimatorStore;

  constructor(options: AnimationSystemOptions) {
    this.library = options.library;
    this.animators = options.animators;
    this.priority = options.priority ?? 100;
  }

  update(world: World, deltaSeconds: number): void {
    this.events.length = 0;

    if (deltaSeconds < 0 || !Number.isFinite(deltaSeconds)) {
      throw new Error(`Animation delta must be a finite non-negative number. Received: ${deltaSeconds}`);
    }

    for (let entity = 0; entity < this.animators.present.length; entity += 1) {
      const entityId = toEntityId(entity);

      if (this.animators.present[entity] !== 1 || this.animators.playing[entity] !== 1 || !world.hasEntity(entityId)) {
        continue;
      }

      this.updateAnimator(entityId, deltaSeconds);
    }
  }

  private updateAnimator(entity: EntityId, deltaSeconds: number): void {
    const clipIndex = this.animators.clipIndex[entity] ?? -1;
    const clip = this.library.get(clipIndex);
    const previousElapsed = this.animators.elapsedSeconds[entity] ?? 0;
    const speed = this.animators.speed[entity] ?? 1;
    const scaledDelta = deltaSeconds * speed;

    if (scaledDelta <= 0) {
      this.animators.frameIndex[entity] = resolveFrameIndex(clip.frames, previousElapsed);
      return;
    }

    let nextElapsed = previousElapsed + scaledDelta;

    if (clip.loop) {
      this.dispatchLoopingEvents(entity, clipIndex, previousElapsed, nextElapsed, clip.durationSeconds);
      nextElapsed %= clip.durationSeconds;
    } else {
      const clampedElapsed = Math.min(nextElapsed, clip.durationSeconds);
      this.dispatchEventsInRange(entity, clipIndex, previousElapsed, clampedElapsed);
      nextElapsed = clampedElapsed;

      if (nextElapsed >= clip.durationSeconds) {
        this.animators.playing[entity] = 0;
      }
    }

    this.animators.elapsedSeconds[entity] = nextElapsed;
    this.animators.frameIndex[entity] = resolveFrameIndex(clip.frames, nextElapsed);
  }

  private dispatchLoopingEvents(
    entity: EntityId,
    clipIndex: number,
    previousElapsed: number,
    nextElapsed: number,
    durationSeconds: number
  ): void {
    let cursor = previousElapsed;
    let remaining = nextElapsed - previousElapsed;

    while (remaining > 0) {
      const segmentEnd = Math.min(durationSeconds, cursor + remaining);
      this.dispatchEventsInRange(entity, clipIndex, cursor, segmentEnd);
      remaining -= segmentEnd - cursor;
      cursor = 0;

      if (segmentEnd === durationSeconds && remaining > 0) {
        this.dispatchEventsInRange(entity, clipIndex, 0, 0);
      }
    }
  }

  private dispatchEventsInRange(entity: EntityId, clipIndex: number, startSeconds: number, endSeconds: number): void {
    const clip = this.library.get(clipIndex);

    for (const event of clip.events) {
      if (startSeconds === endSeconds) {
        if (event.atSeconds === startSeconds) {
          this.events.push({ entity, clipIndex, eventName: event.name });
        }

        continue;
      }

      if (event.atSeconds > startSeconds && event.atSeconds <= endSeconds) {
        this.events.push({ entity, clipIndex, eventName: event.name });
      }
    }
  }
}

const resolveFrameIndex = (frames: readonly { readonly durationSeconds: number }[], elapsedSeconds: number): number => {
  let cursor = 0;

  for (let index = 0; index < frames.length; index += 1) {
    cursor += frames[index]?.durationSeconds ?? 0;

    if (elapsedSeconds < cursor) {
      return index;
    }
  }

  return frames.length - 1;
};
