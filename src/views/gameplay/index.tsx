import React from 'react';
import { observer } from 'mobx-react-lite';
import { useKeyboard } from 'src/hooks/useKeyboard';
import { useWindowSize } from 'src/hooks/useWindowSize';
import { Renderer } from 'src/components/renderer';
import { Modal } from 'src/components/modal';
import { Container } from './styled';
import { useStore } from './store';

const Gameplay: React.FC = observer(() => {
  const { mazeStore, playerStore, cameraStore } = useStore();
  const [showPauseModal, setShowPauseModal] = React.useState(false);
  const { width = 0, height = 0 } = useWindowSize();
  // todo add difficult condition
  const cameraSize = React.useMemo(
    () =>
      height < width
        ? { height: 5, width: Math.floor(width / (height / 5)) }
        : { width: 5, height: Math.floor(height / (width / 5)) },
    [width, height],
  );

  const commands: { [key: string]: VoidFunction } = {
    keyR: () => {
      initMaze().then();
    },
  };

  const handleKeyDown = (key: string) => {
    key === 'Escape' && setShowPauseModal((show) => !show);

    if (showPauseModal) {
      return;
    }

    commands[key]?.();

    ['ArrowUp', 'KeyW'].includes(key) && playerStore.moveUp();
    ['ArrowRight', 'KeyD'].includes(key) && playerStore.moveRight();
    ['ArrowDown', 'KeyS'].includes(key) && playerStore.moveDown();
    ['ArrowLeft', 'KeyA'].includes(key) && playerStore.moveLeft();
  };

  useKeyboard(handleKeyDown);

  const initMaze = async () => {
    await mazeStore.getRandomSavedMaze();
    playerStore.setMaze(mazeStore.maze);
    cameraStore.setMaze(mazeStore.maze);
    cameraStore.setCameraSize(cameraSize);
  };

  React.useEffect(() => {
    initMaze().then();
  }, [cameraSize]);

  React.useEffect(() => {
    cameraStore.setCameraPoint(playerStore.player.point);
  }, [playerStore.player.point]);

  return (
    <Container>
      <Renderer.Gameplay
        maze={mazeStore.maze}
        maxCanvasWidth={width}
        maxCanvasHeight={height}
        camera={cameraStore.camera}
        player={playerStore.player}
      />
      {showPauseModal && <Modal.Pause onCancel={() => setShowPauseModal(false)} />}
    </Container>
  );
});

export default Gameplay;
