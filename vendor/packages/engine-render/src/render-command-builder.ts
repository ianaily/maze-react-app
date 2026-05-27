import { type EntityId, toEntityId, type World } from '../../engine-core/src/index.js';
import { createAabb, createVec2, type ReadonlyAabb } from '../../engine-math/src/index.js';
import type { Camera2D } from './camera2d.js';
import type { Projection } from './projection.js';
import { compareRenderCommands, type RenderCommand, type SpriteRenderCommand } from './render-command.js';
import type { SpriteStore } from './sprite-store.js';

export interface SpriteSourceResolution {
  /** Real image asset id (e.g. atlas asset id) that backs the requested logical id. */
  readonly id: string;
  /** Sub-rect into that image, in pixels. */
  readonly source: ReadonlyAabb;
}

export interface SpriteRenderCommandBuilderOptions {
  readonly world: World;
  readonly sprites: SpriteStore;
  readonly projection: Projection;
  readonly camera: Camera2D;
  readonly assetIdOf?: (entity: EntityId, fallbackAssetId: string) => string;
  readonly layerOf?: (entity: EntityId) => number;
  /**
   * Per-entity render-order tie-breaker. Threaded into `projection.depth` so
   * authors can stack two sprites at the same Y without renaming layers.
   * Defaults to 0 when omitted.
   */
  readonly orderOf?: (entity: EntityId) => number;
  /**
   * Translate a logical asset id into a real image + sub-rect. The render
   * backend draws the resolved image with `source` as the source rectangle.
   * Used to map atlas region ids onto their containing atlas image without
   * letting the builder import engine-asset. Callers wire this from their
   * scene catalog (typically via `findAtlasRegion`).
   *
   * Returning `undefined` means the assetId already names a real image —
   * the builder leaves assetId untouched and emits no `source` rect.
   */
  readonly sourceOf?: (assetId: string) => SpriteSourceResolution | undefined;
  readonly out?: RenderCommand[];
}

export const buildSpriteRenderCommands = (options: SpriteRenderCommandBuilderOptions): RenderCommand[] => {
  const commands = options.out ?? [];
  const projected = createVec2();
  const screen = createVec2();
  const worldPosition = createVec2();

  commands.length = 0;

  for (let entity = 0; entity < options.sprites.present.length; entity += 1) {
    const entityId = toEntityId(entity);

    if (options.sprites.present[entity] !== 1 || !options.world.hasEntity(entityId) || !options.world.transforms.has(entityId)) {
      continue;
    }

    worldPosition.x = (options.world.transforms.x[entity] ?? 0) + (options.sprites.offsetX[entity] ?? 0);
    worldPosition.y = (options.world.transforms.y[entity] ?? 0) + (options.sprites.offsetY[entity] ?? 0);
    options.projection.project(projected, worldPosition);
    options.camera.projectedToScreen(screen, projected);

    const fallbackAssetId = options.sprites.assetId[entity] ?? '';
    const logicalAssetId = options.assetIdOf?.(entityId, fallbackAssetId) ?? fallbackAssetId;
    const layer = options.layerOf?.(entityId) ?? 0;
    const order = options.orderOf?.(entityId) ?? 0;

    const resolved = options.sourceOf?.(logicalAssetId);
    const renderAssetId = resolved?.id ?? logicalAssetId;
    const command: SpriteRenderCommand = {
      kind: 'sprite',
      assetId: renderAssetId,
      screenX: screen.x,
      screenY: screen.y,
      width: (options.sprites.width[entity] ?? 1) * options.camera.zoom,
      height: (options.sprites.height[entity] ?? 1) * options.camera.zoom,
      rotation: options.world.transforms.rotation[entity] ?? 0,
      alpha: options.sprites.alpha[entity] ?? 1,
      depth: options.projection.depth(worldPosition, layer, order),
      ...(resolved !== undefined ? { source: resolved.source } : {})
    };

    commands.push(command);
  }

  commands.sort(compareRenderCommands);
  return commands;
};

// Re-export so callers don't need to reach into engine-math to construct a source-rect.
export { createAabb };
