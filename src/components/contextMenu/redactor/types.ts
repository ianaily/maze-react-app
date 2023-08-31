import { AreaConfig } from 'src/types/config';

export interface RedactorContextMenuProps {
  x: number;
  y: number;
  areaTypes: AreaConfig[];
  onSelectAreaType: (areaType: AreaConfig) => void;
  onClose: VoidFunction;
}
