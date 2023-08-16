export interface ControlPanelProps {
  onCheck: VoidFunction;
  onSave: VoidFunction;
  enableLoad: boolean;
  onLoad: VoidFunction;
  enableDelete: boolean;
  onDelete: VoidFunction;
  mazeName: string;
  onMazeNameChange: (name: string) => void;
}
