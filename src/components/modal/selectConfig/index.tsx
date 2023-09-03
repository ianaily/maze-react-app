import React from 'react';
import { ConfigInfo } from 'src/types/config';
import { Button } from 'src/components/button';
import { Modal } from '../base';
import {
  ConfigItem,
  ConfigList,
  ConfigName,
  Container,
  ControlContainer,
  MetaInfo,
} from './styled';
import { SelectConfigModalProps } from './types';

export const SelectConfig: React.FC<SelectConfigModalProps> = ({
  configs,
  onSelect,
  onDelete,
  onCancel,
}) => {
  const [currentConfig, setCurrentConfig] = React.useState<ConfigInfo | null>(null);
  const [toDelete, setToDelete] = React.useState<boolean>(false);

  return (
    <Modal
      title="Create config"
      footer={
        <ControlContainer>
          <Button variant="grey" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            variant="red"
            onClick={() => currentConfig && onDelete(currentConfig)}
            onMouseEnter={() => setToDelete(true)}
            onMouseLeave={() => setToDelete(false)}
            disabled={!currentConfig}
          >
            Delete
          </Button>
          <Button
            variant="green"
            onClick={() => currentConfig && onSelect(currentConfig)}
            disabled={!currentConfig}
          >
            Select
          </Button>
        </ControlContainer>
      }
    >
      <Container>
        <ConfigList>
          {configs.map((config) => (
            <ConfigItem
              key={config.name}
              selected={config.name === currentConfig?.name}
              toDelete={toDelete}
              onClick={() => setCurrentConfig(config)}
            >
              <ConfigName>{config.name}</ConfigName>
              <MetaInfo>[custom areas: {config.customTypesCount}]</MetaInfo>
            </ConfigItem>
          ))}
        </ConfigList>
      </Container>
    </Modal>
  );
};
