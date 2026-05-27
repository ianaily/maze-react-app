import {
  TILE_EMPTY,
  TILEMAP_CHUNK_SIZE,
  chunkKey,
  tileIndexInChunk,
  tileToChunk
} from '../../engine-tilemap/src/index.js';
import type {
  SceneDocument,
  SceneTilemapChunkDocumentV1,
  SceneTilemapDocumentV1
} from '../../engine-scene/src/index.js';
import type { EditorCommand } from './scene-commands.js';

export interface TilemapTileEdit {
  readonly tx: number;
  readonly ty: number;
  readonly tileId: number;
}

/**
 * Apply a batch of tile edits to one tilemap component, recording the inverse
 * batch as the undo step. Erasing the last non-empty tile in a chunk drops the
 * chunk entry so the saved scene stays compact. Edits target the entity's
 * `tilemap` component; missing component or unknown entity throws on apply.
 *
 * The whole batch is one undo unit — paint stroke or fill region commits
 * once, no matter how many tiles changed.
 */
export function setTilemapTilesCommand(
  entityId: string,
  edits: readonly TilemapTileEdit[]
): EditorCommand {
  return {
    name: `paint ${edits.length} tile${edits.length === 1 ? '' : 's'} on ${entityId}`,
    apply(document) {
      const entityIndex = document.entities.findIndex((entity) => entity.id === entityId);

      if (entityIndex === -1) {
        throw new Error(`Tilemap target entity does not exist: ${entityId}`);
      }

      const entity = document.entities[entityIndex];

      if (entity === undefined || entity.tilemap === undefined) {
        throw new Error(`Entity ${entityId} has no tilemap component to paint.`);
      }

      const previousTilemap = entity.tilemap;
      const workingChunks = new Map<string, number[]>();

      for (const chunk of previousTilemap.chunks) {
        workingChunks.set(chunkKey(chunk.cx, chunk.cy), [...chunk.tiles]);
      }

      const inverseEdits: TilemapTileEdit[] = [];
      let mutated = false;

      for (const edit of edits) {
        const { tx, ty, tileId } = edit;
        const { cx, cy } = tileToChunk(tx, ty);
        const key = chunkKey(cx, cy);
        let tiles = workingChunks.get(key);

        if (tiles === undefined) {
          if (tileId === TILE_EMPTY) {
            continue;
          }

          tiles = new Array(TILEMAP_CHUNK_SIZE * TILEMAP_CHUNK_SIZE).fill(TILE_EMPTY);
          workingChunks.set(key, tiles);
        }

        const index = tileIndexInChunk(tx, ty);
        const previousTile = tiles[index] ?? TILE_EMPTY;

        if (previousTile === tileId) {
          continue;
        }

        tiles[index] = tileId;
        inverseEdits.push({ tx, ty, tileId: previousTile });
        mutated = true;

        if (tileId === TILE_EMPTY && tiles.every((value) => value === TILE_EMPTY)) {
          workingChunks.delete(key);
        }
      }

      if (!mutated) {
        return {
          document,
          undo: setTilemapTilesCommand(entityId, [])
        };
      }

      const nextChunks: SceneTilemapChunkDocumentV1[] = [];

      for (const chunk of previousTilemap.chunks) {
        const key = chunkKey(chunk.cx, chunk.cy);
        const updated = workingChunks.get(key);

        if (updated === undefined) {
          continue;
        }

        nextChunks.push({ cx: chunk.cx, cy: chunk.cy, tiles: updated });
        workingChunks.delete(key);
      }

      for (const [key, tiles] of workingChunks) {
        const [cxRaw, cyRaw] = key.split(',');
        nextChunks.push({ cx: Number(cxRaw), cy: Number(cyRaw), tiles });
      }

      const nextTilemap: SceneTilemapDocumentV1 = {
        paletteId: previousTilemap.paletteId,
        tileSize: previousTilemap.tileSize,
        chunks: nextChunks
      };
      const nextEntities = document.entities.slice();
      nextEntities[entityIndex] = { ...entity, tilemap: nextTilemap };
      const nextDocument: SceneDocument = { ...document, entities: nextEntities };

      const reversedInverse = inverseEdits.slice().reverse();
      return {
        document: nextDocument,
        undo: setTilemapTilesCommand(entityId, reversedInverse)
      };
    }
  };
}
