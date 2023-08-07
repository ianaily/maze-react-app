import { action, computed, makeObservable, observable } from 'mobx';
import localforage from 'localforage';
import { buildMazePots } from 'src/core/buildMazePots';
import { generateMaze } from 'src/core/generateMaze';
import { mazeUtils } from 'src/utils/mazeUtils';
import { getNextAreaType } from 'src/utils/areaUtils';
import { Maze } from 'src/types/maze';
import { Point } from 'src/types/point';

class MazeStore {
  constructor() {
    makeObservable(this, {
      maze: observable,
      _utils: computed,
      generate: action,
      changeAreaTypeToNext: action,
      load: action,
    });
  }

  width = 64;
  height = 32;
  maze: Maze = buildMazePots(this.width, this.height);

  get _utils() {
    return mazeUtils({ ...this.maze });
  }

  generate = (width: number, height: number) => {
    this.width = width;
    this.height = height;
    const initial = buildMazePots(width, height);
    this.maze = generateMaze(initial);
  };

  changeAreaTypeToNext = (point: Point) => {
    const currentType = this._utils.getAreaType(point);
    const nextType = getNextAreaType(currentType.name);

    this.maze = this._utils.setAreaType(point, nextType, true);
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
    return localforage.setItem(`maze-${id}`, this.maze);
  };
}

export default MazeStore;
