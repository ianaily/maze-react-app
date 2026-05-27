import { toEntityId, type EntityId, type World } from '../../engine-core/src/index.js';
import { ColliderStore } from './collider-store.js';
import { RigidbodyStore, RigidbodyType } from './rigidbody-store.js';
import { SpatialHash } from './spatial-hash.js';

export interface PhysicsWorldOptions {
  readonly gravityX?: number;
  readonly gravityY?: number;
  readonly cellSize?: number;
}

export interface CollisionPair {
  readonly left: EntityId;
  readonly right: EntityId;
  readonly trigger: boolean;
  readonly normalX: number;
  readonly normalY: number;
  readonly penetration: number;
}

export class PhysicsWorld {
  readonly rigidbodies = new RigidbodyStore();
  readonly colliders = new ColliderStore();
  readonly contacts: CollisionPair[] = [];
  readonly solvedContacts: CollisionPair[] = [];
  readonly collisions = this.contacts;

  gravityX: number;
  gravityY: number;

  private readonly spatialHash: SpatialHash;
  private readonly queryBuffer: EntityId[] = [];

  constructor(options: PhysicsWorldOptions = {}) {
    this.gravityX = options.gravityX ?? 0;
    this.gravityY = options.gravityY ?? 0;
    this.spatialHash = new SpatialHash(options.cellSize ?? 64);
  }

  step(world: World, deltaSeconds: number): void {
    this.integrate(world, deltaSeconds);
    this.syncColliderBounds(world);
    this.collectCollisions();
    this.resolveCollisions(world);
  }

  removeEntity(entity: EntityId): void {
    this.rigidbodies.remove(entity);
    this.colliders.remove(entity);
  }

  writeCurrentOverlaps(out: CollisionPair[] = []): CollisionPair[] {
    const colliders = this.colliders;

    out.length = 0;

    for (let left = 0; left < colliders.present.length; left += 1) {
      if (colliders.present[left] !== 1) {
        continue;
      }

      const leftEntity = toEntityId(left);

      for (let right = left + 1; right < colliders.present.length; right += 1) {
        const rightEntity = toEntityId(right);

        if (colliders.present[right] !== 1 || !canCollide(leftEntity, rightEntity, colliders)) {
          continue;
        }

        const contact = getAabbContact(leftEntity, rightEntity, colliders);

        if (contact !== null && contact.penetration > 0) {
          out.push({
            left: leftEntity,
            right: rightEntity,
            trigger: colliders.isTrigger[left] === 1 || colliders.isTrigger[right] === 1,
            normalX: contact.normalX,
            normalY: contact.normalY,
            penetration: contact.penetration
          });
        }
      }
    }

    return out;
  }

  private integrate(world: World, deltaSeconds: number): void {
    const rigidbodies = this.rigidbodies;

    for (let entity = 0; entity < rigidbodies.present.length; entity += 1) {
      if (rigidbodies.present[entity] !== 1 || rigidbodies.type[entity] !== RigidbodyType.Dynamic) {
        continue;
      }

      const entityId = toEntityId(entity);

      if (!world.transforms.has(entityId)) {
        continue;
      }

      const gravityScale = rigidbodies.gravityScale[entity] ?? 1;
      const nextVelocityX = (rigidbodies.velocityX[entity] ?? 0) + this.gravityX * gravityScale * deltaSeconds;
      const nextVelocityY = (rigidbodies.velocityY[entity] ?? 0) + this.gravityY * gravityScale * deltaSeconds;

      rigidbodies.velocityX[entity] = nextVelocityX;
      rigidbodies.velocityY[entity] = nextVelocityY;
      world.transforms.x[entity] = (world.transforms.x[entity] ?? 0) + nextVelocityX * deltaSeconds;
      world.transforms.y[entity] = (world.transforms.y[entity] ?? 0) + nextVelocityY * deltaSeconds;
    }
  }

  private syncColliderBounds(world: World): void {
    const colliders = this.colliders;

    for (let entity = 0; entity < colliders.present.length; entity += 1) {
      if (colliders.present[entity] !== 1) {
        continue;
      }

      const entityId = toEntityId(entity);

      if (!world.transforms.has(entityId)) {
        continue;
      }

      this.syncColliderBoundsForEntity(world, entityId);
    }
  }

  private collectCollisions(): void {
    const colliders = this.colliders;

    this.contacts.length = 0;
    this.solvedContacts.length = 0;
    this.spatialHash.rebuild(colliders);

    for (let entity = 0; entity < colliders.present.length; entity += 1) {
      if (colliders.present[entity] !== 1) {
        continue;
      }

      const entityId = toEntityId(entity);
      const candidates = this.spatialHash.query(entityId, colliders, this.queryBuffer);

      for (const candidate of candidates) {
        if (candidate <= entityId || !colliders.has(candidate) || !canCollide(entityId, candidate, colliders)) {
          continue;
        }

        const contact = getAabbContact(entityId, candidate, colliders);

        if (contact !== null) {
          this.contacts.push({
            left: entityId,
            right: candidate,
            trigger: colliders.isTrigger[entity] === 1 || colliders.isTrigger[candidate] === 1,
            normalX: contact.normalX,
            normalY: contact.normalY,
            penetration: contact.penetration
          });
        }
      }
    }
  }

  private resolveCollisions(world: World): void {
    for (const collision of this.contacts) {
      if (collision.trigger) {
        continue;
      }

      if (this.resolveCollision(world, collision)) {
        this.solvedContacts.push(collision);
      }
    }
  }

  private resolveCollision(world: World, collision: CollisionPair): boolean {
    const leftBodyType = this.getBodyType(collision.left);
    const rightBodyType = this.getBodyType(collision.right);
    const leftDynamic = leftBodyType === RigidbodyType.Dynamic;
    const rightDynamic = rightBodyType === RigidbodyType.Dynamic;

    if (!leftDynamic && !rightDynamic) {
      return false;
    }

    if (leftDynamic && rightDynamic) {
      this.moveBody(world, collision.left, -collision.normalX * collision.penetration * 0.5, -collision.normalY * collision.penetration * 0.5);
      this.moveBody(world, collision.right, collision.normalX * collision.penetration * 0.5, collision.normalY * collision.penetration * 0.5);
      this.zeroVelocityIntoNormal(collision.left, collision.normalX, collision.normalY);
      this.zeroVelocityIntoNormal(collision.right, -collision.normalX, -collision.normalY);
      return true;
    }

    if (leftDynamic) {
      this.moveBody(world, collision.left, -collision.normalX * collision.penetration, -collision.normalY * collision.penetration);
      this.zeroVelocityIntoNormal(collision.left, collision.normalX, collision.normalY);
      return true;
    }

    if (rightDynamic) {
      this.moveBody(world, collision.right, collision.normalX * collision.penetration, collision.normalY * collision.penetration);
      this.zeroVelocityIntoNormal(collision.right, -collision.normalX, -collision.normalY);
      return true;
    }

    return false;
  }

  private getBodyType(entity: EntityId): RigidbodyType {
    if (!this.rigidbodies.has(entity)) {
      return RigidbodyType.Static;
    }

    return (this.rigidbodies.type[entity] ?? RigidbodyType.Dynamic) as RigidbodyType;
  }

  private moveBody(world: World, entity: EntityId, deltaX: number, deltaY: number): void {
    if (!world.transforms.has(entity)) {
      return;
    }

    world.transforms.x[entity] = (world.transforms.x[entity] ?? 0) + deltaX;
    world.transforms.y[entity] = (world.transforms.y[entity] ?? 0) + deltaY;
    this.syncColliderBoundsForEntity(world, entity);
  }

  private zeroVelocityIntoNormal(entity: EntityId, normalX: number, normalY: number): void {
    if (!this.rigidbodies.has(entity)) {
      return;
    }

    if (normalX !== 0 && (this.rigidbodies.velocityX[entity] ?? 0) * normalX > 0) {
      this.rigidbodies.velocityX[entity] = 0;
    }

    if (normalY !== 0 && (this.rigidbodies.velocityY[entity] ?? 0) * normalY > 0) {
      this.rigidbodies.velocityY[entity] = 0;
    }
  }

  private syncColliderBoundsForEntity(world: World, entity: EntityId): void {
    const colliders = this.colliders;

    if (!colliders.has(entity) || !world.transforms.has(entity)) {
      return;
    }

    const width = colliders.width[entity] ?? 1;
    const height = colliders.height[entity] ?? 1;
    const halfWidth = width * 0.5;
    const halfHeight = height * 0.5;
    const centerX = (world.transforms.x[entity] ?? 0) + (colliders.offsetX[entity] ?? 0);
    const centerY = (world.transforms.y[entity] ?? 0) + (colliders.offsetY[entity] ?? 0);

    colliders.minX[entity] = centerX - halfWidth;
    colliders.minY[entity] = centerY - halfHeight;
    colliders.maxX[entity] = centerX + halfWidth;
    colliders.maxY[entity] = centerY + halfHeight;
  }
}

interface AabbContact {
  readonly normalX: number;
  readonly normalY: number;
  readonly penetration: number;
}

const getAabbContact = (left: EntityId, right: EntityId, colliders: ColliderStore): AabbContact | null => {
  const leftMinX = colliders.minX[left] ?? 0;
  const leftMinY = colliders.minY[left] ?? 0;
  const leftMaxX = colliders.maxX[left] ?? 0;
  const leftMaxY = colliders.maxY[left] ?? 0;
  const rightMinX = colliders.minX[right] ?? 0;
  const rightMinY = colliders.minY[right] ?? 0;
  const rightMaxX = colliders.maxX[right] ?? 0;
  const rightMaxY = colliders.maxY[right] ?? 0;

  if (leftMinX > rightMaxX || leftMaxX < rightMinX || leftMinY > rightMaxY || leftMaxY < rightMinY) {
    return null;
  }

  const overlapX = Math.min(leftMaxX, rightMaxX) - Math.max(leftMinX, rightMinX);
  const overlapY = Math.min(leftMaxY, rightMaxY) - Math.max(leftMinY, rightMinY);
  const leftCenterX = (leftMinX + leftMaxX) * 0.5;
  const leftCenterY = (leftMinY + leftMaxY) * 0.5;
  const rightCenterX = (rightMinX + rightMaxX) * 0.5;
  const rightCenterY = (rightMinY + rightMaxY) * 0.5;

  if (overlapX < overlapY) {
    return {
      normalX: leftCenterX <= rightCenterX ? 1 : -1,
      normalY: 0,
      penetration: overlapX
    };
  }

  return {
    normalX: 0,
    normalY: leftCenterY <= rightCenterY ? 1 : -1,
    penetration: overlapY
  };
};

const canCollide = (left: EntityId, right: EntityId, colliders: ColliderStore): boolean => {
  const leftCategory = colliders.categoryBits[left] ?? 1;
  const leftMask = colliders.maskBits[left] ?? 0xffff_ffff;
  const rightCategory = colliders.categoryBits[right] ?? 1;
  const rightMask = colliders.maskBits[right] ?? 0xffff_ffff;

  return (leftMask & rightCategory) !== 0 && (rightMask & leftCategory) !== 0;
};
