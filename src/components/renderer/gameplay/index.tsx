import React from 'react';
import { Point } from 'src/types/point';
import { AreaSprite } from 'src/types/camera';
import { spritesImages } from 'src/const/spritesMap';
import { playerStyle } from '../const';
import { useCanvasInit } from '../hooks';
import { GameplayRendererProps } from './types';
import { Canvas, Container } from './styled';

export const GameplayRenderer: React.FC<GameplayRendererProps> = ({
  maxCanvasWidth,
  maxCanvasHeight,
  player,
  camera,
}) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const canvasSize = maxCanvasWidth < maxCanvasHeight ? maxCanvasWidth : maxCanvasHeight;
  const { context, drawPoint, areaSize = 0 } = useCanvasInit(canvasRef, canvasSize, camera.size);
  // todo redo
  const canvasWidth = React.useMemo(() => areaSize * camera.size.width, [canvasSize, areaSize]);
  const canvasHeight = React.useMemo(() => areaSize * camera.size.height, [canvasSize, areaSize]);

  const drawArea = (area: AreaSprite, point: Point) => {
    drawPoint(point, { image: spritesImages[area.sprite] });
  };

  const drawPlayer = () => {
    const firstPoint = camera.areas[0] || { x: 0, y: 0 };
    const point = {
      x: player.point.x - firstPoint.x,
      y: player.point.y - firstPoint.y,
    };
    drawPoint(point, playerStyle);
  };

  const drawCamera = () => {
    const { height } = camera.size;
    camera.areas.map((area, index) => {
      const point = {
        x: Math.floor(index / height),
        y: index % height,
      };
      drawArea(area, point);
    });
  };

  const updateFrame = () => {
    context?.clearRect(0, 0, canvasWidth, canvasHeight);

    drawCamera();
    drawPlayer();
  };

  React.useEffect(() => {
    updateFrame();

    requestAnimationFrame(updateFrame);
  }, [context]);

  React.useEffect(() => {
    updateFrame();
  }, [camera.point, player.point]);

  return (
    <Container width={canvasWidth} height={canvasHeight}>
      {canvasWidth && canvasHeight && (
        <Canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} tabIndex={0} />
      )}
    </Container>
  );
};
