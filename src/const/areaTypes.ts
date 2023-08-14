import { AreaTypes } from 'src/types/maze';

export const areaFillStyles: { [key in keyof typeof AreaTypes]: string } = {
  Way: '#abc',
  Thread: '#cba',
  Center: '#fd0',
  Enter: '#f64',
  Exit: '#af0',
  Wall: '#456',
};

export const coordsFillStyle = 'black';
export const playerFillStyle = '#f5d';
export const cursorStyle = {
  fill: 'rgba(255, 152, 224, 0.25)',
  stroke: '#f1c',
  lineWidth: 2,
};
