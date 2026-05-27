import type { EntityId } from '../../../engine-core/src/index.js';
import type { SceneTransformDocumentV1 } from '../scene-schema.js';
import type { SceneRuntime } from '../scene-runtime.js';

export const serializeTransform = (runtime: SceneRuntime, entity: EntityId): SceneTransformDocumentV1 | undefined => {
  if (!runtime.world.transforms.has(entity)) {
    return undefined;
  }

  return {
    x: runtime.world.transforms.x[entity] ?? 0,
    y: runtime.world.transforms.y[entity] ?? 0,
    rotation: runtime.world.transforms.rotation[entity] ?? 0,
    scaleX: runtime.world.transforms.scaleX[entity] ?? 1,
    scaleY: runtime.world.transforms.scaleY[entity] ?? 1
  };
};
