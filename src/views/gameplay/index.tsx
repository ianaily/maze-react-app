import React from 'react';
import { observer } from 'mobx-react-lite';
import { toJS } from 'mobx';
import { useKeyboard } from 'src/hooks/useKeyboard';
import { Renderer } from 'src/components/renderer';
import { Modal } from 'src/components/modal';
import { Container } from './styled';
import { useStore } from './store';

const Gameplay: React.FC = observer(() => {
  const { mazeStore, playerStore } = useStore();
  const [showPauseModal, setShowPauseModal] = React.useState(false);

  const commands: { [key: string]: VoidFunction } = {
    Escape: () => setShowPauseModal((show) => !show),
    w: () => {
      playerStore.moveTop();
      console.log(toJS(playerStore.player.point));
    },
    s: () => {
      playerStore.moveBottom();
      console.log(toJS(playerStore.player.point));
    },
    a: () => {
      playerStore.moveLeft();
      console.log(toJS(playerStore.player.point));
    },
    d: () => {
      playerStore.moveRight();
      console.log(toJS(playerStore.player.point));
    },
  };

  const handleKeyDown = (key: string) => {
    commands[key]?.();
  };

  useKeyboard(handleKeyDown);

  React.useEffect(() => {
    mazeStore.generate({ height: 90, width: 70 });
    playerStore.setMaze(mazeStore.maze);
    playerStore.setPosition(mazeStore.maze.enter);
  }, []);
  return (
    <Container>
      <Renderer.Gameplay
        maze={mazeStore.maze}
        canvasWidth={window.innerWidth - 80}
        camera={{ point: mazeStore.maze.enter, size: { width: 5, height: 5 }, areas: [] }}
        player={{ point: mazeStore.maze.enter }}
      />
      {showPauseModal && <Modal.Pause onCancel={() => setShowPauseModal(false)} />}
    </Container>
  );
});

export default Gameplay;
