import type { EntityId } from '../../../engine-core/src/index.js';
import type { SceneColliderDocumentV1 } from '../scene-schema.js';
import type { SceneRuntime } from '../scene-runtime.js';

export const serializeCollider = (runtime: SceneRuntime, entity: EntityId): SceneColliderDocumentV1 | undefined => {
  if (!runtime.physics.colliders.has(entity)) {
    return undefined;
  }

  return {
    width: runtime.physics.colliders.width[entity] ?? 1,
    height: runtime.physics.colliders.height[entity] ?? 1,
    offsetX: runtime.physics.colliders.offsetX[entity] ?? 0,
    offsetY: runtime.physics.colliders.offsetY[entity] ?? 0,
    trigger: runtime.physics.colliders.isTrigger[entity] === 1,
    categoryBits: runtime.physics.colliders.categoryBits[entity] ?? 1,
    maskBits: runtime.physics.colliders.maskBits[entity] ?? 0xffff_ffff
  };
};
