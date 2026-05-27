import {
  compareRenderCommands,
  type Camera2D,
  type Projection,
  type RenderCommand,
  type SpriteRenderCommand
} from '../../engine-render/src/index.js';
import { PARTICLE_ACTIVE, type ParticlePool } from './particle-pool.js';

export interface ParticleRenderOptions {
  readonly pool: ParticlePool;
  readonly projection: Projection;
  readonly camera: Camera2D;
  readonly baseSpriteSize?: number;
  readonly out?: RenderCommand[];
}

export function buildParticleRenderCommands(options: ParticleRenderOptions): RenderCommand[] {
  const commands = options.out ?? [];
  commands.length = 0;

  const pool = options.pool;
  const baseSize = options.baseSpriteSize ?? 4;
  const worldPosition = { x: 0, y: 0 };
  const projected = { x: 0, y: 0 };
  const screen = { x: 0, y: 0 };

  for (let slot = 0; slot < pool.capacity; slot += 1) {
    if (pool.alive[slot] !== PARTICLE_ACTIVE) {
      continue;
    }

    const assetId = pool.spriteAssetId[slot] ?? '';

    if (assetId.length === 0) {
      continue;
    }

    const total = pool.totalSeconds[slot] ?? 0;
    const remaining = pool.remainingSeconds[slot] ?? 0;
    const progress = total <= 0 ? 1 : Math.min(Math.max(1 - remaining / total, 0), 1);
    const startScale = pool.startScale[slot] ?? 1;
    const endScale = pool.endScale[slot] ?? 1;
    const startAlpha = pool.startAlpha[slot] ?? 1;
    const endAlpha = pool.endAlpha[slot] ?? 0;
    const scale = startScale + (endScale - startScale) * progress;
    const alpha = startAlpha + (endAlpha - startAlpha) * progress;

    if (alpha <= 0 || scale <= 0) {
      continue;
    }

    worldPosition.x = pool.x[slot] ?? 0;
    worldPosition.y = pool.y[slot] ?? 0;
    options.projection.project(projected, worldPosition);
    options.camera.projectedToScreen(screen, projected);

    const command: SpriteRenderCommand = {
      kind: 'sprite',
      assetId,
      screenX: screen.x,
      screenY: screen.y,
      width: baseSize * scale * options.camera.zoom,
      height: baseSize * scale * options.camera.zoom,
      rotation: 0,
      alpha,
      depth: options.projection.depth(worldPosition, pool.layer[slot] ?? 0)
    };
    commands.push(command);
  }

  commands.sort(compareRenderCommands);
  return commands;
}
