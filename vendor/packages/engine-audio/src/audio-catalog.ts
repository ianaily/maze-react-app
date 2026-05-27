import type {
  AssetCatalogDocument,
  AudioClipAssetDocument
} from '../../engine-asset/src/index.js';

export const collectAudioClips = (
  catalog: AssetCatalogDocument | undefined
): ReadonlyMap<string, AudioClipAssetDocument> => {
  const result = new Map<string, AudioClipAssetDocument>();

  for (const clip of catalog?.audioClips ?? []) {
    result.set(clip.id, clip);
  }

  return result;
};

export const findAudioClip = (
  catalog: AssetCatalogDocument | undefined,
  id: string
): AudioClipAssetDocument | undefined => {
  for (const clip of catalog?.audioClips ?? []) {
    if (clip.id === id) {
      return clip;
    }
  }

  return undefined;
};
