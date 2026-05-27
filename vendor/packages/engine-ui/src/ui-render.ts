import type { UiLayer, UiNode, UiRect } from './ui-layer.js';

export type UiDrawCommand =
  | UiPanelDrawCommand
  | UiLabelDrawCommand
  | UiImageDrawCommand;

export interface UiPanelDrawCommand {
  readonly kind: 'ui-panel';
  readonly rect: UiRect;
  readonly fillColor: string | undefined;
  readonly borderColor: string | undefined;
  readonly borderWidth: number;
  readonly alpha: number;
}

export interface UiLabelDrawCommand {
  readonly kind: 'ui-label';
  readonly rect: UiRect;
  readonly text: string;
  readonly color: string;
  readonly fontSize: number;
  readonly textAlign: 'left' | 'center' | 'right';
  readonly alpha: number;
}

export interface UiImageDrawCommand {
  readonly kind: 'ui-image';
  readonly rect: UiRect;
  readonly assetId: string;
  readonly alpha: number;
}

export function buildUiDrawCommands(layer: UiLayer, out: UiDrawCommand[] = []): UiDrawCommand[] {
  out.length = 0;
  appendNode(layer.root, out);
  return out;
}

function appendNode(node: UiNode, out: UiDrawCommand[]): void {
  switch (node.kind) {
    case 'panel':
    case 'button':
      out.push({
        kind: 'ui-panel',
        rect: copyRect(node.rect),
        fillColor: node.style.backgroundColor,
        borderColor: node.style.borderColor,
        borderWidth: node.style.borderWidth ?? 0,
        alpha: node.style.alpha
      });

      if (node.kind === 'button' && node.text.length > 0) {
        out.push({
          kind: 'ui-label',
          rect: copyRect(node.rect),
          text: node.text,
          color: node.style.textColor ?? '#ffffff',
          fontSize: node.style.fontSize ?? 14,
          textAlign: node.style.textAlign ?? 'center',
          alpha: node.style.alpha
        });
      }
      break;
    case 'label':
      out.push({
        kind: 'ui-label',
        rect: copyRect(node.rect),
        text: node.text,
        color: node.style.textColor ?? '#ffffff',
        fontSize: node.style.fontSize ?? 14,
        textAlign: node.style.textAlign ?? 'left',
        alpha: node.style.alpha
      });
      break;
    case 'image':
      out.push({
        kind: 'ui-image',
        rect: copyRect(node.rect),
        assetId: node.assetId,
        alpha: node.style.alpha
      });
      break;
  }

  for (const child of node.children) {
    appendNode(child, out);
  }
}

function copyRect(rect: UiRect): UiRect {
  return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
}
