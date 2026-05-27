import type { SceneCameraDocumentV1, SceneDocument } from '../scene-schema.js';

export const validateEntityCamera = (entityId: string, camera: SceneCameraDocumentV1): void => {
  if (camera.smoothingTimeSeconds !== undefined && (!Number.isFinite(camera.smoothingTimeSeconds) || camera.smoothingTimeSeconds < 0)) {
    throw new Error(`Camera smoothingTimeSeconds must be a non-negative finite number for entity: ${entityId}`);
  }

  if (camera.zoom !== undefined && (!Number.isFinite(camera.zoom) || camera.zoom <= 0)) {
    throw new Error(`Camera zoom must be a positive finite number for entity: ${entityId}`);
  }

  if (camera.deadZoneWidth !== undefined && (!Number.isFinite(camera.deadZoneWidth) || camera.deadZoneWidth < 0)) {
    throw new Error(`Camera deadZoneWidth must be a non-negative finite number for entity: ${entityId}`);
  }

  if (camera.deadZoneHeight !== undefined && (!Number.isFinite(camera.deadZoneHeight) || camera.deadZoneHeight < 0)) {
    throw new Error(`Camera deadZoneHeight must be a non-negative finite number for entity: ${entityId}`);
  }

  if (camera.bounds !== undefined) {
    if (camera.bounds.maxX < camera.bounds.minX || camera.bounds.maxY < camera.bounds.minY) {
      throw new Error(`Camera bounds must satisfy max >= min for entity: ${entityId}`);
    }
  }
};

export const validateCameraTargets = (document: SceneDocument, entityIds: ReadonlySet<string>): void => {
  for (const entity of document.entities) {
    if (entity.camera?.targetEntityId !== undefined && !entityIds.has(entity.camera.targetEntityId)) {
      throw new Error(
        `Camera targetEntityId references unknown entity for ${entity.id}: ${entity.camera.targetEntityId}`
      );
    }
  }
};
