import type { SceneAnimatorDocumentV1 } from '../scene-schema.js';

export const validateEntityAnimator = (
  entityId: string,
  animator: SceneAnimatorDocumentV1,
  clipIds: ReadonlySet<string>
): void => {
  if (!clipIds.has(animator.clipId)) {
    throw new Error(`Unknown animation clip id for entity ${entityId}: ${animator.clipId}`);
  }
};
