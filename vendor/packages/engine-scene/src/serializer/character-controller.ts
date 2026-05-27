import { CharacterControllerMode } from '../../../engine-character/src/index.js';
import type { EntityId } from '../../../engine-core/src/index.js';
import type { SceneCharacterControllerDocumentV1 } from '../scene-schema.js';
import type { SceneRuntime } from '../scene-runtime.js';

export const serializeCharacterController = (
  runtime: SceneRuntime,
  entity: EntityId
): SceneCharacterControllerDocumentV1 | undefined => {
  if (!runtime.characterControllers.has(entity)) {
    return undefined;
  }

  const mode = runtime.characterControllers.mode[entity] ?? CharacterControllerMode.Platformer;

  return {
    ...(mode === CharacterControllerMode.TopDown ? { mode: 'top-down' as const } : {}),
    maxSpeed: runtime.characterControllers.maxSpeed[entity] ?? 72,
    jumpSpeed: runtime.characterControllers.jumpSpeed[entity] ?? 170
  };
};
