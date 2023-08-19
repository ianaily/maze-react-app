import { Maze } from 'src/types/maze';
import { Player } from 'src/types/player';
import { Camera } from 'src/types/camera';

export interface GameplayRendererProps {
  maxCanvasWidth: number;
  maxCanvasHeight: number;
  maze: Maze;
  player: Player;
  camera: Camera;
}
