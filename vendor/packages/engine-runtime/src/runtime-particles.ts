import {
  toEntityId,
  type EntityId,
  type EventBus,
  type EventSubscription
} from '../../engine-core/src/index.js';
import {
  DEFAULT_PARTICLE_POOL_CAPACITY,
  ParticlePool,
  ParticleSystem,
  type ParticleEmitterStore
} from '../../engine-particles/src/index.js';
import type { RuntimeSession } from './runtime-session.js';

export interface RuntimeParticlesOptions {
  readonly eventBus?: EventBus;
  readonly pool?: ParticlePool;
  readonly maxParticles?: number;
  readonly random?: () => number;
}

export interface RuntimeParticlesBinding {
  readonly pool: ParticlePool;
  readonly system: ParticleSystem;
  burst(entityId: string, count: number): void;
  setActive(entityId: string, active: boolean): void;
  dispose(): void;
}

export function attachRuntimeParticles(
  session: RuntimeSession,
  options: RuntimeParticlesOptions = {}
): RuntimeParticlesBinding {
  const pool = options.pool ?? new ParticlePool(options.maxParticles ?? DEFAULT_PARTICLE_POOL_CAPACITY);
  const system = new ParticleSystem({
    emitters: session.runtime.particleEmitters,
    pool,
    transforms: session.runtime.world.transforms,
    gravityX: session.runtime.physics.gravityX,
    gravityY: session.runtime.physics.gravityY,
    ...(options.random !== undefined ? { random: options.random } : {})
  });
  session.engine.addSystem(system);

  const subscriptions: EventSubscription[] = [];

  if (options.eventBus !== undefined) {
    subscribeBurstEmitters(options.eventBus, session.runtime.particleEmitters, system, subscriptions);
  }

  const resolve = (entityId: string): EntityId | undefined => {
    return session.runtime.entityIds.get(entityId);
  };

  return {
    pool,
    system,
    burst(entityId, count): void {
      const entity = resolve(entityId);

      if (entity !== undefined) {
        system.burst(entity, count);
      }
    },
    setActive(entityId, active): void {
      const entity = resolve(entityId);

      if (entity !== undefined) {
        session.runtime.particleEmitters.setActive(entity, active);
      }
    },
    dispose(): void {
      for (const subscription of subscriptions) {
        subscription.dispose();
      }
      subscriptions.length = 0;
    }
  };
}

function subscribeBurstEmitters(
  bus: EventBus,
  emitters: ParticleEmitterStore,
  system: ParticleSystem,
  subscriptions: EventSubscription[]
): void {
  const present = emitters.present;

  for (let index = 0; index < present.length; index += 1) {
    if (present[index] !== 1) {
      continue;
    }

    const eventName = emitters.eventName[index] ?? '';
    const burstCount = emitters.burstCount[index] ?? 0;

    if (eventName.length === 0 || burstCount <= 0) {
      continue;
    }

    const entity = toEntityId(index);
    subscriptions.push(
      bus.subscribe<unknown>(eventName, () => {
        system.burst(entity, burstCount);
      })
    );
  }
}
