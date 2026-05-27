import { resolveAssetReference, type AssetCatalogDocument } from '../../../engine-asset/src/index.js';
import type { SceneParticleEmitterDocumentV1 } from '../scene-schema.js';

const SUPPORTED_EMITTER_SHAPES = new Set(['point', 'line', 'rect']);

export const validateEntityParticleEmitter = (
  entityId: string,
  emitter: SceneParticleEmitterDocumentV1,
  assets: AssetCatalogDocument | undefined
): void => {
  if (!SUPPORTED_EMITTER_SHAPES.has(emitter.shape)) {
    throw new Error(`Particle emitter shape "${emitter.shape}" is not supported for entity: ${entityId}`);
  }

  if (typeof emitter.spriteAssetId !== 'string' || emitter.spriteAssetId.length === 0) {
    throw new Error(`Particle emitter spriteAssetId must not be empty for entity: ${entityId}`);
  }

  if (!Number.isFinite(emitter.rate) || emitter.rate < 0) {
    throw new Error(`Particle emitter rate must be a non-negative finite number for entity: ${entityId}`);
  }

  if (!Number.isFinite(emitter.lifetimeMinSeconds) || emitter.lifetimeMinSeconds < 0) {
    throw new Error(`Particle emitter lifetimeMinSeconds must be a non-negative finite number for entity: ${entityId}`);
  }

  if (!Number.isFinite(emitter.lifetimeMaxSeconds) || emitter.lifetimeMaxSeconds < emitter.lifetimeMinSeconds) {
    throw new Error(
      `Particle emitter lifetimeMaxSeconds must be >= lifetimeMinSeconds for entity: ${entityId}`
    );
  }

  if (emitter.eventName !== undefined && emitter.eventName.length === 0) {
    throw new Error(`Particle emitter eventName must not be empty when present for entity: ${entityId}`);
  }

  if (assets !== undefined) {
    const reference = resolveAssetReference(assets, emitter.spriteAssetId);

    if (reference === undefined) {
      throw new Error(
        `Particle emitter spriteAssetId "${emitter.spriteAssetId}" is not present in the scene asset catalog (entity: ${entityId}).`
      );
    }

    if (reference.kind !== 'sprite' && reference.kind !== 'animation-strip' && reference.kind !== 'atlas-region') {
      throw new Error(
        `Particle emitter spriteAssetId "${emitter.spriteAssetId}" must resolve to a sprite-like asset (entity: ${entityId}).`
      );
    }
  }
};
