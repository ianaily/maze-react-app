import type {
  PrefabDocument,
  PrefabEntity,
  PrefabEntityDocumentV1,
  PrefabHierarchyNodeDocumentV1
} from '../../engine-prefab/src/index.js';
import type {
  SceneDocument,
  SceneEntityDocumentV1,
  SceneTransformDocumentV1
} from '../../engine-scene/src/index.js';
import { createEntityCommand, type EditorCommand } from './scene-commands.js';
import { createCommandGroup } from './command-group.js';
import { setHierarchyParentCommand } from './hierarchy.js';

export interface ConvertSelectionToPrefabOptions {
  readonly id: string;
  readonly label: string;
  readonly category?: string;
}

export function convertSelectionToPrefab(
  document: SceneDocument,
  selectedIds: readonly string[],
  options: ConvertSelectionToPrefabOptions
): PrefabDocument {
  if (selectedIds.length === 0) {
    throw new Error('Cannot convert an empty selection into a prefab.');
  }

  if (typeof options.id !== 'string' || options.id.length === 0) {
    throw new Error('Prefab id is required.');
  }

  if (typeof options.label !== 'string' || options.label.length === 0) {
    throw new Error('Prefab label is required.');
  }

  const idSet = new Set(selectedIds);
  const rootId = selectedIds[0]!;
  const entities: PrefabEntityDocumentV1[] = [];
  const hierarchy: PrefabHierarchyNodeDocumentV1[] = [];

  for (const id of selectedIds) {
    const entity = document.entities.find((candidate) => candidate.id === id);

    if (entity === undefined) {
      throw new Error(`Selection references unknown entity: ${id}`);
    }

    entities.push(cloneEntityDocument(entity));
  }

  hierarchy.push({ id: rootId, order: 0 });

  for (const id of selectedIds) {
    if (id === rootId) {
      continue;
    }

    const sceneNode = document.editor?.hierarchy?.find((node) => node.id === id);
    const sceneParent = sceneNode?.parentId;
    const parentId = sceneParent !== undefined && idSet.has(sceneParent) ? sceneParent : rootId;

    hierarchy.push({
      id,
      parentId,
      order: sceneNode?.order ?? 0
    });
  }

  return {
    version: 1,
    id: options.id,
    label: options.label,
    ...(options.category !== undefined ? { category: options.category } : {}),
    rootId,
    entities,
    hierarchy
  };
}

function cloneEntityDocument(entity: SceneEntityDocumentV1): PrefabEntityDocumentV1 {
  return JSON.parse(JSON.stringify(entity)) as PrefabEntityDocumentV1;
}

export interface InstantiatePrefabOptions {
  readonly position?: { readonly x: number; readonly y: number };
  readonly idPrefix?: string;
  readonly parentEntityId?: string;
}

export function instantiatePrefabCommand(
  prefab: PrefabDocument,
  options: InstantiatePrefabOptions = {}
): EditorCommand {
  return {
    name: `instantiate prefab ${prefab.id}`,
    apply(document) {
      const idMap = buildIdMap(document, prefab, options.idPrefix);
      const targetPosition = options.position;
      const subCommands: EditorCommand[] = [];

      for (const entity of prefab.entities) {
        const newId = idMap.get(entity.id);

        if (newId === undefined) {
          throw new Error(`Prefab id mapping is missing for entity: ${entity.id}`);
        }

        const sceneEntity = sceneEntityFromPrefab(entity, newId, prefab.rootId === entity.id, targetPosition);
        subCommands.push(createEntityCommand(sceneEntity));
      }

      const rootNewId = idMap.get(prefab.rootId);

      if (rootNewId === undefined) {
        throw new Error(`Prefab root id mapping is missing: ${prefab.rootId}`);
      }

      const rootOrder = document.entities.length;
      subCommands.push(setHierarchyParentCommand(rootNewId, options.parentEntityId, rootOrder));

      for (const node of prefab.hierarchy ?? []) {
        if (node.id === prefab.rootId) {
          continue;
        }

        const childId = idMap.get(node.id);

        if (childId === undefined) {
          continue;
        }

        const parentLocalId = node.parentId ?? prefab.rootId;
        const parentMappedId = idMap.get(parentLocalId);

        if (parentMappedId === undefined) {
          continue;
        }

        subCommands.push(setHierarchyParentCommand(childId, parentMappedId, node.order ?? 0));
      }

      const group = createCommandGroup(`instantiate prefab ${prefab.id}`, subCommands);
      return group.apply(document);
    }
  };
}

function buildIdMap(
  document: SceneDocument,
  prefab: PrefabDocument,
  prefix: string | undefined
): Map<string, string> {
  const existing = new Set(document.entities.map((entity) => entity.id));
  const idMap = new Map<string, string>();
  const used = new Set<string>(existing);

  for (const entity of prefab.entities) {
    const base = prefix !== undefined && prefix.length > 0 ? `${prefix}-${entity.id}` : entity.id;
    let candidate = base;
    let counter = 1;

    while (used.has(candidate)) {
      candidate = `${base}-${counter}`;
      counter += 1;
    }

    idMap.set(entity.id, candidate);
    used.add(candidate);
  }

  return idMap;
}

function sceneEntityFromPrefab(
  entity: PrefabEntity,
  newId: string,
  isRoot: boolean,
  targetPosition: { readonly x: number; readonly y: number } | undefined
): SceneEntityDocumentV1 {
  const transform = entity.transform === undefined && !isRoot
    ? undefined
    : applyRootPosition(entity.transform, isRoot, targetPosition);

  return {
    id: newId,
    ...(entity.layer !== undefined ? { layer: entity.layer } : {}),
    ...(transform !== undefined ? { transform } : {}),
    ...(entity.rigidbody !== undefined ? { rigidbody: { ...entity.rigidbody } } : {}),
    ...(entity.collider !== undefined ? { collider: { ...entity.collider } } : {}),
    ...(entity.animator !== undefined ? { animator: { ...entity.animator } } : {}),
    ...(entity.characterController !== undefined
      ? { characterController: { ...entity.characterController } }
      : {}),
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
    ...(entity.particleEmitter !== undefined
      ? { particleEmitter: { ...entity.particleEmitter } }
      : {}),
    ...(entity.behaviors !== undefined
      ? {
          // Behavior configs are JSON-serializable; round-trip clones the entire
          // tree so two prefab instances can't share a mutable config reference.
          behaviors: entity.behaviors.map((behavior) => JSON.parse(JSON.stringify(behavior)) as typeof behavior)
        }
      : {})
  };
}

function applyRootPosition(
  transform: SceneTransformDocumentV1 | undefined,
  isRoot: boolean,
  targetPosition: { readonly x: number; readonly y: number } | undefined
): SceneTransformDocumentV1 | undefined {
  if (transform === undefined && (!isRoot || targetPosition === undefined)) {
    return undefined;
  }

  const base = transform ?? {};

  if (!isRoot || targetPosition === undefined) {
    return { ...base };
  }

  return {
    ...base,
    x: targetPosition.x,
    y: targetPosition.y
  };
}
