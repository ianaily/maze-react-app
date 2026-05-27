import type { SceneEntityDocumentV1 } from '../../../engine-scene/src/index.js';
import { entityById, replaceEntity } from './shared.js';
import type { EditorCommand } from './types.js';

/**
 * Set or clear the entity's render layer id. Layer changes are simple top-level
 * field rewrites and undo restores the previous value.
 */
export function setEntityLayerCommand(id: string, layer: string | undefined): EditorCommand {
  return {
    name: `set layer on ${id}`,
    apply(document) {
      const entity = entityById(document, id);
      const previous = entity.layer;

      if (previous === layer) {
        return { document, undo: setEntityLayerCommand(id, previous) };
      }

      const { layer: _previousLayer, ...rest } = entity;
      const nextEntity: SceneEntityDocumentV1 = layer === undefined ? rest : { ...rest, layer };

      return {
        document: replaceEntity(document, nextEntity),
        undo: setEntityLayerCommand(id, previous)
      };
    }
  };
}

/**
 * Set or clear the entity's per-entity render order. Numeric tie-breaker
 * threaded into `projection.depth` after `layer.order`.
 */
export function setEntityOrderCommand(id: string, order: number | undefined): EditorCommand {
  return {
    name: `set order on ${id}`,
    apply(document) {
      const entity = entityById(document, id);
      const previous = entity.order;

      if (previous === order) {
        return { document, undo: setEntityOrderCommand(id, previous) };
      }

      if (order !== undefined && !Number.isFinite(order)) {
        throw new Error(`Entity order must be a finite number. Received: ${order}`);
      }

      const { order: _previousOrder, ...rest } = entity;
      const nextEntity: SceneEntityDocumentV1 = order === undefined ? rest : { ...rest, order };

      return {
        document: replaceEntity(document, nextEntity),
        undo: setEntityOrderCommand(id, previous)
      };
    }
  };
}
