export class KeyboardState {
  private readonly down = new Set<string>();
  private readonly pressed = new Set<string>();
  private readonly released = new Set<string>();

  press(code: string): void {
    if (!this.down.has(code)) {
      this.pressed.add(code);
    }

    this.down.add(code);
    this.released.delete(code);
  }

  release(code: string): void {
    if (this.down.has(code)) {
      this.released.add(code);
    }

    this.down.delete(code);
    this.pressed.delete(code);
  }

  isDown(code: string): boolean {
    return this.down.has(code);
  }

  wasPressed(code: string): boolean {
    return this.pressed.has(code);
  }

  /**
   * Atomic "was this just pressed?" check that also clears the press flag, so
   * the same press cannot fire twice inside one variable-step frame that runs
   * multiple fixed sub-steps. Use from `fixedUpdate` instead of `wasPressed`.
   */
  consumePress(code: string): boolean {
    return this.pressed.delete(code);
  }

  wasReleased(code: string): boolean {
    return this.released.has(code);
  }

  /**
   * Atomic "was this just released?" check that also clears the release flag.
   */
  consumeRelease(code: string): boolean {
    return this.released.delete(code);
  }

  endFrame(): void {
    this.pressed.clear();
    this.released.clear();
  }

  reset(): void {
    this.down.clear();
    this.pressed.clear();
    this.released.clear();
  }
}
