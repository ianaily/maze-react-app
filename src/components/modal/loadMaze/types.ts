import { Save } from 'src/types/save';

export interface LoadMazeModalProps {
  mazeList: Save[];
  onLoad: (mazeId: string) => void;
  onDelete: (mazeId: string) => void;
  onCancel: VoidFunction;
}
