import { action, computed, makeObservable, observable, toJS } from 'mobx';
import localforage from 'localforage';
import { buildMazePots } from 'src/core/buildMazePots';
import { generateMaze } from 'src/core/generateMaze';
import { mazeUtils, parseMaze } from 'src/utils/mazeUtils';
import { random, randomId } from 'src/utils/random';
import { defaultMazeSize, mazeSaveKeyPrefix, mazeSavesKey } from 'src/const/maze';
import { AreaType, AreaTypes, Maze } from 'src/types/maze';
import { Point } from 'src/types/point';
import { Size } from 'src/types/size';
import { Save } from 'src/types/save';
import * as dump from 'src/assets/presets.json';

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
      setMaze: action,
      setMazeName: action,
      setFillAreaType: action,
      setMazeList: action,
      saveMazeList: action,
      loadMazeList: action,
      load: action,
    });
    this.loadPresets();
  }

  size = defaultMazeSize;
  maze: Maze = buildMazePots(this.size);
  fillAreaType: AreaType = AreaTypes.Wall;
  mazeId: string | null = null;
  mazeList: Save[] = [];
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

  setMaze = (maze: Maze | null) => {
    if (maze) {
      this.maze = maze;
      this.size = maze.size;
    } else {
      this.generate(defaultMazeSize);
    }
  };

  setMazeList = (mazeList: Save[]) => {
    this.mazeList = mazeList;
  };

  getRandomSavedMaze = async () => {
    const saves = await this.loadMazeList();
    const randomIndex = random(saves.length - 1, 0);
    const randomSave = saves[randomIndex];

    await this.load(randomSave.mazeId);

    return this.maze;
  };

  private loadPresets = async () => {
    const { presets } = dump;

    const saveList = await localforage.getItem<{ saves: Save[] }>(mazeSavesKey);
    const saves = saveList?.saves || [];
    const notSaved = presets.filter(({ id }) => !saves.some((save: Save) => save.mazeId === id));

    await this.loadMazeList();
    notSaved.forEach((preset) => {
      const maze = parseMaze(preset.maze);

      this.saveMazeList({
        mazeId: preset.id,
        mazeName: maze.name,
        mazeSize: maze.size,
      });
      localforage.setItem(preset.id, maze);
    });
  };

  loadMazeList = (): Promise<Save[]> => {
    return localforage
      .getItem<{ saves: Save[] }>(mazeSavesKey)
      .then((mazeList) => mazeList?.saves || [])
      .then((mazeList) => {
        this.setMazeList(mazeList);

        return mazeList;
      });
  };

  saveMazeList = async (save?: Save): Promise<void> => {
    const newSave: Save = save || {
      mazeId: this.mazeId || '',
      mazeName: this.maze.name,
      mazeSize: this.maze.size,
    };
    const updatedSaves = [newSave, ...this.mazeList];

    this.mazeList = [...new Set(updatedSaves.map((item) => item.mazeId))]
      .map((id) => updatedSaves.find((item) => item.mazeId === id))
      .filter((save) => !!save) as Save[];

    await localforage.setItem<{ saves: Save[] }>(mazeSavesKey, { saves: toJS(this.mazeList) });
  };

  deleteMazeListItem = async (mazeId: string): Promise<void> => {
    const list = await this.loadMazeList();
    const updatedList = list.filter((save) => save.mazeId !== mazeId);

    await localforage.setItem<{ saves: Save[] }>(mazeSavesKey, { saves: updatedList });
    this.setMazeList(updatedList);
  };

  load = async (id: string): Promise<void> => {
    const maze = await localforage.getItem<Maze>(id);

    this.mazeId = id;
    this.setMaze(maze);
  };

  save = async (): Promise<void> => {
    this.mazeId = this.mazeId || `${mazeSaveKeyPrefix}${randomId()}`;
    await this.loadMazeList();
    await localforage.setItem(this.mazeId, toJS(this.maze));
    await this.saveMazeList();
  };

  delete = async (mazeId?: string) => {
    const id = mazeId || this.mazeId || '';

    await this.deleteMazeListItem(id);
    await localforage.removeItem(id);
  };
}

export default new MazeStore();
