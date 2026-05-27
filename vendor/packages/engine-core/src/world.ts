import { type EntityId, toEntityId } from './entity.js';
import { TransformStore } from './transform-store.js';

export type EntityCleanup = (entity: EntityId) => void;

export class World {
  readonly transforms = new TransformStore();

  private nextEntityValue = 0;
  private readonly alive = new Set<EntityId>();
  private readonly entityCleanup = new Set<EntityCleanup>();

  createEntity(): EntityId {
    const entity = toEntityId(this.nextEntityValue);
    this.nextEntityValue += 1;
    this.alive.add(entity);
    return entity;
  }

  destroyEntity(entity: EntityId): void {
    if (!this.alive.delete(entity)) {
      return;
    }

    this.transforms.remove(entity);

    for (const cleanup of this.entityCleanup) {
      cleanup(entity);
    }
  }

  registerStoreCleanup(cleanup: EntityCleanup): () => void {
    this.entityCleanup.add(cleanup);
    return () => {
      this.entityCleanup.delete(cleanup);
    };
  }

  hasEntity(entity: EntityId): boolean {
    return this.alive.has(entity);
  }

  get entityCount(): number {
    return this.alive.size;
  }
}
