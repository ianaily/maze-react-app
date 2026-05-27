import {
  BehaviorSystem,
  type BehaviorRegistry,
  type BehaviorSystemOptions
} from '../../engine-behavior/src/index.js';
import type { EntityId } from '../../engine-core/src/index.js';
import type { RuntimeSession } from './runtime-session.js';

export interface RuntimeBehaviorsOptions {
  readonly registry: BehaviorRegistry;
  /**
   * Forwarded into every BehaviorContext as `ctx.host`. Game code typically
   * passes a record carrying `bus`, `runtime`, score counters, etc., so
   * behaviors can interact with the wider game state without the engine
   * taking a dependency on game code shapes.
   */
  readonly host?: unknown;
  readonly onUnknownBehavior?: (behaviorId: string, entity: EntityId) => void;
  readonly priority?: number;
}

export interface RuntimeBehaviorsBinding {
  readonly system: BehaviorSystem;
  /** Update the host passed into BehaviorContexts after attaching. */
  setHost(host: unknown): void;
}

/**
 * Register a `BehaviorSystem` on the session's engine that walks the scene
 * runtime's `behaviors` store every variable update. Behavior definitions are
 * resolved through the supplied registry; unknown ids surface via the
 * optional callback so the host can highlight authoring mistakes without
 * breaking the loop.
 */
export function attachRuntimeBehaviors(
  session: RuntimeSession,
  options: RuntimeBehaviorsOptions
): RuntimeBehaviorsBinding {
  const systemOptions: BehaviorSystemOptions = {
    store: session.runtime.behaviors,
    registry: options.registry,
    entityNameOf: (entity) => idForEntity(session, entity),
    ...(options.onUnknownBehavior !== undefined ? { onUnknownBehavior: options.onUnknownBehavior } : {}),
    ...(options.priority !== undefined ? { priority: options.priority } : {}),
    ...(options.host !== undefined ? { host: options.host } : {})
  };
  const system = new BehaviorSystem(systemOptions);
  session.engine.addSystem(system);

  return {
    system,
    setHost(host): void {
      system.setHost(host);
    }
  };
}

function idForEntity(session: RuntimeSession, entity: EntityId): string | undefined {
  for (const [id, mapped] of session.runtime.entityIds) {
    if (mapped === entity) {
      return id;
    }
  }

  return undefined;
}
