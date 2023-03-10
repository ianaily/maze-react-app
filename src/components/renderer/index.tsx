import React from 'react';
import { Canvas } from './styled';
import { RendererProps } from './types';
import { areaFillStyles } from './const';

const Renderer: React.FC<RendererProps> = ({ maze, size }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');

    if (!context) {
      return;
    }

    maze.areas.map((area) => {
      context.fillStyle = areaFillStyles[area.type.name];
      context.fillRect(area.x * size, area.y * size, size, size);

      // todo coords
      context.fillStyle = 'black';
      context.fillText(`${area.x}:${area.y}`, area.x * size, area.y * size + 10, size);
    });
  }, []);

  return <Canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight} />;
};

export default Renderer;