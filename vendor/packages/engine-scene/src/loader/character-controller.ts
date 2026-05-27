import { CharacterControllerMode } from '../../../engine-character/src/index.js';
import type { EntityId } from '../../../engine-core/src/index.js';
import type { SceneCharacterControllerDocumentV1 } from '../scene-schema.js';
import type { SceneRuntime } from '../scene-runtime.js';

export const loadCharacterController = (
  runtime: SceneRuntime,
  entity: EntityId,
  document: SceneCharacterControllerDocumentV1
): void => {
  runtime.characterControllers.add(entity);
  runtime.characterControllers.mode[entity] = characterControllerModeOf(document.mode);
  runtime.characterControllers.maxSpeed[entity] = document.maxSpeed ?? 72;
  runtime.characterControllers.jumpSpeed[entity] = document.jumpSpeed ?? 170;
};

const characterControllerModeOf = (
  mode: SceneCharacterControllerDocumentV1['mode']
): CharacterControllerMode => {
  if (mode === 'top-down') {
    return CharacterControllerMode.TopDown;
  }

  return CharacterControllerMode.Platformer;
};
