import type {
  AssetCatalogDocument,
  AssetKind,
  ResolvedAssetReference
} from './asset-catalog-document.js';

export function resolveAssetReference(
  catalog: AssetCatalogDocument | undefined,
  id: string
): ResolvedAssetReference | undefined {
  if (catalog === undefined) {
    return undefined;
  }

  if (catalog.sprites?.some((entry) => entry.id === id) === true) {
    return { id, kind: 'sprite' };
  }

  if (catalog.animationStrips?.some((entry) => entry.id === id) === true) {
    return { id, kind: 'animation-strip' };
  }

  if (catalog.animationStrips !== undefined) {
    for (const strip of catalog.animationStrips) {
      if (strip.frameIds?.includes(id) === true) {
        return { id, kind: 'animation-strip-frame' };
      }
    }
  }

  if (catalog.atlases !== undefined) {
    for (const atlas of catalog.atlases) {
      if (atlas.regions.some((region) => region.id === id)) {
        return { id, kind: 'atlas-region' };
      }
    }
  }

  if (catalog.audioClips?.some((entry) => entry.id === id) === true) {
    return { id, kind: 'audio-clip' };
  }

  if (catalog.tilePalettes?.some((entry) => entry.id === id) === true) {
    return { id, kind: 'tile-palette' };
  }

  return undefined;
}

export function listCatalogIds(catalog: AssetCatalogDocument | undefined): readonly string[] {
  if (catalog === undefined) {
    return [];
  }

  const ids: string[] = [];

  for (const sprite of catalog.sprites ?? []) {
    ids.push(sprite.id);
  }

  for (const strip of catalog.animationStrips ?? []) {
    ids.push(strip.id);

    for (const frameId of strip.frameIds ?? []) {
      ids.push(frameId);
    }
  }

  for (const atlas of catalog.atlases ?? []) {
    for (const region of atlas.regions) {
      ids.push(region.id);
    }
  }

  for (const clip of catalog.audioClips ?? []) {
    ids.push(clip.id);
  }

  for (const palette of catalog.tilePalettes ?? []) {
    ids.push(palette.id);
  }

  return ids;
}

export function findDuplicateAssetIds(catalog: AssetCatalogDocument | undefined): readonly string[] {
  const ids = listCatalogIds(catalog);
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  for (const id of ids) {
    if (seen.has(id)) {
      duplicates.add(id);
    } else {
      seen.add(id);
    }
  }

  return [...duplicates];
}

export function assetKindOf(
  catalog: AssetCatalogDocument | undefined,
  id: string
): AssetKind | undefined {
  return resolveAssetReference(catalog, id)?.kind;
}

export interface ResolvedAtlasRegion {
  /** Atlas asset id — the parent image whose source-rect the region samples. */
  readonly atlasId: string;
  readonly source: string;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

/**
 * Look up an atlas region id and return the containing atlas's image source
 * plus the region's pixel rectangle. Render command builders use this to
 * translate authored region ids into "draw atlas image with sub-rect" calls.
 * Returns undefined when the id is not an atlas region.
 */
export interface ResolvedAnimationStripFrame {
  /** Strip asset id — the parent image whose grid the frame samples. */
  readonly stripId: string;
  readonly source: string;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

/**
 * Look up a strip frame id and return the containing strip's image source
 * plus the slot's pixel rectangle. Frame index maps row-major: row =
 * floor(index / columns), column = index % columns. Returns undefined when
 * the id is not a declared strip frame.
 */
export function findAnimationStripFrame(
  catalog: AssetCatalogDocument | undefined,
  frameId: string
): ResolvedAnimationStripFrame | undefined {
  if (catalog?.animationStrips === undefined) {
    return undefined;
  }

  for (const strip of catalog.animationStrips) {
    const frameIndex = strip.frameIds?.indexOf(frameId) ?? -1;

    if (frameIndex < 0) {
      continue;
    }

    const columns = strip.columns ?? strip.frameCount;
    const column = frameIndex % columns;
    const row = Math.floor(frameIndex / columns);

    return {
      stripId: strip.id,
      source: strip.source,
      x: column * strip.frameWidth,
      y: row * strip.frameHeight,
      width: strip.frameWidth,
      height: strip.frameHeight
    };
  }

  return undefined;
}

export function findAtlasRegion(
  catalog: AssetCatalogDocument | undefined,
  regionId: string
): ResolvedAtlasRegion | undefined {
  if (catalog?.atlases === undefined) {
    return undefined;
  }

  for (const atlas of catalog.atlases) {
    const region = atlas.regions.find((entry) => entry.id === regionId);

    if (region !== undefined) {
      return {
        atlasId: atlas.id,
        source: atlas.source,
        x: region.x,
        y: region.y,
        width: region.width,
        height: region.height
      };
    }
  }

  return undefined;
}
