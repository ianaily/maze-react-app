import React from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { Import } from 'src/types/save';
import { stringifyMaze } from 'src/utils/mazeUtils';
import { appLinks } from 'src/router/const';
import { Modal } from 'src/components/modal';
import { Panel } from 'src/components/panels';
import { Button } from 'src/components/button';
import { Container, FileInput, HeadControl, ImportExportContainer } from './styled';
import { readFile, writeFile } from './utils';
import { useStore } from './store';

const Settings: React.FC = observer(() => {
  const navigate = useNavigate();
  const { mazeStore } = useStore();
  const [showSavesModal, setShowSavesModal] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      const content = await readFile(file);
      const mazeImport = JSON.parse(content) as Import;

      mazeStore.importMaze(mazeImport);
    } catch (error) {
      toast.error(`Error reading file: ${error}`);
    }
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
      <Panel.Blank>
        <ImportExportContainer>
          <FileInput ref={inputRef} type="file" onChange={handleImport} />
          <Button variant="green" onClick={() => inputRef.current?.click()}>
            Import
          </Button>
          <Button variant="blue" onClick={() => setShowSavesModal(true)}>
            Export
          </Button>
        </ImportExportContainer>
      </Panel.Blank>
      {showSavesModal && (
        <Modal.LoadMaze
          mazeList={mazeStore.mazeList}
          onLoad={handleExport}
          onDelete={handleDelete}
          onCancel={() => setShowSavesModal(false)}
        />
      )}
    </Container>
  );
});

export default Settings;
