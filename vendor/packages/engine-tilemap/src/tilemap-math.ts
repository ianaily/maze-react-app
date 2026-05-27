export const TILEMAP_CHUNK_SIZE = 16;

export const TILE_EMPTY = 0;

export interface ChunkCoord {
  readonly cx: number;
  readonly cy: number;
}

export interface TileCoord {
  readonly tx: number;
  readonly ty: number;
}

export function chunkKey(cx: number, cy: number): string {
  return `${cx},${cy}`;
}

export function parseChunkKey(key: string): ChunkCoord {
  const [cxRaw, cyRaw] = key.split(',');
  const cx = Number(cxRaw);
  const cy = Number(cyRaw);

  if (!Number.isFinite(cx) || !Number.isFinite(cy)) {
    throw new Error(`Invalid chunk key: ${key}`);
  }

  return { cx, cy };
}

export function tileToChunk(tx: number, ty: number): ChunkCoord {
  return {
    cx: Math.floor(tx / TILEMAP_CHUNK_SIZE),
    cy: Math.floor(ty / TILEMAP_CHUNK_SIZE)
  };
}

export function tileIndexInChunk(tx: number, ty: number): number {
  const localX = ((tx % TILEMAP_CHUNK_SIZE) + TILEMAP_CHUNK_SIZE) % TILEMAP_CHUNK_SIZE;
  const localY = ((ty % TILEMAP_CHUNK_SIZE) + TILEMAP_CHUNK_SIZE) % TILEMAP_CHUNK_SIZE;
  return localY * TILEMAP_CHUNK_SIZE + localX;
}

export function tileToWorld(tx: number, ty: number, tileSize: number): { x: number; y: number } {
  return {
    x: tx * tileSize,
    y: ty * tileSize
  };
}

export function worldToTile(x: number, y: number, tileSize: number): TileCoord {
  return {
    tx: Math.floor(x / tileSize),
    ty: Math.floor(y / tileSize)
  };
}
