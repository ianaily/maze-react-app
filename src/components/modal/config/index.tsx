import React from 'react';
import { AreaTypes } from 'src/types/maze';
import { areaFillColors } from 'src/const/areaTypes';
import { spritesMap } from 'src/const/spritesMap';
import { Button } from 'src/components/button';
import { Modal } from '../base';
import { ConfigModalProps } from './types';
import {
  AreaType,
  AreaTypeColor,
  AreaTypeData,
  AreaTypeInfo,
  AreaTypeName,
  AreaTypeShort,
  Container,
  ControlContainer,
  Sprite,
} from './styled';

export const ConfigModal: React.FC<ConfigModalProps> = ({ onCancel }) => {
  return (
    <Modal
      title="Create config"
      footer={
        <ControlContainer>
          <Button variant="grey" onClick={onCancel}>
            Cancel
          </Button>
        </ControlContainer>
      }
    >
      <Container>
        {Object.values(AreaTypes).map((type) => (
          <AreaType key={type.short}>
            <AreaTypeInfo>
              <AreaTypeColor type={areaFillColors[type.name]} />
              <AreaTypeShort>{type.short}</AreaTypeShort>
              <AreaTypeName>{type.name}</AreaTypeName>
            </AreaTypeInfo>
            <AreaTypeData>passable: {type.passable ? 'yes' : 'no'}</AreaTypeData>
            <Sprite src={spritesMap[type.name]} />
          </AreaType>
        ))}
      </Container>
    </Modal>
  );
};
