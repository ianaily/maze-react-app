import type { EntityId } from '../../../engine-core/src/index.js';
import type { SceneParticleEmitterDocumentV1 } from '../scene-schema.js';
import type { SceneRuntime } from '../scene-runtime.js';

export const loadParticleEmitter = (
  runtime: SceneRuntime,
  entity: EntityId,
  document: SceneParticleEmitterDocumentV1
): void => {
  runtime.particleEmitters.add(entity, {
    shape: document.shape,
    ...(document.extentX !== undefined ? { extentX: document.extentX } : {}),
    ...(document.extentY !== undefined ? { extentY: document.extentY } : {}),
    rate: document.rate,
    ...(document.burstCount !== undefined ? { burstCount: document.burstCount } : {}),
    ...(document.eventName !== undefined ? { eventName: document.eventName } : {}),
    lifetimeMinSeconds: document.lifetimeMinSeconds,
    lifetimeMaxSeconds: document.lifetimeMaxSeconds,
    velocityMinX: document.velocityMinX,
    velocityMaxX: document.velocityMaxX,
    velocityMinY: document.velocityMinY,
    velocityMaxY: document.velocityMaxY,
    gravityScale: document.gravityScale,
    startScale: document.startScale,
    endScale: document.endScale,
    startAlpha: document.startAlpha,
    endAlpha: document.endAlpha,
    spriteAssetId: document.spriteAssetId,
    ...(document.layer !== undefined ? { layer: document.layer } : {}),
    ...(document.autoplay !== undefined ? { autoplay: document.autoplay } : {})
  });
};
