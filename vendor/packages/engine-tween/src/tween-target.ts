export type TweenTargetComponent = 'transform' | 'sprite';

export type TweenTargetField =
  | 'x'
  | 'y'
  | 'rotation'
  | 'scaleX'
  | 'scaleY'
  | 'alpha'
  | 'offsetX'
  | 'offsetY';

export const SUPPORTED_TARGET_FIELDS: Readonly<Record<TweenTargetComponent, ReadonlySet<TweenTargetField>>> = {
  transform: new Set<TweenTargetField>(['x', 'y', 'rotation', 'scaleX', 'scaleY']),
  sprite: new Set<TweenTargetField>(['alpha', 'offsetX', 'offsetY'])
};

export function isSupportedTarget(component: TweenTargetComponent, field: TweenTargetField): boolean {
  return SUPPORTED_TARGET_FIELDS[component].has(field);
}
