import type { EntityId } from '../../../engine-core/src/index.js';
import {
  TILE_EMPTY,
  TILEMAP_CHUNK_SIZE
} from '../../../engine-tilemap/src/index.js';
import type { SceneTilemapDocumentV1 } from '../scene-schema.js';
import type { SceneRuntime } from '../scene-runtime.js';

export const loadTilemap = (
  runtime: SceneRuntime,
  entity: EntityId,
  document: SceneTilemapDocumentV1
): void => {
  const binding = runtime.tilemaps.add(entity, document.paletteId, document.tileSize);

  for (const chunk of document.chunks) {
    if (chunk.tiles.length !== TILEMAP_CHUNK_SIZE * TILEMAP_CHUNK_SIZE) {
      throw new Error(
        `Tilemap chunk at (${chunk.cx}, ${chunk.cy}) must have ${TILEMAP_CHUNK_SIZE * TILEMAP_CHUNK_SIZE} tiles. Received: ${chunk.tiles.length}`
      );
    }

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

    const startTx = chunk.cx * TILEMAP_CHUNK_SIZE;
    const startTy = chunk.cy * TILEMAP_CHUNK_SIZE;

    for (let local = 0; local < chunk.tiles.length; local += 1) {
      const tileId = chunk.tiles[local] ?? TILE_EMPTY;

      if (tileId === TILE_EMPTY) {
        continue;
      }

      const localX = local % TILEMAP_CHUNK_SIZE;
      const localY = Math.floor(local / TILEMAP_CHUNK_SIZE);
      runtime.tilemaps.setTile(binding, startTx + localX, startTy + localY, tileId);
    }
  }
};
