import type { MutableVec2, ReadonlyVec2 } from './vec2.js';

export interface ReadonlyMatrix2D {
  readonly a: number;
  readonly b: number;
  readonly c: number;
  readonly d: number;
  readonly tx: number;
  readonly ty: number;
}

export interface MutableMatrix2D {
  a: number;
  b: number;
  c: number;
  d: number;
  tx: number;
  ty: number;
}

export const createMatrix2D = (): MutableMatrix2D => ({
  a: 1,
  b: 0,
  c: 0,
  d: 1,
  tx: 0,
  ty: 0
});

export const setMatrix2D = (
  out: MutableMatrix2D,
  a: number,
  b: number,
  c: number,
  d: number,
  tx: number,
  ty: number
): MutableMatrix2D => {
  out.a = a;
  out.b = b;
  out.c = c;
  out.d = d;
  out.tx = tx;
  out.ty = ty;
  return out;
};

export const identityMatrix2D = (out: MutableMatrix2D): MutableMatrix2D => {
  out.a = 1;
  out.b = 0;
  out.c = 0;
  out.d = 1;
  out.tx = 0;
  out.ty = 0;
  return out;
};

export const copyMatrix2D = (out: MutableMatrix2D, value: ReadonlyMatrix2D): MutableMatrix2D => {
  out.a = value.a;
  out.b = value.b;
  out.c = value.c;
  out.d = value.d;
  out.tx = value.tx;
  out.ty = value.ty;
  return out;
};

export const multiplyMatrix2D = (
  out: MutableMatrix2D,
  left: ReadonlyMatrix2D,
  right: ReadonlyMatrix2D
): MutableMatrix2D => {
  const a = left.a * right.a + left.c * right.b;
  const b = left.b * right.a + left.d * right.b;
  const c = left.a * right.c + left.c * right.d;
  const d = left.b * right.c + left.d * right.d;
  const tx = left.a * right.tx + left.c * right.ty + left.tx;
  const ty = left.b * right.tx + left.d * right.ty + left.ty;

  out.a = a;
  out.b = b;
  out.c = c;
  out.d = d;
  out.tx = tx;
  out.ty = ty;
  return out;
};

export const invertMatrix2D = (out: MutableMatrix2D, value: ReadonlyMatrix2D): MutableMatrix2D | null => {
  const determinant = value.a * value.d - value.b * value.c;

  if (determinant === 0) {
    return null;
  }

  const inverseDeterminant = 1 / determinant;
  const a = value.d * inverseDeterminant;
  const b = -value.b * inverseDeterminant;
  const c = -value.c * inverseDeterminant;
  const d = value.a * inverseDeterminant;
  const tx = (value.c * value.ty - value.d * value.tx) * inverseDeterminant;
  const ty = (value.b * value.tx - value.a * value.ty) * inverseDeterminant;

  out.a = a;
  out.b = b;
  out.c = c;
  out.d = d;
  out.tx = tx;
  out.ty = ty;
  return out;
};

export const transformPoint2D = (
  out: MutableVec2,
  matrix: ReadonlyMatrix2D,
  point: ReadonlyVec2
): MutableVec2 => {
  const x = matrix.a * point.x + matrix.c * point.y + matrix.tx;
  const y = matrix.b * point.x + matrix.d * point.y + matrix.ty;

  out.x = x;
  out.y = y;
  return out;
};
