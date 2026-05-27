export {
  type AnimationStripAssetDocument,
  type AssetCatalogDocument,
  type AssetKind,
  type AtlasAssetDocument,
  type AtlasRegionDocument,
  type AudioClipAssetDocument,
  type AudioClipChannel,
  type ResolvedAssetReference,
  type SpriteAssetDocument,
  type TileColliderDocument,
  type TileDefinitionDocument,
  type TilePaletteAssetDocument
} from './asset-catalog-document.js';

export {
  assetKindOf,
  findAnimationStripFrame,
  findAtlasRegion,
  findDuplicateAssetIds,
  listCatalogIds,
  resolveAssetReference,
  type ResolvedAnimationStripFrame,
  type ResolvedAtlasRegion
} from './asset-catalog-resolver.js';

export { validateAssetCatalog } from './asset-catalog-validator.js';

export {
  AssetPreloader,
  type AssetPreloadKind,
  type AssetPreloadOptions,
  type AssetPreloadProgress,
  type AssetPreloadRequest,
  type AssetPreloadResult
} from './asset-preloader.js';
