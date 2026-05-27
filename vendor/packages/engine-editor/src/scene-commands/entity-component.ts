import type { SceneTransformDocumentV1 } from '../../../engine-scene/src/index.js';
import {
  cloneComponentValue,
  entityById,
  replaceEntity,
  withComponent
} from './shared.js';
import type { EditorCommand, SceneComponentKey, SceneComponentValue } from './types.js';

export function updateTransformCommand(id: string, patch: SceneTransformDocumentV1): EditorCommand {
  return updateEntityComponentCommand(id, 'transform', {
    ...(patch.x !== undefined ? { x: patch.x } : {}),
    ...(patch.y !== undefined ? { y: patch.y } : {}),
    ...(patch.rotation !== undefined ? { rotation: patch.rotation } : {}),
    ...(patch.scaleX !== undefined ? { scaleX: patch.scaleX } : {}),
    ...(patch.scaleY !== undefined ? { scaleY: patch.scaleY } : {})
  });
}

export function updateEntityComponentCommand<K extends SceneComponentKey>(
  id: string,
  component: K,
  patch: Partial<SceneComponentValue<K>>
): EditorCommand {
  const patchSnapshot = { ...patch } as Partial<SceneComponentValue<K>>;

  return {
    name: `update ${component} on ${id}`,
    apply(document) {
      const entity = entityById(document, id);
      const previous = entity[component] as SceneComponentValue<K> | undefined;
      const next = { ...(previous ?? {}), ...patchSnapshot } as SceneComponentValue<K>;

      return {
        document: replaceEntity(document, {
          ...entity,
          [component]: next
        }),
        undo: setEntityComponentCommand(id, component, previous)
      };
    }
  };
}

export function setEntityComponentCommand<K extends SceneComponentKey>(
  id: string,
  component: K,
  value: SceneComponentValue<K> | undefined
): EditorCommand {
  const valueSnapshot = cloneComponentValue(value);

  return {
    name: `set ${component} on ${id}`,
    apply(document) {
      const entity = entityById(document, id);
      const previous = entity[component] as SceneComponentValue<K> | undefined;

      return {
        document: replaceEntity(document, withComponent(entity, component, valueSnapshot)),
        undo: setEntityComponentCommand(id, component, previous)
      };
    }
  };
}
