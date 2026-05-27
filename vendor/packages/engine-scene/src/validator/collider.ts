import type { SceneColliderDocumentV1 } from '../scene-schema.js';

export const validateEntityCollider = (entityId: string, collider: SceneColliderDocumentV1): void => {
  if (collider.width <= 0 || collider.height <= 0) {
    throw new Error(`Collider size must be positive for entity: ${entityId}`);
  }

  if ((collider.categoryBits ?? 1) < 0) {
    throw new Error(`Collider category bits must be non-negative for entity: ${entityId}`);
  }

  if ((collider.maskBits ?? 1) < 0) {
    throw new Error(`Collider mask bits must be non-negative for entity: ${entityId}`);
  }
};
