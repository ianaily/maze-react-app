import { makeObservable, action, computed, observable } from 'mobx';
import * as utils from 'src/utils/pointUtils';
import { Cursor } from 'src/types/cursor';

export class CursorStore {
  constructor() {
    makeObservable(this, {
      cursor: observable,
      width: observable,
      height: observable,
      enabled: computed,
      setEnable: action,
      setBoxSize: action,
      reset: action,
      toUp: action,
      toRight: action,
      toDown: action,
      toLeft: action,
    });
  }

  cursor: Cursor = {
    enable: false,
    point: { x: 0, y: 0 },
    prevPoint: { x: 0, y: 0 },
  };

  width = 0;
  height = 0;

  setEnable = (isEnable: boolean) => {
    this.cursor.enable = isEnable;
  };

  setBoxSize = (width: number, height: number) => {
    this.width = width;
    this.height = height;
  };

  get enabled(): boolean {
    return this.cursor.enable;
  }

  reset = () => {
    this.cursor.point = { x: 0, y: 0 };
    this.cursor.prevPoint = { x: 0, y: 0 };
  };

  toUp = () => {
    if (this.cursor.point.y - 1 >= 0) {
      this.cursor.prevPoint = { ...this.cursor.point };
      this.cursor.point = utils.toTop(this.cursor.point);
    }
  };

  toRight = () => {
    if (this.cursor.point.x + 1 < this.width) {
      this.cursor.prevPoint = { ...this.cursor.point };
      this.cursor.point = utils.toRight(this.cursor.point);
    }
  };

  toDown = () => {
    if (this.cursor.point.y + 1 < this.height) {
      this.cursor.prevPoint = { ...this.cursor.point };
      this.cursor.point = utils.toBottom(this.cursor.point);
    }
  };

  toLeft = () => {
    if (this.cursor.point.x - 1 >= 0) {
      this.cursor.prevPoint = { ...this.cursor.point };
      this.cursor.point = utils.toLeft(this.cursor.point);
    }
  };
}

export default new CursorStore();
