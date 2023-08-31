import { action, makeObservable, observable } from 'mobx';
import { Size } from 'src/types/size';
import { Point } from 'src/types/point';
import { Config } from 'src/types/config';
import { AreaSprite, Camera } from 'src/types/camera';
import { Maze } from 'src/types/maze';
import { enrichMazeWithSprite } from 'src/core/enrichMazeWithSprite';

export class CameraStore {
  camera: Camera = {
    point: { x: 0, y: 0 },
    size: { width: 0, height: 0 },
    areas: [],
  };
  anchor = { x: 0, y: 0 };
  mazeSize = { width: 0, height: 0 };
  areas: AreaSprite[] = [];

  setMaze = (maze: Maze, config: Config) => {
    this.mazeSize = maze.size;
    this.areas = enrichMazeWithSprite(maze, config);
    this.setCameraPoint(maze.enter);
  };

  setCameraSize = (size: Size) => {
    this.camera.size = size;
  };

  setCameraPoint = (point: Point) => {
    this.camera.point = point;
    this.updateAreas();
  };

  updateAreas = () => {
    const { point } = this.camera;
    const { width, height } = this.camera.size;
    const x = Math.min(Math.max(point.x - Math.floor(width / 2), 0), this.mazeSize.width - width);
    const y = Math.min(
      Math.max(point.y - Math.floor(height / 2), 0),
      this.mazeSize.height - height,
    );
    this.anchor = { x, y };

    this.camera.areas = this.areas.filter(
      (area) => area.x >= x && area.x < x + width && area.y >= y && area.y < y + height,
    );
  };

  constructor() {
    makeObservable(this, {
      camera: observable,
      mazeSize: observable,
      anchor: observable,
      areas: observable,
      setMaze: action,
      setCameraSize: action,
      setCameraPoint: action,
      updateAreas: action,
    });
  }
}

export default new CameraStore();
