import type { AnimationClipDefinition } from '../../engine-animation/src/index.js';
import type { AssetCatalogDocument, AudioClipChannel } from '../../engine-asset/src/index.js';
import type { SceneBehaviorDocumentV1 } from '../../engine-behavior/src/index.js';
import type { ParticleEmitterShape } from '../../engine-particles/src/index.js';
import type { RigidbodyType } from '../../engine-physics/src/index.js';
import type { UiLayerDocument } from '../../engine-ui/src/index.js';
import type {
  EasingName,
  TweenRepeatMode,
  TweenTargetComponent,
  TweenTargetField
} from '../../engine-tween/src/index.js';

export type SceneView = 'top-down' | 'side-view' | 'isometric' | 'pseudo-3d';

export interface SceneDocumentV1 {
  readonly version: 1;
  readonly view: SceneView;
  readonly animationClips?: readonly AnimationClipDefinition[];
  readonly assets?: AssetCatalogDocument;
  readonly editor?: SceneEditorDocumentV1;
  readonly entities: readonly SceneEntityDocumentV1[];
  readonly layers?: readonly SceneLayerDocumentV1[];
  readonly music?: SceneMusicDocumentV1;
  readonly cameraEntityId?: string;
  readonly ui?: UiLayerDocument;
}

export interface SceneMusicDocumentV1 {
  readonly clipId: string;
  readonly volume?: number;
  readonly loop?: boolean;
}

export interface SceneEditorDocumentV1 {
  readonly hierarchy?: readonly SceneHierarchyNodeDocumentV1[];
  readonly grid?: SceneEditorGridDocumentV1;
}

export interface SceneEditorGridDocumentV1 {
  readonly enabled?: boolean;
  readonly size?: number;
}

export interface SceneHierarchyNodeDocumentV1 {
  readonly id: string;
  readonly parentId?: string;
  readonly order?: number;
}

export interface SceneLayerDocumentV1 {
  readonly id: string;
  readonly order: number;
}

export interface SceneEntityDocumentV1 {
  readonly id: string;
  readonly layer?: string;
  /**
   * Per-entity render-order tie-breaker. Applied AFTER `layer.order` and
   * BEFORE the projection-specific positional term (worldY for side-view,
   * x+y for isometric, nothing for top-down). Authors typically only set
   * this when two entities at the same Y need a stable visual stacking
   * regardless of position. Treated as 0 when omitted.
   */
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

export type {
  SceneBehaviorConfig,
  SceneBehaviorConfigValue,
  SceneBehaviorDocumentV1
} from '../../engine-behavior/src/index.js';

export interface SceneParticleEmitterDocumentV1 {
  readonly shape: ParticleEmitterShape;
  readonly extentX?: number;
  readonly extentY?: number;
  readonly rate: number;
  readonly burstCount?: number;
  readonly eventName?: string;
  readonly lifetimeMinSeconds: number;
  readonly lifetimeMaxSeconds: number;
  readonly velocityMinX: number;
  readonly velocityMaxX: number;
  readonly velocityMinY: number;
  readonly velocityMaxY: number;
  readonly gravityScale: number;
  readonly startScale: number;
  readonly endScale: number;
  readonly startAlpha: number;
  readonly endAlpha: number;
  readonly spriteAssetId: string;
  readonly layer?: number;
  readonly autoplay?: boolean;
}

export interface SceneTweenDocumentV1 {
  readonly target: SceneTweenTargetDocumentV1;
  readonly from: number;
  readonly to: number;
  readonly durationSeconds: number;
  readonly easing: EasingName;
  readonly delaySeconds?: number;
  readonly repeat?: TweenRepeatMode;
  readonly autoplay?: boolean;
}

export interface SceneTweenTargetDocumentV1 {
  readonly component: TweenTargetComponent;
  readonly field: TweenTargetField;
}

export interface SceneTilemapDocumentV1 {
  readonly paletteId: string;
  readonly tileSize: number;
  readonly chunks: readonly SceneTilemapChunkDocumentV1[];
}

export interface SceneTilemapChunkDocumentV1 {
  readonly cx: number;
  readonly cy: number;
  readonly tiles: readonly number[];
}

export interface SceneCameraDocumentV1 {
  readonly targetEntityId?: string;
  readonly smoothingTimeSeconds?: number;
  readonly deadZoneWidth?: number;
  readonly deadZoneHeight?: number;
  readonly bounds?: SceneCameraBoundsDocumentV1;
  readonly zoom?: number;
}

export interface SceneCameraBoundsDocumentV1 {
  readonly minX: number;
  readonly minY: number;
  readonly maxX: number;
  readonly maxY: number;
}

export interface SceneAudioDocumentV1 {
  readonly clipId: string;
  readonly autoplay?: boolean;
  readonly loop?: boolean;
  readonly volume?: number;
  readonly channel?: AudioClipChannel;
}

export interface SceneTransformDocumentV1 {
  readonly x?: number;
  readonly y?: number;
  readonly rotation?: number;
  readonly scaleX?: number;
  readonly scaleY?: number;
}

export interface SceneRigidbodyDocumentV1 {
  readonly type?: RigidbodyType;
  readonly velocityX?: number;
  readonly velocityY?: number;
  readonly gravityScale?: number;
}

export interface SceneColliderDocumentV1 {
  readonly width: number;
  readonly height: number;
  readonly offsetX?: number;
  readonly offsetY?: number;
  readonly trigger?: boolean;
  readonly categoryBits?: number;
  readonly maskBits?: number;
}

export interface SceneAnimatorDocumentV1 {
  readonly clipId: string;
  readonly playing?: boolean;
  readonly speed?: number;
}

export interface SceneSpriteDocumentV1 {
  readonly assetId: string;
  readonly width: number;
  readonly height: number;
  readonly offsetX?: number;
  readonly offsetY?: number;
  readonly alpha?: number;
}

export interface SceneCharacterControllerDocumentV1 {
  readonly mode?: 'platformer' | 'top-down';
  readonly maxSpeed?: number;
  readonly jumpSpeed?: number;
}

export type SceneDocument = SceneDocumentV1;
