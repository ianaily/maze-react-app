import type {
  UiAnchor,
  UiLayerDocument,
  UiLayoutDirection,
  UiNodeDocument,
  UiNodeKind,
  UiStyleDocument
} from './ui-document.js';

export interface UiRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface UiNode {
  readonly id: string;
  readonly kind: UiNodeKind;
  readonly anchor: UiAnchor;
  readonly offsetX: number;
  readonly offsetY: number;
  readonly width: number | undefined;
  readonly height: number | undefined;
  readonly padding: { top: number; right: number; bottom: number; left: number };
  readonly layout: UiLayoutDirection;
  readonly gap: number;
  readonly text: string;
  readonly assetId: string;
  readonly style: Required<Pick<UiStyleDocument, 'alpha'>> & UiStyleDocument;
  readonly clickEventName: string;
  readonly children: readonly UiNode[];
  readonly rect: UiRect;
}

export interface UiLayer {
  viewportWidth: number;
  viewportHeight: number;
  readonly root: UiNode;
  readonly byId: ReadonlyMap<string, UiNode>;
}

export function buildUiLayer(document: UiLayerDocument): UiLayer {
  const viewportWidth = document.viewportWidth ?? 0;
  const viewportHeight = document.viewportHeight ?? 0;
  const root = buildNode(document.root);
  const byId = new Map<string, UiNode>();
  indexNodes(root, byId);

  layoutNode(root, { x: 0, y: 0, width: viewportWidth, height: viewportHeight });

  return { viewportWidth, viewportHeight, root, byId };
}

export function layoutUi(layer: UiLayer, viewport: { readonly width: number; readonly height: number }): void {
  layer.viewportWidth = viewport.width;
  layer.viewportHeight = viewport.height;
  layoutNode(layer.root, { x: 0, y: 0, width: viewport.width, height: viewport.height });
}

function buildNode(document: UiNodeDocument): UiNode {
  return {
    id: document.id,
    kind: document.kind,
    anchor: document.anchor ?? 'top-left',
    offsetX: document.offsetX ?? 0,
    offsetY: document.offsetY ?? 0,
    width: document.width,
    height: document.height,
    padding: {
      top: document.padding?.top ?? 0,
      right: document.padding?.right ?? 0,
      bottom: document.padding?.bottom ?? 0,
      left: document.padding?.left ?? 0
    },
    layout: document.layout ?? 'absolute',
    gap: document.gap ?? 0,
    text: document.text ?? '',
    assetId: document.assetId ?? '',
    style: { alpha: 1, ...(document.style ?? {}) },
    clickEventName: document.clickEventName ?? '',
    children: (document.children ?? []).map(buildNode),
    rect: { x: 0, y: 0, width: 0, height: 0 }
  };
}

function indexNodes(node: UiNode, into: Map<string, UiNode>): void {
  if (into.has(node.id)) {
    throw new Error(`Duplicate UI node id: ${node.id}`);
  }

  into.set(node.id, node);

  for (const child of node.children) {
    indexNodes(child, into);
  }
}

function layoutNode(node: UiNode, parentRect: UiRect): void {
  const rect = node.rect;

  if (node.anchor === 'stretch') {
    rect.x = parentRect.x + node.offsetX;
    rect.y = parentRect.y + node.offsetY;
    rect.width = Math.max(parentRect.width - node.offsetX * 2, 0);
    rect.height = Math.max(parentRect.height - node.offsetY * 2, 0);
  } else {
    const width = node.width ?? 0;
    const height = node.height ?? 0;
    const anchorOrigin = anchorPosition(node.anchor, parentRect, width, height);
    rect.x = anchorOrigin.x + node.offsetX;
    rect.y = anchorOrigin.y + node.offsetY;
    rect.width = width;
    rect.height = height;
  }

  if (node.children.length === 0) {
    return;
  }

  const innerX = rect.x + node.padding.left;
  const innerY = rect.y + node.padding.top;
  const innerWidth = Math.max(rect.width - node.padding.left - node.padding.right, 0);
  const innerHeight = Math.max(rect.height - node.padding.top - node.padding.bottom, 0);

  if (node.layout === 'row') {
    let cursorX = innerX;

    for (const child of node.children) {
      layoutNode(child, { x: cursorX, y: innerY, width: innerWidth, height: innerHeight });
      cursorX += (child.width ?? child.rect.width) + node.gap;
    }
    return;
  }

  if (node.layout === 'column') {
    let cursorY = innerY;

    for (const child of node.children) {
      layoutNode(child, { x: innerX, y: cursorY, width: innerWidth, height: innerHeight });
      cursorY += (child.height ?? child.rect.height) + node.gap;
    }
    return;
  }

  for (const child of node.children) {
    layoutNode(child, { x: innerX, y: innerY, width: innerWidth, height: innerHeight });
  }
}

function anchorPosition(
  anchor: UiAnchor,
  parentRect: UiRect,
  width: number,
  height: number
): { x: number; y: number } {
  switch (anchor) {
    case 'top-left':
      return { x: parentRect.x, y: parentRect.y };
    case 'top':
      return { x: parentRect.x + (parentRect.width - width) / 2, y: parentRect.y };
    case 'top-right':
      return { x: parentRect.x + parentRect.width - width, y: parentRect.y };
    case 'left':
      return { x: parentRect.x, y: parentRect.y + (parentRect.height - height) / 2 };
    case 'center':
      return {
        x: parentRect.x + (parentRect.width - width) / 2,
        y: parentRect.y + (parentRect.height - height) / 2
      };
    case 'right':
      return {
        x: parentRect.x + parentRect.width - width,
        y: parentRect.y + (parentRect.height - height) / 2
      };
    case 'bottom-left':
      return { x: parentRect.x, y: parentRect.y + parentRect.height - height };
    case 'bottom':
      return {
        x: parentRect.x + (parentRect.width - width) / 2,
        y: parentRect.y + parentRect.height - height
      };
    case 'bottom-right':
      return {
        x: parentRect.x + parentRect.width - width,
        y: parentRect.y + parentRect.height - height
      };
    case 'stretch':
      return { x: parentRect.x, y: parentRect.y };
  }
}
