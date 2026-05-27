import { CAMERA_TARGET_NONE } from '../../../engine-camera/src/index.js';
import type { EntityId } from '../../../engine-core/src/index.js';
import type { SceneCameraDocumentV1 } from '../scene-schema.js';
import type { SceneRuntime } from '../scene-runtime.js';

export const serializeCamera = (runtime: SceneRuntime, entity: EntityId): SceneCameraDocumentV1 | undefined => {
  if (!runtime.cameras.has(entity)) {
    return undefined;
  }

  const cameras = runtime.cameras;
  const targetEntityNumeric = cameras.targetEntity[entity] ?? CAMERA_TARGET_NONE;
  let targetEntityId: string | undefined;

  if (targetEntityNumeric !== CAMERA_TARGET_NONE) {
    for (const [docId, mappedEntity] of runtime.entityIds) {
      if (mappedEntity === targetEntityNumeric) {
        targetEntityId = docId;
        break;
      }
    }
  }

  return {
    ...(targetEntityId !== undefined ? { targetEntityId } : {}),
    smoothingTimeSeconds: cameras.smoothingTimeSeconds[entity] ?? 0,
    deadZoneWidth: cameras.deadZoneWidth[entity] ?? 0,
    deadZoneHeight: cameras.deadZoneHeight[entity] ?? 0,
    zoom: cameras.zoom[entity] ?? 1,
    ...(cameras.boundsEnabled[entity] === 1
      ? {
          bounds: {
            minX: cameras.boundsMinX[entity] ?? 0,
            minY: cameras.boundsMinY[entity] ?? 0,
            maxX: cameras.boundsMaxX[entity] ?? 0,
            maxY: cameras.boundsMaxY[entity] ?? 0
          }
        }
      : {})
  };
};
