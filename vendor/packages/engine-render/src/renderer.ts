import type { RenderCommand } from './render-command.js';

export interface RenderFrame {
  readonly width: number;
  readonly height: number;
  readonly commands: readonly RenderCommand[];
}

export interface Renderer {
  beginFrame(frame: RenderFrame): void;
  render(command: RenderCommand): void;
  endFrame(frame: RenderFrame): void;
}
