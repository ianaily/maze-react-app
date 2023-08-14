import React from 'react';
import { observer } from 'mobx-react-lite';
import { StoreContext } from 'src/context/storeContext';
import { Renderer } from 'src/components/renderer';
import { Modal } from 'src/components/modal';
import { Container } from './styled';
import { useKeyboard } from 'src/hooks/useKeyboard';

const Gameplay: React.FC = observer(() => {
  const { mazeStore } = React.useContext(StoreContext);
  const [showPauseModal, setShowPauseModal] = React.useState(false);

  const commands: { [key: string]: VoidFunction } = {
    Escape: () => setShowPauseModal((show) => !show),
  };

  const handleKeyDown = (key: string) => {
    commands[key]?.();
  };

  useKeyboard(handleKeyDown);

  return (
    <Container>
      <Renderer.Gameplay maze={mazeStore.maze} />
      {showPauseModal && <Modal.Pause onCancel={() => setShowPauseModal(false)} />}
    </Container>
  );
});

export default Gameplay;
