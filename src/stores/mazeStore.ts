import { action, computed, makeObservable, observable, toJS } from 'mobx';
import localforage from 'localforage';
import { buildMazePots } from 'src/core/buildMazePots';
import { generateMaze } from 'src/core/generateMaze';
import { mazeUtils } from 'src/utils/mazeUtils';
import { AreaType, AreaTypes, Maze } from 'src/types/maze';
import { Point } from 'src/types/point';

class MazeStore {
  constructor() {
    makeObservable(this, {
      maze: observable,
      fillAreaType: observable,
      mazeList: observable,
      utils: computed,
      generate: action,
      changeAreaType: action,
      loadMazeList: action,
      load: action,
    });
  }

  width = 64;
  height = 32;
  maze: Maze = buildMazePots(this.width, this.height);
  fillAreaType: AreaType = AreaTypes.Wall;
  mazeId: string | null = null;
  mazeList: string[] = [];

  get utils() {
    return mazeUtils({ ...this.maze });
  }

  generate = (width: number, height: number) => {
    this.width = width;
    this.height = height;
    const initial = buildMazePots(width, height);
    this.maze = generateMaze(initial);
  };

  changeAreaType = (point: Point, type: AreaType = this.fillAreaType) => {
    this.maze = this.utils.setAreaType(point, type, true);
    this.fillAreaType = type;
  };

  loadMazeList = (): Promise<void> => {
    return localforage.getItem<string[]>('mazeList').then((list) => {
      this.mazeList = list || [];
    });
  };

  load = async (id: string): Promise<void> => {
    const maze = await localforage.getItem<Maze>(id);

    if (maze) {
      this.maze = maze;
      this.width = maze.width;
      this.height = maze.height;
    } else {
      this.maze = buildMazePots(this.width, this.height);
    }
  };

  saveMazeList = async (): Promise<void> => {
    const uniqArray = [...new Set(toJS(this.mazeList))];
    await localforage.setItem<string[]>('mazeList', uniqArray);

    return;
  };

  save = async (): Promise<void> => {
    if (this.mazeId) {
      await localforage.setItem(`maze-${this.mazeId}`, toJS(this.maze));
    } else {
      this.mazeId = `maze-${this.mazeList.length}`;
      await this.loadMazeList();
      this.mazeList.push(this.mazeId);
      await this.saveMazeList();
      await localforage.setItem(this.mazeId, toJS(this.maze));
    }
  };
}

export default MazeStore;
