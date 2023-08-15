import { Point } from './point';

export interface Fork {
  point: Point;
  top?: Point;
  right?: Point;
  bottom?: Point;
  left?: Point;
}
