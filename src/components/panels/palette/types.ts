import { AreaConfig } from 'src/types/config';

export interface PalettePanelProps {
  areaType: AreaConfig;
  areaTypes: AreaConfig[];
  onSelect: (areaType: AreaConfig) => void;
}
