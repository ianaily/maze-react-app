import { AreaType } from 'src/types/maze';

export interface RedactorContextMenuProps {
  x: number;
  y: number;
  areaTypes: AreaType[];
  onSelectAreaType: (areaType: AreaType) => void;
  onClose: VoidFunction;
}
