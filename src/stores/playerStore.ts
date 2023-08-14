import { makeAutoObservable } from 'mobx';
import { Player } from 'src/types/player';
import { Point } from 'src/types/point';
import { Maze } from 'src/types/maze';
import { mazeUtils } from 'src/utils/mazeUtils';
import { toBottom, toLeft, toRight, toTop } from 'src/utils/pointUtils';
import { buildMazePots } from 'src/core/buildMazePots';
import { defaultMazeSize } from 'src/const/maze';

export class PlayerStore {
  constructor() {
    makeAutoObservable(this);
  }

  player: Player = {
    point: { x: 0, y: 0 },
  };

  private get x(): number {
    return this.player.point.x;
  }

  private get y(): number {
    return this.player.point.y;
  }

  get utils() {
    return mazeUtils({ ...this.maze });
  }

  maze: Maze = buildMazePots(defaultMazeSize);

  setMaze(maze: Maze) {
    this.maze = maze;
  }

  setPosition(position: Point) {
    this.player.point = position;
  }

  private throughPassable(point: Point): boolean {
    return this.utils.getAreaType(point).passable;
  }

  moveTop() {
    if (this.y - 1 >= 0 && this.throughPassable(toTop(this.player.point))) {
      this.setPosition({ x: this.x, y: this.y - 1 });
    }
  }

  moveBottom() {
    if (this.y + 1 < this.maze.size.height && this.throughPassable(toBottom(this.player.point))) {
      this.setPosition({ x: this.x, y: this.y + 1 });
    }
  }

  moveLeft() {
    if (this.x - 1 >= 0 && this.throughPassable(toLeft(this.player.point))) {
      this.setPosition({ x: this.x - 1, y: this.y });
    }
  }

  moveRight() {
    if (this.x + 1 < this.maze.size.width && this.throughPassable(toRight(this.player.point))) {
      this.setPosition({ x: this.x + 1, y: this.y });
    }
  }
}
