import {
  EventBus,
  type EventSubscription
} from '../../engine-core/src/index.js';
import type {
  GameStateDocument,
  GameStateSnapshot,
  GameTransitionDocument
} from './game-state-document.js';
import { validateGameStateDocument } from './game-state-validator.js';
import { GameVariables } from './game-variables.js';

export interface GameSceneChangedEvent {
  readonly previousSceneId: string | undefined;
  readonly nextSceneId: string;
  readonly trigger: 'manual' | 'event';
  readonly eventName?: string;
}

export const GAME_SCENE_CHANGED_EVENT = 'game:scene-changed';

export interface GameStateMachineOptions {
  readonly document: GameStateDocument;
  readonly bus?: EventBus;
}

export class GameStateMachine {
  readonly variables = new GameVariables();
  readonly bus: EventBus;
  readonly document: GameStateDocument;
  private readonly registeredScenes: ReadonlySet<string>;
  private readonly transitionSubscriptions: EventSubscription[] = [];
  private currentSceneIdInternal: string;

  constructor(options: GameStateMachineOptions) {
    validateGameStateDocument(options.document);
    this.document = options.document;
    this.bus = options.bus ?? new EventBus();
    this.registeredScenes = new Set(options.document.scenes.map((scene) => scene.id));
    this.currentSceneIdInternal = options.document.defaultSceneId;
    this.subscribeTransitions(options.document.transitions ?? []);
  }

  get currentSceneId(): string {
    return this.currentSceneIdInternal;
  }

  transitionTo(sceneId: string, trigger: 'manual' | 'event' = 'manual', eventName?: string): void {
    if (!this.registeredScenes.has(sceneId)) {
      throw new Error(`Game state transition target is not registered: ${sceneId}`);
    }

    if (sceneId === this.currentSceneIdInternal) {
      return;
    }

    const previous = this.currentSceneIdInternal;
    this.currentSceneIdInternal = sceneId;
    const payload: GameSceneChangedEvent = {
      previousSceneId: previous,
      nextSceneId: sceneId,
      trigger,
      ...(eventName !== undefined ? { eventName } : {})
    };
    this.bus.publish<GameSceneChangedEvent>(GAME_SCENE_CHANGED_EVENT, payload);
  }

  snapshot(): GameStateSnapshot {
    return {
      version: 1,
      currentSceneId: this.currentSceneIdInternal,
      variables: this.variables.toJSON()
    };
  }

  restore(snapshot: GameStateSnapshot): void {
    if (snapshot.version !== 1) {
      throw new Error(`Unsupported game state snapshot version: ${snapshot.version}`);
    }

    if (!this.registeredScenes.has(snapshot.currentSceneId)) {
      throw new Error(`Snapshot references unregistered scene: ${snapshot.currentSceneId}`);
    }

    const previous = this.currentSceneIdInternal;
    this.currentSceneIdInternal = snapshot.currentSceneId;
    this.variables.loadFrom(snapshot.variables);

    if (previous !== snapshot.currentSceneId) {
      this.bus.publish<GameSceneChangedEvent>(GAME_SCENE_CHANGED_EVENT, {
        previousSceneId: previous,
        nextSceneId: snapshot.currentSceneId,
        trigger: 'manual'
      });
    }
  }

  dispose(): void {
    for (const subscription of this.transitionSubscriptions) {
      subscription.dispose();
    }

    this.transitionSubscriptions.length = 0;
  }

  /**
   * Register one bus listener per distinct event name (not per transition).
   * If two transitions share an eventName (e.g. a door that toggles between
   * overworld ↔ interior), the listener picks the single transition whose
   * `fromSceneId` matches the current scene at the moment the event fires,
   * so a single `publish` results in at most one scene change instead of
   * cascading through every direction listed for that event.
   */
  private subscribeTransitions(transitions: readonly GameTransitionDocument[]): void {
    const byEvent = new Map<string, GameTransitionDocument[]>();

    for (const transition of transitions) {
      const list = byEvent.get(transition.eventName) ?? [];
      list.push(transition);
      byEvent.set(transition.eventName, list);
    }

    for (const [eventName, list] of byEvent) {
      const subscription = this.bus.subscribe(eventName, () => {
        const match = list.find((transition) => transition.fromSceneId === this.currentSceneIdInternal);

        if (match === undefined) {
          return;
        }

        this.transitionTo(match.toSceneId, 'event', eventName);
      });
      this.transitionSubscriptions.push(subscription);
    }
  }
}
