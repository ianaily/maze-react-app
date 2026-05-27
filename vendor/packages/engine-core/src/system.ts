import type { World } from './world.js';

export interface System {
  readonly name: string;
  readonly priority: number;
  fixedUpdate?(world: World, deltaSeconds: number): void;
  update?(world: World, deltaSeconds: number): void;
}
