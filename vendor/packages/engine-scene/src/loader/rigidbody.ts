import type { EntityId } from '../../../engine-core/src/index.js';
import { RigidbodyType } from '../../../engine-physics/src/index.js';
import type { SceneRigidbodyDocumentV1 } from '../scene-schema.js';
import type { SceneRuntime } from '../scene-runtime.js';

export const loadRigidbody = (
  runtime: SceneRuntime,
  entity: EntityId,
  document: SceneRigidbodyDocumentV1
): void => {
  runtime.physics.rigidbodies.add(entity, document.type ?? RigidbodyType.Dynamic);
  runtime.physics.rigidbodies.velocityX[entity] = document.velocityX ?? 0;
  runtime.physics.rigidbodies.velocityY[entity] = document.velocityY ?? 0;
  runtime.physics.rigidbodies.gravityScale[entity] = document.gravityScale ?? 1;
};
