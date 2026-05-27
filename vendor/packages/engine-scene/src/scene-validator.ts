import { validateAssetCatalog } from '../../engine-asset/src/index.js';
import type { SceneDocument } from './scene-schema.js';
import { validateEntityAnimator } from './validator/animator.js';
import { validateEntityAudio } from './validator/audio.js';
import { validateEntityBehaviors } from './validator/behaviors.js';
import { validateCameraTargets, validateEntityCamera } from './validator/camera.js';
import { validateEntityCharacterController } from './validator/character-controller.js';
import { validateEntityCollider } from './validator/collider.js';
import { validateEditorHierarchy } from './validator/hierarchy.js';
import { validateSceneMusic } from './validator/music.js';
import { validateEntityParticleEmitter } from './validator/particle-emitter.js';
import { requireFiniteNumber } from './validator/shared.js';
import { validateEntitySprite } from './validator/sprite.js';
import { validateEntityTilemap } from './validator/tilemap.js';
import { validateEntityTween } from './validator/tween.js';
import { validateUiLayer } from './validator/ui.js';

export const validateScene = (document: SceneDocument): void => {
  if (document.version !== 1) {
    throw new Error(`Unsupported scene version: ${document.version}`);
  }

  validateAssetCatalog(document.assets);

  const layerIds = new Set<string>();
  const clipIds = new Set<string>();
  const entityIds = new Set<string>();

  for (const layer of document.layers ?? []) {
    if (layer.id.length === 0) {
      throw new Error('Scene layer id must not be empty.');
    }

    requireFiniteNumber('Scene layer', layer.id, 'order', layer.order);

    if (layerIds.has(layer.id)) {
      throw new Error(`Duplicate scene layer id: ${layer.id}`);
    }

    layerIds.add(layer.id);
  }

  for (const clip of document.animationClips ?? []) {
    if (clipIds.has(clip.id)) {
      throw new Error(`Duplicate animation clip id in scene: ${clip.id}`);
    }

    clipIds.add(clip.id);
  }

  for (const entity of document.entities) {
    if (entity.id.length === 0) {
      throw new Error('Scene entity id must not be empty.');
    }

    if (entityIds.has(entity.id)) {
      throw new Error(`Duplicate scene entity id: ${entity.id}`);
    }

    if (entity.layer !== undefined && !layerIds.has(entity.layer)) {
      throw new Error(`Unknown scene layer id: ${entity.layer}`);
    }

    if (entity.order !== undefined && !Number.isFinite(entity.order)) {
      throw new Error(`Scene entity "${entity.id}" has a non-finite order value.`);
    }

    if (entity.collider !== undefined) {
      validateEntityCollider(entity.id, entity.collider);
    }

    if (entity.sprite !== undefined) {
      validateEntitySprite(entity.id, entity.sprite, document.assets);
    }

    if (entity.characterController !== undefined) {
      validateEntityCharacterController(entity.id, entity.characterController);
    }

    if (entity.animator !== undefined) {
      validateEntityAnimator(entity.id, entity.animator, clipIds);
    }

    if (entity.audio !== undefined) {
      validateEntityAudio(entity.id, entity.audio, document.assets);
    }

    if (entity.camera !== undefined) {
      validateEntityCamera(entity.id, entity.camera);
    }

    if (entity.tilemap !== undefined) {
      validateEntityTilemap(entity.id, entity.tilemap, document.assets);
    }

    if (entity.tween !== undefined) {
      validateEntityTween(entity.id, entity.tween);
    }

    if (entity.particleEmitter !== undefined) {
      validateEntityParticleEmitter(entity.id, entity.particleEmitter, document.assets);
    }

    if (entity.behaviors !== undefined) {
      validateEntityBehaviors(entity.id, entity.behaviors);
    }

    entityIds.add(entity.id);
  }

  if (document.music !== undefined) {
    validateSceneMusic(document.music, document.assets);
  }

  if (document.cameraEntityId !== undefined && !entityIds.has(document.cameraEntityId)) {
    throw new Error(`Scene cameraEntityId references unknown entity: ${document.cameraEntityId}`);
  }

  if (document.ui !== undefined) {
    validateUiLayer(document.ui);
  }

  validateCameraTargets(document, entityIds);
  validateEditorHierarchy(document.editor, entityIds);
};
