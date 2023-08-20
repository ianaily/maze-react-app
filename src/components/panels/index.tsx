import React from 'react';
import { PanelVariants, VariantPropsMap } from './types';
import { NavigationPanel } from './navigation';
import { PalettePanel } from './palette';
import { GeneratePanel } from './generate';
import { ControlPanel } from './control';
import { BlankPanel } from './blank';

export const Panel: { [key in PanelVariants]: React.FC<VariantPropsMap[key]> } = {
  Navigation: NavigationPanel,
  Palette: PalettePanel,
  Generate: GeneratePanel,
  Control: ControlPanel,
  Blank: BlankPanel,
};
