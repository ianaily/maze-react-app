import React from 'react';
import { Button } from 'src/components/button';
import { ControlPanelProps } from './types';
import { ButtonContainer, ControlContainer } from './styled';

export const ControlPanel: React.FC<ControlPanelProps> = ({
  onSave,
  enableLoad,
  onLoad,
  enableDelete,
  onDelete,
}) => (
  <ControlContainer>
    <ButtonContainer>
      <Button variant="blue" onClick={onLoad} disabled={!enableLoad}>
        Load
      </Button>
    </ButtonContainer>
    <ButtonContainer>
      <Button variant="red" onClick={onDelete} disabled={!enableDelete}>
        Delete
      </Button>
      <Button variant="green" onClick={onSave}>
        Save
      </Button>
    </ButtonContainer>
  </ControlContainer>
);
