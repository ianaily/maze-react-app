import type { RenderCommand, RenderFrame, Renderer, SpriteRenderCommand } from '../../engine-render/src/index.js';

export type CanvasDrawable = CanvasImageSource;

export interface CanvasAssetResolver {
  resolve(assetId: string): CanvasDrawable | undefined;
}

export interface Canvas2DContext {
  globalAlpha: number;
  globalCompositeOperation: GlobalCompositeOperation;
  fillStyle: string | CanvasGradient | CanvasPattern;
  clearRect(x: number, y: number, width: number, height: number): void;
  drawImage(image: CanvasDrawable, dx: number, dy: number, dWidth: number, dHeight: number): void;
  drawImage(
    image: CanvasDrawable,
    sx: number,
    sy: number,
    sWidth: number,
    sHeight: number,
    dx: number,
    dy: number,
    dWidth: number,
    dHeight: number
  ): void;
  fillRect(x: number, y: number, width: number, height: number): void;
  restore(): void;
  rotate(angle: number): void;
  save(): void;
  scale(x: number, y: number): void;
  translate(x: number, y: number): void;
}

export interface CanvasRendererOptions {
  readonly context: Canvas2DContext;
  readonly assets: CanvasAssetResolver;
  readonly clearBeforeFrame?: boolean;
  readonly missingAssetHandler?: (assetId: string) => void;
}

export class CanvasRenderer implements Renderer {
  private readonly context: Canvas2DContext;
  private readonly assets: CanvasAssetResolver;
  private readonly clearBeforeFrame: boolean;
  private readonly missingAssetHandler: ((assetId: string) => void) | undefined;

  constructor(options: CanvasRendererOptions) {
    this.context = options.context;
    this.assets = options.assets;
    this.clearBeforeFrame = options.clearBeforeFrame ?? true;
    this.missingAssetHandler = options.missingAssetHandler;
  }

  beginFrame(frame: RenderFrame): void {
    if (this.clearBeforeFrame) {
      this.context.clearRect(0, 0, frame.width, frame.height);
    }
  }

  render(command: RenderCommand): void {
    switch (command.kind) {
      case 'sprite':
        this.renderSprite(command);
        break;
    }
  }

  endFrame(_frame: RenderFrame): void {
    this.context.globalAlpha = 1;
  }

  private renderSprite(command: SpriteRenderCommand): void {
    const image = this.assets.resolve(command.assetId);

    if (image === undefined) {
      this.missingAssetHandler?.(command.assetId);
      return;
    }

    this.context.save();
    this.context.globalAlpha = command.alpha;
    this.context.translate(command.screenX, command.screenY);
    this.context.rotate(command.rotation);

    if (command.flipX === true) {
      this.context.scale(-1, 1);
    }

    const halfWidth = command.width * 0.5;
    const halfHeight = command.height * 0.5;

    if (command.source === undefined) {
      this.context.drawImage(image, -halfWidth, -halfHeight, command.width, command.height);
    } else {
      const sourceWidth = command.source.maxX - command.source.minX;
      const sourceHeight = command.source.maxY - command.source.minY;

      this.context.drawImage(
        image,
        command.source.minX,
        command.source.minY,
        sourceWidth,
        sourceHeight,
        -halfWidth,
        -halfHeight,
        command.width,
        command.height
      );
    }

    if (command.tint !== undefined) {
      const previousOp: GlobalCompositeOperation = this.context.globalCompositeOperation;
      this.context.globalCompositeOperation = 'source-atop';
      this.context.fillStyle = `rgba(${command.tint.r}, ${command.tint.g}, ${command.tint.b}, ${command.tint.a})`;
      this.context.fillRect(-halfWidth, -halfHeight, command.width, command.height);
      this.context.globalCompositeOperation = previousOp;
    }

    this.context.restore();
  }
}
