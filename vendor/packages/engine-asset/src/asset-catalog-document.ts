export interface SpriteAssetDocument {
  readonly id: string;
  readonly source: string;
  readonly width: number;
  readonly height: number;
  readonly label?: string;
}

export interface AnimationStripAssetDocument {
  readonly id: string;
  readonly source: string;
  readonly frameWidth: number;
  readonly frameHeight: number;
  readonly frameCount: number;
  readonly label?: string;
  /**
   * Optional addressable id per frame slot, in row-major order. When provided,
   * length must equal `frameCount`; the ids enter the catalog id namespace and
   * resolve as kind `animation-strip-frame`. Animation clips reference these
   * ids to render a specific slot of the strip image.
   */
  readonly frameIds?: readonly string[];
  /**
   * Optional column count for the row-major frame grid. Defaults to
   * `frameCount` (single row). Used to translate a frame index into a pixel
   * rect within the strip image.
   */
  readonly columns?: number;
}

export interface AtlasRegionDocument {
  readonly id: string;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export interface AtlasAssetDocument {
  readonly id: string;
  readonly source: string;
  readonly regions: readonly AtlasRegionDocument[];
  readonly label?: string;
}

export type AudioClipChannel = 'music' | 'sfx';

export interface AudioClipAssetDocument {
  readonly id: string;
  readonly source: string;
  readonly label?: string;
  readonly defaultVolume?: number;
  readonly defaultLoop?: boolean;
  readonly channel?: AudioClipChannel;
}

export interface AssetCatalogDocument {
  readonly sprites?: readonly SpriteAssetDocument[];
  readonly animationStrips?: readonly AnimationStripAssetDocument[];
  readonly atlases?: readonly AtlasAssetDocument[];
  readonly audioClips?: readonly AudioClipAssetDocument[];
  readonly tilePalettes?: readonly TilePaletteAssetDocument[];
}

export interface TileDefinitionDocument {
  readonly spriteAssetId?: string;
  readonly collider?: TileColliderDocument;
  readonly flags?: number;
  readonly label?: string;
}

export interface TileColliderDocument {
  readonly width: number;
  readonly height: number;
  readonly offsetX?: number;
  readonly offsetY?: number;
  readonly trigger?: boolean;
  readonly categoryBits?: number;
  readonly maskBits?: number;
}

export interface TilePaletteAssetDocument {
  readonly id: string;
  readonly label?: string;
  readonly tileSize: number;
  readonly tiles: readonly TileDefinitionDocument[];
}

export type AssetKind =
  | 'sprite'
  | 'animation-strip'
  | 'animation-strip-frame'
  | 'atlas-region'
  | 'audio-clip'
  | 'tile-palette';

export interface ResolvedAssetReference {
  readonly id: string;
  readonly kind: AssetKind;
}
