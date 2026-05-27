import type { PrefabDocument, PrefabEntity } from './prefab-document.js';

export function validatePrefab(prefab: PrefabDocument): void {
  if (prefab.version !== 1) {
    throw new Error(`Unsupported prefab version: ${prefab.version}`);
  }

  if (typeof prefab.id !== 'string' || prefab.id.length === 0) {
    throw new Error('Prefab requires a non-empty id.');
  }

  if (typeof prefab.label !== 'string' || prefab.label.length === 0) {
    throw new Error(`Prefab "${prefab.id}" requires a non-empty label.`);
  }

  if (prefab.entities.length === 0) {
    throw new Error(`Prefab "${prefab.id}" must contain at least one entity.`);
  }

  const localIds = new Set<string>();

  for (const entity of prefab.entities) {
    if (typeof entity.id !== 'string' || entity.id.length === 0) {
      throw new Error(`Prefab "${prefab.id}" has an entity with an empty local id.`);
    }

    if (localIds.has(entity.id)) {
      throw new Error(`Prefab "${prefab.id}" has duplicate local entity id: ${entity.id}`);
    }

    localIds.add(entity.id);
  }

  if (!localIds.has(prefab.rootId)) {
    throw new Error(`Prefab "${prefab.id}" rootId is not present in entities: ${prefab.rootId}`);
  }

  const hierarchyIds = new Set<string>();
  const parents = new Map<string, string>();

  for (const node of prefab.hierarchy ?? []) {
    if (!localIds.has(node.id)) {
      throw new Error(`Prefab "${prefab.id}" hierarchy references unknown entity id: ${node.id}`);
    }

    if (hierarchyIds.has(node.id)) {
      throw new Error(`Prefab "${prefab.id}" hierarchy has duplicate entry: ${node.id}`);
    }

    if (node.parentId !== undefined) {
      if (node.parentId === node.id) {
        throw new Error(`Prefab "${prefab.id}" hierarchy entity cannot parent itself: ${node.id}`);
      }

      if (!localIds.has(node.parentId)) {
        throw new Error(
          `Prefab "${prefab.id}" hierarchy references unknown parent id: ${node.parentId}`
        );
      }

      parents.set(node.id, node.parentId);
    }

    if (node.order !== undefined && (!Number.isFinite(node.order) || !Number.isInteger(node.order))) {
      throw new Error(`Prefab "${prefab.id}" hierarchy order must be an integer: ${node.id}`);
    }

    hierarchyIds.add(node.id);
  }

  for (const id of hierarchyIds) {
    const seen = new Set<string>();
    let cursor: string | undefined = id;

    while (cursor !== undefined) {
      if (seen.has(cursor)) {
        throw new Error(`Prefab "${prefab.id}" hierarchy cycle detected at entity: ${cursor}`);
      }

      seen.add(cursor);
      cursor = parents.get(cursor);
    }
  }
}

export function findPrefabEntity(prefab: PrefabDocument, localId: string): PrefabEntity | undefined {
  return prefab.entities.find((entity) => entity.id === localId);
}
