import {
  toEntityId,
  type EntityId,
  type System,
  type World
} from '../../engine-core/src/index.js';
import {
  PARTICLE_ACTIVE,
  ParticlePool
} from './particle-pool.js';
import type { ParticleEmitterStore } from './particle-emitter-store.js';

export interface ParticleTransformSource {
  has(entity: EntityId): boolean;
  readonly x: ArrayLike<number>;
  readonly y: ArrayLike<number>;
}

export interface ParticleSystemOptions {
  readonly emitters: ParticleEmitterStore;
  readonly pool: ParticlePool;
  readonly transforms: ParticleTransformSource;
  readonly priority?: number;
  readonly random?: () => number;
  readonly gravityX?: number;
  readonly gravityY?: number;
}

export class ParticleSystem implements System {
  readonly name = 'particles';
  readonly priority: number;

  private readonly emitters: ParticleEmitterStore;
  private readonly pool: ParticlePool;
  private readonly transforms: ParticleTransformSource;
  private readonly random: () => number;

  gravityX: number;
  gravityY: number;

  constructor(options: ParticleSystemOptions) {
    this.emitters = options.emitters;
    this.pool = options.pool;
    this.transforms = options.transforms;
    this.priority = options.priority ?? 60;
    this.random = options.random ?? Math.random;
    this.gravityX = options.gravityX ?? 0;
    this.gravityY = options.gravityY ?? 0;
  }

  fixedUpdate(world: World, fixedDeltaSeconds: number): void {
    this.emitContinuous(world, fixedDeltaSeconds);
    this.advanceParticles(fixedDeltaSeconds);
  }

  /** Emit `count` particles from the given emitter regardless of rate / accumulator. */
  burst(entity: EntityId, count: number): void {
    if (this.emitters.present[entity] !== 1 || count <= 0) {
      return;
    }

    if (!this.transforms.has(entity)) {
      return;
    }

    const baseX = this.transforms.x[entity] ?? 0;
    const baseY = this.transforms.y[entity] ?? 0;

    for (let index = 0; index < count; index += 1) {
      this.spawnFromEmitter(entity, baseX, baseY);
    }
  }

  private emitContinuous(world: World, deltaSeconds: number): void {
    const present = this.emitters.present;

    for (let index = 0; index < present.length; index += 1) {
      if (present[index] !== 1 || this.emitters.active[index] !== 1) {
        continue;
      }

      const entity = toEntityId(index);

      if (!world.hasEntity(entity) || !this.transforms.has(entity)) {
        continue;
      }

      const rate = this.emitters.rate[index] ?? 0;

      if (rate <= 0) {
        continue;
      }

      let accumulator = (this.emitters.spawnAccumulator[index] ?? 0) + rate * deltaSeconds;
      const baseX = this.transforms.x[entity] ?? 0;
      const baseY = this.transforms.y[entity] ?? 0;

      while (accumulator >= 1) {
        this.spawnFromEmitter(entity, baseX, baseY);
        accumulator -= 1;
      }

      this.emitters.spawnAccumulator[index] = accumulator;
    }
  }

  private advanceParticles(deltaSeconds: number): void {
    const pool = this.pool;

    for (let slot = 0; slot < pool.capacity; slot += 1) {
      if (pool.alive[slot] !== PARTICLE_ACTIVE) {
        continue;
      }

      const remaining = (pool.remainingSeconds[slot] ?? 0) - deltaSeconds;

      if (remaining <= 0) {
        pool.retire(slot);
        continue;
      }

      pool.remainingSeconds[slot] = remaining;
      const gravityScale = pool.gravityScale[slot] ?? 1;
      pool.velocityX[slot] = (pool.velocityX[slot] ?? 0) + this.gravityX * gravityScale * deltaSeconds;
      pool.velocityY[slot] = (pool.velocityY[slot] ?? 0) + this.gravityY * gravityScale * deltaSeconds;
      pool.x[slot] = (pool.x[slot] ?? 0) + (pool.velocityX[slot] ?? 0) * deltaSeconds;
      pool.y[slot] = (pool.y[slot] ?? 0) + (pool.velocityY[slot] ?? 0) * deltaSeconds;
    }
  }

  private spawnFromEmitter(entity: EntityId, baseX: number, baseY: number): void {
    const pool = this.pool;
    const slot = pool.spawn();

    const shape = this.emitters.shape[entity] ?? 'point';
    const extentX = this.emitters.extentX[entity] ?? 0;
    const extentY = this.emitters.extentY[entity] ?? 0;
    let offsetX = 0;
    let offsetY = 0;

    if (shape === 'line') {
      offsetX = (this.random() * 2 - 1) * extentX;
    } else if (shape === 'rect') {
      offsetX = (this.random() * 2 - 1) * extentX;
      offsetY = (this.random() * 2 - 1) * extentY;
    }

    const lifetimeMin = this.emitters.lifetimeMinSeconds[entity] ?? 0;
    const lifetimeMax = this.emitters.lifetimeMaxSeconds[entity] ?? lifetimeMin;
    const lifetime = lifetimeMin + this.random() * Math.max(lifetimeMax - lifetimeMin, 0);

    pool.x[slot] = baseX + offsetX;
    pool.y[slot] = baseY + offsetY;
    pool.velocityX[slot] = lerp(this.random(), this.emitters.velocityMinX[entity] ?? 0, this.emitters.velocityMaxX[entity] ?? 0);
    pool.velocityY[slot] = lerp(this.random(), this.emitters.velocityMinY[entity] ?? 0, this.emitters.velocityMaxY[entity] ?? 0);
    pool.gravityScale[slot] = this.emitters.gravityScale[entity] ?? 1;
    pool.startScale[slot] = this.emitters.startScale[entity] ?? 1;
    pool.endScale[slot] = this.emitters.endScale[entity] ?? 1;
    pool.startAlpha[slot] = this.emitters.startAlpha[entity] ?? 1;
    pool.endAlpha[slot] = this.emitters.endAlpha[entity] ?? 0;
    pool.spriteAssetId[slot] = this.emitters.spriteAssetId[entity] ?? '';
    pool.layer[slot] = this.emitters.layer[entity] ?? 0;
    pool.totalSeconds[slot] = lifetime;
    pool.remainingSeconds[slot] = lifetime;
  }
}

const lerp = (t: number, min: number, max: number): number => min + (max - min) * t;
