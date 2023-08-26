import React from 'react';
import { AreaConfig } from 'src/types/config';
import { AreaTypeKeys, AreaTypes } from 'src/types/maze';
import { areaFillColors } from 'src/const/areaTypes';
import { sprites } from 'src/const/spritesMap';
import { DropdownInput } from 'src/components/dropdownInput';
import { UploadInput } from 'src/components/uploadInput';
import { Dropdown } from 'src/components/dropdown';
import { Button } from 'src/components/button';
import { Modal } from '../base';
import { ConfigModalProps } from './types';
import {
  AddTypeContainer,
  AreaType,
  AreaTypeColor,
  AreaTypePassable,
  AreaTypeInfo,
  AreaTypeName,
  AreaTypeShort,
  Container,
  ControlContainer,
  CustomAreaType,
  DeleteButton,
  MultiSprite,
  MultiSpriteDropdown,
  RightSide,
  Sprite,
} from './styled';
import { initialCustomType, initialCustomTypes, initialTypes, initialWalls } from './const';

export const ConfigModal: React.FC<ConfigModalProps> = ({ onCancel, onSave }) => {
  const triggerRef = React.useRef<HTMLDivElement>(null);
  const [wallsOpened, setWallsOpened] = React.useState(false);
  const [types, setTypes] = React.useState({ ...initialTypes });
  const [walls, setWalls] = React.useState({ ...initialWalls });
  const [customTypes, setCustomTypes] = React.useState([...initialCustomTypes]);

  const handleSave = () => {
    onSave();
  };

  const handleImport = (item: AreaConfig, content: string) => {
    setTypes({ ...types, [item.name]: { ...types[item.name], sprite: content } });
  };

  const handleCustomImport = (index: number, content: string) => {
    const types = [...customTypes];

    types[index].sprite = content;
    setCustomTypes(types);
  };

  const handleWallImport = (wallName: string, content: string) => {
    setWalls({ ...walls, [wallName]: content });
  };

  const handleChangeCustomType = (index: number, key: string, value: string | boolean) => {
    const types = [...customTypes];

    types[index][key] = value;
    setCustomTypes(types);
  };

  const handleAddType = () => {
    const types = [...customTypes];
    types.push({ ...initialCustomType });
    setCustomTypes(types);
  };

  const handleDeleteType = (index: number) => {
    const types = customTypes.filter((_, i) => i !== index);

    setCustomTypes(types);
  };

  const isUniq = React.useCallback(
    (key: string, value: string) => {
      const customUniq = customTypes.filter((type) => type[key] === value);
      const typesUniq = Object.values(types).filter((type) => type[key] === value);

      return typesUniq.length === 0 && customUniq.length <= 1;
    },
    [customTypes],
  );

  const isValidShort = (value: string) => isUniq('short', value) && value !== '&';

  const isValidColor = (value: string) => {
    const colorHexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

    return isUniq('color', value) && colorHexRegex.test(value);
  };

  const isUniqRow = React.useCallback(
    (item: AreaConfig) =>
      isUniq('name', item.name) && isValidShort(item.short) && isValidColor(item.color),
    [isUniq],
  );

  const isValid = React.useMemo(() => customTypes.every((type) => isUniqRow(type)), [customTypes]);

  return (
    <Modal
      title="Create config"
      footer={
        <ControlContainer>
          <Button variant="grey" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="green" onClick={handleSave} disabled={!isValid}>
            Save
          </Button>
        </ControlContainer>
      }
    >
      <Container>
        <AreaType>
          <AreaTypeInfo>
            <AreaTypeColor color={areaFillColors[AreaTypeKeys.Wall]} />
            <AreaTypeShort>{AreaTypes.Wall.short}</AreaTypeShort>
            <AreaTypeName>{AreaTypes.Wall.name}</AreaTypeName>
          </AreaTypeInfo>
          <AreaTypePassable>passable: no</AreaTypePassable>
          <MultiSprite ref={triggerRef} onClick={() => setWallsOpened((prev) => !prev)}>
            <Sprite src={sprites.middleWall} />
            <Dropdown
              theme="dark"
              isOpened={wallsOpened}
              onHide={() => setWallsOpened(false)}
              triggerRef={triggerRef}
            >
              <MultiSpriteDropdown>
                {Object.keys(walls).map((wallName) => (
                  <UploadInput
                    key={wallName}
                    onImport={(content) => handleWallImport(wallName, content)}
                    type="image/*"
                  >
                    <Sprite src={walls[wallName]} />
                  </UploadInput>
                ))}
              </MultiSpriteDropdown>
            </Dropdown>
          </MultiSprite>
        </AreaType>
        {Object.values(types).map((type) => (
          <AreaType key={type.short}>
            <AreaTypeInfo>
              <AreaTypeColor color={type.color} />
              <AreaTypeShort>{type.short}</AreaTypeShort>
              <AreaTypeName>{type.name}</AreaTypeName>
            </AreaTypeInfo>
            <AreaTypePassable>passable: {type.passable ? 'yes' : 'no'}</AreaTypePassable>
            <UploadInput onImport={(content) => handleImport(type, content)} type="image/*">
              <Sprite src={type.sprite} />
            </UploadInput>
          </AreaType>
        ))}
        {customTypes.map((type, index) => (
          <CustomAreaType key={type.short} invalid={!isUniqRow(type)}>
            <AreaTypeInfo>
              <DropdownInput
                required
                invalid={(value) => !isValidColor(value)}
                initialValue={type.color}
                onAccept={(color) => handleChangeCustomType(index, 'color', color)}
              >
                <AreaTypeColor color={type.color} invalid={!isValidColor(type.color)} />
              </DropdownInput>
              <DropdownInput
                required
                maxlength={1}
                invalid={(value) => !isValidShort(value)}
                initialValue={type.short}
                onAccept={(short) => handleChangeCustomType(index, 'short', short)}
              >
                <AreaTypeShort invalid={!isValidShort(type.short)}>{type.short}</AreaTypeShort>
              </DropdownInput>
              <DropdownInput
                required
                invalid={(value) => !isUniq('name', value)}
                initialValue={type.name}
                onAccept={(name) => handleChangeCustomType(index, 'name', name)}
              >
                <AreaTypeName invalid={!isUniq('name', type.name)}>{type.name}</AreaTypeName>
              </DropdownInput>
            </AreaTypeInfo>
            <AreaTypePassable>
              passable:{' '}
              <input
                type="checkbox"
                checked={type.passable}
                onChange={() => handleChangeCustomType(index, 'passable', !type.passable)}
              />
            </AreaTypePassable>
            <RightSide>
              <UploadInput
                onImport={(content) => handleCustomImport(index, content)}
                type="image/*"
              >
                <Sprite src={type.sprite} />
              </UploadInput>
              <DeleteButton variant="transparent" onClick={() => handleDeleteType(index)}>
                ×
              </DeleteButton>
            </RightSide>
          </CustomAreaType>
        ))}
        <AddTypeContainer>
          <Button variant="green" onClick={handleAddType}>
            Add type
          </Button>
        </AddTypeContainer>
      </Container>
    </Modal>
  );
};
