import type { MutableMatrix2D } from './matrix2d.js';

export interface ReadonlyTransform2D {
  readonly x: number;
  readonly y: number;
  readonly rotation: number;
  readonly scaleX: number;
  readonly scaleY: number;
}

export interface MutableTransform2D {
  x: number;
  y: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
}

export const createTransform2D = (
  x = 0,
  y = 0,
  rotation = 0,
  scaleX = 1,
  scaleY = 1
): MutableTransform2D => ({
  x,
  y,
  rotation,
  scaleX,
  scaleY
});

export const setTransform2D = (
  out: MutableTransform2D,
  x: number,
  y: number,
  rotation: number,
  scaleX: number,
  scaleY: number
): MutableTransform2D => {
  out.x = x;
  out.y = y;
  out.rotation = rotation;
  out.scaleX = scaleX;
  out.scaleY = scaleY;
  return out;
};

export const copyTransform2D = (out: MutableTransform2D, value: ReadonlyTransform2D): MutableTransform2D => {
  out.x = value.x;
  out.y = value.y;
  out.rotation = value.rotation;
  out.scaleX = value.scaleX;
  out.scaleY = value.scaleY;
  return out;
};

export const composeMatrix2D = (out: MutableMatrix2D, transform: ReadonlyTransform2D): MutableMatrix2D => {
  const cos = Math.cos(transform.rotation);
  const sin = Math.sin(transform.rotation);

  out.a = cos * transform.scaleX;
  out.b = sin * transform.scaleX;
  out.c = -sin * transform.scaleY;
  out.d = cos * transform.scaleY;
  out.tx = transform.x;
  out.ty = transform.y;
  return out;
};
