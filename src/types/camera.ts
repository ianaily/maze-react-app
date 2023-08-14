import { Point } from './point';
import { Size } from './size';
import { Area } from './maze';

export interface Camera {
  size: Size;
  point: Point;
  areas: Area[];
}
