import React from 'react';
import { Config } from 'src/types/config';
import { Button } from 'src/components/button';
import { Modal } from '../base';
import { ConfigItem, ConfigList, Container, ControlContainer, MetaInfo } from './styled';
import { SelectConfigModalProps } from './types';

export const SelectConfig: React.FC<SelectConfigModalProps> = ({
  configs,
  onSelect,
  onDelete,
  onCancel,
}) => {
  const [currentConfig, setCurrentConfig] = React.useState<Config | null>(null);

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
            <ConfigItem key={config.name} onClick={() => setCurrentConfig(config)}>
              {config.name}
              <MetaInfo>[custom areas: {config.customTypes.length}]</MetaInfo>
            </ConfigItem>
          ))}
        </ConfigList>
      </Container>
    </Modal>
  );
};
