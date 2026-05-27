import type { KeyboardState } from './keyboard-state.js';

export interface KeyboardListenerTarget {
  addEventListener(type: 'keydown' | 'keyup', listener: (event: KeyboardEvent) => void): void;
  removeEventListener(type: 'keydown' | 'keyup', listener: (event: KeyboardEvent) => void): void;
}

export interface BrowserKeyboardBinding {
  dispose(): void;
}

export const attachKeyboardListeners = (
  target: KeyboardListenerTarget,
  keyboard: KeyboardState
): BrowserKeyboardBinding => {
  const onKeyDown = (event: KeyboardEvent): void => {
    keyboard.press(event.code);
  };
  const onKeyUp = (event: KeyboardEvent): void => {
    keyboard.release(event.code);
  };

  target.addEventListener('keydown', onKeyDown);
  target.addEventListener('keyup', onKeyUp);

  return {
    dispose() {
      target.removeEventListener('keydown', onKeyDown);
      target.removeEventListener('keyup', onKeyUp);
      keyboard.reset();
    }
  };
};
