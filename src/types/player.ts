import { Point } from './point';
import { Direction } from './direction';

export interface Player {
  point: Point;
  prevPoint: Point;
  direction: Direction;
}
