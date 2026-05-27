import type { EntityId } from '../../engine-core/src/index.js';
import type { AnimationFrame, AnimationLibrary } from './animation-clip.js';
import type { AnimatorStore } from './animator-store.js';

export const getAnimatorFrame = (
  library: AnimationLibrary,
  animators: AnimatorStore,
  entity: EntityId
): AnimationFrame | undefined => {
  if (!animators.has(entity)) {
    return undefined;
  }

  const clipIndex = animators.clipIndex[entity];
  const frameIndex = animators.frameIndex[entity];

  if (clipIndex === undefined || frameIndex === undefined) {
    return undefined;
  }

  return library.get(clipIndex).frames[frameIndex];
};
