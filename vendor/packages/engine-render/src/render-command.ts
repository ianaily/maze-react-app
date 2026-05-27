import type { ReadonlyAabb } from '../../engine-math/src/index.js';

export type RenderCommand = SpriteRenderCommand;

export interface SpriteRenderCommand {
  readonly kind: 'sprite';
  readonly assetId: string;
  readonly screenX: number;
  readonly screenY: number;
  readonly width: number;
  readonly height: number;
  readonly rotation: number;
  readonly alpha: number;
  readonly depth: number;
  readonly source?: ReadonlyAabb;
  /** Mirror the sprite horizontally around its center. Useful for character facing. */
  readonly flipX?: boolean;
  /**
   * Tint colour applied on top of the sprite, preserving the sprite alpha mask
   * (canvas backend uses `source-atop`). Channels in `[0, 255]`, alpha in `[0, 1]`.
   */
  readonly tint?: SpriteTintColor;
}

export interface SpriteTintColor {
  readonly r: number;
  readonly g: number;
  readonly b: number;
  readonly a: number;
}

/**
 * Hot-path sort. Depth already encodes layer, entity order, and projection
 * position (see `Projection.depth`), so this just compares numerically and
 * relies on `Array.prototype.sort`'s stable behaviour for equal-depth ties —
 * builders emit commands in entity-iteration order, which is scene-document
 * order, so the fallback is automatic. No string compare per command.
 */
export const compareRenderCommands = (left: RenderCommand, right: RenderCommand): number => {
  return left.depth - right.depth;
};
