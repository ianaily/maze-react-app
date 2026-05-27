import {
  compareRenderCommands,
  type Camera2D,
  type Projection,
  type RenderCommand,
  type SpriteRenderCommand
} from '../../engine-render/src/index.js';
import { findAtlasRegion, type AssetCatalogDocument } from '../../engine-asset/src/index.js';
import { toEntityId, type World } from '../../engine-core/src/index.js';
import {
  TILE_EMPTY,
  TILEMAP_CHUNK_SIZE,
  tileToWorld
} from './tilemap-math.js';
import { findTilePalette, tileDefinition } from './tilemap-palette.js';
import type { TilemapStore } from './tilemap-store.js';

export interface TilemapRenderOptions {
  readonly world: World;
  readonly tilemaps: TilemapStore;
  readonly catalog: AssetCatalogDocument | undefined;
  readonly projection: Projection;
  readonly camera: Camera2D;
  readonly layerOf?: (entity: number) => number;
  readonly orderOf?: (entity: number) => number;
  readonly cullPadding?: number;
  readonly out?: RenderCommand[];
}

export function buildTilemapRenderCommands(options: TilemapRenderOptions): RenderCommand[] {
  const commands = options.out ?? [];
  commands.length = 0;

  const cullPadding = options.cullPadding ?? 0;
  const halfViewportWidth = options.camera.viewportWidth * 0.5 / options.camera.zoom;
  const halfViewportHeight = options.camera.viewportHeight * 0.5 / options.camera.zoom;
  const minVisibleX = options.camera.x - halfViewportWidth - cullPadding;
  const maxVisibleX = options.camera.x + halfViewportWidth + cullPadding;
  const minVisibleY = options.camera.y - halfViewportHeight - cullPadding;
  const maxVisibleY = options.camera.y + halfViewportHeight + cullPadding;

  const worldPosition = { x: 0, y: 0 };
  const projected = { x: 0, y: 0 };
  const screen = { x: 0, y: 0 };

  for (const binding of options.tilemaps.list()) {
    const entityId = toEntityId(binding.entity);

    if (!options.world.hasEntity(entityId)) {
      continue;
    }

    const palette = findTilePalette(options.catalog, binding.paletteId);

    if (palette === undefined) {
      continue;
    }

    const tileSize = binding.tileSize;
    const baseX = options.world.transforms.x[binding.entity] ?? 0;
    const baseY = options.world.transforms.y[binding.entity] ?? 0;
    const layer = options.layerOf?.(binding.entity) ?? 0;
    const order = options.orderOf?.(binding.entity) ?? 0;

    for (const chunk of binding.chunks.values()) {
      const chunkMinX = baseX + chunk.cx * TILEMAP_CHUNK_SIZE * tileSize;
      const chunkMinY = baseY + chunk.cy * TILEMAP_CHUNK_SIZE * tileSize;
      const chunkMaxX = chunkMinX + TILEMAP_CHUNK_SIZE * tileSize;
      const chunkMaxY = chunkMinY + TILEMAP_CHUNK_SIZE * tileSize;

      if (chunkMaxX < minVisibleX || chunkMinX > maxVisibleX || chunkMaxY < minVisibleY || chunkMinY > maxVisibleY) {
        continue;
      }

      for (let local = 0; local < chunk.tiles.length; local += 1) {
        const tileId = chunk.tiles[local] ?? TILE_EMPTY;

        if (tileId === TILE_EMPTY) {
          continue;
        }

        const tile = tileDefinition(palette, tileId);

        if (tile?.spriteAssetId === undefined) {
          continue;
        }

        const localX = local % TILEMAP_CHUNK_SIZE;
        const localY = Math.floor(local / TILEMAP_CHUNK_SIZE);
        const tx = chunk.cx * TILEMAP_CHUNK_SIZE + localX;
        const ty = chunk.cy * TILEMAP_CHUNK_SIZE + localY;
        const tileWorld = tileToWorld(tx, ty, tileSize);
        worldPosition.x = baseX + tileWorld.x + tileSize * 0.5;
        worldPosition.y = baseY + tileWorld.y + tileSize * 0.5;
        options.projection.project(projected, worldPosition);
        options.camera.projectedToScreen(screen, projected);

        const region = findAtlasRegion(options.catalog, tile.spriteAssetId);
        const renderAssetId = region?.atlasId ?? tile.spriteAssetId;
        const command: SpriteRenderCommand = {
          kind: 'sprite',
          assetId: renderAssetId,
          screenX: screen.x,
          screenY: screen.y,
          width: tileSize * options.camera.zoom,
          height: tileSize * options.camera.zoom,
          rotation: 0,
          alpha: 1,
          depth: options.projection.depth(worldPosition, layer, order),
          ...(region !== undefined
            ? {
                source: {
                  minX: region.x,
                  minY: region.y,
                  maxX: region.x + region.width,
                  maxY: region.y + region.height
                }
              }
            : {})
        };
        commands.push(command);
      }
    }
  }

  commands.sort(compareRenderCommands);
  return commands;
}
