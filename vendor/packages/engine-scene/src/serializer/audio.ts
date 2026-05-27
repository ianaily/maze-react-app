import type { EntityId } from '../../../engine-core/src/index.js';
import type { SceneAudioDocumentV1 } from '../scene-schema.js';
import type { SceneRuntime } from '../scene-runtime.js';

export const serializeAudio = (runtime: SceneRuntime, entity: EntityId): SceneAudioDocumentV1 | undefined => {
  if (!runtime.audio.has(entity)) {
    return undefined;
  }

  const channel = runtime.audio.channelOverride[entity];

  return {
    clipId: runtime.audio.clipId[entity] ?? '',
    autoplay: runtime.audio.autoplay[entity] === 1,
    loop: runtime.audio.loop[entity] === 1,
    volume: runtime.audio.volume[entity] ?? 1,
    ...(channel !== undefined ? { channel } : {})
  };
};
