import { Size } from './size';

export interface Save {
  mazeId: string;
  mazeName: string;
  mazeSize: Size;
}

export interface Import {
  id: string;
  maze: string;
}
