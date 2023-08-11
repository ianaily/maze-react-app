import React from 'react';
import { Area } from 'src/types/maze';
import { Point } from 'src/types/point';
import { mazeUtils } from 'src/utils/mazeUtils';
import { areaFillStyles, coordsFillStyle, cursorStyle } from 'src/const/areaTypes';
import { Loading } from 'src/components/loading/styled';
import { RendererProps } from './types';
import { Canvas, Container } from './styled';

export const Renderer: React.FC<RendererProps> = ({
  maze,
  cursor,
  canvasWidth,
  onKeyDown,
  onAreaClick,
  onMouseMove,
  onContextMenu,
  enableCoords,
}) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const context = React.useMemo(() => canvasRef.current?.getContext('2d'), [canvasRef.current]);
  const { getAreaType } = React.useMemo(() => mazeUtils(maze), [maze]);

  const areaSize = React.useMemo(() => canvasWidth / maze.width, [maze.width, canvasWidth]);
  const canvasHeight = React.useMemo(() => areaSize * maze.height, [areaSize, maze.height]);

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

  const drawSelect = ({ x, y }: Point) => {
    if (!context) {
      return;
    }

    context.fillStyle = cursorStyle.fill;
    context.strokeStyle = cursorStyle.stroke;
    context.lineWidth = cursorStyle.lineWidth;
    context.fillRect(x * areaSize, y * areaSize, areaSize, areaSize);
    context.strokeRect(x * areaSize + 2, y * areaSize + 2, areaSize - 4, areaSize - 4);
  };

  const drawMaze = () => {
    React.startTransition(() => {
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.height = `${canvasHeight}px`;
      }

      context?.clearRect(0, 0, canvasWidth, canvasHeight);
      maze.areas.map((area) => {
        drawArea(area);
        drawCoords(area);
      });
    });
  };

  const drawCursor = () => {
    React.startTransition(() => {
      if (cursor.enable && maze.areas.length) {
        const { point, prevPoint } = cursor;
        const type = getAreaType(prevPoint);

        drawSelect(point);
        drawArea({ ...prevPoint, type });
        drawCoords({ ...prevPoint });
      }
    });
  };

  const calculateCursorPosition = (offset: Point): Point => {
    const rect = canvasRef.current?.getBoundingClientRect();
    const mazeWidth = rect?.width || 0;
    const mazeHeight = rect?.height || 0;

    if (offset.x > mazeWidth || offset.y > mazeHeight) {
      return { x: 0, y: 0 };
    }

    return {
      x: Math.floor(offset.x / areaSize),
      y: Math.floor(offset.y / areaSize),
    };
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    onKeyDown(event.key);
  };

  const handleClick = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
    const offset = { x: nativeEvent.offsetX, y: nativeEvent.offsetY };
    const areaPoint = calculateCursorPosition(offset);

    onAreaClick(areaPoint);
  };

  const handleMouseMove = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
    const offset = { x: nativeEvent.offsetX, y: nativeEvent.offsetY };
    const areaPoint = calculateCursorPosition(offset);

    onMouseMove(areaPoint);
    drawMaze();
  };

  const handleContextMenu = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const offset = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
    const areaPoint = calculateCursorPosition(offset);

    onContextMenu(areaPoint, { x: e.clientX, y: e.clientY });
  };

  React.useEffect(() => {
    if (!context) {
      return;
    }

    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
  }, [context]);

  React.useEffect(() => {
    drawMaze();
  }, [maze, context]);

  React.useEffect(() => {
    drawCursor();
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
        onMouseMove={handleMouseMove}
        onContextMenu={handleContextMenu}
        tabIndex={0}
      />
    </Container>
  );
};
