import type { UiDrawCommand } from './ui-render.js';

export interface UiPaintAssetResolver {
  resolve(assetId: string): CanvasImageSource | undefined;
}

export function paintUi(
  context: CanvasRenderingContext2D,
  commands: readonly UiDrawCommand[],
  assets?: UiPaintAssetResolver
): void {
  for (const command of commands) {
    context.save();
    context.globalAlpha = command.alpha;

    switch (command.kind) {
      case 'ui-panel': {
        if (command.fillColor !== undefined) {
          context.fillStyle = command.fillColor;
          context.fillRect(command.rect.x, command.rect.y, command.rect.width, command.rect.height);
        }

        if (command.borderColor !== undefined && command.borderWidth > 0) {
          context.lineWidth = command.borderWidth;
          context.strokeStyle = command.borderColor;
          context.strokeRect(command.rect.x, command.rect.y, command.rect.width, command.rect.height);
        }
        break;
      }
      case 'ui-label': {
        context.fillStyle = command.color;
        context.font = `${command.fontSize}px sans-serif`;
        context.textAlign = command.textAlign;
        context.textBaseline = 'middle';

        const cx = command.textAlign === 'left'
          ? command.rect.x + 4
          : command.textAlign === 'right'
            ? command.rect.x + command.rect.width - 4
            : command.rect.x + command.rect.width / 2;

        const cy = command.rect.y + command.rect.height / 2;
        context.fillText(command.text, cx, cy);
        break;
      }
      case 'ui-image': {
        const image = assets?.resolve(command.assetId);

        if (image !== undefined) {
          context.drawImage(image, command.rect.x, command.rect.y, command.rect.width, command.rect.height);
        }
        break;
      }
    }

    context.restore();
  }
}
