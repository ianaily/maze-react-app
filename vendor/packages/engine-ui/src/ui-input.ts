import type { EventBus } from '../../engine-core/src/index.js';
import type { UiLayer, UiNode } from './ui-layer.js';

export type UiPointerKind = 'down' | 'up' | 'move';

export interface UiPointerResult {
  readonly consumed: boolean;
  readonly nodeId?: string;
}

export interface UiPointerEvent {
  readonly kind: UiPointerKind;
  readonly x: number;
  readonly y: number;
}

export function hitTestUi(layer: UiLayer, x: number, y: number): UiNode | undefined {
  return hitNode(layer.root, x, y);
}

export function routePointerEvent(
  layer: UiLayer,
  event: UiPointerEvent,
  bus: EventBus | undefined
): UiPointerResult {
  const node = hitTestUi(layer, event.x, event.y);

  if (node === undefined) {
    return { consumed: false };
  }

  if (event.kind === 'down' && node.kind === 'button' && node.clickEventName.length > 0 && bus !== undefined) {
    bus.publish(node.clickEventName, { nodeId: node.id, x: event.x, y: event.y });
  }

  return { consumed: true, nodeId: node.id };
}

function hitNode(node: UiNode, x: number, y: number): UiNode | undefined {
  // Children are drawn after their parent, so they receive hits first.
  for (let index = node.children.length - 1; index >= 0; index -= 1) {
    const child = node.children[index];

    if (child === undefined) {
      continue;
    }

    const childHit = hitNode(child, x, y);

    if (childHit !== undefined) {
      return childHit;
    }
  }

  if (!withinRect(node, x, y)) {
    return undefined;
  }

  if (node.kind === 'panel' || node.kind === 'button' || node.kind === 'image') {
    return node;
  }

  // Labels do not consume pointer input by themselves.
  return undefined;
}

function withinRect(node: UiNode, x: number, y: number): boolean {
  return (
    x >= node.rect.x &&
    x <= node.rect.x + node.rect.width &&
    y >= node.rect.y &&
    y <= node.rect.y + node.rect.height
  );
}
