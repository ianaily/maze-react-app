import { makeAutoObservable } from 'mobx';
import localforage from 'localforage';
import { buildMazePots } from 'src/core/buildMazePots';
import { generateMaze } from 'src/core/generateMaze';
import { Maze } from 'src/types/maze';

class MazeStore {
  constructor() {
    makeAutoObservable(this);
  }

  width = 64;
  height = 32;
  maze: Maze = buildMazePots(this.width, this.height);

  generate = (width: number, height: number) => {
    const initial = buildMazePots(width, height);
    this.maze = generateMaze(initial);
    this.width = width;
    this.height = height;
  };

  load = (id: string) => {
    localforage.getItem<Maze>(`maze-${id}`).then((maze) => {
      if (maze) {
        this.maze = maze;
        this.width = maze.width;
        this.height = maze.height;
      } else {
        this.maze = buildMazePots(this.width, this.height);
      }
    });
  };

  save = (id: string) => {
    localforage.setItem(`maze-${id}`, this.maze);
  };
}

export default MazeStore;
