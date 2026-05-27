import type { EntityId } from '../../../engine-core/src/index.js';
import type { SceneAudioDocumentV1 } from '../scene-schema.js';
import type { SceneRuntime } from '../scene-runtime.js';

export const loadAudio = (
  runtime: SceneRuntime,
  entity: EntityId,
  document: SceneAudioDocumentV1
): void => {
  runtime.audio.add(entity, document.clipId, {
    ...(document.autoplay !== undefined ? { autoplay: document.autoplay } : {}),
    ...(document.loop !== undefined ? { loop: document.loop } : {}),
    ...(document.volume !== undefined ? { volume: document.volume } : {}),
    ...(document.channel !== undefined ? { channel: document.channel } : {})
  });
};
