import { toEntityId, type EntityId, type System, type World } from '../../engine-core/src/index.js';
import type { PhysicsWorld } from '../../engine-physics/src/index.js';
import { CharacterControllerMode, type CharacterControllerStore } from './character-controller-store.js';

export interface CharacterControllerSystemOptions {
  readonly controllers: CharacterControllerStore;
  readonly physics: PhysicsWorld;
  readonly priority?: number;
}

export class CharacterControllerSystem implements System {
  readonly name = 'character-controller';
  readonly priority: number;

  private readonly controllers: CharacterControllerStore;
  private readonly physics: PhysicsWorld;

  constructor(options: CharacterControllerSystemOptions) {
    this.controllers = options.controllers;
    this.physics = options.physics;
    this.priority = options.priority ?? -100;
  }

  fixedUpdate(world: World): void {
    this.updateGrounded();

    for (let entity = 0; entity < this.controllers.present.length; entity += 1) {
      const entityId = toEntityId(entity);

      if (this.controllers.present[entity] !== 1 || !world.hasEntity(entityId) || !this.physics.rigidbodies.has(entityId)) {
        continue;
      }

      const desiredMoveX = clamp(this.controllers.desiredMoveX[entity] ?? 0, -1, 1);
      const desiredMoveY = clamp(this.controllers.desiredMoveY[entity] ?? 0, -1, 1);
      const maxSpeed = this.controllers.maxSpeed[entity] ?? 0;
      const mode = this.controllers.mode[entity] ?? CharacterControllerMode.Platformer;

      if (mode === CharacterControllerMode.TopDown) {
        this.physics.rigidbodies.velocityX[entity] = desiredMoveX * maxSpeed;
        this.physics.rigidbodies.velocityY[entity] = desiredMoveY * maxSpeed;
        this.controllers.jumpRequested[entity] = 0;
        continue;
      }

      this.physics.rigidbodies.velocityX[entity] = desiredMoveX * maxSpeed;

      if (this.controllers.jumpRequested[entity] === 1 && this.controllers.grounded[entity] === 1) {
        this.physics.rigidbodies.velocityY[entity] = -(this.controllers.jumpSpeed[entity] ?? 0);
        this.controllers.grounded[entity] = 0;
      }

      this.controllers.jumpRequested[entity] = 0;
    }
  }

  private updateGrounded(): void {
    for (let entity = 0; entity < this.controllers.grounded.length; entity += 1) {
      this.controllers.grounded[entity] = 0;
    }

    for (const contact of this.physics.solvedContacts) {
      const grounded = groundedEntityFromContact(contact.left, contact.right, contact.normalY);

      if (grounded !== undefined && this.controllers.has(grounded)) {
        this.controllers.grounded[grounded] = 1;
      }
    }
  }
}

const groundedEntityFromContact = (left: EntityId, right: EntityId, normalY: number): EntityId | undefined => {
  if (normalY < 0) {
    return right;
  }

  if (normalY > 0) {
    return left;
  }

  return undefined;
};

const clamp = (value: number, min: number, max: number): number => Math.min(Math.max(value, min), max);
