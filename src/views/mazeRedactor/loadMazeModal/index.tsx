import React from 'react';
import { Modal } from 'src/components/modal';
import { CancelButton, LoadButton } from 'src/components/buttons/styled';
import { LoadMazeModalProps } from './types';
import { ControlContainer, DeleteButton, MazeItem, MazeLoadList } from './styled';

export const LoadMazeModal: React.FC<LoadMazeModalProps> = ({
  mazeList,
  onLoad,
  onDelete,
  onCancel,
}) => {
  const [selectedItem, setSelectedItem] = React.useState<string>();

  const handleLoad = () => {
    selectedItem && onLoad(selectedItem);
    onCancel();
  };

  const handleDelete = (id: string) => {
    onDelete(id);
    onCancel();
  };

  return (
    <Modal
      title={<span>Saved Mazes</span>}
      footer={
        <ControlContainer>
          <CancelButton onClick={onCancel}>Cancel</CancelButton>
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
            onClick={() => setSelectedItem(item)}
          >
            {item}
            <DeleteButton onClick={() => handleDelete(item)}>Delete</DeleteButton>
          </MazeItem>
        ))}
      </MazeLoadList>
    </Modal>
  );
};
