import { MazeRedactorRendererProps } from './mazeRedactor/types';
import { GameplayRendererProps } from './gameplay/types';

export type RendererVariants = 'MazeRedactor' | 'Gameplay';

export type VariantPropsMap = {
  MazeRedactor: MazeRedactorRendererProps;
  Gameplay: GameplayRendererProps;
};

export interface DrawStyleProps {
  textFill?: string;
  fill: string;
  stroke?: string;
  lineWidth?: number;
}
