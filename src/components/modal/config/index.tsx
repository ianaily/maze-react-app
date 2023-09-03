import React from 'react';
import { AreaTypeKeys } from 'src/types/maze';
import { initialChars, initialTypes, initialWalls, initialWallType } from 'src/const/config';
import { areaFillColors, AreaTypes } from 'src/const/areaTypes';
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
  ConfigNameInput,
} from './styled';
import { initialCustomType, initialCustomTypes } from './const';
import { useValidate } from './hooks';

export const ConfigModal: React.FC<ConfigModalProps> = ({ onCancel, onSave }) => {
  const wallsTriggerRef = React.useRef<HTMLDivElement>(null);
  const charTriggerRef = React.useRef<HTMLDivElement>(null);
  const [wallsOpened, setWallsOpened] = React.useState(false);
  const [charsOpened, setCharsOpened] = React.useState(false);
  const [configName, setConfigName] = React.useState('New Config Name');
  const [types, setTypes] = React.useState([...initialTypes]);
  const [walls, setWalls] = React.useState({ ...initialWalls });
  const [chars, setChars] = React.useState({ ...initialChars });
  const [customTypes, setCustomTypes] = React.useState([...initialCustomTypes]);
  const { isValidName, isValidShort, isValidColor, isValidType, isValid } = useValidate(
    configName,
    types,
    customTypes,
  );

  const handleSave = () => {
    onSave({
      name: configName,
      types: [...types, initialWallType],
      wallSprites: walls,
      charSprites: chars,
      customTypes,
    });
  };

  const handleImport = (index: number, content: string) => {
    const typesCopy = [...types];
    typesCopy[index].sprite = content;

    setTypes(typesCopy);
  };

  const handleCustomImport = (index: number, content: string) => {
    const types = [...customTypes];

    types[index].sprite = content;
    setCustomTypes(types);
  };

  const handleWallImport = (wallName: string, content: string) => {
    setWalls({ ...walls, [wallName]: content });
  };

  const handleCharImport = (charDirect: string, content: string) => {
    setChars({ ...chars, [charDirect]: content });
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
        <ConfigNameInput
          type="text"
          invalid={!configName.length}
          placeholder="input config name..."
          value={configName}
          onChange={({ target }) => setConfigName(target.value)}
        />
        <AreaType>
          <AreaTypeName>Character</AreaTypeName>
          <MultiSprite ref={charTriggerRef} onClick={() => setCharsOpened((prev) => !prev)}>
            <Sprite src={sprites.char} />
            <Dropdown
              theme="dark"
              isOpened={charsOpened}
              onHide={() => setCharsOpened(false)}
              triggerRef={charTriggerRef}
            >
              <MultiSpriteDropdown>
                {Object.keys(chars).map((charDirect) => (
                  <UploadInput
                    key={charDirect}
                    onImport={(content) => handleCharImport(charDirect, content)}
                    type="image/*"
                  >
                    <Sprite src={chars[charDirect]} />
                  </UploadInput>
                ))}
              </MultiSpriteDropdown>
            </Dropdown>
          </MultiSprite>
        </AreaType>
        <AreaType>
          <AreaTypeInfo>
            <AreaTypeColor color={areaFillColors[AreaTypeKeys.Wall]} />
            <AreaTypeShort>{AreaTypes.Wall.short}</AreaTypeShort>
            <AreaTypeName>{AreaTypes.Wall.name}</AreaTypeName>
          </AreaTypeInfo>
          <AreaTypePassable>passable: no</AreaTypePassable>
          <MultiSprite ref={wallsTriggerRef} onClick={() => setWallsOpened((prev) => !prev)}>
            <Sprite src={sprites.middleWall} />
            <Dropdown
              theme="dark"
              isOpened={wallsOpened}
              onHide={() => setWallsOpened(false)}
              triggerRef={wallsTriggerRef}
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
        {types.map((type, index) => (
          <AreaType key={type.short}>
            <AreaTypeInfo>
              <AreaTypeColor color={type.color} />
              <AreaTypeShort>{type.short}</AreaTypeShort>
              <AreaTypeName>{type.name}</AreaTypeName>
            </AreaTypeInfo>
            <AreaTypePassable>passable: {type.passable ? 'yes' : 'no'}</AreaTypePassable>
            <UploadInput onImport={(content) => handleImport(index, content)} type="image/*">
              <Sprite src={type.sprite} />
            </UploadInput>
          </AreaType>
        ))}
        {customTypes.map((type, index) => (
          <CustomAreaType key={type.short} invalid={!isValidType(type)}>
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
                invalid={(value) => !isValidName(value)}
                initialValue={type.name}
                onAccept={(name) => handleChangeCustomType(index, 'name', name)}
              >
                <AreaTypeName invalid={!isValidName(type.name)}>{type.name}</AreaTypeName>
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
