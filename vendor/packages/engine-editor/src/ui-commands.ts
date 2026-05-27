import type { UiNodeDocument } from '../../engine-ui/src/index.js';
import type { SceneDocument } from '../../engine-scene/src/index.js';
import type { EditorCommand } from './scene-commands.js';

export type UiNodePatch = Partial<Pick<UiNodeDocument, 'offsetX' | 'offsetY' | 'width' | 'height' | 'anchor' | 'text'>>;

/**
 * Walk the scene's UI tree, replace the node matching `nodeId` with the patch
 * applied on top of its current values, and record the inverse patch as undo.
 * Throws if no UI layer exists or the node id is missing — UI commands should
 * be dispatched from picks that already proved the node exists.
 */
interface PatchResult {
  readonly node: UiNodeDocument;
  readonly inverse: UiNodePatch;
}

export function updateUiNodeCommand(nodeId: string, patch: UiNodePatch): EditorCommand {
  return {
    name: `update ui node ${nodeId}`,
    apply(document) {
      if (document.ui === undefined) {
        throw new Error(`Scene has no UI layer to mutate.`);
      }

      const walked = walkAndPatch(document.ui.root, nodeId, patch);

      if (walked === undefined) {
        throw new Error(`UI node not found: ${nodeId}`);
      }

      return {
        document: {
          ...document,
          ui: { ...document.ui, root: walked.node }
        },
        undo: updateUiNodeCommand(nodeId, walked.inverse)
      };
    }
  };
}

function walkAndPatch(
  node: UiNodeDocument,
  targetId: string,
  patch: UiNodePatch
): PatchResult | undefined {
  if (node.id === targetId) {
    return applyPatch(node, patch);
  }

  const children = node.children;

  if (children === undefined || children.length === 0) {
    return undefined;
  }

  for (let index = 0; index < children.length; index += 1) {
    const child = children[index]!;
    const recursed = walkAndPatch(child, targetId, patch);

    if (recursed === undefined) {
      continue;
    }

    const nextChildren = children.slice();
    nextChildren[index] = recursed.node;
    return { node: { ...node, children: nextChildren }, inverse: recursed.inverse };
  }

  return undefined;
}

function applyPatch(node: UiNodeDocument, patch: UiNodePatch): PatchResult {
  const next: { -readonly [K in keyof UiNodeDocument]: UiNodeDocument[K] } = { ...node };
  const inverse: { -readonly [K in keyof UiNodePatch]: UiNodePatch[K] } = {};

  if (patch.offsetX !== undefined && node.offsetX !== patch.offsetX) {
    inverse.offsetX = node.offsetX ?? 0;
    next.offsetX = patch.offsetX;
  }

  if (patch.offsetY !== undefined && node.offsetY !== patch.offsetY) {
    inverse.offsetY = node.offsetY ?? 0;
    next.offsetY = patch.offsetY;
  }

  if (patch.width !== undefined && node.width !== patch.width) {
    inverse.width = node.width ?? 0;
    next.width = patch.width;
  }

  if (patch.height !== undefined && node.height !== patch.height) {
    inverse.height = node.height ?? 0;
    next.height = patch.height;
  }

  if (patch.anchor !== undefined && node.anchor !== patch.anchor) {
    inverse.anchor = node.anchor ?? 'top-left';
    next.anchor = patch.anchor;
  }

  if (patch.text !== undefined && node.text !== patch.text) {
    inverse.text = node.text ?? '';
    next.text = patch.text;
  }

  return { node: next, inverse };
}
