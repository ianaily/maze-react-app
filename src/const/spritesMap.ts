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

export const walls = {
  topLeft: TL as string,
  topMiddle: TM as string,
  topRight: TR as string,
  middleLeft: ML as string,
  middleMiddle: MM as string,
  middleRight: MR as string,
  bottomLeft: BL as string,
  bottomMiddle: BM as string,
  bottomRight: BR as string,
  narrowTop: NT as string,
  narrowRight: NR as string,
  narrowBottom: NB as string,
  narrowLeft: NL as string,
  narrowHorizontal: NH as string,
  narrowVertical: NV as string,
  narrowMiddle: NM as string,
};

export const sprites = {
  way: Way,
  door: Door,
  char: CharRight,
};
