import type { EntityId } from '../../../engine-core/src/index.js';
import type { SceneCameraDocumentV1 } from '../scene-schema.js';
import type { SceneRuntime } from '../scene-runtime.js';

export const loadCamera = (
  runtime: SceneRuntime,
  entity: EntityId,
  document: SceneCameraDocumentV1
): void => {
  runtime.cameras.add(entity, {
    ...(document.smoothingTimeSeconds !== undefined
      ? { smoothingTimeSeconds: document.smoothingTimeSeconds }
      : {}),
    ...(document.deadZoneWidth !== undefined ? { deadZoneWidth: document.deadZoneWidth } : {}),
    ...(document.deadZoneHeight !== undefined ? { deadZoneHeight: document.deadZoneHeight } : {}),
    ...(document.zoom !== undefined ? { zoom: document.zoom } : {}),
    ...(document.bounds !== undefined
      ? {
          bounds: {
            minX: document.bounds.minX,
            minY: document.bounds.minY,
            maxX: document.bounds.maxX,
            maxY: document.bounds.maxY
          }
        }
      : {})
  });
};
