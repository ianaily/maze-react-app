export const PARTICLE_INACTIVE = 0;
export const PARTICLE_ACTIVE = 1;

export const DEFAULT_PARTICLE_POOL_CAPACITY = 2000;

/**
 * Ring-buffered global pool of particles shared across every emitter. Stored as
 * structure-of-arrays to keep per-tick iteration cache-friendly. Particles are
 * not entities — emitters are.
 */
export class ParticlePool {
  readonly capacity: number;

  readonly alive: Uint8Array;
  readonly remainingSeconds: Float32Array;
  readonly totalSeconds: Float32Array;
  readonly x: Float32Array;
  readonly y: Float32Array;
  readonly velocityX: Float32Array;
  readonly velocityY: Float32Array;
  readonly gravityScale: Float32Array;
  readonly startScale: Float32Array;
  readonly endScale: Float32Array;
  readonly startAlpha: Float32Array;
  readonly endAlpha: Float32Array;
  readonly spriteAssetId: string[];
  readonly layer: Int32Array;

  private cursor = 0;
  private liveCount = 0;

  constructor(capacity: number = DEFAULT_PARTICLE_POOL_CAPACITY) {
    this.capacity = Math.max(1, Math.floor(capacity));
    this.alive = new Uint8Array(this.capacity);
    this.remainingSeconds = new Float32Array(this.capacity);
    this.totalSeconds = new Float32Array(this.capacity);
    this.x = new Float32Array(this.capacity);
    this.y = new Float32Array(this.capacity);
    this.velocityX = new Float32Array(this.capacity);
    this.velocityY = new Float32Array(this.capacity);
    this.gravityScale = new Float32Array(this.capacity);
    this.startScale = new Float32Array(this.capacity);
    this.endScale = new Float32Array(this.capacity);
    this.startAlpha = new Float32Array(this.capacity);
    this.endAlpha = new Float32Array(this.capacity);
    this.spriteAssetId = new Array<string>(this.capacity).fill('');
    this.layer = new Int32Array(this.capacity);
  }

  get count(): number {
    return this.liveCount;
  }

  /** Returns the slot index of the spawned particle (recycling the oldest if the pool is full). */
  spawn(): number {
    let slot = this.cursor;

    // Advance until we find an inactive slot or wrap back to the start.
    const start = this.cursor;
    while (this.alive[slot] === PARTICLE_ACTIVE) {
      slot = (slot + 1) % this.capacity;

      if (slot === start) {
        // Pool full — recycle the slot at `start`.
        slot = start;
        break;
      }
    }

    if (this.alive[slot] !== PARTICLE_ACTIVE) {
      this.liveCount += 1;
    }

    this.alive[slot] = PARTICLE_ACTIVE;
    this.cursor = (slot + 1) % this.capacity;
    return slot;
  }

  retire(slot: number): void {
    if (slot < 0 || slot >= this.capacity || this.alive[slot] !== PARTICLE_ACTIVE) {
      return;
    }

    this.alive[slot] = PARTICLE_INACTIVE;
    this.liveCount -= 1;
  }

  clear(): void {
    this.alive.fill(PARTICLE_INACTIVE);
    this.liveCount = 0;
    this.cursor = 0;
  }
}
