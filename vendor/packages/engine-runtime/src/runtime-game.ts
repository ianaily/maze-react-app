import { EventBus, type EventSubscription } from '../../engine-core/src/index.js';
import {
  GAME_SCENE_CHANGED_EVENT,
  GameStateMachine,
  type GameSceneChangedEvent,
  type GameStateDocument,
  type GameStateSnapshot
} from '../../engine-state/src/index.js';
import type { SceneDocument } from '../../engine-scene/src/index.js';
import {
  createRuntimeSession,
  type RuntimeSession,
  type RuntimeSessionOptions
} from './runtime-session.js';

/**
 * Why the scene change carries a `trigger`: callers (input rebinds, audio
 * channels, save-slot UI) need to distinguish a boot from a manual transition
 * from a save-restore. `BootedGame` reuses the state machine's own trigger
 * tag for `manual` / `event` and adds two of its own: `boot` (the very first
 * scene the BootedGame stands up) and `restore` (the snapshot path, which
 * passes through `GameStateMachine.restore` and would otherwise look like
 * a manual transition).
 */
export interface BootedSceneInfo {
  readonly sceneId: string;
  readonly previousSceneId: string | undefined;
  readonly trigger: 'boot' | 'manual' | 'event' | 'restore';
  readonly eventName?: string;
}

export type SceneFactory = (sceneId: string) => SceneDocument;

export interface BootGameOptions {
  readonly document: GameStateDocument;
  readonly sceneFactory: SceneFactory;
  readonly session?: RuntimeSessionOptions;
  /**
   * Custom event bus. When omitted, BootedGame owns a fresh `EventBus` shared
   * with the underlying `GameStateMachine`. Pass a bus from outside if other
   * subsystems (audio, UI) need to publish/subscribe on the same instance.
   */
  readonly bus?: EventBus;
  /**
   * Called after every session swap (including the initial boot). Use this to
   * attach input/audio/camera/etc. hooks against the fresh `RuntimeSession`.
   */
  readonly onSessionReady?: (session: RuntimeSession, info: BootedSceneInfo) => void;
  /**
   * Called before the current session is replaced. Use this to detach hooks
   * and persist any per-scene runtime state.
   */
  readonly onSessionDispose?: (session: RuntimeSession, info: BootedSceneInfo) => void;
  /**
   * Async hook fired the moment a transition starts but BEFORE the old session
   * is disposed. Use this to run a fade-out tween, snapshot persistent runtime
   * state, etc. While the hook is awaited `currentSession` still points at the
   * outgoing scene so a loop with a session supplier keeps stepping it.
   *
   * Rejections are forwarded to `onTransitionError` (if provided) and otherwise
   * surfaced via `console.error`; the swap proceeds regardless so a buggy fade
   * cannot strand the game on the wrong scene.
   */
  readonly onTransitionStart?: (info: BootedSceneInfo) => Promise<void> | void;
  /**
   * Async hook fired AFTER the new session is built and `onSessionReady` ran.
   * Use this to run a fade-in tween. Errors are handled like `onTransitionStart`.
   */
  readonly onTransitionEnd?: (info: BootedSceneInfo) => Promise<void> | void;
  /**
   * Optional error sink for rejected transition hooks. Receives the rejected
   * value and which hook ('start' or 'end') triggered it.
   */
  readonly onTransitionError?: (error: unknown, hook: 'start' | 'end', info: BootedSceneInfo) => void;
}

/**
 * Stateful wrapper that owns the active scene's `RuntimeSession` and swaps
 * it whenever the underlying `GameStateMachine` emits `game:scene-changed`.
 *
 * The `RuntimeLoop` should be pointed at `bootedGame.currentSession` via the
 * supplier overload of `createRuntimeLoop` so the loop keeps stepping after
 * a transition.
 */
export class BootedGame {
  readonly state: GameStateMachine;
  readonly bus: EventBus;

  private readonly sceneFactory: SceneFactory;
  private readonly sessionOptions: RuntimeSessionOptions;
  private readonly readyCallback: ((session: RuntimeSession, info: BootedSceneInfo) => void) | undefined;
  private readonly disposeCallback: ((session: RuntimeSession, info: BootedSceneInfo) => void) | undefined;
  private readonly transitionStart: ((info: BootedSceneInfo) => Promise<void> | void) | undefined;
  private readonly transitionEnd: ((info: BootedSceneInfo) => Promise<void> | void) | undefined;
  private readonly transitionError: ((error: unknown, hook: 'start' | 'end', info: BootedSceneInfo) => void) | undefined;
  private readonly sceneChangeSubscription: EventSubscription;

  private currentSessionInternal: RuntimeSession;
  private currentSceneInfo: BootedSceneInfo;
  private restoring = false;
  private disposed = false;

  constructor(options: BootGameOptions) {
    this.bus = options.bus ?? new EventBus();
    this.state = new GameStateMachine({ document: options.document, bus: this.bus });
    this.sceneFactory = options.sceneFactory;
    this.sessionOptions = options.session ?? {};
    this.readyCallback = options.onSessionReady;
    this.disposeCallback = options.onSessionDispose;
    this.transitionStart = options.onTransitionStart;
    this.transitionEnd = options.onTransitionEnd;
    this.transitionError = options.onTransitionError;

    const bootInfo: BootedSceneInfo = {
      sceneId: this.state.currentSceneId,
      previousSceneId: undefined,
      trigger: 'boot'
    };

    this.currentSessionInternal = this.buildSession(bootInfo.sceneId);
    this.currentSceneInfo = bootInfo;
    this.readyCallback?.(this.currentSessionInternal, bootInfo);

    this.sceneChangeSubscription = this.bus.subscribe<GameSceneChangedEvent>(
      GAME_SCENE_CHANGED_EVENT,
      (event) => this.handleSceneChanged(event)
    );
  }

  get currentSession(): RuntimeSession {
    return this.currentSessionInternal;
  }

  get currentScene(): BootedSceneInfo {
    return this.currentSceneInfo;
  }

  transitionTo(sceneId: string): void {
    this.state.transitionTo(sceneId);
  }

  snapshot(): GameStateSnapshot {
    return this.state.snapshot();
  }

  restore(snapshot: GameStateSnapshot): void {
    this.restoring = true;
    try {
      this.state.restore(snapshot);
    } finally {
      this.restoring = false;
    }
  }

  dispose(): void {
    if (this.disposed) {
      return;
    }

    this.disposed = true;
    this.disposeCallback?.(this.currentSessionInternal, this.currentSceneInfo);
    this.sceneChangeSubscription.dispose();
    this.state.dispose();
  }

  private handleSceneChanged(event: GameSceneChangedEvent): void {
    if (this.disposed) {
      return;
    }

    const trigger: BootedSceneInfo['trigger'] = this.restoring ? 'restore' : event.trigger;
    const nextInfo: BootedSceneInfo = {
      sceneId: event.nextSceneId,
      previousSceneId: event.previousSceneId,
      trigger,
      ...(event.eventName !== undefined ? { eventName: event.eventName } : {})
    };

    void this.runTransition(nextInfo);
  }

  private async runTransition(nextInfo: BootedSceneInfo): Promise<void> {
    if (this.transitionStart !== undefined) {
      try {
        await this.transitionStart(nextInfo);
      } catch (error) {
        this.reportTransitionError(error, 'start', nextInfo);
      }
    }

    if (this.disposed) {
      return;
    }

    const previousSession = this.currentSessionInternal;
    const previousInfo = this.currentSceneInfo;

    this.disposeCallback?.(previousSession, previousInfo);
    this.currentSessionInternal = this.buildSession(nextInfo.sceneId);
    this.currentSceneInfo = nextInfo;
    this.readyCallback?.(this.currentSessionInternal, nextInfo);

    if (this.transitionEnd !== undefined) {
      try {
        await this.transitionEnd(nextInfo);
      } catch (error) {
        this.reportTransitionError(error, 'end', nextInfo);
      }
    }
  }

  private reportTransitionError(
    error: unknown,
    hook: 'start' | 'end',
    info: BootedSceneInfo
  ): void {
    if (this.transitionError !== undefined) {
      this.transitionError(error, hook, info);
      return;
    }

    console.error(`bootGame onTransition${hook === 'start' ? 'Start' : 'End'} threw:`, error);
  }

  private buildSession(sceneId: string): RuntimeSession {
    const scene = this.sceneFactory(sceneId);
    return createRuntimeSession(scene, this.sessionOptions);
  }
}

export function bootGame(options: BootGameOptions): BootedGame {
  return new BootedGame(options);
}
