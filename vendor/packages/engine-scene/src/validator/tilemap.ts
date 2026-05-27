import { resolveAssetReference, type AssetCatalogDocument } from '../../../engine-asset/src/index.js';
import type { SceneTilemapDocumentV1 } from '../scene-schema.js';

export const validateEntityTilemap = (
  entityId: string,
  tilemap: SceneTilemapDocumentV1,
  assets: AssetCatalogDocument | undefined
): void => {
  if (typeof tilemap.paletteId !== 'string' || tilemap.paletteId.length === 0) {
    throw new Error(`Tilemap paletteId must not be empty for entity: ${entityId}`);
  }

  if (!Number.isFinite(tilemap.tileSize) || tilemap.tileSize <= 0) {
    throw new Error(`Tilemap tileSize must be a positive finite number for entity: ${entityId}`);
  }

  if (assets !== undefined) {
    const reference = resolveAssetReference(assets, tilemap.paletteId);

    if (reference === undefined) {
      throw new Error(
        `Tilemap paletteId "${tilemap.paletteId}" is not present in the asset catalog (entity: ${entityId}).`
      );
    }

    if (reference.kind !== 'tile-palette') {
      throw new Error(
        `Tilemap paletteId "${tilemap.paletteId}" must resolve to a tile-palette asset (entity: ${entityId}).`
      );
    }
  }

  const seenChunkKeys = new Set<string>();

  for (const chunk of tilemap.chunks) {
    if (!Number.isInteger(chunk.cx) || !Number.isInteger(chunk.cy)) {
      throw new Error(`Tilemap chunk coordinates must be integers for entity: ${entityId}`);
    }

    const key = `${chunk.cx},${chunk.cy}`;

    if (seenChunkKeys.has(key)) {
      throw new Error(`Duplicate tilemap chunk at (${chunk.cx}, ${chunk.cy}) for entity: ${entityId}`);
    }

    seenChunkKeys.add(key);

    if (!Array.isArray(chunk.tiles)) {
      throw new Error(`Tilemap chunk tiles must be an array for entity: ${entityId}`);
    }
  }
};
