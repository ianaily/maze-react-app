import { MazeRedactorRendererProps } from './mazeRedactor/types';

export type RendererVariants = 'MazeRedactor';

export type VariantPropsMap = {
  MazeRedactor: MazeRedactorRendererProps;
};

export interface DrawStyleProps {
  textFill?: string;
  fill?: string;
  stroke?: string;
  lineWidth?: number;
  image?: CanvasImageSource;
}
