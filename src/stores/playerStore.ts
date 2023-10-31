import { makeAutoObservable } from 'mobx';
import { Direction } from 'src/types/direction';
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
    prevPoint: { x: 0, y: 0 },
    direction: 'right',
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
    this.setPosition(maze.enter);
  }

  setPosition(position: Point) {
    this.player.prevPoint = { ...this.player.point };
    this.player.point = position;
    this.player.direction = this.direction;
  }

  private get direction(): Direction {
    const point = this.player.point;
    const prev = this.player.prevPoint;

    if (prev.x < point.x) {
      return 'right';
    } else if (prev.x > point.x) {
      return 'left';
    } else if (prev.y < point.y) {
      return this.player.direction;
    } else if (prev.y > point.y) {
      return this.player.direction;
    }

    return this.player.direction;
  }

  private throughPassable(point: Point): boolean {
    return this.utils.getAreaType(point).passable;
  }

  moveUp() {
    if (this.y - 1 >= 0 && this.throughPassable(toTop(this.player.point))) {
      this.setPosition(toTop(this.player.point));
    }
  }

  moveRight() {
    if (this.x + 1 < this.maze.size.width && this.throughPassable(toRight(this.player.point))) {
      this.setPosition(toRight(this.player.point));
    }
  }

  moveDown() {
    if (this.y + 1 < this.maze.size.height && this.throughPassable(toBottom(this.player.point))) {
      this.setPosition(toBottom(this.player.point));
    }
  }

  moveLeft() {
    if (this.x - 1 >= 0 && this.throughPassable(toLeft(this.player.point))) {
      this.setPosition(toLeft(this.player.point));
    }
  }
}

export default new PlayerStore();
