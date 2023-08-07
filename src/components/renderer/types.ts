import { Maze } from 'src/types/maze';
import { Cursor } from 'src/types/cursor';

export interface RendererProps {
  maze: Maze;
  cursor: Cursor;
  canvasWidth: number;
  canvasHeight: number;
}
