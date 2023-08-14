import React from 'react';
import { Area } from 'src/types/maze';
import { areaFillStyles, playerFillStyle } from 'src/const/areaTypes';
import { useCanvasInit } from '../hooks';
import { GameplayRendererProps } from './types';
import { Canvas, Container } from './styled';

export const GameplayRenderer: React.FC<GameplayRendererProps> = ({
  canvasWidth,
  player,
  camera,
}) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const { context, areaSize, canvasHeight } = useCanvasInit(canvasRef, canvasWidth, camera.size);

  const drawArea = ({ x, y, type }: Area) => {
    if (!context) {
      return;
    }

    context.fillStyle = areaFillStyles[type.name];
    context.fillRect(x * areaSize, y * areaSize, areaSize, areaSize);
  };

  const drawPlayer = () => {
    if (!context) {
      return;
    }

    context.fillStyle = playerFillStyle;
    context.fillRect(player.point.x * areaSize, player.point.y * areaSize, areaSize, areaSize);
  };

  const drawCamera = () => {
    camera.areas.map((area) => {
      drawArea(area);
    });
  };

  React.useEffect(() => {
    drawCamera();
    drawPlayer();
  }, [camera, player, context]);

  return (
    <Container>
      <Canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} tabIndex={0} />
    </Container>
  );
};
