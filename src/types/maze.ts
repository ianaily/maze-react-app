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
}

export enum AreaTypeKeys {
  Way = 'Way',
  Thread = 'Thread',
  Enter = 'Enter',
  Exit = 'Exit',
  Center = 'Center',
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
  [AreaTypeKeys.Way]: {
    name: AreaTypeKeys.Way,
    short: ' ',
    passable: true,
    rewritable: true,
  },
  [AreaTypeKeys.Thread]: {
    name: AreaTypeKeys.Thread,
    short: '·',
    passable: true,
    rewritable: false,
  },
  [AreaTypeKeys.Enter]: {
    name: AreaTypeKeys.Enter,
    short: '⍈',
    passable: false,
    rewritable: false,
  },
  [AreaTypeKeys.Exit]: {
    name: AreaTypeKeys.Exit,
    short: '⍇',
    passable: false,
    rewritable: false,
  },
  [AreaTypeKeys.Center]: {
    name: AreaTypeKeys.Center,
    short: '◈', // ◇
    passable: true,
    rewritable: false,
  },
  [AreaTypeKeys.Wall]: {
    name: AreaTypeKeys.Wall,
    short: '▒',
    passable: false,
    rewritable: true,
  },
};
