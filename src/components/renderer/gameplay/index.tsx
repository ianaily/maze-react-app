import React from 'react';
import { AreaSprite } from 'src/types/camera';
import { playerStyle } from '../const';
import { useCanvasInit } from '../hooks';
import { GameplayRendererProps } from './types';
import { Canvas, Container } from './styled';

export const GameplayRenderer: React.FC<GameplayRendererProps> = ({
  canvasWidth,
  player,
  camera,
}) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const { context, canvasHeight, drawPoint } = useCanvasInit(canvasRef, canvasWidth, camera.size);

  const drawArea = (area: AreaSprite) => {
    const sprite = new Image();
    sprite.src = area.sprite;

    drawPoint(area, { image: sprite });
  };

  const drawPlayer = () => {
    drawPoint(player.point, playerStyle);
  };

  const drawCamera = () => {
    camera.areas.map((area) => {
      drawArea(area);
    });
  };

  const updateFrame = () => {
    drawCamera();
    drawPlayer();

    requestAnimationFrame(updateFrame);
  };

  React.useEffect(() => {
    updateFrame();
  }, [context, player.point]);

  return (
    <Container>
      <Canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} tabIndex={0} />
    </Container>
  );
};
