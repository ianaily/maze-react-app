import React from 'react';
import { AreaConfig } from 'src/types/config';
import { useKeyboard } from 'src/hooks/useKeyboard';
import { Dropdown } from 'src/components/dropdown';
import { PalettePanelProps } from './types';
import { AreaPaletteBlock, AreaInfo, AreaPalette, AreaTypeList, Container } from './styled';

export const PalettePanel: React.FC<PalettePanelProps> = ({ areaType, areaTypes, onSelect }) => {
  const [palettesOpened, setPalettesOpened] = React.useState(false);
  const [history, setHistory] = React.useState<AreaConfig[]>([]);
  const prev = React.useMemo(() => history?.[0] || null, [history]);
  const triggerRef = React.useRef<HTMLDivElement>(null);

  const handleKeyDown = (key: string) => {
    key === 'KeyX' && prev && onSelect(prev);
  };

  const handleSwitchShowPalettes = () => {
    setPalettesOpened((opened) => !opened);
  };

  const handleClosePalettes = () => {
    setPalettesOpened(false);
  };

  const handleSelectArea = (areaType: AreaConfig) => {
    setPalettesOpened(false);
    onSelect(areaType);
  };

  const handleSelectPrevArea = () => {
    setPalettesOpened(false);
    prev && onSelect(prev);
  };

  useKeyboard(handleKeyDown);

  React.useEffect(() => {
    setHistory((history) =>
      history.length ? [history[history.length - 1], areaType] : [areaType],
    );
  }, [areaType]);

  return (
    <Container>
      <AreaPaletteBlock ref={triggerRef}>
        <AreaPalette color={areaType.color} onClick={handleSwitchShowPalettes} />
        <AreaInfo>
          <span>{areaType.name}</span>
          <span>passable: {areaType.passable ? 'yes' : 'no'}</span>
        </AreaInfo>
      </AreaPaletteBlock>
      {prev && (
        <AreaPaletteBlock>
          <AreaPalette color={prev.color} onClick={handleSelectPrevArea} />
          <AreaInfo>
            <span>{prev.name}</span>
            <span>passable: {prev.passable ? 'yes' : 'no'}</span>
          </AreaInfo>
        </AreaPaletteBlock>
      )}
      <Dropdown
        isOpened={palettesOpened}
        onHide={handleClosePalettes}
        triggerRef={triggerRef}
        offsetTop="xm"
      >
        <AreaTypeList>
          {areaTypes.map((type) => (
            <AreaPalette
              key={type.name}
              color={type.color}
              onClick={() => handleSelectArea(type)}
            />
          ))}
        </AreaTypeList>
      </Dropdown>
    </Container>
  );
};
