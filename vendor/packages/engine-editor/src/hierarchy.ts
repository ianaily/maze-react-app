import type {
  SceneDocument,
  SceneHierarchyNodeDocumentV1
} from '../../engine-scene/src/index.js';
import type { EditorCommand } from './scene-commands.js';

export type HierarchyDropPosition = 'before' | 'after' | 'inside';

export interface ReparentRequest {
  /** Ids of entities to move. Order within the array defines their final order among new siblings. */
  readonly ids: readonly string[];
  /** New parent id; `undefined` means top-level. */
  readonly parentId: string | undefined;
  /** Anchor id used to position the moved ids; must be a sibling of `parentId`. Falsy = append. */
  readonly anchorId?: string;
  /** Where to drop relative to anchorId. Ignored when `anchorId` is absent. */
  readonly position?: 'before' | 'after';
}

export interface EditorHierarchyNode {
  readonly id: string;
  readonly parentId?: string;
  readonly order: number;
  readonly children: readonly EditorHierarchyNode[];
}

export function buildHierarchy(document: SceneDocument): readonly EditorHierarchyNode[] {
  const entries = hierarchyEntries(document);
  const childrenByParent = new Map<string | undefined, HierarchyEntry[]>();

  for (const entry of entries) {
    const siblings = childrenByParent.get(entry.parentId) ?? [];
    siblings.push(entry);
    childrenByParent.set(entry.parentId, siblings);
  }

  const buildLevel = (parentId: string | undefined): EditorHierarchyNode[] =>
    sortEntries(childrenByParent.get(parentId) ?? []).map((entry) => ({
      id: entry.id,
      ...(entry.parentId !== undefined ? { parentId: entry.parentId } : {}),
      order: entry.order,
      children: buildLevel(entry.id)
    }));

  return buildLevel(undefined);
}

/**
 * Returns true when reparenting any of `movingIds` under `parentId` would create a cycle
 * (either by parenting an entity to itself or to one of its own descendants).
 */
export function wouldCreateCycle(
  document: SceneDocument,
  movingIds: readonly string[],
  parentId: string | undefined
): boolean {
  if (parentId === undefined) {
    return false;
  }

  const movingSet = new Set(movingIds);

  if (movingSet.has(parentId)) {
    return true;
  }

  const parents = new Map<string, string | undefined>();

  for (const node of document.editor?.hierarchy ?? []) {
    parents.set(node.id, node.parentId);
  }

  let cursor: string | undefined = parents.get(parentId);
  const visited = new Set<string>();

  while (cursor !== undefined) {
    if (movingSet.has(cursor)) {
      return true;
    }

    if (visited.has(cursor)) {
      // existing data already contains a cycle — bail out and treat as invalid
      return true;
    }

    visited.add(cursor);
    cursor = parents.get(cursor);
  }

  return false;
}

/**
 * Move one or more entities under a new parent at a chosen position. Rejects (no-op)
 * if any move would create a cycle. Sibling ordering is preserved via dense `order`
 * values, so the resulting hierarchy round-trips cleanly through `buildHierarchy`.
 */
export function reparentEntitiesCommand(request: ReparentRequest): EditorCommand {
  const ids = request.ids.filter((id, index, list) => list.indexOf(id) === index);
  const { parentId, anchorId, position } = request;

  return {
    name: ids.length === 1
      ? `reparent ${ids[0]}`
      : `reparent ${ids.length} entities`,
    apply(document) {
      const previousHierarchy = document.editor?.hierarchy;

      if (ids.length === 0) {
        return { document, undo: setHierarchyCommand(previousHierarchy) };
      }

      if (wouldCreateCycle(document, ids, parentId)) {
        return { document, undo: setHierarchyCommand(previousHierarchy) };
      }

      const flat = hierarchyEntries(document);
      const moving = new Set(ids);

      // Sibling list at the new parent, with the moving ids removed first so we can
      // splice them back in at the requested position.
      const newSiblings = sortEntries(flat.filter((entry) => entry.parentId === parentId && !moving.has(entry.id)));

      let insertIndex = newSiblings.length;

      if (anchorId !== undefined && !moving.has(anchorId)) {
        const anchorIndex = newSiblings.findIndex((entry) => entry.id === anchorId);

        if (anchorIndex !== -1) {
          insertIndex = position === 'before' ? anchorIndex : anchorIndex + 1;
        }
      }

      const movingEntries: HierarchyEntry[] = ids
        .map((id) => flat.find((entry) => entry.id === id))
        .filter((entry): entry is HierarchyEntry => entry !== undefined)
        .map((entry) => ({ ...entry, parentId }));

      const reordered = [
        ...newSiblings.slice(0, insertIndex),
        ...movingEntries,
        ...newSiblings.slice(insertIndex)
      ];

      // Rewrite the moved siblings' order densely; leave non-affected siblings alone where possible.
      const orderById = new Map<string, number>();

      for (let index = 0; index < reordered.length; index += 1) {
        orderById.set(reordered[index]!.id, index);
      }

      const nextHierarchy: SceneHierarchyNodeDocumentV1[] = [];

      for (const entry of flat) {
        if (moving.has(entry.id)) {
          nextHierarchy.push({
            id: entry.id,
            ...(parentId !== undefined ? { parentId } : {}),
            order: orderById.get(entry.id) ?? entry.order
          });
          continue;
        }

        if (entry.parentId === parentId) {
          nextHierarchy.push({
            id: entry.id,
            ...(entry.parentId !== undefined ? { parentId: entry.parentId } : {}),
            order: orderById.get(entry.id) ?? entry.order
          });
          continue;
        }

        nextHierarchy.push({
          id: entry.id,
          ...(entry.parentId !== undefined ? { parentId: entry.parentId } : {}),
          order: entry.order
        });
      }

      return {
        document: withHierarchy(document, nextHierarchy),
        undo: setHierarchyCommand(previousHierarchy)
      };
    }
  };
}

export function setHierarchyParentCommand(id: string, parentId: string | undefined, order = 0): EditorCommand {
  return {
    name: `set hierarchy parent for ${id}`,
    apply(document) {
      const previousHierarchy = document.editor?.hierarchy;
      const nextHierarchy = upsertHierarchyNode(document, { id, ...(parentId !== undefined ? { parentId } : {}), order });

      return {
        document: withHierarchy(document, nextHierarchy),
        undo: setHierarchyCommand(previousHierarchy)
      };
    }
  };
}

export function setHierarchyCommand(hierarchy: readonly SceneHierarchyNodeDocumentV1[] | undefined): EditorCommand {
  const snapshot = hierarchy?.map((node) => ({ ...node }));

  return {
    name: 'set hierarchy',
    apply(document) {
      const previousHierarchy = document.editor?.hierarchy;

      return {
        document: withHierarchy(document, snapshot),
        undo: setHierarchyCommand(previousHierarchy)
      };
    }
  };
}

function hierarchyEntries(document: SceneDocument): HierarchyEntry[] {
  const metadata = new Map<string, SceneHierarchyNodeDocumentV1>();

  for (const node of document.editor?.hierarchy ?? []) {
    metadata.set(node.id, node);
  }

  return document.entities.map((entity, index) => {
    const node = metadata.get(entity.id);

    return {
      id: entity.id,
      parentId: node?.parentId,
      order: node?.order ?? index
    };
  });
}

function upsertHierarchyNode(
  document: SceneDocument,
  node: SceneHierarchyNodeDocumentV1
): readonly SceneHierarchyNodeDocumentV1[] {
  const existing = document.editor?.hierarchy ?? [];
  const withoutNode = existing.filter((candidate) => candidate.id !== node.id);
  return [...withoutNode, { ...node }];
}

function withHierarchy(
  document: SceneDocument,
  hierarchy: readonly SceneHierarchyNodeDocumentV1[] | undefined
): SceneDocument {
  if (hierarchy === undefined) {
    const { editor: _editor, ...rest } = document;
    return rest;
  }

  return {
    ...document,
    editor: {
      ...(document.editor ?? {}),
      hierarchy: hierarchy.map((node) => ({ ...node }))
    }
  };
}

function sortEntries(entries: readonly HierarchyEntry[]): HierarchyEntry[] {
  return [...entries].sort((left, right) => {
    const orderDelta = left.order - right.order;
    return orderDelta !== 0 ? orderDelta : left.id.localeCompare(right.id);
  });
}

interface HierarchyEntry {
  readonly id: string;
  readonly parentId: string | undefined;
  readonly order: number;
}
