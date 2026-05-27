import type { EntityId } from '../../../engine-core/src/index.js';
import type { SceneParticleEmitterDocumentV1 } from '../scene-schema.js';
import type { SceneRuntime } from '../scene-runtime.js';

export const serializeParticleEmitter = (
  runtime: SceneRuntime,
  entity: EntityId
): SceneParticleEmitterDocumentV1 | undefined => {
  if (!runtime.particleEmitters.has(entity)) {
    return undefined;
  }

  const emitters = runtime.particleEmitters;
  const eventName = emitters.eventName[entity] ?? '';
  return {
    shape: emitters.shape[entity] ?? 'point',
    extentX: emitters.extentX[entity] ?? 0,
    extentY: emitters.extentY[entity] ?? 0,
    rate: emitters.rate[entity] ?? 0,
    burstCount: emitters.burstCount[entity] ?? 0,
    ...(eventName.length > 0 ? { eventName } : {}),
    lifetimeMinSeconds: emitters.lifetimeMinSeconds[entity] ?? 0,
    lifetimeMaxSeconds: emitters.lifetimeMaxSeconds[entity] ?? 0,
    velocityMinX: emitters.velocityMinX[entity] ?? 0,
    velocityMaxX: emitters.velocityMaxX[entity] ?? 0,
    velocityMinY: emitters.velocityMinY[entity] ?? 0,
    velocityMaxY: emitters.velocityMaxY[entity] ?? 0,
    gravityScale: emitters.gravityScale[entity] ?? 0,
    startScale: emitters.startScale[entity] ?? 1,
    endScale: emitters.endScale[entity] ?? 1,
    startAlpha: emitters.startAlpha[entity] ?? 1,
    endAlpha: emitters.endAlpha[entity] ?? 0,
    spriteAssetId: emitters.spriteAssetId[entity] ?? '',
    layer: emitters.layer[entity] ?? 0,
    autoplay: emitters.active[entity] === 1
  };
};
