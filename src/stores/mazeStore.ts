import { action, computed, makeObservable, observable, toJS } from 'mobx';
import localforage from 'localforage';
import { buildMazePots } from 'src/core/buildMazePots';
import { generateMaze } from 'src/core/generateMaze';
import { mazeUtils } from 'src/utils/mazeUtils';
import { randomId } from 'src/utils/random';
import { AreaType, AreaTypes, Maze } from 'src/types/maze';
import { Point } from 'src/types/point';

const mazeKeyPrefix = 'maze-';

export class MazeStore {
  constructor() {
    makeObservable(this, {
      maze: observable,
      fillAreaType: observable,
      mazeList: observable,
      utils: computed,
      generate: action,
      changeAreaType: action,
      setFillAreaType: action,
      setMazeList: action,
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
    this.mazeId = null;
  };

  changeAreaType = (point: Point, type: AreaType = this.fillAreaType) => {
    this.maze = this.utils.setAreaType(point, type, true);
    this.setFillAreaType(type);
  };

  setFillAreaType = (type: AreaType) => {
    this.fillAreaType = type;
  };

  setMazeList = (mazeList: string[]) => {
    this.mazeList = mazeList;
  };

  loadMazeList = (): Promise<string[]> => {
    return localforage
      .keys()
      .then((list) => list?.filter((key) => key.includes(mazeKeyPrefix)) || [])
      .then((mazeList) => {
        this.setMazeList(mazeList);
        return mazeList;
      });
  };

  load = async (id: string): Promise<void> => {
    const maze = await localforage.getItem<Maze>(id);
    this.mazeId = id;

    if (maze) {
      this.maze = maze;
      this.width = maze.width;
      this.height = maze.height;
    } else {
      this.maze = buildMazePots(this.width, this.height);
    }
  };

  save = async (): Promise<void> => {
    if (this.mazeId) {
      await localforage.setItem(this.mazeId, toJS(this.maze));
    } else {
      this.mazeId = `${mazeKeyPrefix}${randomId()}`;
      await localforage.setItem(this.mazeId, toJS(this.maze));
      await this.loadMazeList();
    }
  };

  delete = async (mazeId?: string) => {
    await localforage.removeItem(mazeId || this.mazeId || '');
  };
}

export default new MazeStore();
