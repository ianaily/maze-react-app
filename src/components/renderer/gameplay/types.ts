import { Maze } from 'src/types/maze';
import { Player } from 'src/types/player';
import { Camera } from 'src/types/camera';

export interface GameplayRendererProps {
  canvasWidth: number;
  maze: Maze;
  player: Player;
  camera: Camera;
}
