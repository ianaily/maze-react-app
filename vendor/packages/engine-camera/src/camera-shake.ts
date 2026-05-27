export interface CameraShakeImpulse {
  readonly intensity: number;
  readonly durationSeconds: number;
}

interface ShakeState {
  active: boolean;
  intensity: number;
  durationSeconds: number;
  remainingSeconds: number;
  seedX: number;
  seedY: number;
}

const PHI = 1.618_033_988_749;

export class CameraShake {
  private readonly state: ShakeState = {
    active: false,
    intensity: 0,
    durationSeconds: 0,
    remainingSeconds: 0,
    seedX: 0,
    seedY: 0
  };

  private random: () => number;

  constructor(options: { random?: () => number } = {}) {
    this.random = options.random ?? Math.random;
  }

  trigger(impulse: CameraShakeImpulse): void {
    if (impulse.durationSeconds <= 0 || impulse.intensity <= 0) {
      return;
    }

    if (this.state.active && this.state.intensity >= impulse.intensity) {
      this.state.remainingSeconds = Math.max(this.state.remainingSeconds, impulse.durationSeconds);
      return;
    }

    this.state.active = true;
    this.state.intensity = impulse.intensity;
    this.state.durationSeconds = impulse.durationSeconds;
    this.state.remainingSeconds = impulse.durationSeconds;
    this.state.seedX = this.random() * 1000;
    this.state.seedY = this.random() * 1000 + PHI;
  }

  reset(): void {
    this.state.active = false;
    this.state.intensity = 0;
    this.state.durationSeconds = 0;
    this.state.remainingSeconds = 0;
  }

  /**
   * Advance the shake by `deltaSeconds` and write the current world-space offset
   * into `outOffset`. Returns true if the shake is still active.
   */
  step(deltaSeconds: number, outOffset: { x: number; y: number }): boolean {
    if (!this.state.active) {
      outOffset.x = 0;
      outOffset.y = 0;
      return false;
    }

    this.state.remainingSeconds -= deltaSeconds;

    if (this.state.remainingSeconds <= 0) {
      this.state.active = false;
      this.state.intensity = 0;
      this.state.remainingSeconds = 0;
      outOffset.x = 0;
      outOffset.y = 0;
      return false;
    }

    const progress = this.state.remainingSeconds / this.state.durationSeconds;
    const falloff = progress * progress;
    const phase = (this.state.durationSeconds - this.state.remainingSeconds) * 30;
    outOffset.x = Math.sin(phase + this.state.seedX) * this.state.intensity * falloff;
    outOffset.y = Math.cos(phase * PHI + this.state.seedY) * this.state.intensity * falloff;
    return true;
  }

  isActive(): boolean {
    return this.state.active;
  }
}
