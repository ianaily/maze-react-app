import React from 'react';
import { AreaTypeKeys, AreaTypes } from 'src/types/maze';
import { areaFillColors } from 'src/const/areaTypes';
import { sprites, spritesMap, walls } from 'src/const/spritesMap';
import { UploadInput } from 'src/components/uploadInput';
import { Dropdown } from 'src/components/dropdown';
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
  MultiSpriteDropdown,
  Sprite,
} from './styled';

export const ConfigModal: React.FC<ConfigModalProps> = ({ onCancel, onSave }) => {
  const triggerRef = React.useRef<HTMLDivElement>(null);
  const [wallsOpened, setWallsOpened] = React.useState(false);

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
              <MultiSprite ref={triggerRef} onClick={() => setWallsOpened((prev) => !prev)}>
                <Sprite src={sprites.middleWall} />
                <Dropdown
                  theme="dark"
                  isOpened={wallsOpened}
                  onHide={() => setWallsOpened(false)}
                  triggerRef={triggerRef}
                >
                  <MultiSpriteDropdown>
                    {Object.values(walls).map((wall) => (
                      <UploadInput key={wall} onImport={handleImport} type="image/*">
                        <Sprite src={wall} />
                      </UploadInput>
                    ))}
                  </MultiSpriteDropdown>
                </Dropdown>
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
