import React from 'react';
import { AreaType } from 'src/types/maze';
import { useOutsideClick } from 'src/hooks/useOutsideClick';
import { Dropdown } from 'src/components/dropdown';
import { RedactorContextMenuProps } from './types';
import { AreaTypePalette, AreaTypeRow, Container } from './styled';

export const RedactorContextMenu: React.FC<RedactorContextMenuProps> = ({
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
    <Dropdown isOpened onHide={onClose} triggerRef={ref} customPosition={{ x, y }}>
      <Container ref={ref}>
        {areaTypes.map((type) => (
          <AreaTypeRow key={type.name} onClick={() => handleRowClick(type)}>
            <AreaTypePalette type={type.name} />
            <span>{type.name}</span>
          </AreaTypeRow>
        ))}
      </Container>
    </Dropdown>
  );
};
