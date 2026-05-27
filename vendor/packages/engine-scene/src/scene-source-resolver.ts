import {
  findAnimationStripFrame,
  findAtlasRegion,
  type AssetCatalogDocument
} from '../../engine-asset/src/index.js';
import type { SpriteSourceResolution } from '../../engine-render/src/index.js';

/**
 * Builds the `sourceOf` callback for `buildSpriteRenderCommands`, resolving
 * atlas region ids and animation-strip frame ids against the scene's asset
 * catalog. Editor and runtime renderers share this so an authored atlas/strip
 * id renders the same way in both surfaces.
 *
 * Returns a function that yields `undefined` when the asset id is already a
 * real image (sprite) — the builder leaves such ids untouched.
 */
export function createCatalogSourceResolver(
  catalog: AssetCatalogDocument | undefined
): (assetId: string) => SpriteSourceResolution | undefined {
  return (assetId) => {
    const region = findAtlasRegion(catalog, assetId);

    if (region !== undefined) {
      return {
        id: region.atlasId,
        source: {
          minX: region.x,
          minY: region.y,
          maxX: region.x + region.width,
          maxY: region.y + region.height
        }
      };
    }

    const frame = findAnimationStripFrame(catalog, assetId);

    if (frame !== undefined) {
      return {
        id: frame.stripId,
        source: {
          minX: frame.x,
          minY: frame.y,
          maxX: frame.x + frame.width,
          maxY: frame.y + frame.height
        }
      };
    }

    return undefined;
  };
}
