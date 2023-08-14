import React from 'react';
import { AreaType } from 'src/types/maze';
import { useOutsideClick } from 'src/hooks/useOutsideClick';
import { useContextPosition } from './hooks';
import { RedactorContextMenuProps } from './types';
import { AreaTypePalette, AreaTypeRow, ContextDropdown } from './styled';

export const RedactorContextMenu: React.FC<RedactorContextMenuProps> = ({
  x,
  y,
  areaTypes,
  onSelectAreaType,
  onClose,
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const position = useContextPosition(ref, x, y);

  const handleRowClick = (areaType: AreaType) => {
    onSelectAreaType(areaType);
    onClose();
  };

  useOutsideClick([ref], onClose);

  return (
    <ContextDropdown ref={ref} top={position.y} left={position.x} isOpened>
      {areaTypes.map((type) => (
        <AreaTypeRow key={type.name} onClick={() => handleRowClick(type)}>
          <AreaTypePalette type={type.name} />
          <span>{type.name}</span>
        </AreaTypeRow>
      ))}
    </ContextDropdown>
  );
};
