import type { EntityId } from '../../../engine-core/src/index.js';
import type { SceneSpriteDocumentV1 } from '../scene-schema.js';
import type { SceneRuntime } from '../scene-runtime.js';

export const serializeSprite = (runtime: SceneRuntime, entity: EntityId): SceneSpriteDocumentV1 | undefined => {
  if (!runtime.sprites.has(entity)) {
    return undefined;
  }

  return {
    assetId: runtime.sprites.assetId[entity] ?? '',
    width: runtime.sprites.width[entity] ?? 1,
    height: runtime.sprites.height[entity] ?? 1,
    offsetX: runtime.sprites.offsetX[entity] ?? 0,
    offsetY: runtime.sprites.offsetY[entity] ?? 0,
    alpha: runtime.sprites.alpha[entity] ?? 1
  };
};
