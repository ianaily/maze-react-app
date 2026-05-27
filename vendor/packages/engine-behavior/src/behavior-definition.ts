import type { EntityId } from '../../engine-core/src/index.js';
import type { SceneBehaviorConfig } from './behavior-document.js';

/**
 * Per-binding scratch state the engine owns. Behavior implementations can
 * stash whatever they need here; the engine treats it as opaque.
 */
export interface BehaviorRuntimeState {
  [key: string]: unknown;
}

export interface BehaviorContext {
  readonly entity: EntityId;
  readonly entityName: string;
  readonly config: SceneBehaviorConfig;
  readonly state: BehaviorRuntimeState;
  readonly deltaSeconds: number;
  /**
   * Application-provided context (bus, runtime, score, etc.) passed through
   * from `attachRuntimeBehaviors` so behaviors can reach the wider world
   * without engine-behavior taking a dependency on engine-scene/runtime.
   * Behaviors that need it cast to the host shape they expect.
   */
  readonly host: unknown;
}

export interface BehaviorDefinition {
  readonly id: string;
  /**
   * Called once per binding the first time the system encounters it.
   * Useful for parsing the config into the state slot.
   */
  init?(context: Omit<BehaviorContext, 'deltaSeconds'>): void;
  /** Called every variable-step `update`. Skip the method to opt out. */
  update?(context: BehaviorContext): void;
  /** Called when the entity or binding is removed. */
  destroy?(context: Omit<BehaviorContext, 'deltaSeconds'>): void;
}
