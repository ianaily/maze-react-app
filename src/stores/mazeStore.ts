import { action, makeObservable, observable } from 'mobx';
import localforage from 'localforage';
import { buildMazePots } from 'src/core/buildMazePots';
import { generateMaze } from 'src/core/generateMaze';
import { Maze } from 'src/types/maze';

class MazeStore {
  constructor() {
    makeObservable(this, {
      maze: observable,
      generate: action,
      load: action,
      save: action,
    });
  }

  maze: Maze = buildMazePots(0, 0);

  generate = (width: number, height: number) => {
    const initial = buildMazePots(width, height);
    this.maze = generateMaze(initial);
  };

  load = (id: string) => {
    localforage.getItem<Maze>(`maze-${id}`).then((maze) => {
      if (maze) {
        this.maze = maze;
      } else {
        this.maze = buildMazePots(50, 35);
      }
    });
  };

  save = (id: string) => {
    localforage.setItem(`maze-${id}`, this.maze);
  };
}

export const mazeStore = new MazeStore();
