import React from 'react';
import { SaveButton } from 'src/components/buttons/styled';
import { GeneratePanelProps } from './types';
import { GenerateContainer, Input, SizeContainer } from './styled';

const max = 250;

export const GeneratePanel: React.FC<GeneratePanelProps> = ({ onGenerate }) => {
  const [width, setWidth] = React.useState(32);
  const [height, setHeight] = React.useState(24);

  const handleWidthChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    setWidth(Math.min(+target.value, max));
  };

  const handleHeightChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    setHeight(Math.min(+target.value, max));
  };

  const handleGenerate = () => {
    onGenerate(width, height);
  };

  const invalidWidth = width < 10;
  const invalidHeight = height < 10;

  return (
    <GenerateContainer>
      <SizeContainer>
        <Input type="number" value={width} onChange={handleWidthChange} invalid={invalidWidth} />
        <Input type="number" value={height} onChange={handleHeightChange} invalid={invalidHeight} />
      </SizeContainer>
      <SaveButton onClick={handleGenerate} disabled={invalidWidth || invalidHeight}>
        Generate
      </SaveButton>
    </GenerateContainer>
  );
};
