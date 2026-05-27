export type UiAnchor =
  | 'top-left'
  | 'top'
  | 'top-right'
  | 'left'
  | 'center'
  | 'right'
  | 'bottom-left'
  | 'bottom'
  | 'bottom-right'
  | 'stretch';

export type UiLayoutDirection = 'absolute' | 'row' | 'column';

export type UiNodeKind = 'panel' | 'label' | 'button' | 'image';

export interface UiPaddingDocument {
  readonly top?: number;
  readonly right?: number;
  readonly bottom?: number;
  readonly left?: number;
}

export interface UiStyleDocument {
  readonly backgroundColor?: string;
  readonly borderColor?: string;
  readonly borderWidth?: number;
  readonly textColor?: string;
  readonly fontSize?: number;
  readonly textAlign?: 'left' | 'center' | 'right';
  readonly alpha?: number;
}

export interface UiNodeDocument {
  readonly id: string;
  readonly kind: UiNodeKind;
  readonly anchor?: UiAnchor;
  readonly offsetX?: number;
  readonly offsetY?: number;
  readonly width?: number;
  readonly height?: number;
  readonly padding?: UiPaddingDocument;
  readonly layout?: UiLayoutDirection;
  readonly gap?: number;
  readonly text?: string;
  readonly assetId?: string;
  readonly style?: UiStyleDocument;
  readonly clickEventName?: string;
  readonly children?: readonly UiNodeDocument[];
}

export interface UiLayerDocument {
  readonly viewportWidth?: number;
  readonly viewportHeight?: number;
  readonly root: UiNodeDocument;
}
