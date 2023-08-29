import React from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { Import } from 'src/types/save';
import { Config } from 'src/types/config';
import { writeFile } from 'src/utils/ioFiles';
import { stringifyMaze } from 'src/utils/mazeUtils';
import { useIsElectron } from 'src/hooks/useIsElectron';
import { appLinks } from 'src/router/const';
import { Modal } from 'src/components/modal';
import { Panel } from 'src/components/panels';
import { Button } from 'src/components/button';
import { UploadInput } from 'src/components/uploadInput';
import { useStore } from './store';
import { Container, HeadControl, SettingsContainer, SettingsPanel } from './styled';

const Settings: React.FC = observer(() => {
  const navigate = useNavigate();
  const isElectron = useIsElectron();
  const { mazeStore } = useStore();
  const [showSavesModal, setShowSavesModal] = React.useState(false);
  const [showConfigModal, setShowConfigModal] = React.useState(false);

  const handleSave = async (config: Config) => {
    try {
      await window.electronAPI.saveConfig(config);
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
    } catch (error) {
      toast.error(`'Error exporting file:'${error}`);
    }
  };

  const handleDelete = (mazeId: string) => {
    mazeStore.delete(mazeId).then(() => {
      toast(`${mazeId} Deleted!`);
    });
  };

  const handleBack = () => navigate(appLinks.mainMenu, { replace: true });

  React.useEffect(() => {
    mazeStore.loadMazeList().then();
  }, []);

  return (
    <Container>
      <HeadControl>
        <Panel.Navigation onBack={handleBack} />
      </HeadControl>
      <SettingsContainer>
        <SettingsPanel>
          <UploadInput onImport={handleImport} type=".json" fullWidth>
            <Button variant="green" fullWidth>
              Import Maze
            </Button>
          </UploadInput>
          <Button variant="blue" fullWidth onClick={() => setShowSavesModal(true)}>
            Export Maze
          </Button>
          {isElectron && (
            <Button variant="yellow" fullWidth onClick={() => setShowConfigModal(true)}>
              Add Texture Pack
            </Button>
          )}
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
    </Container>
  );
});

export default Settings;
