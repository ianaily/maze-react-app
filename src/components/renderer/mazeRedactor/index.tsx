import React from 'react';
import { Area } from 'src/types/maze';
import { Point } from 'src/types/point';
import { tooSmallAreaSize } from 'src/const/maze';
import { areaFillColors } from 'src/const/areaTypes';
import { mazeUtils } from 'src/utils/mazeUtils';
import { Loading } from 'src/components/loading/styled';
import { coordsStyle, cursorStyle, routePointStyle } from '../const';
import { useCanvasInit } from '../hooks';
import { MazeRedactorRendererProps } from './types';
import { Canvas, Container } from './styled';

export const MazeRedactorRenderer: React.FC<MazeRedactorRendererProps> = ({
  maze,
  cursor,
  route,
  canvasWidth,
  onKeyDown,
  onAreaClick,
  onMouseMove,
  onMouseHoldMove,
  onContextMenu,
}) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const { context, areaSize, canvasHeight, calculateCursorPosition, drawPoint } = useCanvasInit(
    canvasRef,
    canvasWidth,
    maze.size,
  );
  const [mouseHold, setMouseHold] = React.useState(false);
  const enableCoords = React.useMemo(() => areaSize > tooSmallAreaSize, [areaSize]);
  const { getAreaType } = React.useMemo(() => mazeUtils(maze), [maze]);

  const drawArea = ({ x, y, type }: Area) => {
    drawPoint({ x, y }, { fill: areaFillColors[type.name] });
  };

  const drawCoords = ({ x, y }: Point) => {
    if (context && enableCoords) {
      const offset = areaSize / 2;
      coordsStyle.textFill && (context.fillStyle = coordsStyle.textFill);
      context.fillText(`${x}:${y}`, x * areaSize, y * areaSize + offset, areaSize);
    }
  };

  const drawSelect = (point: Point) => {
    drawPoint(point, cursorStyle);
  };

  const drawMaze = () => {
    React.startTransition(() => {
      context?.clearRect(0, 0, canvasWidth, canvasHeight);
      maze.areas.forEach((area) => {
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

  const drawRoute = () => {
    React.startTransition(() => {
      maze.areas.length && route.forEach((point) => drawPoint(point, routePointStyle));
    });
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    onKeyDown(event.code);
  };

  const handleClick = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
    const offset = { x: nativeEvent.offsetX, y: nativeEvent.offsetY };
    const areaPoint = calculateCursorPosition(offset);

    onAreaClick(areaPoint);
  };

  const handleMouseMove = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
    const offset = { x: nativeEvent.offsetX, y: nativeEvent.offsetY };
    const areaPoint = calculateCursorPosition(offset);

    mouseHold && onMouseHoldMove(areaPoint);
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
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      canvas.style.height = `${canvasHeight}px`;
    }
  }, [canvasWidth, canvasHeight, canvasRef.current]);

  React.useEffect(() => {
    drawMaze();
  }, [maze, route]);

  React.useEffect(() => {
    drawCursor();
  }, [cursor, maze]);

  React.useEffect(() => {
    drawRoute();
  }, [maze, cursor, route]);

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
        onMouseDown={() => setMouseHold(true)}
        onMouseUp={() => setMouseHold(false)}
        onContextMenu={handleContextMenu}
        tabIndex={0}
      />
    </Container>
  );
};
