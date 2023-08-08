import React from 'react';
import { LoadButton, SaveButton } from 'src/components/buttons/styled';
import { ControlPanelProps } from './types';
import { ButtonContainer, ControlContainer } from './styled';

export const ControlPanel: React.FC<ControlPanelProps> = ({ onSave, enableLoad, onLoad }) => {
  return (
    <ControlContainer>
      <ButtonContainer>
        <LoadButton onClick={onLoad} disabled={!enableLoad}>
          Load
        </LoadButton>
      </ButtonContainer>
      <ButtonContainer>
        <SaveButton onClick={onSave}>Save</SaveButton>
      </ButtonContainer>
    </ControlContainer>
  );
};
