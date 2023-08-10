import React from 'react';
import { Modal } from 'src/components/modal';
import { CancelButton, DeleteButton, LoadButton } from 'src/components/buttons/styled';
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
          <CancelButton onClick={onCancel}>Cancel</CancelButton>
          <DeleteButton
            onClick={handleDelete}
            onMouseEnter={() => setToDelete(true)}
            onMouseLeave={() => setToDelete(false)}
            disabled={!selectedItem}
          >
            Delete
          </DeleteButton>
          <LoadButton onClick={handleLoad} disabled={!selectedItem}>
            Load
          </LoadButton>
        </ControlContainer>
      }
    >
      <MazeLoadList>
        {mazeList.map((item) => (
          <MazeItem
            key={item}
            selected={item === selectedItem}
            toDelete={toDelete}
            onClick={() => setSelectedItem(item)}
          >
            {item}
          </MazeItem>
        ))}
      </MazeLoadList>
    </Modal>
  );
};
