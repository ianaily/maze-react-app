import type { EntityId } from '../../../engine-core/src/index.js';
import type { SceneTweenDocumentV1 } from '../scene-schema.js';
import type { SceneRuntime } from '../scene-runtime.js';

export const serializeTween = (runtime: SceneRuntime, entity: EntityId): SceneTweenDocumentV1 | undefined => {
  if (!runtime.tweens.has(entity)) {
    return undefined;
  }

  const tweens = runtime.tweens;
  return {
    target: {
      component: tweens.targetComponent[entity] ?? 'transform',
      field: tweens.targetField[entity] ?? 'x'
    },
    from: tweens.from[entity] ?? 0,
    to: tweens.to[entity] ?? 0,
    durationSeconds: tweens.durationSeconds[entity] ?? 0,
    easing: tweens.easing[entity] ?? 'linear',
    delaySeconds: tweens.delaySeconds[entity] ?? 0,
    repeat: tweens.repeat[entity] ?? 'once'
  };
};
