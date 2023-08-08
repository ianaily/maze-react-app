export interface Maze {
  name: string;
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

export enum AreaTypeKeys {
  Way = 'Way',
  Thread = 'Thread',
  Enter = 'Enter',
  Exit = 'Exit',
  Center = 'Center',
  Pass = 'Pass',
  Wall = 'Wall',
}

export interface AreaType {
  name: AreaTypeKeys;
  short: string;
  passable: boolean;
  rewritable: boolean;
}

// todo redo keys
export const AreaTypes: { [key in AreaTypeKeys]: AreaType } = {
  Way: {
    name: AreaTypeKeys.Way,
    short: ' ',
    passable: true,
    rewritable: true,
  },
  Thread: {
    name: AreaTypeKeys.Thread,
    short: '·',
    passable: true,
    rewritable: false,
  },
  Enter: {
    name: AreaTypeKeys.Enter,
    short: '>',
    passable: false,
    rewritable: false,
  },
  Exit: {
    name: AreaTypeKeys.Exit,
    short: '<',
    passable: false,
    rewritable: false,
  },
  Center: {
    name: AreaTypeKeys.Center,
    short: 'o',
    passable: true,
    rewritable: false,
  },
  // todo delete
  Pass: {
    name: AreaTypeKeys.Pass,
    short: '◦',
    passable: true,
    rewritable: false,
  },
  Wall: {
    name: AreaTypeKeys.Wall,
    short: '▒',
    passable: false,
    rewritable: true,
  },
};
