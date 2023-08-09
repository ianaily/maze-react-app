import React from 'react';
import { SaveButton } from 'src/components/buttons/styled';
import { GeneratePanelProps } from './types';
import { GenerateContainer, Input, SizeContainer } from './styled';

export const GeneratePanel: React.FC<GeneratePanelProps> = ({ onGenerate }) => {
  const [width, setWidth] = React.useState(32);
  const [height, setHeight] = React.useState(24);

  const handleWidthChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    setWidth(Math.max(+target.value, 10));
  };

  const handleHeightChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    setHeight(Math.max(+target.value, 10));
  };

  const handleGenerate = () => {
    onGenerate(width, height);
  };

  return (
    <GenerateContainer>
      <SizeContainer>
        <Input type="number" min="10" minLength={2} value={width} onChange={handleWidthChange} />
        <Input type="number" min="10" minLength={2} value={height} onChange={handleHeightChange} />
      </SizeContainer>
      <SaveButton onClick={handleGenerate}>Generate</SaveButton>
    </GenerateContainer>
  );
};
