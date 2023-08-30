import React from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { Import } from 'src/types/save';
import { Config, ConfigInfo } from 'src/types/config';
import { writeFile } from 'src/utils/ioFiles';
import { stringifyMaze } from 'src/utils/mazeUtils';
import { useIsElectron } from 'src/hooks/useIsElectron';
import { appLinks } from 'src/router/const';
import { Modal } from 'src/components/modal';
import { Panel } from 'src/components/panels';
import { Button } from 'src/components/button';
import { UploadInput } from 'src/components/uploadInput';
import { useStore } from './store';
import { ButtonsBlock, Container, HeadControl, SettingsContainer, SettingsPanel } from './styled';

const Settings: React.FC = observer(() => {
  const navigate = useNavigate();
  const isElectron = useIsElectron();
  const { mazeStore, configStore } = useStore();
  const [showSavesModal, setShowSavesModal] = React.useState(false);
  const [showConfigModal, setShowConfigModal] = React.useState(false);
  const [showSetConfigModal, setShowSetConfigModal] = React.useState(false);

  const handleSave = async (config: Config) => {
    try {
      await configStore.saveConfig(config);
      toast.success(`Config ${config.name} was saved`);
      setShowConfigModal(false);
    } catch {
      toast.error(`Error while saving config ${config.name}`);
    }
  };

  const handleImport = async (content: string, name: string) => {
    if (!name?.includes('.json')) {
      toast.error('JSON configuration files only');
    }

    const mazeImport = JSON.parse(content) as Import;

    mazeStore.importMaze(mazeImport);
    toast.success(`Maze ${mazeImport.id} was import`);
  };

  const handleExport = async (mazeId: string) => {
    if (!mazeId) {
      return;
    }

    try {
      await mazeStore.load(mazeId);
      const maze = stringifyMaze(mazeStore.maze);
      const save = JSON.stringify({
        id: mazeId,
        maze,
      });
      await writeFile(`${mazeId}.json`, save);
      toast.success(`Maze ${mazeId} was export`);
    } catch (error) {
      toast.error(`'Error exporting file:'${error}`);
    }
  };

  const handleDelete = (mazeId: string) => {
    mazeStore.delete(mazeId).then(() => {
      toast(`${mazeId} Deleted!`);
    });
  };

  const handleLoadConfig = async (configInfo: ConfigInfo) => {
    await configStore.loadConfig(configInfo.configPath);
    toast.success(`Config ${configInfo.name} was load`);
    setShowSetConfigModal(false);
  };

  const handleDeleteConfig = async (configInfo: ConfigInfo) => {
    await configStore.deleteConfig(configInfo.configPath);
    toast(`Config ${configInfo.name} Deleted!`);
    setShowSetConfigModal(false);
  };

  const handleBack = () => navigate(appLinks.mainMenu, { replace: true });

  React.useEffect(() => {
    mazeStore.loadMazeList().then();
    configStore.loadConfigs().then();
  }, []);

  return (
    <Container>
      <HeadControl>
        <Panel.Navigation onBack={handleBack} />
      </HeadControl>
      <SettingsContainer>
        <SettingsPanel>
          <ButtonsBlock>
            <UploadInput onImport={handleImport} type=".json" fullWidth>
              <Button variant="green" fullWidth>
                Import Maze
              </Button>
            </UploadInput>
            <Button variant="blue" fullWidth onClick={() => setShowSavesModal(true)}>
              Export Maze
            </Button>
          </ButtonsBlock>
          <ButtonsBlock>
            {isElectron && (
              <Button variant="yellow" fullWidth onClick={() => setShowConfigModal(true)}>
                Add Texture Pack
              </Button>
            )}
            {isElectron && (
              <Button variant="green" fullWidth onClick={() => setShowSetConfigModal(true)}>
                Set Texture Pack
              </Button>
            )}
          </ButtonsBlock>
        </SettingsPanel>
      </SettingsContainer>
      {showSavesModal && (
        <Modal.LoadMaze
          mazeList={mazeStore.mazeList}
          onLoad={handleExport}
          onDelete={handleDelete}
          onCancel={() => setShowSavesModal(false)}
        />
      )}
      {showConfigModal && (
        <Modal.Config onSave={handleSave} onCancel={() => setShowConfigModal(false)} />
      )}
      {showSetConfigModal && (
        <Modal.SelectConfig
          configs={configStore.configsInfo}
          onSelect={handleLoadConfig}
          onDelete={handleDeleteConfig}
          onCancel={() => setShowSetConfigModal(false)}
        />
      )}
    </Container>
  );
});

export default Settings;
