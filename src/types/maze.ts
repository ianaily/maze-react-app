export interface Maze {
  areas: Area[];
  enter: Area;
  exit: Area;
  center: Area;
  width: number;
  height: number;
}

export interface Area {
  x: number;
  y: number;
  type: AreaType;
  // todo passed: boolean
}

export interface AreaType {
  name: string;
  short: string;
  passable: boolean;
  rewritable: boolean;
}

// todo redo keys
export const AreaTypes: { [key: string]: AreaType } = {
  Way: {
    name: 'Way',
    short: ' ',
    passable: true,
    rewritable: false,
  },
  Thread: {
    name: 'Thread',
    short: '·',
    passable: true,
    rewritable: false,
  },
  Enter: {
    name: 'Enter',
    short: '✦',
    passable: false,
    rewritable: false,
  },
  Exit: {
    name: 'Exit',
    short: '⚹',
    passable: false,
    rewritable: false,
  },
  Center: {
    name: 'Center',
    short: '❂',
    passable: true,
    rewritable: false,
  },
  // todo delete
  Pass: {
    name: 'Pass',
    short: '◦',
    passable: true,
    rewritable: false,
  },
  Wall: {
    name: 'Wall',
    short: '▒',
    passable: false,
    rewritable: true,
  },
};
