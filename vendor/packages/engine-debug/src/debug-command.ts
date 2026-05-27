export type DebugDrawCommand = DebugRectCommand | DebugLineCommand | DebugCircleCommand;

export interface DebugStyle {
  readonly strokeStyle: string;
  readonly fillStyle?: string;
  readonly lineWidth: number;
}

export interface DebugRectCommand extends DebugStyle {
  readonly kind: 'rect';
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export interface DebugLineCommand extends DebugStyle {
  readonly kind: 'line';
  readonly startX: number;
  readonly startY: number;
  readonly endX: number;
  readonly endY: number;
}

export interface DebugCircleCommand extends DebugStyle {
  readonly kind: 'circle';
  readonly x: number;
  readonly y: number;
  readonly radius: number;
}
