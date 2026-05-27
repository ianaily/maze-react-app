import type { EntityId } from '../../../engine-core/src/index.js';
import type { SceneSpriteDocumentV1 } from '../scene-schema.js';
import type { SceneRuntime } from '../scene-runtime.js';

export const loadSprite = (
  runtime: SceneRuntime,
  entity: EntityId,
  document: SceneSpriteDocumentV1
): void => {
  runtime.sprites.add(entity, document.assetId, document.width, document.height);
  runtime.sprites.offsetX[entity] = document.offsetX ?? 0;
  runtime.sprites.offsetY[entity] = document.offsetY ?? 0;
  runtime.sprites.alpha[entity] = document.alpha ?? 1;
};
