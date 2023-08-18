import React from 'react';
import { Size } from 'src/types/size';
import { Point } from 'src/types/point';
import { DrawStyleProps } from './types';

type UseCanvas = {
  context: CanvasRenderingContext2D | null;
  areaSize: number;
  canvasHeight: number;
  calculateCursorPosition: (offsetPx: Point) => Point;
  drawPoint: (point: Point, style: DrawStyleProps) => void;
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

  const drawPoint = ({ x, y }: Point, style: DrawStyleProps) => {
    if (!context) {
      return;
    }

    style.fill && (context.fillStyle = style.fill);
    style.stroke && (context.strokeStyle = style.stroke);
    style.lineWidth && (context.lineWidth = style.lineWidth);

    style.fill && context.fillRect(x * areaSize, y * areaSize, areaSize, areaSize);
    style.image && context.drawImage(style.image, x * areaSize, y * areaSize, areaSize, areaSize);

    if (style.stroke && style.lineWidth) {
      const w = style.lineWidth;
      const w2 = style.lineWidth * 2;

      context.strokeRect(x * areaSize + w, y * areaSize + w, areaSize - w2, areaSize - w2);
    }
  };

  return {
    context,
    areaSize,
    canvasHeight,
    calculateCursorPosition,
    drawPoint,
  };
};
