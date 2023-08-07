import { makeObservable, action, computed, observable } from 'mobx';
import * as utils from 'src/utils/pointUtils';
import { Cursor } from 'src/types/cursor';

class CursorStore {
  constructor() {
    makeObservable(this, {
      cursor: observable,
      enabled: computed,
      setEnable: action,
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

  get enabled(): boolean {
    return this.cursor.enable;
  }

  setEnable = (isEnable: boolean) => {
    this.cursor.enable = isEnable;
  };

  reset = () => {
    this.cursor.point = { x: 0, y: 0 };
    this.cursor.prevPoint = { x: 0, y: 0 };
  };

  toUp = () => {
    this.cursor.prevPoint = { ...this.cursor.point };
    this.cursor.point = utils.toTop(this.cursor.point);
  };

  toRight = () => {
    this.cursor.prevPoint = { ...this.cursor.point };
    this.cursor.point = utils.toRight(this.cursor.point);
  };

  toDown = () => {
    this.cursor.prevPoint = { ...this.cursor.point };
    this.cursor.point = utils.toBottom(this.cursor.point);
  };

  toLeft = () => {
    this.cursor.prevPoint = { ...this.cursor.point };
    this.cursor.point = utils.toLeft(this.cursor.point);
  };
}

export const cursorStore = new CursorStore();
