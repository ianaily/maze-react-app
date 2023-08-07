import { Point } from './point';

export interface Cursor {
  enable: boolean;
  point: Point;
  prevPoint: Point;
}
