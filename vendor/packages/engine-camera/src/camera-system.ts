import {
  toEntityId,
  type EntityId,
  type System,
  type World
} from '../../engine-core/src/index.js';
import type { Camera2D } from '../../engine-render/src/index.js';
import { CAMERA_TARGET_NONE, CameraStore } from './camera-store.js';
import { CameraShake } from './camera-shake.js';

export interface CameraSystemOptions {
  readonly camera: Camera2D;
  readonly cameras: CameraStore;
  readonly shake: CameraShake;
  readonly world: World;
  readonly transforms: { readonly x: readonly number[]; readonly y: readonly number[] };
  readonly priority?: number;
  readonly cameraEntity?: EntityId | undefined;
}

interface CameraVelocity {
  vx: number;
  vy: number;
}

const SHAKE_OFFSET = { x: 0, y: 0 };

export class CameraSystem implements System {
  readonly name = 'camera';
  readonly priority: number;

  private readonly camera: Camera2D;
  private readonly cameras: CameraStore;
  private readonly shake: CameraShake;
  private readonly transforms: { readonly x: readonly number[]; readonly y: readonly number[] };
  private readonly velocityByEntity = new Map<EntityId, CameraVelocity>();
  cameraEntity: EntityId | undefined;

  constructor(options: CameraSystemOptions) {
    this.camera = options.camera;
    this.cameras = options.cameras;
    this.shake = options.shake;
    this.transforms = options.transforms;
    this.priority = options.priority ?? 50;
    this.cameraEntity = options.cameraEntity;
  }

  fixedUpdate(world: World, fixedDeltaSeconds: number): void {
    const entity = this.activeCameraEntity(world);

    if (entity === undefined) {
      this.applyShakeOnly(fixedDeltaSeconds);
      return;
    }

    const targetId = this.cameras.targetEntity[entity] ?? CAMERA_TARGET_NONE;
    const desiredZoom = this.cameras.zoom[entity] ?? this.camera.zoom;
    let desiredX = this.camera.x;
    let desiredY = this.camera.y;

    if (targetId !== CAMERA_TARGET_NONE) {
      const targetEntityId = targetId as EntityId;

      if (world.hasEntity(targetEntityId)) {
        desiredX = this.transforms.x[targetEntityId] ?? this.camera.x;
        desiredY = this.transforms.y[targetEntityId] ?? this.camera.y;
      }
    }

    desiredX = this.applyDeadZoneX(entity, desiredX);
    desiredY = this.applyDeadZoneY(entity, desiredY);
    desiredX = this.applyBoundsX(entity, desiredX);
    desiredY = this.applyBoundsY(entity, desiredY);

    this.smoothToTarget(entity, desiredX, desiredY, fixedDeltaSeconds);
    this.camera.zoom = desiredZoom;
    this.applyShake(fixedDeltaSeconds);
  }

  private activeCameraEntity(world: World): EntityId | undefined {
    if (this.cameraEntity !== undefined) {
      if (world.hasEntity(this.cameraEntity) && this.cameras.has(this.cameraEntity)) {
        return this.cameraEntity;
      }

      this.cameraEntity = undefined;
    }

    const present = this.cameras.present;

    for (let index = 0; index < present.length; index += 1) {
      if (present[index] !== 1) {
        continue;
      }

      const entityId = toEntityId(index);

      if (world.hasEntity(entityId)) {
        this.cameraEntity = entityId;
        return entityId;
      }
    }

    return undefined;
  }

  private applyDeadZoneX(entity: EntityId, desiredX: number): number {
    const dzWidth = this.cameras.deadZoneWidth[entity] ?? 0;

    if (dzWidth <= 0) {
      return desiredX;
    }

    const halfWidth = dzWidth * 0.5;
    const cameraX = this.camera.x;

    if (desiredX > cameraX + halfWidth) {
      return desiredX - halfWidth;
    }

    if (desiredX < cameraX - halfWidth) {
      return desiredX + halfWidth;
    }

    return cameraX;
  }

  private applyDeadZoneY(entity: EntityId, desiredY: number): number {
    const dzHeight = this.cameras.deadZoneHeight[entity] ?? 0;

    if (dzHeight <= 0) {
      return desiredY;
    }

    const halfHeight = dzHeight * 0.5;
    const cameraY = this.camera.y;

    if (desiredY > cameraY + halfHeight) {
      return desiredY - halfHeight;
    }

    if (desiredY < cameraY - halfHeight) {
      return desiredY + halfHeight;
    }

    return cameraY;
  }

  private applyBoundsX(entity: EntityId, desiredX: number): number {
    if (this.cameras.boundsEnabled[entity] !== 1) {
      return desiredX;
    }

    const minX = this.cameras.boundsMinX[entity] ?? desiredX;
    const maxX = this.cameras.boundsMaxX[entity] ?? desiredX;
    return Math.min(Math.max(desiredX, minX), maxX);
  }

  private applyBoundsY(entity: EntityId, desiredY: number): number {
    if (this.cameras.boundsEnabled[entity] !== 1) {
      return desiredY;
    }

    const minY = this.cameras.boundsMinY[entity] ?? desiredY;
    const maxY = this.cameras.boundsMaxY[entity] ?? desiredY;
    return Math.min(Math.max(desiredY, minY), maxY);
  }

  private smoothToTarget(entity: EntityId, targetX: number, targetY: number, deltaSeconds: number): void {
    const timeConstant = this.cameras.smoothingTimeSeconds[entity] ?? 0;

    if (timeConstant <= 0 || deltaSeconds <= 0) {
      this.camera.x = targetX;
      this.camera.y = targetY;
      const velocity = this.velocityByEntity.get(entity);

      if (velocity !== undefined) {
        velocity.vx = 0;
        velocity.vy = 0;
      }

      return;
    }

    let velocity = this.velocityByEntity.get(entity);

    if (velocity === undefined) {
      velocity = { vx: 0, vy: 0 };
      this.velocityByEntity.set(entity, velocity);
    }

    const omega = 2 / timeConstant;
    const x = omega * deltaSeconds;
    const exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
    const changeX = this.camera.x - targetX;
    const changeY = this.camera.y - targetY;
    const tempX = (velocity.vx + omega * changeX) * deltaSeconds;
    const tempY = (velocity.vy + omega * changeY) * deltaSeconds;
    velocity.vx = (velocity.vx - omega * tempX) * exp;
    velocity.vy = (velocity.vy - omega * tempY) * exp;
    this.camera.x = targetX + (changeX + tempX) * exp;
    this.camera.y = targetY + (changeY + tempY) * exp;
  }

  private applyShake(deltaSeconds: number): void {
    if (!this.shake.isActive()) {
      return;
    }

    this.shake.step(deltaSeconds, SHAKE_OFFSET);
    this.camera.x += SHAKE_OFFSET.x;
    this.camera.y += SHAKE_OFFSET.y;
  }

  private applyShakeOnly(deltaSeconds: number): void {
    if (!this.shake.isActive()) {
      return;
    }

    this.shake.step(deltaSeconds, SHAKE_OFFSET);
    this.camera.x += SHAKE_OFFSET.x;
    this.camera.y += SHAKE_OFFSET.y;
  }
}
