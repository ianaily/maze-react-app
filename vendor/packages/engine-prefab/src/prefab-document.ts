import type {
  SceneAnimatorDocumentV1,
  SceneAudioDocumentV1,
  SceneBehaviorDocumentV1,
  SceneCameraDocumentV1,
  SceneCharacterControllerDocumentV1,
  SceneColliderDocumentV1,
  SceneParticleEmitterDocumentV1,
  SceneRigidbodyDocumentV1,
  SceneSpriteDocumentV1,
  SceneTilemapDocumentV1,
  SceneTransformDocumentV1,
  SceneTweenDocumentV1
} from '../../engine-scene/src/index.js';

export interface PrefabEntityDocumentV1 {
  readonly id: string;
  readonly layer?: string;
  /** Render-order tie-breaker; mirrors SceneEntityDocumentV1.order. */
  readonly order?: number;
  readonly transform?: SceneTransformDocumentV1;
  readonly rigidbody?: SceneRigidbodyDocumentV1;
  readonly collider?: SceneColliderDocumentV1;
  readonly animator?: SceneAnimatorDocumentV1;
  readonly characterController?: SceneCharacterControllerDocumentV1;
  readonly sprite?: SceneSpriteDocumentV1;
  readonly audio?: SceneAudioDocumentV1;
  readonly camera?: SceneCameraDocumentV1;
  readonly tilemap?: SceneTilemapDocumentV1;
  readonly tween?: SceneTweenDocumentV1;
  readonly particleEmitter?: SceneParticleEmitterDocumentV1;
  readonly behaviors?: readonly SceneBehaviorDocumentV1[];
}

export interface PrefabHierarchyNodeDocumentV1 {
  readonly id: string;
  readonly parentId?: string;
  readonly order?: number;
}

export interface PrefabDocumentV1 {
  readonly version: 1;
  readonly id: string;
  readonly label: string;
  readonly category?: string;
  readonly rootId: string;
  readonly entities: readonly PrefabEntityDocumentV1[];
  readonly hierarchy?: readonly PrefabHierarchyNodeDocumentV1[];
}

export type PrefabDocument = PrefabDocumentV1;

export interface PrefabEntity extends PrefabEntityDocumentV1 {}

export interface PrefabHierarchyNode extends PrefabHierarchyNodeDocumentV1 {}
