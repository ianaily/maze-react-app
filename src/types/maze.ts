import { Size } from './size';
import { Point } from './point';

export interface Maze {
  name: string;
  configName: string;
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
