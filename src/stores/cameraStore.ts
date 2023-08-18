import { action, makeObservable, observable } from 'mobx';
import { Size } from 'src/types/size';
import { Point } from 'src/types/point';
import { AreaSprite, Camera } from 'src/types/camera';
import { Maze } from 'src/types/maze';
import { enrichMazeWithSprite } from '../core/enrichMazeWithSprite';

export class CameraStore {
  camera: Camera = {
    point: { x: 0, y: 0 },
    size: { width: 0, height: 0 },
    areas: [],
  };
  mazeSize = { width: 0, height: 0 };
  areas: AreaSprite[] = [];

  setMaze = (maze: Maze) => {
    this.mazeSize = maze.size;
    this.areas = enrichMazeWithSprite(maze);
    this.setCameraPoint(maze.enter);
    this.setCameraAreas();
  };

  setCameraSize = (size: Size) => {
    this.camera.size = size;
  };

  setCameraPoint = (point: Point) => {
    this.camera.point = point;
  };

  setCameraAreas = () => {
    this.camera.areas = [...this.areas];
  };

  constructor() {
    makeObservable(this, {
      camera: observable,
      mazeSize: observable,
      areas: observable,
      setMaze: action,
      setCameraSize: action,
      setCameraPoint: action,
      setCameraAreas: action,
    });
  }
}

export default new CameraStore();
