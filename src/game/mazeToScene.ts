import { AreaTypeKeys, Maze } from 'src/types/maze';
import type {
  SceneDocument,
  SceneEntityDocumentV1,
  SceneTilemapChunkDocumentV1,
} from 'engine-scene';
import type { TileDefinitionDocument } from 'engine-asset';
import { TILEMAP_CHUNK_SIZE } from 'engine-tilemap';
import {
  ASSET_COIN,
  ASSET_DOOR,
  ASSET_FLOOR,
  ASSET_HERO_RIGHT,
  HERO_MAX_SPEED,
  TILE_FLOOR,
  TILE_SIZE,
  TILE_WALL_BASE,
  WALL_VARIANTS,
  wallAssetId,
} from './const';

export interface SceneSpawnRefs {
  readonly coinIds: readonly string[];
}

export interface MazeSceneBundle {
  readonly scene: SceneDocument;
  readonly refs: SceneSpawnRefs;
}

const areaAt = (maze: Maze, x: number, y: number) =>
  maze.areas[x * maze.size.height + y];

const isWallArea = (maze: Maze, x: number, y: number): boolean => {
  if (x < 0 || y < 0 || x >= maze.size.width || y >= maze.size.height) {
    return true;
  }
  const area = areaAt(maze, x, y);
  return area?.type.name === AreaTypeKeys.Wall;
};

const wallNeighbourMask = (maze: Maze, x: number, y: number): number => {
  const t = isWallArea(maze, x, y - 1) ? 1 : 0;
  const r = isWallArea(maze, x + 1, y) ? 1 : 0;
  const b = isWallArea(maze, x, y + 1) ? 1 : 0;
  const l = isWallArea(maze, x - 1, y) ? 1 : 0;
  return (t << 3) | (r << 2) | (b << 1) | l;
};

const tileWorldCenter = (tx: number, ty: number) => ({
  x: tx * TILE_SIZE + TILE_SIZE / 2,
  y: ty * TILE_SIZE + TILE_SIZE / 2,
});

const isCollectibleSpot = (maze: Maze, x: number, y: number): boolean => {
  const area = areaAt(maze, x, y);
  if (!area) {
    return false;
  }
  const t = area.type.name;
  return t === AreaTypeKeys.Way || t === AreaTypeKeys.Thread;
};

const pickCoinSpots = (maze: Maze, count: number): { x: number; y: number }[] => {
  const candidates: { x: number; y: number }[] = [];
  for (let x = 0; x < maze.size.width; x += 1) {
    for (let y = 0; y < maze.size.height; y += 1) {
      if (isCollectibleSpot(maze, x, y)) {
        candidates.push({ x, y });
      }
    }
  }
  for (let i = candidates.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
  }
  return candidates.slice(0, Math.min(count, candidates.length));
};

const buildPaletteTiles = (): TileDefinitionDocument[] => {
  const tiles: TileDefinitionDocument[] = [
    { spriteAssetId: ASSET_FLOOR, label: 'floor' },
  ];
  for (const variant of WALL_VARIANTS) {
    tiles.push({
      spriteAssetId: wallAssetId(variant),
      collider: { width: TILE_SIZE, height: TILE_SIZE },
      label: `wall-${variant}`,
    });
  }
  return tiles;
};

export const mazeToScene = (maze: Maze): MazeSceneBundle => {
  const { width, height } = maze.size;
  const chunkCountX = Math.max(1, Math.ceil(width / TILEMAP_CHUNK_SIZE));
  const chunkCountY = Math.max(1, Math.ceil(height / TILEMAP_CHUNK_SIZE));
  const chunks: SceneTilemapChunkDocumentV1[] = [];

  for (let cy = 0; cy < chunkCountY; cy += 1) {
    for (let cx = 0; cx < chunkCountX; cx += 1) {
      const tiles = new Array<number>(TILEMAP_CHUNK_SIZE * TILEMAP_CHUNK_SIZE).fill(0);

      for (let ly = 0; ly < TILEMAP_CHUNK_SIZE; ly += 1) {
        for (let lx = 0; lx < TILEMAP_CHUNK_SIZE; lx += 1) {
          const tx = cx * TILEMAP_CHUNK_SIZE + lx;
          const ty = cy * TILEMAP_CHUNK_SIZE + ly;
          const slotIndex = ly * TILEMAP_CHUNK_SIZE + lx;

          if (tx >= width || ty >= height) {
            tiles[slotIndex] = TILE_WALL_BASE + 0b1111; // outside maze acts as fully surrounded wall
            continue;
          }

          if (isWallArea(maze, tx, ty)) {
            tiles[slotIndex] = TILE_WALL_BASE + wallNeighbourMask(maze, tx, ty);
          } else {
            tiles[slotIndex] = TILE_FLOOR;
          }
        }
      }

      chunks.push({ cx, cy, tiles });
    }
  }

  const inwardPort = (x: number, y: number) => ({
    x: x === 0 ? x + 1 : x === width - 1 ? x - 1 : x,
    y: y === 0 ? y + 1 : y === height - 1 ? y - 1 : y,
  });
  const enterPort = inwardPort(maze.enter.x, maze.enter.y);
  const enterWorld = tileWorldCenter(maze.enter.x, maze.enter.y);
  const exitWorld = tileWorldCenter(maze.exit.x, maze.exit.y);
  const heroSpawn = tileWorldCenter(enterPort.x, enterPort.y);

  const mazeWorldWidth = width * TILE_SIZE;
  const mazeWorldHeight = height * TILE_SIZE;

  const targetCoinCount = Math.max(3, Math.min(20, Math.floor((width * height) / 32)));
  const coinSpots = pickCoinSpots(maze, targetCoinCount);
  const coinIds: string[] = [];
  const coinEntities: SceneEntityDocumentV1[] = coinSpots.map((spot, index) => {
    const id = `coin-${index}`;
    coinIds.push(id);
    return {
      id,
      layer: 'goal',
      transform: tileWorldCenter(spot.x, spot.y),
      sprite: { assetId: ASSET_COIN, width: 10, height: 10 },
      collider: { width: 8, height: 8, trigger: true },
    };
  });

  const scene: SceneDocument = {
    version: 1,
    view: 'top-down',
    cameraEntityId: 'play-camera',
    assets: {
      tilePalettes: [
        {
          id: 'maze-palette',
          tileSize: TILE_SIZE,
          tiles: buildPaletteTiles(),
        },
      ],
    },
    layers: [
      { id: 'floor', order: 0 },
      { id: 'goal', order: 1 },
      { id: 'actors', order: 2 },
    ],
    entities: [
      {
        id: 'maze-tilemap',
        layer: 'floor',
        transform: { x: 0, y: 0 },
        tilemap: {
          paletteId: 'maze-palette',
          tileSize: TILE_SIZE,
          chunks,
        },
      },
      {
        id: 'enter-marker',
        layer: 'goal',
        transform: enterWorld,
        sprite: {
          assetId: ASSET_DOOR,
          width: TILE_SIZE,
          height: TILE_SIZE,
          alpha: 0.55,
        },
      },
      {
        id: 'exit-marker',
        layer: 'goal',
        transform: exitWorld,
        sprite: { assetId: ASSET_DOOR, width: TILE_SIZE, height: TILE_SIZE },
        collider: {
          width: TILE_SIZE * 0.7,
          height: TILE_SIZE * 0.7,
          trigger: true,
        },
      },
      ...coinEntities,
      {
        id: 'hero',
        layer: 'actors',
        transform: heroSpawn,
        sprite: {
          assetId: ASSET_HERO_RIGHT,
          width: 12,
          height: 16,
        },
        collider: { width: 10, height: 10 },
        rigidbody: { gravityScale: 0 },
        characterController: {
          mode: 'top-down',
          maxSpeed: HERO_MAX_SPEED,
        },
      },
      {
        id: 'play-camera',
        camera: {
          targetEntityId: 'hero',
          smoothingTimeSeconds: 0.18,
          bounds: {
            minX: 0,
            minY: 0,
            maxX: mazeWorldWidth,
            maxY: mazeWorldHeight,
          },
        },
      },
    ],
  };

  return { scene, refs: { coinIds } };
};
