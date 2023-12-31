import React from 'react';
import { useNavigate } from 'react-router';
import { observer } from 'mobx-react-lite';
import { appLinks } from 'src/router/const';
import { Button } from 'src/components/button';
import { Modal } from 'src/components/modal';
import { useStore } from './store';
import { Container, MenuPanel, MenuTitle, Title } from './styled';

const MainMenu: React.FC = observer(() => {
  const navigate = useNavigate();
  const { mazeStore } = useStore();
  const [showLoadModal, setShowLoadModal] = React.useState(false);

  const handleLoad = async (mazeId: string) => {
    await mazeStore.load(mazeId);
    navigate(appLinks.gameplay);
  };

  const handleDelete = (mazeId?: string) => {
    mazeStore.delete(mazeId).then(async () => {
      await mazeStore.loadMazeList();
    });
  };

  React.useEffect(() => {
    mazeStore.loadMazeList().then();
  }, []);

  return (
    <Container>
      <Title>Maze</Title>
      <MenuTitle>Main menu</MenuTitle>
      <MenuPanel>
        <Button variant="green" onClick={() => navigate(appLinks.difficult)}>
          Play!
        </Button>
        <Button variant="blue" onClick={() => setShowLoadModal(true)}>
          Load
        </Button>
        <Button variant="yellow" onClick={() => navigate(appLinks.mazeRedactor)}>
          Redactor
        </Button>
        <Button variant="grey" onClick={() => navigate(appLinks.settings)}>
          Settings
        </Button>
      </MenuPanel>
      {showLoadModal && (
        <Modal.LoadMaze
          mazeList={mazeStore.mazeList}
          onLoad={handleLoad}
          onDelete={handleDelete}
          onCancel={() => setShowLoadModal(false)}
        />
      )}
    </Container>
  );
});

export default MainMenu;
