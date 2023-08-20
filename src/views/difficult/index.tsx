import React from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router';
import { appLinks } from 'src/router/const';
import { Difficult as DifficultEnum } from 'src/types/game';
import { Button } from 'src/components/button';
import { Container, DifficultPanel, MainMenuContainer } from './styled';
import { useStore } from './store';

const Difficult: React.FC = observer(() => {
  const navigate = useNavigate();
  const { mazeStore } = useStore();

  const handleDifficult = (difficult: DifficultEnum) => {
    mazeStore.getRandomSavedMazeByDifficult(difficult).then();
    navigate(appLinks.gameplay);
  };

  React.useEffect(() => {
    mazeStore.loadMazeList().then();
  }, []);

  return (
    <Container>
      <DifficultPanel>
        <Button variant="green" onClick={() => handleDifficult(DifficultEnum.easy)}>
          Easy
        </Button>
        <Button variant="yellow" onClick={() => handleDifficult(DifficultEnum.normal)}>
          Medium
        </Button>
        <Button variant="red" onClick={() => handleDifficult(DifficultEnum.hard)}>
          Hard
        </Button>
      </DifficultPanel>
      <MainMenuContainer>
        <Button variant="blue" onClick={() => navigate(appLinks.mainMenu, { replace: true })}>
          Main menu
        </Button>
      </MainMenuContainer>
    </Container>
  );
});

export default Difficult;
