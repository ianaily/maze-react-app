import React from 'react';
import { useNavigate } from 'react-router';
import { appLinks } from 'src/router/const';
import { Button } from 'src/components/button';
import { Container, MenuPanel, MenuTitle, Title } from './styled';

const MainMenu: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Title>Maze</Title>
      <MenuTitle>Main menu</MenuTitle>
      <MenuPanel>
        <Button variant="green" onClick={() => navigate(appLinks.gameplay)}>
          Play!
        </Button>
        <Button variant="blue" onClick={() => navigate(appLinks.mazeRedactor)}>
          Redactor
        </Button>
      </MenuPanel>
    </Container>
  );
};

export default MainMenu;
