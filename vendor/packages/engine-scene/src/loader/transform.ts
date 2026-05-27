import type { EntityId } from '../../../engine-core/src/index.js';
import type { SceneTransformDocumentV1 } from '../scene-schema.js';
import type { SceneRuntime } from '../scene-runtime.js';

export const loadTransform = (
  runtime: SceneRuntime,
  entity: EntityId,
  document: SceneTransformDocumentV1
): void => {
  runtime.world.transforms.add(entity);
  runtime.world.transforms.x[entity] = document.x ?? 0;
  runtime.world.transforms.y[entity] = document.y ?? 0;
  runtime.world.transforms.rotation[entity] = document.rotation ?? 0;
  runtime.world.transforms.scaleX[entity] = document.scaleX ?? 1;
  runtime.world.transforms.scaleY[entity] = document.scaleY ?? 1;
};
