import {
  CameraShake,
  CameraSystem,
  type CameraShakeImpulse
} from '../../engine-camera/src/index.js';
import type { Camera2D } from '../../engine-render/src/index.js';
import type { RuntimeSession } from './runtime-session.js';

export interface RuntimeCameraOptions {
  readonly camera: Camera2D;
  readonly shake?: CameraShake;
}

export interface RuntimeCameraBinding {
  readonly camera: Camera2D;
  readonly shake: CameraShake;
  readonly system: CameraSystem;
  triggerShake(impulse: CameraShakeImpulse): void;
}

export function attachRuntimeCamera(
  session: RuntimeSession,
  options: RuntimeCameraOptions
): RuntimeCameraBinding {
  const shake = options.shake ?? new CameraShake();
  const initialCameraEntity = session.runtime.cameraEntityId !== undefined
    ? session.runtime.entityIds.get(session.runtime.cameraEntityId)
    : undefined;
  const system = new CameraSystem({
    camera: options.camera,
    cameras: session.runtime.cameras,
    shake,
    world: session.runtime.world,
    transforms: session.runtime.world.transforms,
    ...(initialCameraEntity !== undefined ? { cameraEntity: initialCameraEntity } : {})
  });
  session.engine.addSystem(system);

  return {
    camera: options.camera,
    shake,
    system,
    triggerShake(impulse): void {
      shake.trigger(impulse);
    }
  };
}
