import type { BehaviorDefinition } from './behavior-definition.js';

export interface BehaviorRegistry {
  get(behaviorId: string): BehaviorDefinition | undefined;
  ids(): readonly string[];
}

/**
 * Mutable, in-memory registry. Game bundles construct one of these, register
 * their `BehaviorDefinition`s, and hand it to `BehaviorSystem`.
 */
export class MutableBehaviorRegistry implements BehaviorRegistry {
  private readonly definitions = new Map<string, BehaviorDefinition>();

  register(definition: BehaviorDefinition): void {
    if (typeof definition.id !== 'string' || definition.id.length === 0) {
      throw new Error('Behavior definition requires a non-empty id.');
    }

    if (this.definitions.has(definition.id)) {
      throw new Error(`Behavior id "${definition.id}" is already registered.`);
    }

    this.definitions.set(definition.id, definition);
  }

  get(behaviorId: string): BehaviorDefinition | undefined {
    return this.definitions.get(behaviorId);
  }

  ids(): readonly string[] {
    return [...this.definitions.keys()];
  }
}
