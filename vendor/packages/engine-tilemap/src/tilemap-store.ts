import type { EntityId } from '../../engine-core/src/index.js';
import {
  chunkKey,
  TILE_EMPTY,
  TILEMAP_CHUNK_SIZE,
  tileIndexInChunk,
  tileToChunk
} from './tilemap-math.js';

export interface TilemapChunk {
  readonly cx: number;
  readonly cy: number;
  readonly tiles: Uint16Array;
}

export interface TilemapBinding {
  readonly entity: EntityId;
  readonly paletteId: string;
  readonly tileSize: number;
  readonly chunks: Map<string, TilemapChunk>;
  readonly colliderEntityByKey: Map<string, EntityId>;
}

export class TilemapStore {
  private readonly bindings = new Map<EntityId, TilemapBinding>();

  add(entity: EntityId, paletteId: string, tileSize: number): TilemapBinding {
    if (this.bindings.has(entity)) {
      throw new Error(`Tilemap already attached to entity ${entity}.`);
    }

    if (paletteId.length === 0) {
      throw new Error('Tilemap palette id must not be empty.');
    }

    if (tileSize <= 0) {
      throw new Error('Tilemap tileSize must be positive.');
    }

    const binding: TilemapBinding = {
      entity,
      paletteId,
      tileSize,
      chunks: new Map(),
      colliderEntityByKey: new Map()
    };
    this.bindings.set(entity, binding);
    return binding;
  }

  has(entity: EntityId): boolean {
    return this.bindings.has(entity);
  }

  get(entity: EntityId): TilemapBinding | undefined {
    return this.bindings.get(entity);
  }

  list(): IterableIterator<TilemapBinding> {
    return this.bindings.values();
  }

  remove(entity: EntityId): TilemapBinding | undefined {
    const binding = this.bindings.get(entity);

    if (binding === undefined) {
      return undefined;
    }

    this.bindings.delete(entity);
    return binding;
  }

  setTile(binding: TilemapBinding, tx: number, ty: number, tileId: number): number {
    const { cx, cy } = tileToChunk(tx, ty);
    const key = chunkKey(cx, cy);
    let chunk = binding.chunks.get(key);

    if (chunk === undefined) {
      if (tileId === TILE_EMPTY) {
        return TILE_EMPTY;
      }

      chunk = { cx, cy, tiles: new Uint16Array(TILEMAP_CHUNK_SIZE * TILEMAP_CHUNK_SIZE) };
      binding.chunks.set(key, chunk);
    }

    const index = tileIndexInChunk(tx, ty);
    const previous = chunk.tiles[index] ?? TILE_EMPTY;
    chunk.tiles[index] = tileId;

    if (tileId === TILE_EMPTY && this.isChunkEmpty(chunk)) {
      binding.chunks.delete(key);
    }

    return previous;
  }

  getTile(binding: TilemapBinding, tx: number, ty: number): number {
    const { cx, cy } = tileToChunk(tx, ty);
    const chunk = binding.chunks.get(chunkKey(cx, cy));

    if (chunk === undefined) {
      return TILE_EMPTY;
    }

    return chunk.tiles[tileIndexInChunk(tx, ty)] ?? TILE_EMPTY;
  }

  private isChunkEmpty(chunk: TilemapChunk): boolean {
    for (let index = 0; index < chunk.tiles.length; index += 1) {
      if (chunk.tiles[index] !== TILE_EMPTY) {
        return false;
      }
    }

    return true;
  }
}
