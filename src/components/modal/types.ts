import { LoadMazeModalProps } from './loadMaze/types';
import { PauseModalProps } from './pause/types';
import { ConfigModalProps } from './config/types';

export type ModalVariants = 'LoadMaze' | 'Pause' | 'Config';

export type VariantPropsMap = {
  LoadMaze: LoadMazeModalProps;
  Pause: PauseModalProps;
  Config: ConfigModalProps;
};
