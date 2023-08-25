import React from 'react';
import { AreaTypeKeys, AreaTypes } from 'src/types/maze';
import { areaFillColors } from 'src/const/areaTypes';
import { sprites, spritesMap } from 'src/const/spritesMap';
import { UploadInput } from 'src/components/uploadInput';
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
  MultiSprite,
  Sprite,
} from './styled';

export const ConfigModal: React.FC<ConfigModalProps> = ({ onCancel, onSave }) => {
  const handleSave = () => {
    onSave();
  };

  const handleImport = (item: string) => {
    console.log(item);
  };

  return (
    <Modal
      title="Create config"
      footer={
        <ControlContainer>
          <Button variant="grey" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="green" onClick={handleSave}>
            Save
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
            {type.name === AreaTypeKeys.Wall ? (
              <MultiSprite>
                <Sprite src={sprites.middleWall} />
              </MultiSprite>
            ) : (
              <UploadInput onImport={handleImport} type="image/*">
                <Sprite src={spritesMap[type.name]} />
              </UploadInput>
            )}
          </AreaType>
        ))}
      </Container>
    </Modal>
  );
};
