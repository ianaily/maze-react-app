import { WallDirections } from 'src/types/direction';

export const TILE_SIZE = 16;

export const ASSET_FLOOR = 'maze-floor';
export const ASSET_DOOR = 'maze-door';
export const ASSET_HERO_RIGHT = 'maze-hero-right';
export const ASSET_HERO_LEFT = 'maze-hero-left';
export const ASSET_COIN = 'maze-coin';

export const wallAssetId = (variant: WallDirections): string => `maze-wall-${variant}`;

/**
 * Wall variant for each 4-bit neighbour mask in TRBL order
 * (top, right, bottom, left). 1 = neighbour is a wall.
 * Index of the array is the bit pattern; entry is the wall sprite
 * orientation describing how the wall block sits in surrounding space.
 */
export const WALL_VARIANTS: readonly WallDirections[] = [
  WallDirections.narrowMiddle,      // 0000 — isolated
  WallDirections.narrowRight,       // 0001 L      — right end of horizontal strip
  WallDirections.narrowTop,         // 0010 B      — top cap of vertical strip
  WallDirections.topRight,          // 0011 B+L    — top-right corner
  WallDirections.narrowLeft,        // 0100 R      — left end of horizontal strip
  WallDirections.narrowHorizontal,  // 0101 R+L
  WallDirections.topLeft,           // 0110 R+B    — top-left corner
  WallDirections.topMiddle,         // 0111 R+B+L  — top edge
  WallDirections.narrowBottom,      // 1000 T      — bottom cap of vertical strip
  WallDirections.bottomRight,       // 1001 T+L    — bottom-right corner
  WallDirections.narrowVertical,    // 1010 T+B
  WallDirections.middleRight,       // 1011 T+B+L  — right edge
  WallDirections.bottomLeft,        // 1100 T+R    — bottom-left corner
  WallDirections.bottomMiddle,      // 1101 T+R+L  — bottom edge
  WallDirections.middleLeft,        // 1110 T+R+B  — left edge
  WallDirections.middleMiddle,      // 1111 — surrounded
];

export const TILE_FLOOR = 1;
export const TILE_WALL_BASE = 2; // variant tile ids: TILE_WALL_BASE + neighbourMask (0..15)

export const HERO_MAX_SPEED = 56;
export const VISIBLE_TILES = 9;
