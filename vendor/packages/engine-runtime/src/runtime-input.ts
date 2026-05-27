import {
  ActionBindings,
  attachKeyboardListeners,
  KeyboardState,
  type ActionBinding,
  type BrowserKeyboardBinding,
  type KeyboardListenerTarget
} from '../../engine-input/src/index.js';
import type { RuntimeSession } from './runtime-session.js';

export type RuntimePlayerAction = 'moveLeft' | 'moveRight' | 'moveUp' | 'moveDown' | 'jump';

export const DEFAULT_RUNTIME_BINDINGS: readonly ActionBinding<RuntimePlayerAction>[] = [
  { action: 'moveLeft', codes: ['KeyA', 'ArrowLeft'] },
  { action: 'moveRight', codes: ['KeyD', 'ArrowRight'] },
  { action: 'moveUp', codes: ['KeyW', 'ArrowUp'] },
  { action: 'moveDown', codes: ['KeyS', 'ArrowDown'] },
  { action: 'jump', codes: ['Space'] }
];

export interface RuntimeInputOptions {
  readonly target?: KeyboardListenerTarget;
  readonly bindings?: readonly ActionBinding<RuntimePlayerAction>[];
}

export interface RuntimeInputBinding {
  readonly keyboard: KeyboardState;
  applyTo(session: RuntimeSession): void;
  endFrame(): void;
  dispose(): void;
}

export function attachRuntimeInput(options: RuntimeInputOptions = {}): RuntimeInputBinding {
  const target = options.target ?? (globalThis as unknown as KeyboardListenerTarget);
  const bindings = options.bindings ?? DEFAULT_RUNTIME_BINDINGS;
  const keyboard = new KeyboardState();
  const actions = new ActionBindings(bindings);
  const handle: BrowserKeyboardBinding = attachKeyboardListeners(target, keyboard);

  return {
    keyboard,
    applyTo(session: RuntimeSession): void {
      const controllers = session.runtime.characterControllers;
      const direction = (actions.isDown(keyboard, 'moveRight') ? 1 : 0)
        - (actions.isDown(keyboard, 'moveLeft') ? 1 : 0);
      const verticalDirection = (actions.isDown(keyboard, 'moveDown') ? 1 : 0)
        - (actions.isDown(keyboard, 'moveUp') ? 1 : 0);
      const jumpPressed = actions.wasPressed(keyboard, 'jump');

      for (let entity = 0; entity < controllers.present.length; entity += 1) {
        if (controllers.present[entity] !== 1) {
          continue;
        }

        controllers.desiredMoveX[entity] = direction;
        controllers.desiredMoveY[entity] = verticalDirection;

        if (jumpPressed) {
          controllers.jumpRequested[entity] = 1;
        }
      }
    },
    endFrame(): void {
      keyboard.endFrame();
    },
    dispose(): void {
      handle.dispose();
    }
  };
}
