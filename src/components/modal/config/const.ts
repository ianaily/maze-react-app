import { AreaConfig } from 'src/types/config';
import { walls } from 'src/const/spritesMap';

export const initialCustomTypes: AreaConfig[] = [];

export const initialCustomType: AreaConfig = {
  name: 'blank',
  short: '-',
  rewritable: false,
  passable: false,
  color: '#000',
  sprite: walls.narrowMiddle,
};
