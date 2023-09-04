import { createContext } from 'react';
import mazeStore, { MazeStore } from 'src/stores/mazeStore';
import gameStore, { GameStore } from 'src/stores/gameStore';
import cursorStore, { CursorStore } from 'src/stores/cursorStore';
import playerStore, { PlayerStore } from 'src/stores/playerStore';
import cameraStore, { CameraStore } from 'src/stores/cameraStore';
import configStore, { ConfigStore } from 'src/stores/configStore';

type StoreContextType = {
  mazeStore: MazeStore;
  gameStore: GameStore;
  cursorStore: CursorStore;
  playerStore: PlayerStore;
  cameraStore: CameraStore;
  configStore: ConfigStore;
};

export const StoreContext = createContext<StoreContextType>({
  mazeStore,
  gameStore,
  cursorStore,
  playerStore,
  cameraStore,
  configStore,
});
