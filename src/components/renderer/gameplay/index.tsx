import React from 'react';
import { Area } from 'src/types/maze';
import { areaFillColors } from 'src/const/areaTypes';
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

  const drawArea = ({ x, y, type }: Area) => {
    drawPoint({ x, y }, { fill: areaFillColors[type.name] });
  };

  const drawPlayer = () => {
    drawPoint(player.point, playerStyle);
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
