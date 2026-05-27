export interface GameSceneEntryDocument {
  readonly id: string;
  readonly label?: string;
  readonly scenePath?: string;
}

export interface GameTransitionDocument {
  readonly fromSceneId: string;
  readonly eventName: string;
  readonly toSceneId: string;
}

export interface GameStateDocument {
  readonly version: 1;
  readonly defaultSceneId: string;
  readonly scenes: readonly GameSceneEntryDocument[];
  readonly transitions?: readonly GameTransitionDocument[];
}

export type GameVariableValue = number | boolean | string;

export interface GameStateSnapshot {
  readonly version: 1;
  readonly currentSceneId: string;
  readonly variables: Readonly<Record<string, GameVariableValue>>;
}
