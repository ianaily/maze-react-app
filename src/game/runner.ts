import {
  attachRuntimeCamera,
  attachRuntimeInput,
  createRuntimeLoop,
  createRuntimeSession,
  type RuntimeLoop,
  type RuntimeSession,
} from 'engine-runtime';
import {
  Camera2D,
  buildSpriteRenderCommands,
  compareRenderCommands,
  createProjectionForView,
  type Projection,
  type RenderCommand,
} from 'engine-render';
import { CanvasRenderer } from 'engine-render-canvas';
import { buildTilemapRenderCommands } from 'engine-tilemap';
import { toEntityId, type EntityId } from 'engine-core';
import { Maze } from 'src/types/maze';
import { mazeToScene, type SceneSpawnRefs } from './mazeToScene';
import { buildMazeAssets } from './assets';
import { ASSET_HERO_LEFT, ASSET_HERO_RIGHT, TILE_SIZE, VISIBLE_TILES } from './const';

export interface GameRunnerStats {
  readonly elapsedMs: number;
  readonly coinsCollected: number;
  readonly totalCoins: number;
}

export interface GameRunnerOptions {
  readonly canvas: HTMLCanvasElement;
  readonly maze: Maze;
  readonly onWin: () => void;
  readonly onStats?: (stats: GameRunnerStats) => void;
}

export interface GameRunner {
  dispose(): void;
}

export const startGameRunner = async (options: GameRunnerOptions): Promise<GameRunner> => {
  const { canvas, maze, onWin, onStats } = options;
  const context = canvas.getContext('2d');

  if (context === null) {
    throw new Error('2D canvas context unavailable.');
  }

  const { scene, refs } = mazeToScene(maze);
  const session: RuntimeSession = createRuntimeSession(scene, { gravityX: 0, gravityY: 0 });

  const assets = await buildMazeAssets();
  const renderer = new CanvasRenderer({ context, assets });
  const input = attachRuntimeInput();
  const projection: Projection = createProjectionForView(scene.view);
  const mazeWorldWidth = maze.size.width * TILE_SIZE;
  const mazeWorldHeight = maze.size.height * TILE_SIZE;
  const camera = new Camera2D({
    x: mazeWorldWidth / 2,
    y: mazeWorldHeight / 2,
    zoom: 1,
    viewportWidth: canvas.width,
    viewportHeight: canvas.height,
  });
  attachRuntimeCamera(session, { camera });

  const playCameraEntity = session.runtime.entityIds.get('play-camera');
  const targetVisibleWorld = VISIBLE_TILES * TILE_SIZE;

  const applyZoom = (): void => {
    const shorterAxis = Math.min(canvas.width, canvas.height);
    const zoom = Math.max(1, Math.floor(shorterAxis / targetVisibleWorld));
    camera.zoom = zoom;
    if (playCameraEntity !== undefined) {
      session.runtime.cameras.zoom[playCameraEntity] = zoom;
    }
  };

  const heroEntity = session.runtime.entityIds.get('hero');
  const exitEntity = session.runtime.entityIds.get('exit-marker');
  const liveCoins = new Set<EntityId>(resolveCoinEntities(session, refs));

  const sprites = session.runtime.sprites;
  let won = false;
  const startedAt = performance.now();
  let coinsCollected = 0;
  const totalCoins = liveCoins.size;
  let lastStatsEmittedAt = 0;

  const updateHeroFacing = (): void => {
    if (heroEntity === undefined) {
      return;
    }
    const vx = session.runtime.physics.rigidbodies.velocityX[heroEntity] ?? 0;
    if (vx > 0.1) {
      sprites.assetId[heroEntity] = ASSET_HERO_RIGHT;
    } else if (vx < -0.1) {
      sprites.assetId[heroEntity] = ASSET_HERO_LEFT;
    }
  };

  const detectInteractions = (): void => {
    if (heroEntity === undefined) {
      return;
    }
    const heroId: EntityId = heroEntity;
    const exitId = exitEntity;

    for (const contact of session.runtime.physics.contacts) {
      const other =
        contact.left === heroId ? contact.right : contact.right === heroId ? contact.left : null;
      if (other === null) {
        continue;
      }

      if (!won && exitId !== undefined && other === exitId) {
        won = true;
        onWin();
        continue;
      }

      if (liveCoins.has(other as EntityId)) {
        liveCoins.delete(other as EntityId);
        coinsCollected += 1;
        session.runtime.world.destroyEntity(other as EntityId);
      }
    }
  };

  const emitStats = (now: number): void => {
    if (!onStats) {
      return;
    }
    if (now - lastStatsEmittedAt < 100) {
      return;
    }
    lastStatsEmittedAt = now;
    onStats({
      elapsedMs: now - startedAt,
      coinsCollected,
      totalCoins,
    });
  };

  const resize = (): void => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(1, Math.floor(rect.width * dpr));
    const height = Math.max(1, Math.floor(rect.height * dpr));
    if (canvas.width !== width) {
      canvas.width = width;
    }
    if (canvas.height !== height) {
      canvas.height = height;
    }
    camera.viewportWidth = canvas.width;
    camera.viewportHeight = canvas.height;
    applyZoom();
  };

  resize();
  const onResize = (): void => resize();
  window.addEventListener('resize', onResize);

  const resolveLayer = (entity: number): number => {
    const layerId = session.runtime.entityLayers.get(toEntityId(entity));
    return session.runtime.layers.find((layer) => layer.id === layerId)?.order ?? 0;
  };
  const resolveOrder = (entity: number): number =>
    session.runtime.entityOrders.get(toEntityId(entity)) ?? 0;

  const loop: RuntimeLoop = createRuntimeLoop(session, {
    onTick(): void {
      input.applyTo(session);
      input.endFrame();
      updateHeroFacing();
      detectInteractions();
      emitStats(performance.now());
    },
    onRender(): void {
      const cx = camera.x;
      const cy = camera.y;
      camera.x = Math.round(cx * camera.zoom) / camera.zoom;
      camera.y = Math.round(cy * camera.zoom) / camera.zoom;

      const tilemapCommands = buildTilemapRenderCommands({
        world: session.runtime.world,
        tilemaps: session.runtime.tilemaps,
        catalog: session.runtime.assets,
        projection,
        camera,
        layerOf: resolveLayer,
        orderOf: resolveOrder,
      });

      const spriteCommands = buildSpriteRenderCommands({
        world: session.runtime.world,
        sprites: session.runtime.sprites,
        projection,
        camera,
        layerOf: resolveLayer,
        orderOf: resolveOrder,
      });

      const commands: RenderCommand[] = [...tilemapCommands, ...spriteCommands].sort(
        compareRenderCommands,
      );

      context.fillStyle = '#0e1014';
      context.fillRect(0, 0, canvas.width, canvas.height);
      renderer.beginFrame({ width: canvas.width, height: canvas.height, commands });

      for (const command of commands) {
        renderer.render(command);
      }

      renderer.endFrame({ width: canvas.width, height: canvas.height, commands });

      camera.x = cx;
      camera.y = cy;
    },
  });

  loop.start();

  return {
    dispose(): void {
      loop.stop();
      input.dispose();
      window.removeEventListener('resize', onResize);
    },
  };
};

const resolveCoinEntities = (session: RuntimeSession, refs: SceneSpawnRefs): EntityId[] => {
  const entities: EntityId[] = [];
  for (const id of refs.coinIds) {
    const entity = session.runtime.entityIds.get(id);
    if (entity !== undefined) {
      entities.push(entity);
    }
  }
  return entities;
};
