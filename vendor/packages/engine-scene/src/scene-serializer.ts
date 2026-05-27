import type { EntityId } from '../../engine-core/src/index.js';
import { serializeAnimator } from './serializer/animator.js';
import { serializeAudio } from './serializer/audio.js';
import { serializeCamera } from './serializer/camera.js';
import { serializeCharacterController } from './serializer/character-controller.js';
import { serializeCollider } from './serializer/collider.js';
import { serializeParticleEmitter } from './serializer/particle-emitter.js';
import { serializeRigidbody } from './serializer/rigidbody.js';
import { serializeSprite } from './serializer/sprite.js';
import { serializeTilemap } from './serializer/tilemap.js';
import { serializeTransform } from './serializer/transform.js';
import { serializeTween } from './serializer/tween.js';
import type { SceneDocument, SceneEntityDocumentV1 } from './scene-schema.js';
import type { SceneRuntime } from './scene-runtime.js';

export const serializeScene = (runtime: SceneRuntime): SceneDocument => {
  const entities: SceneEntityDocumentV1[] = [];

  for (const [id, entity] of runtime.entityIds) {
    if (!runtime.world.hasEntity(entity)) {
      continue;
    }

    entities.push(serializeEntity(runtime, id, entity));
  }

  return {
    version: 1,
    view: runtime.view,
    ...(runtime.assets !== undefined ? { assets: runtime.assets } : {}),
    ...(runtime.editor !== undefined ? { editor: runtime.editor } : {}),
    ...(runtime.music !== undefined ? { music: { ...runtime.music } } : {}),
    ...(runtime.cameraEntityId !== undefined ? { cameraEntityId: runtime.cameraEntityId } : {}),
    ...(runtime.uiDocument !== undefined ? { ui: runtime.uiDocument } : {}),
    layers: [...runtime.layers],
    animationClips: runtime.animationLibrary.list().map((clip) => ({
      id: clip.id,
      frames: [...clip.frames],
      loop: clip.loop,
      events: [...clip.events]
    })),
    entities
  };
};

const serializeEntity = (runtime: SceneRuntime, id: string, entity: EntityId): SceneEntityDocumentV1 => {
  const layer = runtime.entityLayers.get(entity);
  const order = runtime.entityOrders.get(entity);
  const transform = serializeTransform(runtime, entity);
  const rigidbody = serializeRigidbody(runtime, entity);
  const collider = serializeCollider(runtime, entity);
  const animator = serializeAnimator(runtime, entity);
  const characterController = serializeCharacterController(runtime, entity);
  const sprite = serializeSprite(runtime, entity);
  const audio = serializeAudio(runtime, entity);
  const camera = serializeCamera(runtime, entity);
  const tilemap = serializeTilemap(runtime, entity);
  const tween = serializeTween(runtime, entity);
  const particleEmitter = serializeParticleEmitter(runtime, entity);
  const behaviors = runtime.behaviors.toDocuments(entity);

  return {
    id,
    ...(layer !== undefined ? { layer } : {}),
    ...(order !== undefined ? { order } : {}),
    ...(transform !== undefined ? { transform } : {}),
    ...(rigidbody !== undefined ? { rigidbody } : {}),
    ...(collider !== undefined ? { collider } : {}),
    ...(animator !== undefined ? { animator } : {}),
    ...(characterController !== undefined ? { characterController } : {}),
    ...(sprite !== undefined ? { sprite } : {}),
    ...(audio !== undefined ? { audio } : {}),
    ...(camera !== undefined ? { camera } : {}),
    ...(tilemap !== undefined ? { tilemap } : {}),
    ...(tween !== undefined ? { tween } : {}),
    ...(particleEmitter !== undefined ? { particleEmitter } : {}),
    ...(behaviors !== undefined ? { behaviors } : {})
  };
};
