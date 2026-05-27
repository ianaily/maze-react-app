import { resolveAssetReference, type AssetCatalogDocument } from '../../../engine-asset/src/index.js';
import type { SceneAudioDocumentV1 } from '../scene-schema.js';

export const validateEntityAudio = (
  entityId: string,
  audio: SceneAudioDocumentV1,
  assets: AssetCatalogDocument | undefined
): void => {
  if (typeof audio.clipId !== 'string' || audio.clipId.length === 0) {
    throw new Error(`Audio clip id must not be empty for entity: ${entityId}`);
  }

  if (audio.volume !== undefined && (!Number.isFinite(audio.volume) || audio.volume < 0 || audio.volume > 1)) {
    throw new Error(`Audio volume must be in [0, 1] for entity: ${entityId}`);
  }

  if (audio.channel !== undefined && audio.channel !== 'music' && audio.channel !== 'sfx') {
    throw new Error(`Audio channel must be "music" or "sfx" for entity: ${entityId}`);
  }

  if (assets === undefined) {
    return;
  }

  const reference = resolveAssetReference(assets, audio.clipId);

  if (reference === undefined) {
    throw new Error(
      `Audio clip id "${audio.clipId}" is not present in the scene asset catalog (entity: ${entityId}).`
    );
  }

  if (reference.kind !== 'audio-clip') {
    throw new Error(
      `Audio clip id "${audio.clipId}" must resolve to an audio-clip asset (entity: ${entityId}).`
    );
  }
};
