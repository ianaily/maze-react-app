import type { EntityId } from '../../../engine-core/src/index.js';
import type { SceneColliderDocumentV1 } from '../scene-schema.js';
import type { SceneRuntime } from '../scene-runtime.js';

export const loadCollider = (
  runtime: SceneRuntime,
  entity: EntityId,
  document: SceneColliderDocumentV1
): void => {
  runtime.physics.colliders.add(entity, document.width, document.height);
  runtime.physics.colliders.offsetX[entity] = document.offsetX ?? 0;
  runtime.physics.colliders.offsetY[entity] = document.offsetY ?? 0;
  runtime.physics.colliders.isTrigger[entity] = document.trigger === true ? 1 : 0;
  runtime.physics.colliders.categoryBits[entity] = document.categoryBits ?? 1;
  runtime.physics.colliders.maskBits[entity] = document.maskBits ?? 0xffff_ffff;
};
