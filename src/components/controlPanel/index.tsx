import React from 'react';
import { DeleteButton, LoadButton, SaveButton } from 'src/components/buttons/styled';
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
      <LoadButton onClick={onLoad} disabled={!enableLoad}>
        Load
      </LoadButton>
    </ButtonContainer>
    <ButtonContainer>
      <DeleteButton onClick={onDelete} disabled={!enableDelete}>
        Delete
      </DeleteButton>
      <SaveButton onClick={onSave}>Save</SaveButton>
    </ButtonContainer>
  </ControlContainer>
);
