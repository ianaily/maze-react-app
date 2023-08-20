import { NavigationPanelProps } from './navigation/types';
import { PalettePanelProps } from './palette/types';
import { GeneratePanelProps } from './generate/types';
import { ControlPanelProps } from './control/types';
import { BlankPanelProps } from './blank/types';

export type PanelVariants = 'Navigation' | 'Palette' | 'Generate' | 'Control' | 'Blank';

export type VariantPropsMap = {
  Navigation: NavigationPanelProps;
  Palette: PalettePanelProps;
  Generate: GeneratePanelProps;
  Control: ControlPanelProps;
  Blank: BlankPanelProps;
};
