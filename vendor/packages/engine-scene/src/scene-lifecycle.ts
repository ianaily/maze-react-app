import type { EntityId } from '../../engine-core/src/index.js';
import { removeEntityMetadata, type SceneRuntime } from './scene-runtime.js';

export const destroySceneEntity = (runtime: SceneRuntime, entity: EntityId): boolean => {
  if (!runtime.world.hasEntity(entity)) {
    removeEntityMetadata(runtime, entity);
    runtime.physics.removeEntity(entity);
    runtime.animators.remove(entity);
    runtime.characterControllers.remove(entity);
    runtime.sprites.remove(entity);
    runtime.audio.remove(entity);
    runtime.cameras.remove(entity);
    runtime.tilemaps.remove(entity);
    runtime.tweens.remove(entity);
    runtime.particleEmitters.remove(entity);
    return false;
  }

  runtime.world.destroyEntity(entity);
  runtime.physics.removeEntity(entity);
  runtime.animators.remove(entity);
  runtime.characterControllers.remove(entity);
  runtime.sprites.remove(entity);
  runtime.audio.remove(entity);
  runtime.cameras.remove(entity);
  runtime.tilemaps.remove(entity);
  runtime.tweens.remove(entity);
  runtime.particleEmitters.remove(entity);
  removeEntityMetadata(runtime, entity);
  return true;
};

export const destroySceneEntityById = (runtime: SceneRuntime, id: string): boolean => {
  const entity = runtime.entityIds.get(id);

  if (entity === undefined) {
    return false;
  }

  return destroySceneEntity(runtime, entity);
};
