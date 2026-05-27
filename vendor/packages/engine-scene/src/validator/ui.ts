import type { UiLayerDocument, UiNodeDocument } from '../../../engine-ui/src/index.js';

const SUPPORTED_UI_KINDS = new Set(['panel', 'label', 'button', 'image']);
const SUPPORTED_UI_ANCHORS = new Set([
  'top-left', 'top', 'top-right',
  'left', 'center', 'right',
  'bottom-left', 'bottom', 'bottom-right',
  'stretch'
]);
const SUPPORTED_UI_LAYOUTS = new Set(['absolute', 'row', 'column']);

export const validateUiLayer = (layer: UiLayerDocument): void => {
  const seen = new Set<string>();
  walkUiNode(layer.root, seen);
};

const walkUiNode = (node: UiNodeDocument, seen: Set<string>): void => {
  if (typeof node.id !== 'string' || node.id.length === 0) {
    throw new Error('UI node id must be a non-empty string.');
  }

  if (seen.has(node.id)) {
    throw new Error(`Duplicate UI node id: ${node.id}`);
  }

  seen.add(node.id);

  if (!SUPPORTED_UI_KINDS.has(node.kind)) {
    throw new Error(`UI node "${node.id}" kind "${node.kind}" is not supported.`);
  }

  if (node.anchor !== undefined && !SUPPORTED_UI_ANCHORS.has(node.anchor)) {
    throw new Error(`UI node "${node.id}" anchor "${node.anchor}" is not supported.`);
  }

  if (node.layout !== undefined && !SUPPORTED_UI_LAYOUTS.has(node.layout)) {
    throw new Error(`UI node "${node.id}" layout "${node.layout}" is not supported.`);
  }

  if (node.kind === 'image' && (typeof node.assetId !== 'string' || node.assetId.length === 0)) {
    throw new Error(`UI image node "${node.id}" requires a non-empty assetId.`);
  }

  for (const child of node.children ?? []) {
    walkUiNode(child, seen);
  }
};
