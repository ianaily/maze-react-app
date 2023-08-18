import React from 'react';
import { observer } from 'mobx-react-lite';
import { useKeyboard } from 'src/hooks/useKeyboard';
import { Renderer } from 'src/components/renderer';
import { Modal } from 'src/components/modal';
import { Container } from './styled';
import { useStore } from './store';

const Gameplay: React.FC = observer(() => {
  const { mazeStore, playerStore, cameraStore } = useStore();
  const [showPauseModal, setShowPauseModal] = React.useState(false);

  const commands: { [key: string]: VoidFunction } = {
    Escape: () => setShowPauseModal((show) => !show),
    r: () => {
      initMaze();
    },
    w: () => {
      playerStore.moveUp();
    },
    s: () => {
      playerStore.moveDown();
    },
    a: () => {
      playerStore.moveLeft();
    },
    d: () => {
      playerStore.moveRight();
    },
  };

  const handleKeyDown = (key: string) => {
    commands[key]?.();
  };

  useKeyboard(handleKeyDown);

  const initMaze = () => {
    // todo get maze from storage
    mazeStore.generate({ height: 10, width: 10 });
    playerStore.setMaze(mazeStore.maze);
    cameraStore.setMaze(mazeStore.maze);
    // todo calculate camera size by maze size
    cameraStore.setCameraSize({ height: 10, width: 10 });
  };

  React.useEffect(() => {
    initMaze();
  }, []);

  // todo calculate canvasWidth and canvasHeight
  return (
    <Container>
      <Renderer.Gameplay
        maze={mazeStore.maze}
        canvasWidth={100 * 5}
        camera={cameraStore.camera}
        player={playerStore.player}
      />
      {showPauseModal && <Modal.Pause onCancel={() => setShowPauseModal(false)} />}
    </Container>
  );
});

export default Gameplay;
