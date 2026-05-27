import { toEntityId, type World } from '../../engine-core/src/index.js';
import { createVec2 } from '../../engine-math/src/index.js';
import type { PhysicsWorld, CollisionPair } from '../../engine-physics/src/index.js';
import type { Camera2D, Projection } from '../../engine-render/src/index.js';
import type { DebugDrawCommand } from './debug-command.js';

export interface DebugProjectionOptions {
  readonly camera: Camera2D;
  readonly projection: Projection;
}

export interface ColliderOverlayOptions extends DebugProjectionOptions {
  readonly physics: PhysicsWorld;
  readonly out?: DebugDrawCommand[];
}

export interface ContactNormalOverlayOptions extends DebugProjectionOptions {
  readonly contacts: readonly CollisionPair[];
  readonly physics: PhysicsWorld;
  readonly out?: DebugDrawCommand[];
}

export interface VelocityOverlayOptions extends DebugProjectionOptions {
  readonly physics: PhysicsWorld;
  readonly world: World;
  readonly scale?: number;
  readonly out?: DebugDrawCommand[];
}

export function buildColliderOverlayCommands(options: ColliderOverlayOptions): DebugDrawCommand[] {
  const commands = clearOut(options.out);
  const projected = createVec2();
  const screen = createVec2();
  const center = createVec2();
  const colliders = options.physics.colliders;

  for (let entity = 0; entity < colliders.present.length; entity += 1) {
    if (colliders.present[entity] !== 1) {
      continue;
    }

    center.x = ((colliders.minX[entity] ?? 0) + (colliders.maxX[entity] ?? 0)) * 0.5;
    center.y = ((colliders.minY[entity] ?? 0) + (colliders.maxY[entity] ?? 0)) * 0.5;
    options.projection.project(projected, center);
    options.camera.projectedToScreen(screen, projected);

    const width = (colliders.width[entity] ?? 1) * options.camera.zoom;
    const height = (colliders.height[entity] ?? 1) * options.camera.zoom;

    commands.push({
      kind: 'rect',
      x: screen.x - width * 0.5,
      y: screen.y - height * 0.5,
      width,
      height,
      strokeStyle: '#f5c542',
      lineWidth: 1
    });
  }

  return commands;
}

export function buildContactNormalOverlayCommands(options: ContactNormalOverlayOptions): DebugDrawCommand[] {
  const commands = clearOut(options.out);
  const projector = createProjector(options);

  for (const contact of options.contacts) {
    const leftCenter = colliderCenter(options.physics, contact.left);
    const rightCenter = colliderCenter(options.physics, contact.right);
    const start = createVec2((leftCenter.x + rightCenter.x) * 0.5, (leftCenter.y + rightCenter.y) * 0.5);
    const end = createVec2(start.x + contact.normalX * 10, start.y + contact.normalY * 10);
    const screenStart = projector(start);
    const screenEnd = projector(end);

    commands.push({
      kind: 'line',
      startX: screenStart.x,
      startY: screenStart.y,
      endX: screenEnd.x,
      endY: screenEnd.y,
      strokeStyle: '#ff6b6b',
      lineWidth: 2
    });
    commands.push({
      kind: 'circle',
      x: screenEnd.x,
      y: screenEnd.y,
      radius: 3,
      strokeStyle: '#ff6b6b',
      fillStyle: '#ff6b6b',
      lineWidth: 2
    });
  }

  return commands;
}

export function buildVelocityOverlayCommands(options: VelocityOverlayOptions): DebugDrawCommand[] {
  const commands = clearOut(options.out);
  const projector = createProjector(options);
  const scale = options.scale ?? 0.12;

  for (let entity = 0; entity < options.physics.rigidbodies.present.length; entity += 1) {
    const entityId = toEntityId(entity);

    if (options.physics.rigidbodies.present[entity] !== 1 || !options.world.transforms.has(entityId)) {
      continue;
    }

    const start = createVec2(valueAt(options.world.transforms.x, entity), valueAt(options.world.transforms.y, entity));
    const end = createVec2(
      start.x + (options.physics.rigidbodies.velocityX[entity] ?? 0) * scale,
      start.y + (options.physics.rigidbodies.velocityY[entity] ?? 0) * scale
    );
    const screenStart = projector(start);
    const screenEnd = projector(end);

    commands.push({
      kind: 'line',
      startX: screenStart.x,
      startY: screenStart.y,
      endX: screenEnd.x,
      endY: screenEnd.y,
      strokeStyle: '#76e4a8',
      lineWidth: 2
    });
  }

  return commands;
}

function clearOut(out: DebugDrawCommand[] | undefined): DebugDrawCommand[] {
  const commands = out ?? [];
  commands.length = 0;
  return commands;
}

function createProjector(options: DebugProjectionOptions): (point: { readonly x: number; readonly y: number }) => { readonly x: number; readonly y: number } {
  const projected = createVec2();
  const screen = createVec2();

  return (point) => {
    options.projection.project(projected, point);
    options.camera.projectedToScreen(screen, projected);
    return { x: screen.x, y: screen.y };
  };
}

function colliderCenter(physics: PhysicsWorld, entity: number): { readonly x: number; readonly y: number } {
  return {
    x: ((physics.colliders.minX[entity] ?? 0) + (physics.colliders.maxX[entity] ?? 0)) * 0.5,
    y: ((physics.colliders.minY[entity] ?? 0) + (physics.colliders.maxY[entity] ?? 0)) * 0.5
  };
}

function valueAt(values: readonly number[], index: number): number {
  const value = values[index];

  if (value === undefined) {
    throw new Error(`Expected numeric value at index ${index}.`);
  }

  return value;
}
