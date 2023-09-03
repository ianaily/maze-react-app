import { AreaTypeKeys } from 'src/types/maze';
import { AreaConfig } from '../types/config';
import { spritesMap } from './spritesMap';

export const areaFillColors: { [key in keyof typeof AreaTypes]: string } = {
  Way: '#abc',
  Thread: '#cba',
  Center: '#fd0',
  Enter: '#f64',
  Exit: '#af0',
  Wall: '#456',
};

export const AreaTypes: { [key in AreaTypeKeys]: AreaConfig } = {
  [AreaTypeKeys.Wall]: {
    name: AreaTypeKeys.Wall,
    short: '▒',
    passable: false,
    rewritable: true,
    color: areaFillColors[AreaTypeKeys.Wall],
    sprite: spritesMap[AreaTypeKeys.Wall],
  },
  [AreaTypeKeys.Center]: {
    name: AreaTypeKeys.Center,
    short: '*',
    passable: true,
    rewritable: false,
    color: areaFillColors[AreaTypeKeys.Center],
    sprite: spritesMap[AreaTypeKeys.Center],
  },
  [AreaTypeKeys.Way]: {
    name: AreaTypeKeys.Way,
    short: ' ',
    passable: true,
    rewritable: true,
    color: areaFillColors[AreaTypeKeys.Way],
    sprite: spritesMap[AreaTypeKeys.Way],
  },
  [AreaTypeKeys.Thread]: {
    name: AreaTypeKeys.Thread,
    short: '·',
    passable: true,
    rewritable: false,
    color: areaFillColors[AreaTypeKeys.Thread],
    sprite: spritesMap[AreaTypeKeys.Thread],
  },
  [AreaTypeKeys.Enter]: {
    name: AreaTypeKeys.Enter,
    short: '#',
    passable: false,
    rewritable: false,
    color: areaFillColors[AreaTypeKeys.Enter],
    sprite: spritesMap[AreaTypeKeys.Enter],
  },
  [AreaTypeKeys.Exit]: {
    name: AreaTypeKeys.Exit,
    short: '!',
    passable: true,
    rewritable: false,
    color: areaFillColors[AreaTypeKeys.Exit],
    sprite: spritesMap[AreaTypeKeys.Exit],
  },
};
