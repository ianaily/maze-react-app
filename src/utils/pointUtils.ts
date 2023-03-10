import { Point } from 'src/types/point';

export const toTop = (point: Point) => ({ ...point, y: point.y - 1 });
export const toRight = (point: Point) => ({ ...point, x: point.x + 1 });
export const toBottom = (point: Point) => ({ ...point, y: point.y + 1 });
export const toLeft = (point: Point) => ({ ...point, x: point.x - 1 });

export const updatePoint = (current: Point, modFunc: (point: Point) => Point) => {
  const updated = modFunc(current);

  current.x = updated.x;
  current.y = updated.y;

  return current;
};
