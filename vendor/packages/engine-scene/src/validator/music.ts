import { resolveAssetReference, type AssetCatalogDocument } from '../../../engine-asset/src/index.js';
import type { SceneMusicDocumentV1 } from '../scene-schema.js';

export const validateSceneMusic = (
  music: SceneMusicDocumentV1,
  assets: AssetCatalogDocument | undefined
): void => {
  if (typeof music.clipId !== 'string' || music.clipId.length === 0) {
    throw new Error('Scene music requires a non-empty clipId.');
  }

  if (music.volume !== undefined && (!Number.isFinite(music.volume) || music.volume < 0 || music.volume > 1)) {
    throw new Error('Scene music volume must be in [0, 1].');
  }

  if (assets === undefined) {
    return;
  }

  const reference = resolveAssetReference(assets, music.clipId);

  if (reference === undefined) {
    throw new Error(`Scene music clipId "${music.clipId}" is not present in the asset catalog.`);
  }

  if (reference.kind !== 'audio-clip') {
    throw new Error(`Scene music clipId "${music.clipId}" must resolve to an audio-clip asset.`);
  }
};
