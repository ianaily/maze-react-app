import type { EntityId } from '../../../engine-core/src/index.js';
import { RigidbodyType } from '../../../engine-physics/src/index.js';
import type { SceneRigidbodyDocumentV1 } from '../scene-schema.js';
import type { SceneRuntime } from '../scene-runtime.js';

export const serializeRigidbody = (runtime: SceneRuntime, entity: EntityId): SceneRigidbodyDocumentV1 | undefined => {
  if (!runtime.physics.rigidbodies.has(entity)) {
    return undefined;
  }

  return {
    type: (runtime.physics.rigidbodies.type[entity] ?? RigidbodyType.Dynamic) as RigidbodyType,
    velocityX: runtime.physics.rigidbodies.velocityX[entity] ?? 0,
    velocityY: runtime.physics.rigidbodies.velocityY[entity] ?? 0,
    gravityScale: runtime.physics.rigidbodies.gravityScale[entity] ?? 1
  };
};
