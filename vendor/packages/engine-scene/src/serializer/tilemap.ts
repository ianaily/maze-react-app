import type { EntityId } from '../../../engine-core/src/index.js';
import { TILE_EMPTY } from '../../../engine-tilemap/src/index.js';
import type {
  SceneTilemapChunkDocumentV1,
  SceneTilemapDocumentV1
} from '../scene-schema.js';
import type { SceneRuntime } from '../scene-runtime.js';

export const serializeTilemap = (runtime: SceneRuntime, entity: EntityId): SceneTilemapDocumentV1 | undefined => {
  const binding = runtime.tilemaps.get(entity);

  if (binding === undefined) {
    return undefined;
  }

  const chunks: SceneTilemapChunkDocumentV1[] = [];

  for (const chunk of binding.chunks.values()) {
    let occupied = false;

    for (let local = 0; local < chunk.tiles.length; local += 1) {
      if (chunk.tiles[local] !== TILE_EMPTY) {
        occupied = true;
        break;
      }
    }

    if (!occupied) {
      continue;
    }

    chunks.push({
      cx: chunk.cx,
      cy: chunk.cy,
      tiles: Array.from(chunk.tiles)
    });
  }

  chunks.sort((left, right) => left.cy - right.cy || left.cx - right.cx);

  return {
    paletteId: binding.paletteId,
    tileSize: binding.tileSize,
    chunks
  };
};
