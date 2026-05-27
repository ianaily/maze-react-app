import { resolveAssetReference, type AssetCatalogDocument } from '../../../engine-asset/src/index.js';
import type { SceneSpriteDocumentV1 } from '../scene-schema.js';

export const validateEntitySprite = (
  entityId: string,
  sprite: SceneSpriteDocumentV1,
  assets: AssetCatalogDocument | undefined
): void => {
  if (sprite.assetId.length === 0) {
    throw new Error(`Sprite asset id must not be empty for entity: ${entityId}`);
  }

  if (sprite.width <= 0 || sprite.height <= 0) {
    throw new Error(`Sprite size must be positive for entity: ${entityId}`);
  }

  if (assets !== undefined && resolveAssetReference(assets, sprite.assetId) === undefined) {
    throw new Error(
      `Sprite asset id "${sprite.assetId}" is not present in the scene asset catalog (entity: ${entityId}).`
    );
  }
};
