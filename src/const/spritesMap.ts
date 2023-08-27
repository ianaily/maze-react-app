import { WallDirections } from 'src/types/direction';
import BL from 'src/assets/sprites/walls/bottom-left.png';
import BM from 'src/assets/sprites/walls/bottom-middle.png';
import BR from 'src/assets/sprites/walls/bottom-right.png';
import ML from 'src/assets/sprites/walls/middle-left.png';
import MM from 'src/assets/sprites/walls/middle.png';
import MR from 'src/assets/sprites/walls/middle-right.png';
import TL from 'src/assets/sprites/walls/top-left.png';
import TM from 'src/assets/sprites/walls/top-middle.png';
import TR from 'src/assets/sprites/walls/top-right.png';
import NT from 'src/assets/sprites/walls/narrow-top.png';
import NR from 'src/assets/sprites/walls/narrow-right.png';
import NB from 'src/assets/sprites/walls/narrow-bottom.png';
import NL from 'src/assets/sprites/walls/narrow-left.png';
import NH from 'src/assets/sprites/walls/narrow-horizontal.png';
import NV from 'src/assets/sprites/walls/narrow-vertical.png';
import NM from 'src/assets/sprites/walls/narrow.png';
import Way from 'src/assets/sprites/way.png';
import Door from 'src/assets/sprites/door.png';
import CharRight from 'src/assets/sprites/char-r.png';
import { AreaTypeKeys } from '../types/maze';

export const walls = {
  [WallDirections.topLeft]: TL as string,
  [WallDirections.topMiddle]: TM as string,
  [WallDirections.topRight]: TR as string,
  [WallDirections.middleLeft]: ML as string,
  [WallDirections.middleMiddle]: MM as string,
  [WallDirections.middleRight]: MR as string,
  [WallDirections.bottomLeft]: BL as string,
  [WallDirections.bottomMiddle]: BM as string,
  [WallDirections.bottomRight]: BR as string,
  [WallDirections.narrowTop]: NT as string,
  [WallDirections.narrowRight]: NR as string,
  [WallDirections.narrowBottom]: NB as string,
  [WallDirections.narrowLeft]: NL as string,
  [WallDirections.narrowHorizontal]: NH as string,
  [WallDirections.narrowVertical]: NV as string,
  [WallDirections.narrowMiddle]: NM as string,
};

export const sprites = {
  middleWall: MM,
  way: Way,
  door: Door,
  char: CharRight,
};

export const spritesMap: { [key: string]: string } = {
  [AreaTypeKeys.Way]: Way,
  [AreaTypeKeys.Thread]: Way,
  [AreaTypeKeys.Center]: Way,
  [AreaTypeKeys.Enter]: Door,
  [AreaTypeKeys.Exit]: Door,
};
