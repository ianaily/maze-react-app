import { action, computed, makeObservable, observable } from 'mobx';
import { AreaTypeKeys, Maze } from 'src/types/maze';
import { Player } from 'src/types/player';
import { defaultMazeSize } from 'src/const/maze';
import { buildMazePots } from 'src/core/buildMazePots';

export class GameStore {
  constructor() {
    makeObservable(this, {
      maze: observable,
      player: observable,
      leftMoves: observable,
      isFinished: computed,
      isLeftMoves: computed,
      setMaze: action,
      setPlayer: action,
    });
  }

  maze: Maze = buildMazePots(defaultMazeSize);
  player: Player = {
    point: { x: 0, y: 0 },
    prevPoint: { x: 0, y: 0 },
    direction: 'right',
  };
  leftMoves = -1;

  get isFinished() {
    const { point } = this.player;
    const { exit } = this.maze;

    return point.x === exit.x && point.y === exit.y;
  }

  get isLeftMoves() {
    return this.leftMoves !== 0;
  }

  setMaze = (maze: Maze) => {
    this.maze = maze;

    const minMoves = maze.areas.filter((value) => value.type.name === AreaTypeKeys.Thread).length;
    const square = maze.size.width * 2 + maze.size.height * 2;

    this.leftMoves = minMoves + square;
  };

  setPlayer = (player: Player) => {
    this.player = player;
    this.leftMoves--;
  };
}

export default new GameStore();
