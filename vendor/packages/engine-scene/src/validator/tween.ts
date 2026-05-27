import { isSupportedTarget, type EasingName } from '../../../engine-tween/src/index.js';
import type { SceneTweenDocumentV1 } from '../scene-schema.js';

const SUPPORTED_EASINGS: ReadonlySet<EasingName> = new Set([
  'linear',
  'ease-in-quad',
  'ease-out-quad',
  'ease-in-out-quad',
  'ease-in-cubic',
  'ease-out-cubic',
  'ease-in-out-cubic',
  'ease-in-elastic',
  'ease-out-elastic',
  'ease-in-bounce',
  'ease-out-bounce'
]);

const SUPPORTED_REPEAT = new Set(['once', 'loop', 'ping-pong']);

export const validateEntityTween = (entityId: string, tween: SceneTweenDocumentV1): void => {
  if (!Number.isFinite(tween.durationSeconds) || tween.durationSeconds < 0) {
    throw new Error(`Tween durationSeconds must be a non-negative finite number for entity: ${entityId}`);
  }

  if (tween.delaySeconds !== undefined && (!Number.isFinite(tween.delaySeconds) || tween.delaySeconds < 0)) {
    throw new Error(`Tween delaySeconds must be a non-negative finite number for entity: ${entityId}`);
  }

  if (!Number.isFinite(tween.from) || !Number.isFinite(tween.to)) {
    throw new Error(`Tween from/to must be finite numbers for entity: ${entityId}`);
  }

  if (!SUPPORTED_EASINGS.has(tween.easing)) {
    throw new Error(`Tween easing "${tween.easing}" is not supported for entity: ${entityId}`);
  }

  if (tween.repeat !== undefined && !SUPPORTED_REPEAT.has(tween.repeat)) {
    throw new Error(`Tween repeat mode "${tween.repeat}" is not supported for entity: ${entityId}`);
  }

  if (!isSupportedTarget(tween.target.component, tween.target.field)) {
    throw new Error(
      `Tween target ${tween.target.component}.${tween.target.field} is not supported for entity: ${entityId}`
    );
  }
};
