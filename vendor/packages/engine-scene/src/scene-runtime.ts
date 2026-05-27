import { type EntityId, World } from '../../engine-core/src/index.js';
import { AnimationLibrary, AnimatorStore } from '../../engine-animation/src/index.js';
import { AudioStore } from '../../engine-audio/src/index.js';
import { BehaviorStore } from '../../engine-behavior/src/index.js';
import { CameraStore } from '../../engine-camera/src/index.js';
import { CharacterControllerStore } from '../../engine-character/src/index.js';
import { PhysicsWorld } from '../../engine-physics/src/index.js';
import { SpriteStore } from '../../engine-render/src/index.js';
import { ParticleEmitterStore } from '../../engine-particles/src/index.js';
import { TilemapStore } from '../../engine-tilemap/src/index.js';
import { TweenStore } from '../../engine-tween/src/index.js';
import type { UiLayer, UiLayerDocument } from '../../engine-ui/src/index.js';
import type { AssetCatalogDocument } from '../../engine-asset/src/index.js';
import type {
  SceneEditorDocumentV1,
  SceneLayerDocumentV1,
  SceneMusicDocumentV1,
  SceneView
} from './scene-schema.js';

export interface SceneRuntime {
  readonly view: SceneView;
  readonly world: World;
  readonly physics: PhysicsWorld;
  readonly animationLibrary: AnimationLibrary;
  readonly animators: AnimatorStore;
  readonly characterControllers: CharacterControllerStore;
  readonly sprites: SpriteStore;
  readonly audio: AudioStore;
  readonly cameras: CameraStore;
  readonly tilemaps: TilemapStore;
  readonly tweens: TweenStore;
  readonly particleEmitters: ParticleEmitterStore;
  readonly entityIds: ReadonlyMap<string, EntityId>;
  readonly entityLayers: ReadonlyMap<EntityId, string>;
  /**
   * Per-entity render-order tie-breaker mirrored from `SceneEntity.order`.
   * Defaults to 0 for entities that omit the field. Render builders read this
   * via the `orderOf` hook to compose `layer → order → position` sort keys.
   */
  readonly entityOrders: ReadonlyMap<EntityId, number>;
  /**
   * Per-entity behavior bindings. The store carries serializable config plus
   * an opaque scratch slot the BehaviorSystem uses for runtime state.
   */
  readonly behaviors: BehaviorStore;
  readonly layers: readonly SceneLayerDocumentV1[];
  assets: AssetCatalogDocument | undefined;
  editor: SceneEditorDocumentV1 | undefined;
  music: SceneMusicDocumentV1 | undefined;
  cameraEntityId: string | undefined;
  ui: UiLayer | undefined;
  uiDocument: UiLayerDocument | undefined;
}

const cleanupRegistered = new WeakSet<SceneRuntime>();

export const createEmptySceneRuntime = (view: SceneView): SceneRuntime => {
  const runtime: SceneRuntime = {
    view,
    world: new World(),
    physics: new PhysicsWorld(),
    animationLibrary: new AnimationLibrary(),
    animators: new AnimatorStore(),
    characterControllers: new CharacterControllerStore(),
    sprites: new SpriteStore(),
    audio: new AudioStore(),
    cameras: new CameraStore(),
    tilemaps: new TilemapStore(),
    tweens: new TweenStore(),
    particleEmitters: new ParticleEmitterStore(),
    entityIds: new Map<string, EntityId>(),
    entityLayers: new Map<EntityId, string>(),
    entityOrders: new Map<EntityId, number>(),
    behaviors: new BehaviorStore(),
    layers: [],
    assets: undefined,
    editor: undefined,
    music: undefined,
    cameraEntityId: undefined,
    ui: undefined,
    uiDocument: undefined
  };

  registerSceneRuntimeCleanup(runtime);
  return runtime;
};

export const registerSceneRuntimeCleanup = (runtime: SceneRuntime): void => {
  if (cleanupRegistered.has(runtime)) {
    return;
  }

  runtime.world.registerStoreCleanup((entity) => {
    runtime.physics.removeEntity(entity);
    runtime.animators.remove(entity);
    runtime.characterControllers.remove(entity);
    runtime.sprites.remove(entity);
    runtime.audio.remove(entity);
    runtime.cameras.remove(entity);
    runtime.tilemaps.remove(entity);
    runtime.tweens.remove(entity);
    runtime.particleEmitters.remove(entity);
    runtime.behaviors.remove(entity);
    removeEntityMetadata(runtime, entity);
  });
  cleanupRegistered.add(runtime);
};

export const removeEntityMetadata = (runtime: SceneRuntime, entity: EntityId): void => {
  const mutableEntityIds = getMutableEntityMap(runtime.entityIds);
  const mutableEntityLayers = getMutableEntityLayerMap(runtime.entityLayers);
  const mutableEntityOrders = getMutableEntityOrderMap(runtime.entityOrders);

  for (const [id, mappedEntity] of mutableEntityIds) {
    if (mappedEntity === entity) {
      mutableEntityIds.delete(id);
      break;
    }
  }

  mutableEntityLayers.delete(entity);
  mutableEntityOrders.delete(entity);
};

const getMutableEntityMap = (entityIds: ReadonlyMap<string, EntityId>): Map<string, EntityId> => {
  if (entityIds instanceof Map) {
    return entityIds;
  }

  throw new Error('Scene runtime entity map must be mutable for lifecycle operations.');
};

const getMutableEntityLayerMap = (entityLayers: ReadonlyMap<EntityId, string>): Map<EntityId, string> => {
  if (entityLayers instanceof Map) {
    return entityLayers;
  }

  throw new Error('Scene runtime entity layer map must be mutable for lifecycle operations.');
};

const getMutableEntityOrderMap = (entityOrders: ReadonlyMap<EntityId, number>): Map<EntityId, number> => {
  if (entityOrders instanceof Map) {
    return entityOrders;
  }

  throw new Error('Scene runtime entity order map must be mutable for lifecycle operations.');
};
