import { MazeRedactorRendererProps } from './mazeRedactor/types';
import { GameplayRendererProps } from './gameplay/types';

export type RendererVariants = 'MazeRedactor' | 'Gameplay';

export type VariantPropsMap = {
  MazeRedactor: MazeRedactorRendererProps;
  Gameplay: GameplayRendererProps;
};
