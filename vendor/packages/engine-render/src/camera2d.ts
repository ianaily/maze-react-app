import {
  createMatrix2D,
  identityMatrix2D,
  invertMatrix2D,
  transformPoint2D,
  type MutableMatrix2D,
  type MutableVec2,
  type ReadonlyVec2
} from '../../engine-math/src/index.js';

export interface Camera2DOptions {
  readonly x?: number;
  readonly y?: number;
  readonly rotation?: number;
  readonly zoom?: number;
  readonly viewportWidth: number;
  readonly viewportHeight: number;
}

export class Camera2D {
  x: number;
  y: number;
  rotation: number;
  zoom: number;
  viewportWidth: number;
  viewportHeight: number;

  private readonly viewMatrix: MutableMatrix2D = createMatrix2D();
  private readonly inverseViewMatrix: MutableMatrix2D = createMatrix2D();

  constructor(options: Camera2DOptions) {
    this.x = options.x ?? 0;
    this.y = options.y ?? 0;
    this.rotation = options.rotation ?? 0;
    this.zoom = options.zoom ?? 1;
    this.viewportWidth = options.viewportWidth;
    this.viewportHeight = options.viewportHeight;
  }

  projectedToScreen(out: MutableVec2, point: ReadonlyVec2): MutableVec2 {
    this.updateViewMatrix();
    return transformPoint2D(out, this.viewMatrix, point);
  }

  screenToProjected(out: MutableVec2, point: ReadonlyVec2): MutableVec2 {
    this.updateViewMatrix();

    if (invertMatrix2D(this.inverseViewMatrix, this.viewMatrix) === null) {
      throw new Error('Camera view matrix is not invertible.');
    }

    return transformPoint2D(out, this.inverseViewMatrix, point);
  }

  private updateViewMatrix(): void {
    if (this.zoom <= 0) {
      throw new Error(`Camera zoom must be positive. Received: ${this.zoom}`);
    }

    const cos = Math.cos(-this.rotation);
    const sin = Math.sin(-this.rotation);
    const scaledCos = cos * this.zoom;
    const scaledSin = sin * this.zoom;
    const centerX = this.viewportWidth * 0.5;
    const centerY = this.viewportHeight * 0.5;

    identityMatrix2D(this.viewMatrix);
    this.viewMatrix.a = scaledCos;
    this.viewMatrix.b = scaledSin;
    this.viewMatrix.c = -scaledSin;
    this.viewMatrix.d = scaledCos;
    this.viewMatrix.tx = centerX - (this.viewMatrix.a * this.x + this.viewMatrix.c * this.y);
    this.viewMatrix.ty = centerY - (this.viewMatrix.b * this.x + this.viewMatrix.d * this.y);
  }
}
