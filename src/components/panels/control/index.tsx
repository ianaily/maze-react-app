import React from 'react';
import { Button } from 'src/components/button';
import { Input } from 'src/components/input';
import { ControlPanelProps } from './types';
import { ButtonContainer, ControlContainer } from './styled';

export const ControlPanel: React.FC<ControlPanelProps> = ({
  onSave,
  enableLoad,
  onLoad,
  enableDelete,
  onDelete,
  mazeName,
  onMazeNameChange,
}) => (
  <ControlContainer>
    <ButtonContainer>
      <Button variant="blue" onClick={onLoad} disabled={!enableLoad}>
        Load
      </Button>
    </ButtonContainer>
    <ButtonContainer>
      <Input
        type="text"
        invalid={!mazeName.length}
        value={mazeName}
        onChange={({ target }) => onMazeNameChange(target.value)}
      />
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
