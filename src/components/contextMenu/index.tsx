import React from 'react';
import { AreaType } from 'src/types/maze';
import { useOutsideClick } from 'src/hooks/useOutsideClick';
import { AreaPalette } from 'src/components/palettePanel/styled';
import { RedactorCanvasContextMenuProps } from './types';
import { AreaTypeRow, ContextDropdown } from './styled';

export const RedactorCanvasContextMenu: React.FC<RedactorCanvasContextMenuProps> = ({
  x,
  y,
  areaTypes,
  onSelectAreaType,
  onClose,
}) => {
  const ref = React.useRef<HTMLDivElement>(null);

  const handleRowClick = (areaType: AreaType) => {
    onSelectAreaType(areaType);
    onClose();
  };

  useOutsideClick([ref], onClose);

  return (
    <ContextDropdown ref={ref} x={x} y={y} isOpened>
      {areaTypes.map((type) => (
        <AreaTypeRow key={type.name} onClick={() => handleRowClick(type)}>
          <AreaPalette type={type.name} />
          <span>{type.name}</span>
        </AreaTypeRow>
      ))}
    </ContextDropdown>
  );
};
