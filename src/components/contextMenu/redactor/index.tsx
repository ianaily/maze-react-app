import React from 'react';
import { AreaConfig } from 'src/types/config';
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

  const handleRowClick = (areaType: AreaConfig) => {
    onSelectAreaType(areaType);
    onClose();
  };

  useOutsideClick([ref], onClose);

  return (
    <Dropdown isOpened onHide={onClose} triggerRef={ref} customPosition={{ x, y }}>
      <Container ref={ref}>
        {areaTypes.map((type) => (
          <AreaTypeRow key={type.name} onClick={() => handleRowClick(type)}>
            <AreaTypePalette color={type.color} />
            <span>{type.name}</span>
          </AreaTypeRow>
        ))}
      </Container>
    </Dropdown>
  );
};
