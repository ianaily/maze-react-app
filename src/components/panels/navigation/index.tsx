import React from 'react';
import { Button } from 'src/components/button';
import { NavigationPanelProps } from './types';
import { Container } from './styled';

export const NavigationPanel: React.FC<NavigationPanelProps> = ({ onBack }) => {
  return (
    <Container>
      <Button variant="blue" onClick={onBack}>
        {'< '}Main Menu
      </Button>
    </Container>
  );
};
