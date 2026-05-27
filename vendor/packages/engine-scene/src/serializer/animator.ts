import type { EntityId } from '../../../engine-core/src/index.js';
import type { SceneAnimatorDocumentV1 } from '../scene-schema.js';
import type { SceneRuntime } from '../scene-runtime.js';

export const serializeAnimator = (runtime: SceneRuntime, entity: EntityId): SceneAnimatorDocumentV1 | undefined => {
  if (!runtime.animators.has(entity)) {
    return undefined;
  }

  const clipIndex = runtime.animators.clipIndex[entity];

  if (clipIndex === undefined) {
    return undefined;
  }

  return {
    clipId: runtime.animationLibrary.get(clipIndex).id,
    playing: runtime.animators.playing[entity] === 1,
    speed: runtime.animators.speed[entity] ?? 1
  };
};
