import React from 'react';
import { MazeStore } from 'src/stores/mazeStore';
import { GameStore } from 'src/stores/gameStore';
import { PlayerStore } from 'src/stores/playerStore';
import { CameraStore } from 'src/stores/cameraStore';
import { ConfigStore } from 'src/stores/configStore';
import { StoreContext } from 'src/context/storeContext';

type StoresType = {
  mazeStore: MazeStore;
  gameStore: GameStore;
  playerStore: PlayerStore;
  cameraStore: CameraStore;
  configStore: ConfigStore;
};

export const useStore = (): StoresType => {
  const { mazeStore, gameStore, playerStore, cameraStore, configStore } =
    React.useContext(StoreContext);

  return {
    mazeStore,
    gameStore,
    playerStore,
    cameraStore,
    configStore,
  };
};
