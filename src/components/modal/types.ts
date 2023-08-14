import { LoadMazeModalProps } from './loadMaze/types';
import { PauseModalProps } from './pause/types';

export type ModalVariants = 'LoadMaze' | 'Pause';

export type VariantPropsMap = {
  LoadMaze: LoadMazeModalProps;
  Pause: PauseModalProps;
};
