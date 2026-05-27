import type { SceneCharacterControllerDocumentV1 } from '../scene-schema.js';

export const validateEntityCharacterController = (
  entityId: string,
  controller: SceneCharacterControllerDocumentV1
): void => {
  if (
    controller.mode !== undefined &&
    controller.mode !== 'platformer' &&
    controller.mode !== 'top-down'
  ) {
    throw new Error(`Character controller mode is not supported for entity: ${entityId}`);
  }

  if ((controller.maxSpeed ?? 1) <= 0) {
    throw new Error(`Character controller max speed must be positive for entity: ${entityId}`);
  }

  if ((controller.jumpSpeed ?? 1) <= 0) {
    throw new Error(`Character controller jump speed must be positive for entity: ${entityId}`);
  }
};
