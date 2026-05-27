import { toEntityId, type EntityId } from '../../engine-core/src/index.js';
import {
  TweenSystem,
  type TweenTargetComponent,
  type TweenTargetField,
  type TweenTargetWriter
} from '../../engine-tween/src/index.js';
import type { SceneRuntime } from '../../engine-scene/src/index.js';
import type { RuntimeSession } from './runtime-session.js';

export interface RuntimeTweenBinding {
  readonly system: TweenSystem;
  trigger(entityId: string): void;
  pause(entityId: string): void;
  resume(entityId: string): void;
  stop(entityId: string): void;
}

class SceneRuntimeTweenWriter implements TweenTargetWriter {
  constructor(private readonly runtime: SceneRuntime) {}

  hasTarget(entity: EntityId, component: TweenTargetComponent): boolean {
    if (component === 'transform') {
      return this.runtime.world.transforms.has(entity);
    }

    if (component === 'sprite') {
      return this.runtime.sprites.has(entity);
    }

    return false;
  }

  writeField(entity: EntityId, component: TweenTargetComponent, field: TweenTargetField, value: number): void {
    if (component === 'transform') {
      switch (field) {
        case 'x':
          this.runtime.world.transforms.x[entity] = value;
          return;
        case 'y':
          this.runtime.world.transforms.y[entity] = value;
          return;
        case 'rotation':
          this.runtime.world.transforms.rotation[entity] = value;
          return;
        case 'scaleX':
          this.runtime.world.transforms.scaleX[entity] = value;
          return;
        case 'scaleY':
          this.runtime.world.transforms.scaleY[entity] = value;
          return;
        default:
          return;
      }
    }

    if (component === 'sprite') {
      switch (field) {
        case 'alpha':
          this.runtime.sprites.alpha[entity] = value;
          return;
        case 'offsetX':
          this.runtime.sprites.offsetX[entity] = value;
          return;
        case 'offsetY':
          this.runtime.sprites.offsetY[entity] = value;
          return;
        default:
          return;
      }
    }
  }
}

export function attachRuntimeTween(session: RuntimeSession): RuntimeTweenBinding {
  const writer = new SceneRuntimeTweenWriter(session.runtime);
  const system = new TweenSystem({
    tweens: session.runtime.tweens,
    targets: writer
  });
  session.engine.addSystem(system);

  const resolve = (entityId: string): EntityId | undefined => session.runtime.entityIds.get(entityId);

  return {
    system,
    trigger(entityId): void {
      const entity = resolve(entityId);

      if (entity !== undefined) {
        session.runtime.tweens.trigger(entity);
      }
    },
    pause(entityId): void {
      const entity = resolve(entityId);

      if (entity !== undefined) {
        session.runtime.tweens.pause(entity);
      }
    },
    resume(entityId): void {
      const entity = resolve(entityId);

      if (entity !== undefined) {
        session.runtime.tweens.resume(entity);
      }
    },
    stop(entityId): void {
      const entity = resolve(entityId);

      if (entity !== undefined) {
        session.runtime.tweens.stop(entity);
      }
    }
  };
}

void toEntityId;
