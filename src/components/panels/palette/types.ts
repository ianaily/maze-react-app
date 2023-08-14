import { AreaType } from 'src/types/maze';

export interface PalettePanelProps {
  areaType: AreaType;
  areaTypes: AreaType[];
  onSelect: (areaType: AreaType) => void;
}
