import React from 'react';
import { Area } from 'src/types/maze';
import { Point } from 'src/types/point';
import { mazeUtils } from 'src/utils/mazeUtils';
import { areaFillStyles, coordsFillStyle, cursorStyle } from './const';
import { RendererProps } from './types';
import { Canvas } from './styled';

const Renderer: React.FC<RendererProps> = ({ maze, cursor, canvasWidth, canvasHeight }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const context = React.useMemo(() => canvasRef.current?.getContext('2d'), [canvasRef.current]);

  const { getAreaType } = React.useMemo(() => mazeUtils(maze), [maze]);
  const areaSize = React.useMemo(() => {
    const largerMazeSide = Math.max(maze.width, maze.height);
    const smallerCanvasSize = Math.min(canvasWidth, canvasHeight);

    return smallerCanvasSize / largerMazeSide;
  }, [maze, canvasWidth, canvasHeight]);

  const drawArea = ({ x, y, type }: Area) => {
    if (!context) {
      return;
    }

    context.fillStyle = areaFillStyles[type.name];
    context.fillRect(x * areaSize, y * areaSize, areaSize, areaSize);
  };

  const drawCoords = ({ x, y }: Point) => {
    if (!context) {
      return;
    }

    const offset = areaSize / 2;
    context.fillStyle = coordsFillStyle;
    context.fillText(`${x}:${y}`, x * areaSize, y * areaSize + offset, areaSize);
  };

  const drawCursor = ({ x, y }: Point) => {
    if (!context) {
      return;
    }

    context.fillStyle = cursorStyle.fill;
    context.strokeStyle = cursorStyle.stroke;
    context.lineWidth = cursorStyle.lineWidth;
    context.fillRect(x * areaSize, y * areaSize, areaSize, areaSize);
    context.strokeRect(x * areaSize + 2, y * areaSize + 2, areaSize - 4, areaSize - 4);
  };

  React.useEffect(() => {
    if (!context) {
      return;
    }

    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
  }, [context]);

  // todo func draw ui
  // todo func draw gameplay
  React.useEffect(() => {
    context?.clearRect(0, 0, canvasWidth, canvasHeight);
    maze.areas.map((area) => {
      drawArea(area);
      drawCoords(area);
    });
  }, [maze, context]);

  React.useEffect(() => {
    if (cursor.enable && maze.areas.length) {
      const { point, prevPoint } = cursor;
      const type = getAreaType(prevPoint);

      drawCursor(point);
      drawArea({ ...prevPoint, type });
      drawCoords({ ...prevPoint });
    }
  }, [cursor, maze]);

  return <Canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} />;
};

export default Renderer;
