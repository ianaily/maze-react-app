import { AnimationSystem } from '../../engine-animation/src/index.js';
import { CharacterControllerSystem } from '../../engine-character/src/index.js';
import { Engine, type System } from '../../engine-core/src/index.js';
import { PhysicsSystem } from '../../engine-physics/src/index.js';
import {
  loadScene,
  type SceneDocument,
  type SceneRuntime
} from '../../engine-scene/src/index.js';

export interface RuntimeSessionOptions {
  readonly fixedDeltaSeconds?: number;
  readonly gravityX?: number;
  readonly gravityY?: number;
  readonly extraSystems?: readonly System[];
}

export interface RuntimeSession {
  readonly engine: Engine;
  readonly runtime: SceneRuntime;
}

export function createRuntimeSession(
  scene: SceneDocument,
  options: RuntimeSessionOptions = {}
): RuntimeSession {
  const runtime = loadScene(scene);

  if (options.gravityX !== undefined) {
    runtime.physics.gravityX = options.gravityX;
  }

  if (options.gravityY !== undefined) {
    runtime.physics.gravityY = options.gravityY;
  }

  const systems: System[] = [
    new CharacterControllerSystem({
      controllers: runtime.characterControllers,
      physics: runtime.physics
    }),
    new PhysicsSystem({ physics: runtime.physics }),
    new AnimationSystem({
      library: runtime.animationLibrary,
      animators: runtime.animators
    }),
    ...(options.extraSystems ?? [])
  ];

  const engine = new Engine({
    fixedDeltaSeconds: options.fixedDeltaSeconds ?? 1 / 60,
    world: runtime.world,
    systems
  });

  return { engine, runtime };
}
