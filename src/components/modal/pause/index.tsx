import React from 'react';
import { Modal } from 'src/components/modal/base';
import { Button } from 'src/components/button';
import { PauseModalProps } from './types';
import { ControlContainer } from './styled';

export const PauseModal: React.FC<PauseModalProps> = ({ onMainMenu, onCancel }) => {
  return (
    <Modal title={<span>Pause</span>} footer={<div />}>
      <ControlContainer>
        <Button variant="blue" onClick={onMainMenu}>
          Main menu
        </Button>
        <Button variant="grey" onClick={onCancel}>
          Resume
        </Button>
      </ControlContainer>
    </Modal>
  );
};
