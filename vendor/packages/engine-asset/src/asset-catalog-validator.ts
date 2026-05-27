import type { AssetCatalogDocument } from './asset-catalog-document.js';
import { findDuplicateAssetIds } from './asset-catalog-resolver.js';

export function validateAssetCatalog(catalog: AssetCatalogDocument | undefined): void {
  if (catalog === undefined) {
    return;
  }

  for (const sprite of catalog.sprites ?? []) {
    requireNonEmptyId('sprite', sprite.id);
    requirePositiveDimension('sprite', sprite.id, 'width', sprite.width);
    requirePositiveDimension('sprite', sprite.id, 'height', sprite.height);
  }

  for (const strip of catalog.animationStrips ?? []) {
    requireNonEmptyId('animation strip', strip.id);
    requirePositiveDimension('animation strip', strip.id, 'frameWidth', strip.frameWidth);
    requirePositiveDimension('animation strip', strip.id, 'frameHeight', strip.frameHeight);
    requirePositiveInteger('animation strip', strip.id, 'frameCount', strip.frameCount);

    if (strip.columns !== undefined) {
      requirePositiveInteger('animation strip', strip.id, 'columns', strip.columns);

      if (strip.columns > strip.frameCount) {
        throw new Error(`Animation strip "${strip.id}" columns (${strip.columns}) cannot exceed frameCount (${strip.frameCount}).`);
      }
    }

    if (strip.frameIds !== undefined) {
      if (strip.frameIds.length !== strip.frameCount) {
        throw new Error(`Animation strip "${strip.id}" frameIds length (${strip.frameIds.length}) must equal frameCount (${strip.frameCount}).`);
      }

      for (const frameId of strip.frameIds) {
        requireNonEmptyId('animation strip frame', frameId);
      }
    }
  }

  for (const atlas of catalog.atlases ?? []) {
    requireNonEmptyId('atlas', atlas.id);

    for (const region of atlas.regions) {
      requireNonEmptyId('atlas region', region.id);
      requireFiniteNumber('atlas region', region.id, 'x', region.x);
      requireFiniteNumber('atlas region', region.id, 'y', region.y);
      requirePositiveDimension('atlas region', region.id, 'width', region.width);
      requirePositiveDimension('atlas region', region.id, 'height', region.height);
    }
  }

  for (const clip of catalog.audioClips ?? []) {
    requireNonEmptyId('audio clip', clip.id);
    requireNonEmptyString('audio clip', clip.id, 'source', clip.source);

    if (clip.defaultVolume !== undefined) {
      requireUnitInterval('audio clip', clip.id, 'defaultVolume', clip.defaultVolume);
    }

    if (clip.channel !== undefined && clip.channel !== 'music' && clip.channel !== 'sfx') {
      throw new Error(`Audio clip "${clip.id}" channel must be "music" or "sfx". Received: ${String(clip.channel)}`);
    }
  }

  for (const palette of catalog.tilePalettes ?? []) {
    requireNonEmptyId('tile palette', palette.id);
    requirePositiveDimension('tile palette', palette.id, 'tileSize', palette.tileSize);

    if (!Array.isArray(palette.tiles) || palette.tiles.length === 0) {
      throw new Error(`Tile palette "${palette.id}" requires at least one tile entry.`);
    }

    for (let index = 0; index < palette.tiles.length; index += 1) {
      const tile = palette.tiles[index];

      if (tile === undefined) {
        throw new Error(`Tile palette "${palette.id}" entry at index ${index} is undefined.`);
      }

      if (tile.collider !== undefined) {
        requirePositiveDimension('tile palette collider', palette.id, 'width', tile.collider.width);
        requirePositiveDimension('tile palette collider', palette.id, 'height', tile.collider.height);
      }
    }
  }

  const duplicates = findDuplicateAssetIds(catalog);

  if (duplicates.length > 0) {
    throw new Error(`Duplicate asset ids in catalog: ${duplicates.join(', ')}`);
  }
}

function requireNonEmptyId(kind: string, id: unknown): void {
  if (typeof id !== 'string' || id.length === 0) {
    throw new Error(`Asset ${kind} requires a non-empty string id. Received: ${String(id)}`);
  }
}

function requirePositiveDimension(kind: string, id: string, field: string, value: unknown): void {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
    throw new Error(`Asset ${kind} "${id}" requires positive ${field}. Received: ${String(value)}`);
  }
}

function requirePositiveInteger(kind: string, id: string, field: string, value: unknown): void {
  if (typeof value !== 'number' || !Number.isInteger(value) || value <= 0) {
    throw new Error(`Asset ${kind} "${id}" requires positive integer ${field}. Received: ${String(value)}`);
  }
}

function requireFiniteNumber(kind: string, id: string, field: string, value: unknown): void {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(`Asset ${kind} "${id}" requires a finite ${field}. Received: ${String(value)}`);
  }
}

function requireNonEmptyString(kind: string, id: string, field: string, value: unknown): void {
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`Asset ${kind} "${id}" requires a non-empty ${field}.`);
  }
}

function requireUnitInterval(kind: string, id: string, field: string, value: unknown): void {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > 1) {
    throw new Error(`Asset ${kind} "${id}" ${field} must be a number in [0, 1]. Received: ${String(value)}`);
  }
}
