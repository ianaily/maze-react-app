import React from 'react';
import { Area } from 'src/types/maze';
import { Point } from 'src/types/point';
import { mazeUtils } from 'src/utils/mazeUtils';
import { Loading } from 'src/components/loading/styled';
import { RendererProps } from './types';
import { areaFillStyles, coordsFillStyle, cursorStyle } from './const';
import { Canvas, Container } from './styled';

export const Renderer: React.FC<RendererProps> = ({
  maze,
  cursor,
  canvasWidth,
  canvasHeight,
  onKeyDown,
  onAreaClick,
  enableCoords,
}) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const context = React.useMemo(() => canvasRef.current?.getContext('2d'), [canvasRef.current]);
  const { getAreaType } = React.useMemo(() => mazeUtils(maze), [maze]);

  const areaSize = React.useMemo(() => {
    const largerMazeSide = Math.max(maze.width, maze.height);
    const largerCanvasSize = Math.max(canvasWidth, canvasHeight);

    return largerCanvasSize / largerMazeSide;
  }, [maze, canvasWidth, canvasHeight]);

  const drawArea = ({ x, y, type }: Area) => {
    if (!context) {
      return;
    }

    context.fillStyle = areaFillStyles[type.name];
    context.fillRect(x * areaSize, y * areaSize, areaSize, areaSize);
  };

  const drawCoords = ({ x, y }: Point) => {
    if (!context || !enableCoords) {
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

  const handleKeyDown = (event: React.KeyboardEvent) => {
    onKeyDown(event.key);
  };

  const handleClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!context || !canvasRef.current) {
      return;
    }
    const offsetX = event.nativeEvent.offsetX;
    const offsetY = event.nativeEvent.offsetY;
    const mazeWidth = maze.width * areaSize;
    const mazeHeight = maze.height * areaSize;

    if (offsetX > mazeWidth || offsetY > mazeHeight) {
      return;
    }

    // todo okay... need to correct modifier
    const modX = offsetX <= mazeWidth / 2 ? -1 : -2;
    const modY = offsetY <= mazeHeight / 2 ? -1 : -2;
    const areaPoint = {
      x: Math.floor(offsetX / (areaSize + modX)),
      y: Math.floor(offsetY / (areaSize + modY)),
    };

    onAreaClick(areaPoint);
  };

  React.useEffect(() => {
    if (!context) {
      return;
    }

    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
  }, [context]);

  React.useEffect(() => {
    React.startTransition(() => {
      context?.clearRect(0, 0, canvasWidth, canvasHeight);
      maze.areas.map((area) => {
        drawArea(area);
        drawCoords(area);
      });
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

  return (
    <Container>
      {!context && <Loading width="64px" height="64px" />}
      <Canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      />
    </Container>
  );
};
