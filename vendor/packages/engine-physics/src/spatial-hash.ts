import { toEntityId, type EntityId } from '../../engine-core/src/index.js';
import type { ColliderStore } from './collider-store.js';

export class SpatialHash {
  readonly cellSize: number;

  private readonly cells = new Map<number, EntityId[]>();

  constructor(cellSize: number) {
    if (cellSize <= 0) {
      throw new Error('Spatial hash cell size must be positive.');
    }

    this.cellSize = cellSize;
  }

  rebuild(colliders: ColliderStore): void {
    this.cells.clear();

    for (let entity = 0; entity < colliders.present.length; entity += 1) {
      if (colliders.present[entity] !== 1) {
        continue;
      }

      this.insert(toEntityId(entity), colliders);
    }
  }

  query(entity: EntityId, colliders: ColliderStore, out: EntityId[]): EntityId[] {
    out.length = 0;

    const minCellX = toCell(colliders.minX[entity] ?? 0, this.cellSize);
    const minCellY = toCell(colliders.minY[entity] ?? 0, this.cellSize);
    const maxCellX = toCell(colliders.maxX[entity] ?? 0, this.cellSize);
    const maxCellY = toCell(colliders.maxY[entity] ?? 0, this.cellSize);
    const seen = new Set<EntityId>();

    for (let cellY = minCellY; cellY <= maxCellY; cellY += 1) {
      for (let cellX = minCellX; cellX <= maxCellX; cellX += 1) {
        const bucket = this.cells.get(hashCell(cellX, cellY));

        if (bucket === undefined) {
          continue;
        }

        for (const candidate of bucket) {
          if (candidate !== entity && !seen.has(candidate)) {
            seen.add(candidate);
            out.push(candidate);
          }
        }
      }
    }

    return out;
  }

  private insert(entity: EntityId, colliders: ColliderStore): void {
    const minCellX = toCell(colliders.minX[entity] ?? 0, this.cellSize);
    const minCellY = toCell(colliders.minY[entity] ?? 0, this.cellSize);
    const maxCellX = toCell(colliders.maxX[entity] ?? 0, this.cellSize);
    const maxCellY = toCell(colliders.maxY[entity] ?? 0, this.cellSize);

    for (let cellY = minCellY; cellY <= maxCellY; cellY += 1) {
      for (let cellX = minCellX; cellX <= maxCellX; cellX += 1) {
        const key = hashCell(cellX, cellY);
        let bucket = this.cells.get(key);

        if (bucket === undefined) {
          bucket = [];
          this.cells.set(key, bucket);
        }

        bucket.push(entity);
      }
    }
  }
}

const toCell = (value: number, cellSize: number): number => Math.floor(value / cellSize);

const hashCell = (x: number, y: number): number => (x * 73_856_093) ^ (y * 19_349_663);
