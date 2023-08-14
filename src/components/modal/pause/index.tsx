import React from 'react';
import { Modal } from 'src/components/modal/base';
import { Button } from 'src/components/button';
import { PauseModalProps } from './types';
import { ControlContainer } from './styled';

export const PauseModal: React.FC<PauseModalProps> = ({ onCancel }) => {
  return (
    <Modal
      title={<span>Pause</span>}
      footer={
        <ControlContainer>
          <Button variant="grey" onClick={onCancel}>
            Cancel
          </Button>
        </ControlContainer>
      }
    >
      Pause
    </Modal>
  );
};
