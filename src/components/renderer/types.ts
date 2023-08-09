import { Maze } from 'src/types/maze';
import { Point } from 'src/types/point';
import { Cursor } from 'src/types/cursor';

export interface RendererProps {
  maze: Maze;
  cursor: Cursor;
  canvasWidth: number;
  canvasHeight: number;
  onKeyDown: (key: string) => void;
  onAreaClick: (area: Point) => void;
  enableCoords: boolean;
}
