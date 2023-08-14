import React from 'react';
import { Point } from 'src/types/point';

export const useContextPosition = (
  ref: React.RefObject<HTMLElement>,
  x: number,
  y: number,
): Point => {
  const [position, setPosition] = React.useState({ x, y });

  React.useEffect(() => {
    if (ref.current) {
      const isRight = ref.current.clientWidth + x > document.body.offsetWidth;
      const isBottom = ref.current.clientHeight + y > document.body.offsetHeight;

      setPosition({
        x: isRight ? x - ref.current.clientWidth : x,
        y: isBottom ? y - ref.current.clientHeight : y,
      });
    }
  }, [ref.current]);

  return position;
};
