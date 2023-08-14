import React from 'react';
import { observer } from 'mobx-react-lite';
import { StoreContext } from 'src/context/storeContext';
import { Renderer } from 'src/components/renderer';
import { Modal } from 'src/components/modal';
import { Container } from './styled';
import { useKeyboard } from 'src/hooks/useKeyboard';
import { PlayerStore } from '../../stores/playerStore';
import { toJS } from 'mobx';

const Gameplay: React.FC = observer(() => {
  const { mazeStore } = React.useContext(StoreContext);
  const [showPauseModal, setShowPauseModal] = React.useState(false);
  const playerStore = React.useMemo(() => new PlayerStore(), []);
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
      <Renderer.Gameplay maze={mazeStore.maze} />
      {showPauseModal && <Modal.Pause onCancel={() => setShowPauseModal(false)} />}
    </Container>
  );
});

export default Gameplay;
