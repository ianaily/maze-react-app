import type { KeyboardState } from './keyboard-state.js';

export interface ActionBinding<TAction extends string = string> {
  readonly action: TAction;
  readonly codes: readonly string[];
}

export class ActionBindings<TAction extends string = string> {
  private readonly codesByAction = new Map<TAction, readonly string[]>();

  constructor(bindings: readonly ActionBinding<TAction>[]) {
    for (const binding of bindings) {
      if (binding.codes.length === 0) {
        throw new Error(`Action binding must contain at least one key code: ${binding.action}`);
      }

      this.codesByAction.set(binding.action, binding.codes);
    }
  }

  isDown(keyboard: KeyboardState, action: TAction): boolean {
    return this.someCode(action, (code) => keyboard.isDown(code));
  }

  wasPressed(keyboard: KeyboardState, action: TAction): boolean {
    return this.someCode(action, (code) => keyboard.wasPressed(code));
  }

  wasReleased(keyboard: KeyboardState, action: TAction): boolean {
    return this.someCode(action, (code) => keyboard.wasReleased(code));
  }

  /**
   * Atomic consume across every code bound to `action`. Use from `fixedUpdate`
   * to avoid double-fire when a render frame runs multiple fixed sub-steps.
   * Clears the press flag for every bound code, even if the first match
   * already returned true.
   */
  consumePress(keyboard: KeyboardState, action: TAction): boolean {
    const codes = this.codesByAction.get(action);

    if (codes === undefined) {
      throw new Error(`Unknown input action: ${action}`);
    }

    let consumed = false;

    for (const code of codes) {
      if (keyboard.consumePress(code)) {
        consumed = true;
      }
    }

    return consumed;
  }

  private someCode(action: TAction, predicate: (code: string) => boolean): boolean {
    const codes = this.codesByAction.get(action);

    if (codes === undefined) {
      throw new Error(`Unknown input action: ${action}`);
    }

    return codes.some(predicate);
  }
}
