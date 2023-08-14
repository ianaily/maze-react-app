import React from 'react';
import { Size } from 'src/types/size';
import { Point } from 'src/types/point';

type UseCanvas = {
  context: CanvasRenderingContext2D | null;
  areaSize: number;
  canvasHeight: number;
  calculateCursorPosition: (offsetPx: Point) => Point;
};

export const useCanvasInit = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  canvasWidth: number,
  territorySize: Size,
): UseCanvas => {
  const context = React.useMemo(() => {
    const context = canvasRef.current?.getContext('2d') || null;
    context && (context.imageSmoothingEnabled = true);
    context && (context.imageSmoothingQuality = 'high');

    return context;
  }, [canvasRef.current]);
  const areaSize = React.useMemo(
    () => canvasWidth / territorySize.width,
    [territorySize.width, canvasWidth],
  );
  const canvasHeight = React.useMemo(
    () => areaSize * territorySize.height,
    [areaSize, territorySize.height],
  );

  const calculateCursorPosition = (offsetPx: Point): Point => {
    const rect = canvasRef.current?.getBoundingClientRect();
    const mazeWidth = rect?.width || 0;
    const mazeHeight = rect?.height || 0;

    if (offsetPx.x > mazeWidth || offsetPx.y > mazeHeight) {
      return { x: 0, y: 0 };
    }

    return {
      x: Math.floor(offsetPx.x / areaSize),
      y: Math.floor(offsetPx.y / areaSize),
    };
  };

  return {
    context,
    areaSize,
    canvasHeight,
    calculateCursorPosition,
  };
};
