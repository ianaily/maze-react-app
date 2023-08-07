import { AreaTypes } from 'src/types/maze';

export const areaFillStyles: { [key in keyof typeof AreaTypes]: string } = {
  Way: '#abc',
  Pass: '#789',
  Thread: '#cba',
  Center: '#fd0',
  Enter: '#f64',
  Exit: '#af0',
  Wall: '#456',
};

export const coordsFillStyle = 'black';
export const cursorFillStyle = '#f1c';
