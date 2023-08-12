import React from 'react';
import { GameplayRendererProps } from './types';
import { Canvas, Container } from './styled';

export const GameplayRenderer: React.FC<GameplayRendererProps> = ({ maze }) => {
  return (
    <Container>
      <Canvas />
    </Container>
  );
};
