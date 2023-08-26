import { Size } from './size';
import { Point } from './point';

export interface Maze {
  name: string;
  areas: Area[];
  enter: Area;
  exit: Area;
  center: Area;
  size: Size;
}

export interface Area extends Point {
  type: AreaType;
}

export enum AreaTypeKeys {
  Way = 'Way',
  Thread = 'Thread',
  Enter = 'Enter',
  Exit = 'Exit',
  Center = 'Center',
  Wall = 'Wall',
}

export interface AreaType {
  name: AreaTypeKeys | string;
  short: string;
  passable: boolean;
  rewritable: boolean;
}

export const AreaTypes: { [key in AreaTypeKeys]: AreaType } = {
  [AreaTypeKeys.Wall]: {
    name: AreaTypeKeys.Wall,
    short: '▒',
    passable: false,
    rewritable: true,
  },
  [AreaTypeKeys.Center]: {
    name: AreaTypeKeys.Center,
    short: '*',
    passable: true,
    rewritable: false,
  },
  [AreaTypeKeys.Way]: {
    name: AreaTypeKeys.Way,
    short: ' ',
    passable: true,
    rewritable: true,
  },
  [AreaTypeKeys.Thread]: {
    name: AreaTypeKeys.Thread,
    short: '·',
    passable: true,
    rewritable: false,
  },
  [AreaTypeKeys.Enter]: {
    name: AreaTypeKeys.Enter,
    short: '#',
    passable: false,
    rewritable: false,
  },
  [AreaTypeKeys.Exit]: {
    name: AreaTypeKeys.Exit,
    short: '!',
    passable: true,
    rewritable: false,
  },
};
