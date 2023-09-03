import React from 'react';
import { Point } from 'src/types/point';
import { AreaSprite } from 'src/types/camera';
import { sprites } from 'src/const/spritesMap';
import { Loading } from 'src/components/loading/styled';
import { useCanvasInit } from '../hooks';
import { GameplayRendererProps } from './types';
import { Canvas, Container } from './styled';
import { useSprite } from './hooks';

export const GameplayRenderer: React.FC<GameplayRendererProps> = ({
  maxCanvasWidth,
  maxCanvasHeight,
  player,
  camera,
  config,
}) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const canvasSize = maxCanvasWidth < maxCanvasHeight ? maxCanvasWidth : maxCanvasHeight;
  const {
    context,
    drawPoint,
    areaSize = 0,
  } = useCanvasInit(canvasRef, canvasSize, camera.size, 'height');
  // todo redo
  const canvasWidth = React.useMemo(() => areaSize * camera.size.width, [canvasSize, areaSize]);
  const canvasHeight = React.useMemo(() => areaSize * camera.size.height, [canvasSize, areaSize]);
  const { spritesLoaded, getSpite } = useSprite(config);

  const drawArea = (area: AreaSprite, point: Point) => {
    console.log('before fail', getSpite(area.sprite));
    drawPoint(point, { image: getSpite(area.sprite) });
    console.log('after fail');
  };

  const drawPlayer = () => {
    const firstPoint = camera.areas[0] || { x: 0, y: 0 };
    const point = {
      x: player.point.x - firstPoint.x,
      y: player.point.y - firstPoint.y,
    };
    drawPoint(point, { image: getSpite(sprites.char) });
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

    window.requestAnimationFrame(updateFrame);
  }, [context, spritesLoaded]);

  React.useEffect(() => {
    updateFrame();
  }, [camera.point, player.point]);

  return (
    <Container width={canvasWidth} height={canvasHeight}>
      {!spritesLoaded && <Loading width="64px" height="64px" />}
      {canvasWidth && canvasHeight && (
        <Canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} tabIndex={0} />
      )}
    </Container>
  );
};
