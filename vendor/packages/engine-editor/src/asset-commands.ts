import type {
  AssetCatalogDocument,
  AssetKind,
  AudioClipAssetDocument,
  SpriteAssetDocument
} from '../../engine-asset/src/index.js';
import { resolveAssetReference } from '../../engine-asset/src/index.js';
import type {
  SceneDocument,
  SceneEntityDocumentV1,
  SceneMusicDocumentV1
} from '../../engine-scene/src/index.js';
import type { EditorCommand } from './scene-commands.js';

export function registerSpriteAssetCommand(asset: SpriteAssetDocument): EditorCommand {
  const snapshot = cloneSpriteAsset(asset);

  return {
    name: `register sprite asset ${snapshot.id}`,
    apply(document) {
      if (resolveAssetReference(document.assets, snapshot.id) !== undefined) {
        throw new Error(`Asset already exists in catalog: ${snapshot.id}`);
      }

      const nextSprites = [...(document.assets?.sprites ?? []), cloneSpriteAsset(snapshot)];

      return {
        document: withCatalog(document, {
          ...document.assets,
          sprites: nextSprites
        }),
        undo: removeAssetCommand(snapshot.id)
      };
    }
  };
}

export function registerAudioClipAssetCommand(asset: AudioClipAssetDocument): EditorCommand {
  const snapshot = cloneAudioClipAsset(asset);

  return {
    name: `register audio clip asset ${snapshot.id}`,
    apply(document) {
      if (resolveAssetReference(document.assets, snapshot.id) !== undefined) {
        throw new Error(`Asset already exists in catalog: ${snapshot.id}`);
      }

      const nextClips = [...(document.assets?.audioClips ?? []), cloneAudioClipAsset(snapshot)];

      return {
        document: withCatalog(document, {
          ...document.assets,
          audioClips: nextClips
        }),
        undo: removeAssetCommand(snapshot.id)
      };
    }
  };
}

export function removeAssetCommand(id: string): EditorCommand {
  return {
    name: `remove asset ${id}`,
    apply(document) {
      const removal = removeAssetFromCatalog(document.assets, id);

      if (removal === undefined) {
        throw new Error(`Asset not found in catalog: ${id}`);
      }

      const referenced = findEntitiesUsingAsset(document, id);

      if (referenced.length > 0) {
        throw new Error(
          `Cannot remove asset "${id}": referenced by entities ${referenced.join(', ')}.`
        );
      }

      if (document.music?.clipId === id) {
        throw new Error(`Cannot remove asset "${id}": referenced by scene music.`);
      }

      return {
        document: withCatalog(document, removal.catalog),
        undo: restoreSpriteAssetCommand(removal.removed)
      };
    }
  };
}

export function renameAssetCommand(oldId: string, newId: string): EditorCommand {
  return {
    name: `rename asset ${oldId} -> ${newId}`,
    apply(document) {
      if (oldId === newId) {
        throw new Error('Asset rename requires distinct ids.');
      }

      if (resolveAssetReference(document.assets, oldId) === undefined) {
        throw new Error(`Asset not found in catalog: ${oldId}`);
      }

      if (resolveAssetReference(document.assets, newId) !== undefined) {
        throw new Error(`Asset id already taken: ${newId}`);
      }

      const nextCatalog = renameInCatalog(document.assets, oldId, newId);
      const nextEntities = document.entities.map((entity) =>
        renameAudioReference(renameSpriteReference(entity, oldId, newId), oldId, newId)
      );
      const nextMusic = renameSceneMusic(document.music, oldId, newId);

      return {
        document: withCatalog(
          {
            ...document,
            entities: nextEntities,
            ...(nextMusic !== undefined ? { music: nextMusic } : {})
          },
          nextCatalog
        ),
        undo: renameAssetCommand(newId, oldId)
      };
    }
  };
}

export function setSceneMusicCommand(music: SceneMusicDocumentV1 | undefined): EditorCommand {
  const snapshot = music !== undefined ? cloneSceneMusic(music) : undefined;

  return {
    name: snapshot === undefined ? 'clear scene music' : `set scene music ${snapshot.clipId}`,
    apply(document) {
      if (snapshot !== undefined) {
        const reference = resolveAssetReference(document.assets, snapshot.clipId);

        if (reference === undefined) {
          throw new Error(`Cannot set scene music: clipId "${snapshot.clipId}" is not in the asset catalog.`);
        }

        if (reference.kind !== 'audio-clip') {
          throw new Error(`Cannot set scene music: clipId "${snapshot.clipId}" must reference an audio-clip asset.`);
        }
      }

      const previous = document.music !== undefined ? cloneSceneMusic(document.music) : undefined;
      const next: SceneDocument = snapshot === undefined
        ? withoutMusic(document)
        : { ...document, music: cloneSceneMusic(snapshot) };

      return {
        document: next,
        undo: setSceneMusicCommand(previous)
      };
    }
  };
}

function withoutMusic(document: SceneDocument): SceneDocument {
  const { music: _omit, ...rest } = document as SceneDocument & { music?: SceneMusicDocumentV1 };
  return rest;
}

function cloneSceneMusic(music: SceneMusicDocumentV1): SceneMusicDocumentV1 {
  return {
    clipId: music.clipId,
    ...(music.volume !== undefined ? { volume: music.volume } : {}),
    ...(music.loop !== undefined ? { loop: music.loop } : {})
  };
}

export function migrateSceneAssets(document: SceneDocument): SceneDocument {
  const existingCatalog = document.assets;
  const collected = new Map<string, SpriteAssetDocument>();

  for (const entity of document.entities) {
    const sprite = entity.sprite;

    if (sprite === undefined) {
      continue;
    }

    if (resolveAssetReference(existingCatalog, sprite.assetId) !== undefined) {
      continue;
    }

    if (collected.has(sprite.assetId)) {
      continue;
    }

    collected.set(sprite.assetId, {
      id: sprite.assetId,
      source: `assets/${sprite.assetId}.png`,
      width: sprite.width,
      height: sprite.height
    });
  }

  if (collected.size === 0) {
    return document;
  }

  const nextCatalog: AssetCatalogDocument = {
    ...existingCatalog,
    sprites: [...(existingCatalog?.sprites ?? []), ...collected.values()]
  };

  return withCatalog(document, nextCatalog);
}

function restoreSpriteAssetCommand(removed: RemovedAsset): EditorCommand {
  if (removed.kind === 'sprite') {
    return registerSpriteAssetCommand(removed.asset as SpriteAssetDocument);
  }

  if (removed.kind === 'audio-clip') {
    return registerAudioClipAssetCommand(removed.asset as AudioClipAssetDocument);
  }

  throw new Error(`Restore command is not implemented for asset kind: ${removed.kind}`);
}

interface RemovedAsset {
  readonly kind: AssetKind;
  readonly asset: SpriteAssetDocument | AudioClipAssetDocument;
}

interface CatalogRemovalResult {
  readonly catalog: AssetCatalogDocument;
  readonly removed: RemovedAsset;
}

function removeAssetFromCatalog(
  catalog: AssetCatalogDocument | undefined,
  id: string
): CatalogRemovalResult | undefined {
  if (catalog === undefined) {
    return undefined;
  }

  const spriteIndex = catalog.sprites?.findIndex((entry) => entry.id === id) ?? -1;

  if (spriteIndex !== -1) {
    const sprites = catalog.sprites ?? [];
    const removed = sprites[spriteIndex];

    if (removed === undefined) {
      return undefined;
    }

    return {
      catalog: {
        ...catalog,
        sprites: sprites.filter((entry) => entry.id !== id)
      },
      removed: { kind: 'sprite', asset: cloneSpriteAsset(removed) }
    };
  }

  const audioIndex = catalog.audioClips?.findIndex((entry) => entry.id === id) ?? -1;

  if (audioIndex !== -1) {
    const clips = catalog.audioClips ?? [];
    const removed = clips[audioIndex];

    if (removed === undefined) {
      return undefined;
    }

    return {
      catalog: {
        ...catalog,
        audioClips: clips.filter((entry) => entry.id !== id)
      },
      removed: { kind: 'audio-clip', asset: cloneAudioClipAsset(removed) }
    };
  }

  return undefined;
}

function renameInCatalog(
  catalog: AssetCatalogDocument | undefined,
  oldId: string,
  newId: string
): AssetCatalogDocument {
  if (catalog === undefined) {
    return {};
  }

  const renameById = <T extends { readonly id: string }>(entries: readonly T[]): readonly T[] =>
    entries.map((entry) => (entry.id === oldId ? { ...entry, id: newId } : entry));

  const next: AssetCatalogDocument = {
    ...(catalog.sprites !== undefined ? { sprites: renameById(catalog.sprites) } : {}),
    ...(catalog.animationStrips !== undefined
      ? { animationStrips: renameById(catalog.animationStrips) }
      : {}),
    ...(catalog.atlases !== undefined
      ? {
          atlases: catalog.atlases.map((atlas) => ({
            ...atlas,
            regions: renameById(atlas.regions)
          }))
        }
      : {}),
    ...(catalog.audioClips !== undefined ? { audioClips: renameById(catalog.audioClips) } : {})
  };

  return next;
}

function renameSpriteReference(
  entity: SceneEntityDocumentV1,
  oldId: string,
  newId: string
): SceneEntityDocumentV1 {
  if (entity.sprite === undefined || entity.sprite.assetId !== oldId) {
    return entity;
  }

  return {
    ...entity,
    sprite: { ...entity.sprite, assetId: newId }
  };
}

function renameAudioReference(
  entity: SceneEntityDocumentV1,
  oldId: string,
  newId: string
): SceneEntityDocumentV1 {
  if (entity.audio === undefined || entity.audio.clipId !== oldId) {
    return entity;
  }

  return {
    ...entity,
    audio: { ...entity.audio, clipId: newId }
  };
}

function renameSceneMusic(
  music: SceneDocument['music'],
  oldId: string,
  newId: string
): SceneDocument['music'] {
  if (music === undefined) {
    return undefined;
  }

  if (music.clipId !== oldId) {
    return music;
  }

  return { ...music, clipId: newId };
}

function findEntitiesUsingAsset(document: SceneDocument, id: string): readonly string[] {
  const referenced = new Set<string>();

  for (const entity of document.entities) {
    if (entity.sprite?.assetId === id || entity.audio?.clipId === id) {
      referenced.add(entity.id);
    }
  }

  return [...referenced];
}

function withCatalog(document: SceneDocument, catalog: AssetCatalogDocument): SceneDocument {
  return { ...document, assets: catalog };
}

function cloneSpriteAsset(asset: SpriteAssetDocument): SpriteAssetDocument {
  return {
    id: asset.id,
    source: asset.source,
    width: asset.width,
    height: asset.height,
    ...(asset.label !== undefined ? { label: asset.label } : {})
  };
}

function cloneAudioClipAsset(asset: AudioClipAssetDocument): AudioClipAssetDocument {
  return {
    id: asset.id,
    source: asset.source,
    ...(asset.label !== undefined ? { label: asset.label } : {}),
    ...(asset.defaultVolume !== undefined ? { defaultVolume: asset.defaultVolume } : {}),
    ...(asset.defaultLoop !== undefined ? { defaultLoop: asset.defaultLoop } : {}),
    ...(asset.channel !== undefined ? { channel: asset.channel } : {})
  };
}
