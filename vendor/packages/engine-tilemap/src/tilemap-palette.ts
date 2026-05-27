import type {
  AssetCatalogDocument,
  TileDefinitionDocument,
  TilePaletteAssetDocument
} from '../../engine-asset/src/index.js';

export function findTilePalette(
  catalog: AssetCatalogDocument | undefined,
  paletteId: string
): TilePaletteAssetDocument | undefined {
  return catalog?.tilePalettes?.find((palette) => palette.id === paletteId);
}

export function tileDefinition(
  palette: TilePaletteAssetDocument,
  tileId: number
): TileDefinitionDocument | undefined {
  // tileId 0 is reserved for "empty"; palette entries are 1-indexed.
  if (tileId <= 0) {
    return undefined;
  }

  return palette.tiles[tileId - 1];
}
