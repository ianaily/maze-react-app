import type { EntityId, World } from '../../engine-core/src/index.js';
import { PhysicsWorld, RigidbodyType } from '../../engine-physics/src/index.js';
import type {
  AssetCatalogDocument,
  TileColliderDocument
} from '../../engine-asset/src/index.js';
import {
  TILE_EMPTY,
  TILEMAP_CHUNK_SIZE,
  chunkKey,
  tileIndexInChunk,
  tileToWorld
} from './tilemap-math.js';
import { findTilePalette, tileDefinition } from './tilemap-palette.js';
import type { TilemapBinding, TilemapStore } from './tilemap-store.js';

export interface MaterializeTilemapCollidersOptions {
  readonly world: World;
  readonly physics: PhysicsWorld;
  readonly tilemaps: TilemapStore;
  readonly catalog: AssetCatalogDocument | undefined;
}

const tileColliderKey = (tx: number, ty: number): string => `${tx},${ty}`;

export function materializeTilemapColliders(options: MaterializeTilemapCollidersOptions): void {
  for (const binding of options.tilemaps.list()) {
    const palette = findTilePalette(options.catalog, binding.paletteId);

    if (palette === undefined) {
      continue;
    }

    const baseX = options.world.transforms.has(binding.entity)
      ? options.world.transforms.x[binding.entity] ?? 0
      : 0;
    const baseY = options.world.transforms.has(binding.entity)
      ? options.world.transforms.y[binding.entity] ?? 0
      : 0;
    const tileSize = binding.tileSize;

    for (const chunk of binding.chunks.values()) {
      for (let index = 0; index < chunk.tiles.length; index += 1) {
        const tileId = chunk.tiles[index] ?? TILE_EMPTY;

        if (tileId === TILE_EMPTY) {
          continue;
        }

        const definition = tileDefinition(palette, tileId);
        const collider = definition?.collider;

        if (collider === undefined) {
          continue;
        }

        const localX = index % TILEMAP_CHUNK_SIZE;
        const localY = Math.floor(index / TILEMAP_CHUNK_SIZE);
        const tx = chunk.cx * TILEMAP_CHUNK_SIZE + localX;
        const ty = chunk.cy * TILEMAP_CHUNK_SIZE + localY;
        const key = tileColliderKey(tx, ty);

        if (binding.colliderEntityByKey.has(key)) {
          continue;
        }

        const tileEntity = createTileColliderEntity(options.world, options.physics, baseX, baseY, tx, ty, tileSize, collider);
        binding.colliderEntityByKey.set(key, tileEntity);
      }
    }
  }
}

export function clearTilemapColliders(options: MaterializeTilemapCollidersOptions): void {
  for (const binding of options.tilemaps.list()) {
    for (const tileEntity of binding.colliderEntityByKey.values()) {
      options.world.destroyEntity(tileEntity);
      options.physics.removeEntity(tileEntity);
    }

    binding.colliderEntityByKey.clear();
  }
}

export function refreshTilemapColliders(
  options: MaterializeTilemapCollidersOptions,
  binding: TilemapBinding
): void {
  const palette = findTilePalette(options.catalog, binding.paletteId);

  if (palette === undefined) {
    return;
  }

  const liveKeys = new Set<string>();
  const baseX = options.world.transforms.has(binding.entity)
    ? options.world.transforms.x[binding.entity] ?? 0
    : 0;
  const baseY = options.world.transforms.has(binding.entity)
    ? options.world.transforms.y[binding.entity] ?? 0
    : 0;

  for (const chunk of binding.chunks.values()) {
    for (let index = 0; index < chunk.tiles.length; index += 1) {
      const tileId = chunk.tiles[index] ?? TILE_EMPTY;

      if (tileId === TILE_EMPTY) {
        continue;
      }

      const definition = tileDefinition(palette, tileId);
      const collider = definition?.collider;

      if (collider === undefined) {
        continue;
      }

      const localX = index % TILEMAP_CHUNK_SIZE;
      const localY = Math.floor(index / TILEMAP_CHUNK_SIZE);
      const tx = chunk.cx * TILEMAP_CHUNK_SIZE + localX;
      const ty = chunk.cy * TILEMAP_CHUNK_SIZE + localY;
      const key = tileColliderKey(tx, ty);
      liveKeys.add(key);

      if (binding.colliderEntityByKey.has(key)) {
        continue;
      }

      const tileEntity = createTileColliderEntity(options.world, options.physics, baseX, baseY, tx, ty, binding.tileSize, collider);
      binding.colliderEntityByKey.set(key, tileEntity);
    }
  }

  for (const [key, tileEntity] of [...binding.colliderEntityByKey.entries()]) {
    if (liveKeys.has(key)) {
      continue;
    }

    options.world.destroyEntity(tileEntity);
    options.physics.removeEntity(tileEntity);
    binding.colliderEntityByKey.delete(key);
  }
}

function createTileColliderEntity(
  world: World,
  physics: PhysicsWorld,
  baseX: number,
  baseY: number,
  tx: number,
  ty: number,
  tileSize: number,
  collider: TileColliderDocument
): EntityId {
  const entity = world.createEntity();
  const tileWorld = tileToWorld(tx, ty, tileSize);

  world.transforms.add(entity);
  world.transforms.x[entity] = baseX + tileWorld.x + tileSize * 0.5;
  world.transforms.y[entity] = baseY + tileWorld.y + tileSize * 0.5;

  physics.rigidbodies.add(entity, RigidbodyType.Static);
  physics.rigidbodies.gravityScale[entity] = 0;

  physics.colliders.add(entity, collider.width, collider.height);
  physics.colliders.offsetX[entity] = collider.offsetX ?? 0;
  physics.colliders.offsetY[entity] = collider.offsetY ?? 0;
  physics.colliders.isTrigger[entity] = collider.trigger === true ? 1 : 0;
  physics.colliders.categoryBits[entity] = collider.categoryBits ?? 1;
  physics.colliders.maskBits[entity] = collider.maskBits ?? 0xffff_ffff;

  // Silence unused param.
  void chunkKey;
  void tileIndexInChunk;
  return entity;
}
