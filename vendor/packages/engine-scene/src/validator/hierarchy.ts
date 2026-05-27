import type { SceneEditorDocumentV1 } from '../scene-schema.js';

export const validateEditorHierarchy = (
  editor: SceneEditorDocumentV1 | undefined,
  entityIds: ReadonlySet<string>
): void => {
  const hierarchy = editor?.hierarchy;

  if (hierarchy === undefined) {
    return;
  }

  const hierarchyIds = new Set<string>();
  const parents = new Map<string, string>();

  for (const node of hierarchy) {
    if (!entityIds.has(node.id)) {
      throw new Error(`Unknown hierarchy entity id: ${node.id}`);
    }

    if (hierarchyIds.has(node.id)) {
      throw new Error(`Duplicate hierarchy entity id: ${node.id}`);
    }

    if (node.parentId !== undefined) {
      if (node.parentId === node.id) {
        throw new Error(`Hierarchy entity cannot parent itself: ${node.id}`);
      }

      if (!entityIds.has(node.parentId)) {
        throw new Error(`Unknown hierarchy parent id for entity ${node.id}: ${node.parentId}`);
      }

      parents.set(node.id, node.parentId);
    }

    if (node.order !== undefined && (!Number.isFinite(node.order) || !Number.isInteger(node.order))) {
      throw new Error(`Hierarchy order must be an integer for entity: ${node.id}`);
    }

    hierarchyIds.add(node.id);
  }

  for (const id of hierarchyIds) {
    const seen = new Set<string>();
    let cursor: string | undefined = id;

    while (cursor !== undefined) {
      if (seen.has(cursor)) {
        throw new Error(`Hierarchy cycle detected at entity: ${cursor}`);
      }

      seen.add(cursor);
      cursor = parents.get(cursor);
    }
  }
};
