import { AreaTypes } from 'src/types/maze';

export const areaFillColors: { [key in keyof typeof AreaTypes]: string } = {
  Way: '#abc',
  Thread: '#cba',
  Center: '#fd0',
  Enter: '#f64',
  Exit: '#af0',
  Wall: '#456',
};
