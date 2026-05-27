import type { MutableVec2, ReadonlyVec2 } from './vec2.js';

export interface ReadonlyAabb {
  readonly minX: number;
  readonly minY: number;
  readonly maxX: number;
  readonly maxY: number;
}

export interface MutableAabb {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export const createAabb = (minX = 0, minY = 0, maxX = 0, maxY = 0): MutableAabb => ({
  minX,
  minY,
  maxX,
  maxY
});

export const setAabb = (
  out: MutableAabb,
  minX: number,
  minY: number,
  maxX: number,
  maxY: number
): MutableAabb => {
  out.minX = minX;
  out.minY = minY;
  out.maxX = maxX;
  out.maxY = maxY;
  return out;
};

export const copyAabb = (out: MutableAabb, value: ReadonlyAabb): MutableAabb => {
  out.minX = value.minX;
  out.minY = value.minY;
  out.maxX = value.maxX;
  out.maxY = value.maxY;
  return out;
};

export const setAabbFromCenterSize = (
  out: MutableAabb,
  center: ReadonlyVec2,
  width: number,
  height: number
): MutableAabb => {
  const halfWidth = width * 0.5;
  const halfHeight = height * 0.5;

  out.minX = center.x - halfWidth;
  out.minY = center.y - halfHeight;
  out.maxX = center.x + halfWidth;
  out.maxY = center.y + halfHeight;
  return out;
};

export const getAabbCenter = (out: MutableVec2, value: ReadonlyAabb): MutableVec2 => {
  out.x = (value.minX + value.maxX) * 0.5;
  out.y = (value.minY + value.maxY) * 0.5;
  return out;
};

export const getAabbSize = (out: MutableVec2, value: ReadonlyAabb): MutableVec2 => {
  out.x = value.maxX - value.minX;
  out.y = value.maxY - value.minY;
  return out;
};

export const intersectsAabb = (left: ReadonlyAabb, right: ReadonlyAabb): boolean => {
  return left.minX <= right.maxX && left.maxX >= right.minX && left.minY <= right.maxY && left.maxY >= right.minY;
};

export const containsAabbPoint = (bounds: ReadonlyAabb, point: ReadonlyVec2): boolean => {
  return point.x >= bounds.minX && point.x <= bounds.maxX && point.y >= bounds.minY && point.y <= bounds.maxY;
};

export const unionAabb = (out: MutableAabb, left: ReadonlyAabb, right: ReadonlyAabb): MutableAabb => {
  out.minX = Math.min(left.minX, right.minX);
  out.minY = Math.min(left.minY, right.minY);
  out.maxX = Math.max(left.maxX, right.maxX);
  out.maxY = Math.max(left.maxY, right.maxY);
  return out;
};
