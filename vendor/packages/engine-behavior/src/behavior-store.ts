import type { EntityId } from '../../engine-core/src/index.js';
import type { SceneBehaviorConfig, SceneBehaviorDocumentV1 } from './behavior-document.js';
import type { BehaviorRuntimeState } from './behavior-definition.js';

export interface BehaviorBinding {
  readonly behaviorId: string;
  readonly config: SceneBehaviorConfig;
  /** Opaque scratch state the behavior implementation owns. */
  readonly state: BehaviorRuntimeState;
  /** Has the registry-supplied `init` been called yet for this binding? */
  initialized: boolean;
}

/**
 * Per-entity list of behavior bindings. Stored in declaration order so authors
 * can rely on consistent ordering between scene JSON and runtime dispatch.
 */
export class BehaviorStore {
  private readonly byEntity = new Map<EntityId, BehaviorBinding[]>();

  set(entity: EntityId, behaviors: readonly SceneBehaviorDocumentV1[]): void {
    if (behaviors.length === 0) {
      this.byEntity.delete(entity);
      return;
    }

    this.byEntity.set(
      entity,
      behaviors.map((behavior) => ({
        behaviorId: behavior.behaviorId,
        config: behavior.config ?? {},
        state: {},
        initialized: false
      }))
    );
  }

  add(entity: EntityId, behavior: SceneBehaviorDocumentV1): void {
    const list = this.byEntity.get(entity) ?? [];

    if (list.some((existing) => existing.behaviorId === behavior.behaviorId)) {
      throw new Error(
        `Behavior "${behavior.behaviorId}" already bound on entity ${entity}; remove it before adding again.`
      );
    }

    list.push({
      behaviorId: behavior.behaviorId,
      config: behavior.config ?? {},
      state: {},
      initialized: false
    });

    this.byEntity.set(entity, list);
  }

  remove(entity: EntityId): readonly BehaviorBinding[] | undefined {
    const list = this.byEntity.get(entity);
    this.byEntity.delete(entity);
    return list;
  }

  removeBinding(entity: EntityId, behaviorId: string): BehaviorBinding | undefined {
    const list = this.byEntity.get(entity);

    if (list === undefined) {
      return undefined;
    }

    const index = list.findIndex((binding) => binding.behaviorId === behaviorId);

    if (index === -1) {
      return undefined;
    }

    const [removed] = list.splice(index, 1);

    if (list.length === 0) {
      this.byEntity.delete(entity);
    }

    return removed;
  }

  has(entity: EntityId): boolean {
    return this.byEntity.has(entity);
  }

  get(entity: EntityId): readonly BehaviorBinding[] | undefined {
    return this.byEntity.get(entity);
  }

  entries(): IterableIterator<[EntityId, readonly BehaviorBinding[]]> {
    return this.byEntity.entries();
  }

  /** Convert the store back to authoring documents for serialization. */
  toDocuments(entity: EntityId): readonly SceneBehaviorDocumentV1[] | undefined {
    const list = this.byEntity.get(entity);

    if (list === undefined || list.length === 0) {
      return undefined;
    }

    return list.map<SceneBehaviorDocumentV1>((binding) =>
      Object.keys(binding.config).length === 0
        ? { behaviorId: binding.behaviorId }
        : { behaviorId: binding.behaviorId, config: cloneConfig(binding.config) }
    );
  }
}

function cloneConfig(config: SceneBehaviorConfig): SceneBehaviorConfig {
  return JSON.parse(JSON.stringify(config)) as SceneBehaviorConfig;
}
