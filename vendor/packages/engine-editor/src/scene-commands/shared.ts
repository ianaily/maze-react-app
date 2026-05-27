import type {
  SceneDocument,
  SceneEntityDocumentV1
} from '../../../engine-scene/src/index.js';
import type {
  MutableSceneEntity,
  SceneComponentKey,
  SceneComponentValue
} from './types.js';

export function entityById(document: SceneDocument, id: string): SceneEntityDocumentV1 {
  const entity = document.entities.find((candidate) => candidate.id === id);

  if (entity === undefined) {
    throw new Error(`Scene entity does not exist: ${id}`);
  }

  return entity;
}

export function findEntityIndex(document: SceneDocument, id: string): number {
  return document.entities.findIndex((entity) => entity.id === id);
}

export function replaceEntity(document: SceneDocument, entity: SceneEntityDocumentV1): SceneDocument {
  return {
    ...document,
    entities: document.entities.map((candidate) => (candidate.id === entity.id ? cloneEntity(entity) : candidate))
  };
}

export function withComponent<K extends SceneComponentKey>(
  entity: SceneEntityDocumentV1,
  component: K,
  value: SceneComponentValue<K> | undefined
): SceneEntityDocumentV1 {
  const next: SceneEntityDocumentV1 = { ...entity };

  if (value === undefined) {
    deleteMutableComponent(next, component);
    return next;
  }

  return {
    ...next,
    [component]: cloneComponentValue(value)
  };
}

export function deleteMutableComponent(entity: SceneEntityDocumentV1, component: SceneComponentKey): void {
  const mutable = entity as MutableSceneEntity;
  delete mutable[component];
}

export function cloneEntity(entity: SceneEntityDocumentV1): SceneEntityDocumentV1 {
  return {
    ...entity,
    ...(entity.transform !== undefined ? { transform: { ...entity.transform } } : {}),
    ...(entity.rigidbody !== undefined ? { rigidbody: { ...entity.rigidbody } } : {}),
    ...(entity.collider !== undefined ? { collider: { ...entity.collider } } : {}),
    ...(entity.animator !== undefined ? { animator: { ...entity.animator } } : {}),
    ...(entity.characterController !== undefined ? { characterController: { ...entity.characterController } } : {}),
    ...(entity.sprite !== undefined ? { sprite: { ...entity.sprite } } : {}),
    ...(entity.audio !== undefined ? { audio: { ...entity.audio } } : {}),
    ...(entity.camera !== undefined
      ? {
          camera: {
            ...entity.camera,
            ...(entity.camera.bounds !== undefined ? { bounds: { ...entity.camera.bounds } } : {})
          }
        }
      : {}),
    ...(entity.tilemap !== undefined
      ? {
          tilemap: {
            paletteId: entity.tilemap.paletteId,
            tileSize: entity.tilemap.tileSize,
            chunks: entity.tilemap.chunks.map((chunk) => ({
              cx: chunk.cx,
              cy: chunk.cy,
              tiles: [...chunk.tiles]
            }))
          }
        }
      : {}),
    ...(entity.tween !== undefined
      ? {
          tween: {
            ...entity.tween,
            target: { ...entity.tween.target }
          }
        }
      : {}),
    ...(entity.particleEmitter !== undefined ? { particleEmitter: { ...entity.particleEmitter } } : {})
  };
}

export function cloneComponentValue<K extends SceneComponentKey>(
  value: SceneComponentValue<K> | undefined
): SceneComponentValue<K> | undefined {
  return value !== undefined ? ({ ...value } as SceneComponentValue<K>) : undefined;
}
