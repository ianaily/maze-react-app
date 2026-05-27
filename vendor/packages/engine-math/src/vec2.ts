export interface ReadonlyVec2 {
  readonly x: number;
  readonly y: number;
}

export interface MutableVec2 {
  x: number;
  y: number;
}

export const createVec2 = (x = 0, y = 0): MutableVec2 => ({ x, y });

export const setVec2 = (out: MutableVec2, x: number, y: number): MutableVec2 => {
  out.x = x;
  out.y = y;
  return out;
};

export const copyVec2 = (out: MutableVec2, value: ReadonlyVec2): MutableVec2 => {
  out.x = value.x;
  out.y = value.y;
  return out;
};

export const addVec2 = (out: MutableVec2, left: ReadonlyVec2, right: ReadonlyVec2): MutableVec2 => {
  out.x = left.x + right.x;
  out.y = left.y + right.y;
  return out;
};

export const subtractVec2 = (out: MutableVec2, left: ReadonlyVec2, right: ReadonlyVec2): MutableVec2 => {
  out.x = left.x - right.x;
  out.y = left.y - right.y;
  return out;
};

export const scaleVec2 = (out: MutableVec2, value: ReadonlyVec2, scalar: number): MutableVec2 => {
  out.x = value.x * scalar;
  out.y = value.y * scalar;
  return out;
};

export const lengthSquaredVec2 = (value: ReadonlyVec2): number => value.x * value.x + value.y * value.y;

export const lengthVec2 = (value: ReadonlyVec2): number => Math.sqrt(lengthSquaredVec2(value));

export const distanceSquaredVec2 = (left: ReadonlyVec2, right: ReadonlyVec2): number => {
  const x = left.x - right.x;
  const y = left.y - right.y;
  return x * x + y * y;
};

export const normalizeVec2 = (out: MutableVec2, value: ReadonlyVec2): MutableVec2 => {
  const length = lengthVec2(value);

  if (length === 0) {
    out.x = 0;
    out.y = 0;
    return out;
  }

  out.x = value.x / length;
  out.y = value.y / length;
  return out;
};
