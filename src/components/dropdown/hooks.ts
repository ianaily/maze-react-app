import React from 'react';
import { Point } from 'src/types/point';

export const useCalculatePosition = (ref: React.RefObject<HTMLElement>): Point => {
  const [position, setPosition] = React.useState({ x: 0, y: 0 });

  React.useEffect(() => {
    if (ref.current) {
      const targetRect = ref.current.getBoundingClientRect();

      const x = targetRect.left;
      const y = targetRect.bottom;

      setPosition({ x, y });
    }
  }, [ref.current]);

  return position;
};

export const useCorrectPosition = (ref: React.RefObject<HTMLElement>, point: Point): Point => {
  const [position, setPosition] = React.useState(point);

  React.useEffect(() => {
    if (ref.current) {
      const isRight = ref.current.clientWidth + point.x > document.body.offsetWidth;
      const isBottom = ref.current.clientHeight + point.y > document.body.offsetHeight;

      setPosition({
        x: isRight ? point.x - ref.current.clientWidth : point.x,
        y: isBottom ? point.y - ref.current.clientHeight : point.y,
      });
    }
  }, [ref.current, point]);

  return position;
};
