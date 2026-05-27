import type { EntityId } from '../../../engine-core/src/index.js';
import type { SceneAnimatorDocumentV1 } from '../scene-schema.js';
import type { SceneRuntime } from '../scene-runtime.js';

export const loadAnimator = (
  runtime: SceneRuntime,
  entity: EntityId,
  document: SceneAnimatorDocumentV1
): void => {
  const clipIndex = runtime.animationLibrary.findIndex(document.clipId);
  runtime.animators.add(entity, clipIndex);
  runtime.animators.speed[entity] = document.speed ?? 1;

  if (document.playing === false) {
    runtime.animators.stop(entity);
  }
};
