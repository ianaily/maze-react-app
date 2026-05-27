import type {
  SceneDocument,
  SceneEntityDocumentV1,
  SceneHierarchyNodeDocumentV1
} from '../../../engine-scene/src/index.js';
import { cloneEntity, findEntityIndex } from './shared.js';
import type { EditorCommand } from './types.js';

export function createEntityCommand(entity: SceneEntityDocumentV1): EditorCommand {
  const entitySnapshot = cloneEntity(entity);

  return {
    name: `create entity ${entitySnapshot.id}`,
    apply(document) {
      if (findEntityIndex(document, entitySnapshot.id) !== -1) {
        throw new Error(`Scene entity already exists: ${entitySnapshot.id}`);
      }

      return {
        document: {
          ...document,
          entities: [...document.entities, cloneEntity(entitySnapshot)]
        },
        undo: destroyEntityCommand(entitySnapshot.id)
      };
    }
  };
}

export function destroyEntityCommand(id: string): EditorCommand {
  return {
    name: `destroy entity ${id}`,
    apply(document) {
      const index = findEntityIndex(document, id);

      if (index === -1) {
        throw new Error(`Scene entity does not exist: ${id}`);
      }

      const entity = document.entities[index];

      if (entity === undefined) {
        throw new Error(`Scene entity index is invalid: ${id}`);
      }

      const previousHierarchy = document.editor?.hierarchy;
      const cleanedHierarchy = previousHierarchy === undefined
        ? undefined
        : detachEntityFromHierarchy(previousHierarchy, id);

      const baseDocument: SceneDocument = {
        ...document,
        entities: document.entities.filter((candidate) => candidate.id !== id)
      };

      return {
        document: cleanedHierarchy === undefined
          ? baseDocument
          : withHierarchyEntries(baseDocument, cleanedHierarchy),
        undo: restoreDestroyedEntityCommand(entity, previousHierarchy)
      };
    }
  };
}

function restoreDestroyedEntityCommand(
  entity: SceneEntityDocumentV1,
  previousHierarchy: readonly SceneHierarchyNodeDocumentV1[] | undefined
): EditorCommand {
  const entitySnapshot = cloneEntity(entity);
  const hierarchySnapshot = previousHierarchy?.map((node) => ({ ...node }));

  return {
    name: `restore entity ${entitySnapshot.id}`,
    apply(document) {
      if (findEntityIndex(document, entitySnapshot.id) !== -1) {
        throw new Error(`Scene entity already exists: ${entitySnapshot.id}`);
      }

      const baseDocument: SceneDocument = {
        ...document,
        entities: [...document.entities, cloneEntity(entitySnapshot)]
      };

      return {
        document: hierarchySnapshot === undefined
          ? baseDocument
          : withHierarchyEntries(baseDocument, hierarchySnapshot),
        undo: destroyEntityCommand(entitySnapshot.id)
      };
    }
  };
}

function detachEntityFromHierarchy(
  hierarchy: readonly SceneHierarchyNodeDocumentV1[],
  id: string
): readonly SceneHierarchyNodeDocumentV1[] | undefined {
  let changed = false;
  const next: SceneHierarchyNodeDocumentV1[] = [];

  for (const node of hierarchy) {
    if (node.id === id) {
      changed = true;
      continue;
    }

    if (node.parentId === id) {
      changed = true;
      const { parentId: _detached, ...rest } = node;
      next.push(rest);
      continue;
    }

    next.push(node);
  }

  return changed ? next : undefined;
}

function withHierarchyEntries(
  document: SceneDocument,
  hierarchy: readonly SceneHierarchyNodeDocumentV1[]
): SceneDocument {
  return {
    ...document,
    editor: {
      ...(document.editor ?? {}),
      hierarchy: hierarchy.map((node) => ({ ...node }))
    }
  };
}
