import { CAMERA_TARGET_NONE } from '../../engine-camera/src/index.js';
import type { EntityId } from '../../engine-core/src/index.js';
import { materializeTilemapColliders } from '../../engine-tilemap/src/index.js';
import { buildUiLayer } from '../../engine-ui/src/index.js';
import { loadAnimator } from './loader/animator.js';
import { loadAudio } from './loader/audio.js';
import { loadBehaviors } from './loader/behaviors.js';
import { loadCamera } from './loader/camera.js';
import { loadCharacterController } from './loader/character-controller.js';
import { loadCollider } from './loader/collider.js';
import { loadParticleEmitter } from './loader/particle-emitter.js';
import { loadRigidbody } from './loader/rigidbody.js';
import { loadSprite } from './loader/sprite.js';
import { loadTilemap } from './loader/tilemap.js';
import { loadTransform } from './loader/transform.js';
import { loadTween } from './loader/tween.js';
import type { SceneDocument, SceneEntityDocumentV1 } from './scene-schema.js';
import { createEmptySceneRuntime, registerSceneRuntimeCleanup, type SceneRuntime } from './scene-runtime.js';

export interface SceneLoadOptions {
  readonly runtime?: SceneRuntime;
}

export const loadScene = (document: SceneDocument, options: SceneLoadOptions = {}): SceneRuntime => {
  if (document.version !== 1) {
    throw new Error(`Unsupported scene version: ${document.version}`);
  }

  const runtime = options.runtime ?? createEmptySceneRuntime(document.view);
  registerSceneRuntimeCleanup(runtime);
  const mutableEntityIds = getMutableEntityMap(runtime.entityIds);
  const mutableEntityLayers = getMutableEntityLayerMap(runtime.entityLayers);
  const mutableEntityOrders = getMutableEntityOrderMap(runtime.entityOrders);
  const mutableLayers = getMutableLayers(runtime.layers);

  runtime.assets = document.assets;
  runtime.editor = document.editor;
  runtime.music = document.music;
  runtime.cameraEntityId = document.cameraEntityId;
  runtime.ui = document.ui !== undefined ? buildUiLayer(document.ui) : undefined;
  runtime.uiDocument = document.ui;
  mutableLayers.length = 0;
  mutableLayers.push(...(document.layers ?? []));

  for (const clip of document.animationClips ?? []) {
    runtime.animationLibrary.add(clip);
  }

  for (const entityDocument of document.entities) {
    const entity = runtime.world.createEntity();
    mutableEntityIds.set(entityDocument.id, entity);
    if (entityDocument.layer !== undefined) {
      mutableEntityLayers.set(entity, entityDocument.layer);
    }
    if (entityDocument.order !== undefined && Number.isFinite(entityDocument.order)) {
      mutableEntityOrders.set(entity, entityDocument.order);
    }
    loadEntity(runtime, entity, entityDocument);
  }

  resolveCameraTargets(runtime, document);
  materializeTilemapColliders({
    world: runtime.world,
    physics: runtime.physics,
    tilemaps: runtime.tilemaps,
    catalog: runtime.assets
  });

  return runtime;
};

const loadEntity = (runtime: SceneRuntime, entity: EntityId, document: SceneEntityDocumentV1): void => {
  if (document.transform !== undefined) {
    loadTransform(runtime, entity, document.transform);
  }

  if (document.rigidbody !== undefined) {
    loadRigidbody(runtime, entity, document.rigidbody);
  }

  if (document.collider !== undefined) {
    loadCollider(runtime, entity, document.collider);
  }

  if (document.animator !== undefined) {
    loadAnimator(runtime, entity, document.animator);
  }

  if (document.characterController !== undefined) {
    loadCharacterController(runtime, entity, document.characterController);
  }

  if (document.sprite !== undefined) {
    loadSprite(runtime, entity, document.sprite);
  }

  if (document.audio !== undefined) {
    loadAudio(runtime, entity, document.audio);
  }

  if (document.tilemap !== undefined) {
    loadTilemap(runtime, entity, document.tilemap);
  }

  if (document.tween !== undefined) {
    loadTween(runtime, entity, document.tween);
  }

  if (document.particleEmitter !== undefined) {
    loadParticleEmitter(runtime, entity, document.particleEmitter);
  }

  if (document.camera !== undefined) {
    loadCamera(runtime, entity, document.camera);
  }

  if (document.behaviors !== undefined) {
    loadBehaviors(runtime, entity, document.behaviors);
  }
};

const resolveCameraTargets = (runtime: SceneRuntime, document: SceneDocument): void => {
  for (const entityDocument of document.entities) {
    if (entityDocument.camera?.targetEntityId === undefined) {
      continue;
    }

    const entity = runtime.entityIds.get(entityDocument.id);
    const target = runtime.entityIds.get(entityDocument.camera.targetEntityId);

    if (entity === undefined) {
      continue;
    }

    runtime.cameras.targetEntity[entity] = target ?? CAMERA_TARGET_NONE;
  }
};

const getMutableEntityMap = (entityIds: ReadonlyMap<string, EntityId>): Map<string, EntityId> => {
  if (entityIds instanceof Map) {
    return entityIds;
  }

  throw new Error('Scene runtime entity map must be mutable while loading.');
};

const getMutableEntityLayerMap = (entityLayers: ReadonlyMap<EntityId, string>): Map<EntityId, string> => {
  if (entityLayers instanceof Map) {
    return entityLayers;
  }

  throw new Error('Scene runtime entity layer map must be mutable while loading.');
};

const getMutableEntityOrderMap = (entityOrders: ReadonlyMap<EntityId, number>): Map<EntityId, number> => {
  if (entityOrders instanceof Map) {
    return entityOrders;
  }

  throw new Error('Scene runtime entity order map must be mutable while loading.');
};

const getMutableLayers = (layers: readonly unknown[]): unknown[] => {
  if (Array.isArray(layers)) {
    return layers;
  }

  throw new Error('Scene runtime layers must be mutable while loading.');
};
