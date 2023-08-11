import { AreaType } from 'src/types/maze';

export interface RedactorCanvasContextMenuProps {
  x: number;
  y: number;
  areaTypes: AreaType[];
  onSelectAreaType: (areaType: AreaType) => void;
  onClose: VoidFunction;
}
