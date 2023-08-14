import React from 'react';
import { Modal } from 'src/components/modal/base';
import { Button } from 'src/components/button';
import { LoadMazeModalProps } from './types';
import { ControlContainer, MazeItem, MazeLoadList } from './styled';

export const LoadMazeModal: React.FC<LoadMazeModalProps> = ({
  mazeList,
  onLoad,
  onDelete,
  onCancel,
}) => {
  const [selectedItem, setSelectedItem] = React.useState<string>();
  const [toDelete, setToDelete] = React.useState<boolean>(false);

  const handleLoad = () => {
    selectedItem && onLoad(selectedItem);
    onCancel();
  };

  const handleDelete = () => {
    selectedItem && onDelete(selectedItem);
  };

  return (
    <Modal
      title={<span>Saved Mazes</span>}
      footer={
        <ControlContainer>
          <Button variant="grey" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            variant="red"
            onClick={handleDelete}
            onMouseEnter={() => setToDelete(true)}
            onMouseLeave={() => setToDelete(false)}
            disabled={!selectedItem}
          >
            Delete
          </Button>
          <Button variant="blue" onClick={handleLoad} disabled={!selectedItem}>
            Load
          </Button>
        </ControlContainer>
      }
    >
      <MazeLoadList>
        {mazeList.map((item) => (
          <MazeItem
            key={item.mazeId}
            selected={item.mazeId === selectedItem}
            toDelete={toDelete}
            onClick={() => setSelectedItem(item.mazeId)}
          >
            {item.mazeName}
          </MazeItem>
        ))}
      </MazeLoadList>
    </Modal>
  );
};
