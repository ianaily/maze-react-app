import type { EntityId } from '../../../engine-core/src/index.js';
import type { SceneTweenDocumentV1 } from '../scene-schema.js';
import type { SceneRuntime } from '../scene-runtime.js';

export const loadTween = (
  runtime: SceneRuntime,
  entity: EntityId,
  document: SceneTweenDocumentV1
): void => {
  runtime.tweens.add(entity, {
    targetComponent: document.target.component,
    targetField: document.target.field,
    from: document.from,
    to: document.to,
    durationSeconds: document.durationSeconds,
    easing: document.easing,
    ...(document.delaySeconds !== undefined ? { delaySeconds: document.delaySeconds } : {}),
    ...(document.repeat !== undefined ? { repeat: document.repeat } : {}),
    ...(document.autoplay !== undefined ? { autoplay: document.autoplay } : {})
  });
};
