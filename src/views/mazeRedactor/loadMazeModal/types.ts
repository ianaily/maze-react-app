export interface LoadMazeModalProps {
  mazeList: string[];
  onLoad: (mazeId: string) => void;
  onCancel: VoidFunction;
}
