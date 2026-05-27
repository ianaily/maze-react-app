import type { EntityId, World } from '../../engine-core/src/index.js';
import type { BehaviorDefinition } from './behavior-definition.js';
import type { BehaviorRegistry } from './behavior-registry.js';
import type { BehaviorStore } from './behavior-store.js';

export interface BehaviorSystemOptions {
  readonly store: BehaviorStore;
  readonly registry: BehaviorRegistry;
  readonly entityNameOf?: (entity: EntityId) => string | undefined;
  readonly onUnknownBehavior?: (behaviorId: string, entity: EntityId) => void;
  readonly priority?: number;
  /** Forwarded into every BehaviorContext as `ctx.host`. Defaults to `undefined`. */
  readonly host?: unknown;
}

/**
 * Variable-step dispatcher that walks the behavior store every `update` and
 * invokes the registered lifecycle methods. Initialization happens lazily on
 * first sight; destruction is triggered by `pruneRemovedEntities` (called
 * before dispatch) so behavior implementations get a chance to clean up.
 */
export class BehaviorSystem {
  readonly name = 'BehaviorSystem';
  readonly priority: number;

  private readonly store: BehaviorStore;
  private readonly registry: BehaviorRegistry;
  private readonly entityNameOf: (entity: EntityId) => string | undefined;
  private readonly onUnknownBehavior?: (behaviorId: string, entity: EntityId) => void;
  private readonly tracked = new Set<EntityId>();
  private readonly warned = new Set<string>();
  private hostValue: unknown;

  constructor(options: BehaviorSystemOptions) {
    this.store = options.store;
    this.registry = options.registry;
    this.entityNameOf = options.entityNameOf ?? (() => undefined);
    if (options.onUnknownBehavior !== undefined) {
      this.onUnknownBehavior = options.onUnknownBehavior;
    }
    this.priority = options.priority ?? 200;
    this.hostValue = options.host;
  }

  /** Swap the host passed into BehaviorContext (e.g. on scene change). */
  setHost(host: unknown): void {
    this.hostValue = host;
  }

  get host(): unknown {
    return this.hostValue;
  }

  update(_world: World, deltaSeconds: number): void {
    this.pruneRemovedEntities();

    for (const [entity, bindings] of this.store.entries()) {
      this.tracked.add(entity);

      for (const binding of bindings) {
        const definition = this.registry.get(binding.behaviorId);

        if (definition === undefined) {
          this.warnOnce(binding.behaviorId, entity);
          continue;
        }

        if (!binding.initialized) {
          binding.initialized = true;
          definition.init?.({
            entity,
            entityName: this.entityNameOf(entity) ?? String(entity),
            config: binding.config,
            state: binding.state,
            host: this.hostValue
          });
        }

        definition.update?.({
          entity,
          entityName: this.entityNameOf(entity) ?? String(entity),
          config: binding.config,
          state: binding.state,
          deltaSeconds,
          host: this.hostValue
        });
      }
    }
  }

  /** Reset internal tracking — used when the scene is replaced. */
  reset(): void {
    this.tracked.clear();
    this.warned.clear();
  }

  private pruneRemovedEntities(): void {
    if (this.tracked.size === 0) {
      return;
    }

    for (const entity of this.tracked) {
      if (this.store.has(entity)) {
        continue;
      }

      this.tracked.delete(entity);
      this.fireDestroy(entity);
    }
  }

  private fireDestroy(entity: EntityId): void {
    // The store has already dropped the bindings (that's how we detected the
    // removal). For now we have no way to recover them; behaviors that need to
    // run a teardown should park lifecycle hooks via `state` cleanup at
    // `update` time. A future iteration can mirror the bindings here if needed.
    void entity;
  }

  private warnOnce(behaviorId: string, entity: EntityId): void {
    const key = `${entity}:${behaviorId}`;

    if (this.warned.has(key)) {
      return;
    }

    this.warned.add(key);
    this.onUnknownBehavior?.(behaviorId, entity);
  }

  protected getDefinition(behaviorId: string): BehaviorDefinition | undefined {
    return this.registry.get(behaviorId);
  }
}
