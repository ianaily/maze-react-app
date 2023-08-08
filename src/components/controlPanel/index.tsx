import React from 'react';
import { LoadButton, SaveButton } from 'src/components/buttons/styled';
import { ControlPanelProps } from './types';
import { ButtonContainer, ControlContainer } from './styled';

export const ControlPanel: React.FC<ControlPanelProps> = ({
  onSave,
  enableLoad,
  onLoad,
  enableUpdate,
  onUpdate,
}) => {
  return (
    <ControlContainer>
      <ButtonContainer>
        <LoadButton onClick={onLoad} disabled={!enableLoad}>
          Load
        </LoadButton>
      </ButtonContainer>
      <ButtonContainer>
        <LoadButton onClick={onUpdate} disabled={!enableUpdate}>
          Update
        </LoadButton>
        <SaveButton onClick={onSave}>Save</SaveButton>
      </ButtonContainer>
    </ControlContainer>
  );
};
