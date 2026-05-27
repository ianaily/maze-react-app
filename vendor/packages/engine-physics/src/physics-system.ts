import type { System, World } from '../../engine-core/src/index.js';
import type { PhysicsWorld } from './physics-world.js';

export interface PhysicsSystemOptions {
  readonly physics: PhysicsWorld;
  readonly priority?: number;
}

export class PhysicsSystem implements System {
  readonly name = 'physics';
  readonly priority: number;

  private readonly physics: PhysicsWorld;

  constructor(options: PhysicsSystemOptions) {
    this.physics = options.physics;
    this.priority = options.priority ?? 0;
  }

  fixedUpdate(world: World, deltaSeconds: number): void {
    this.physics.step(world, deltaSeconds);
  }
}
