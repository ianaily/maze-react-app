import React from 'react';
import { defaultMazeSide, maxMazeSide, minMazeSide } from 'src/const/maze';
import { Button } from 'src/components/button';
import { GeneratePanelProps } from './types';
import { GenerateContainer, Input, SizeContainer } from './styled';

export const GeneratePanel: React.FC<GeneratePanelProps> = ({ onGenerate }) => {
  const [width, setWidth] = React.useState(defaultMazeSide);
  const [height, setHeight] = React.useState(defaultMazeSide);

  const handleWidthChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    setWidth(Math.min(+target.value, maxMazeSide));
  };

  const handleHeightChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    setHeight(Math.min(+target.value, maxMazeSide));
  };

  const handleGenerate = () => {
    onGenerate(width, height);
  };

  const invalidWidth = width < minMazeSide;
  const invalidHeight = height < minMazeSide;

  return (
    <GenerateContainer>
      <SizeContainer>
        <Input type="number" value={width} onChange={handleWidthChange} invalid={invalidWidth} />
        <Input type="number" value={height} onChange={handleHeightChange} invalid={invalidHeight} />
      </SizeContainer>
      <Button variant="green" onClick={handleGenerate} disabled={invalidWidth || invalidHeight}>
        Generate
      </Button>
    </GenerateContainer>
  );
};
