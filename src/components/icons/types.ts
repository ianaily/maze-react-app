export interface SvgPropsTypes extends React.SVGAttributes<HTMLOrSVGElement> {
  onClick?: React.MouseEventHandler<SVGElement>;
  style?: React.CSSProperties;
}
