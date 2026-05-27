import type { MutableVec2, ReadonlyVec2 } from '../../engine-math/src/index.js';

export interface Projection {
  readonly name: string;
  project(out: MutableVec2, point: ReadonlyVec2): MutableVec2;
  unproject(out: MutableVec2, point: ReadonlyVec2): MutableVec2;
  /**
   * Compose a numeric depth key. The render sort is `layer → entity.order →
   * within-layer position`, so projection implementations slot `order` between
   * the layer magnitude and the per-projection positional term (Y for
   * side-view, X+Y for isometric, nothing for top-down). `order` defaults to 0
   * for callers that haven't started threading the entity order through yet.
   */
  depth(point: ReadonlyVec2, layer: number, order?: number): number;
}

export type ProjectionView = 'top-down' | 'side-view' | 'isometric' | 'pseudo-3d';

export interface IsometricProjectionOptions {
  readonly tileWidth: number;
  readonly tileHeight: number;
}

export const createTopDownProjection = (): Projection => ({
  name: 'top-down',
  project(out, point) {
    out.x = point.x;
    out.y = point.y;
    return out;
  },
  unproject(out, point) {
    out.x = point.x;
    out.y = point.y;
    return out;
  },
  depth(_point, layer, order = 0) {
    return layer * 1_000_000 + order;
  }
});

export const createSideViewProjection = (): Projection => ({
  name: 'side-view',
  project(out, point) {
    out.x = point.x;
    out.y = point.y;
    return out;
  },
  unproject(out, point) {
    out.x = point.x;
    out.y = point.y;
    return out;
  },
  depth(point, layer, order = 0) {
    return layer * 1_000_000 + order * 1_000 + point.y;
  }
});

export const createIsometricProjection = (options: IsometricProjectionOptions): Projection => {
  if (options.tileWidth <= 0 || options.tileHeight <= 0) {
    throw new Error('Isometric tile size must be positive.');
  }

  const halfWidth = options.tileWidth * 0.5;
  const halfHeight = options.tileHeight * 0.5;

  return {
    name: 'isometric',
    project(out, point) {
      out.x = (point.x - point.y) * halfWidth;
      out.y = (point.x + point.y) * halfHeight;
      return out;
    },
    unproject(out, point) {
      const x = point.x / halfWidth;
      const y = point.y / halfHeight;

      out.x = (x + y) * 0.5;
      out.y = (y - x) * 0.5;
      return out;
    },
    depth(point, layer, order = 0) {
      return layer * 1_000_000 + order * 1_000 + point.x + point.y;
    }
  };
};

export const createProjectionForView = (view: ProjectionView): Projection => {
  switch (view) {
    case 'top-down':
      return createTopDownProjection();
    case 'side-view':
      return createSideViewProjection();
    case 'isometric':
      return createIsometricProjection({ tileWidth: 64, tileHeight: 32 });
    case 'pseudo-3d':
      throw new Error('pseudo-3d projection is declared in the scene schema but is not implemented yet.');
  }
};
