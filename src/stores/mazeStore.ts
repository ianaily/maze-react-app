import { action, computed, makeObservable, observable, toJS } from 'mobx';
import localforage from 'localforage';
import { buildMazePots } from 'src/core/buildMazePots';
import { generateMaze } from 'src/core/generateMaze';
import { mazeUtils } from 'src/utils/mazeUtils';
import { randomId } from 'src/utils/random';
import { defaultMazeSize } from 'src/const/maze';
import { AreaType, AreaTypes, Maze } from 'src/types/maze';
import { Point } from 'src/types/point';
import { Size } from 'src/types/size';

const mazeKeyPrefix = 'maze-';

export class MazeStore {
  constructor() {
    makeObservable(this, {
      maze: observable,
      fillAreaType: observable,
      mazeList: observable,
      areaTypes: observable,
      utils: computed,
      generate: action,
      changeAreaType: action,
      setFillAreaType: action,
      setMazeList: action,
      loadMazeList: action,
      load: action,
    });
  }

  size = defaultMazeSize;
  maze: Maze = buildMazePots(this.size);
  fillAreaType: AreaType = AreaTypes.Wall;
  mazeId: string | null = null;
  mazeList: string[] = [];
  areaTypes = Object.values(AreaTypes);

  get utils() {
    return mazeUtils({ ...this.maze });
  }

  generate = (size: Size) => {
    this.size = size;
    const initial = buildMazePots(size);
    this.maze = generateMaze(initial);
    this.mazeId = null;
  };

  setMazeName = (name: string) => {
    this.maze.name = name;
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
      this.size = maze.size;
    } else {
      this.maze = buildMazePots(this.size);
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
