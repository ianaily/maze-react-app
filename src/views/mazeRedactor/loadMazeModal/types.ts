export interface LoadMazeModalProps {
  mazeList: string[];
  onLoad: (mazeId: string) => void;
  onDelete: (mazeId: string) => void;
  onCancel: VoidFunction;
}
