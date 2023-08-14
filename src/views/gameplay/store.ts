import React from 'react';
import { MazeStore } from 'src/stores/mazeStore';
import { PlayerStore } from 'src/stores/playerStore';
import { CameraStore } from 'src/stores/cameraStore';
import { StoreContext } from 'src/context/storeContext';

type StoresType = {
  mazeStore: MazeStore;
  playerStore: PlayerStore;
  cameraStore: CameraStore;
};

export const useStore = (): StoresType => {
  const { mazeStore, playerStore, cameraStore } = React.useContext(StoreContext);

  return {
    mazeStore,
    playerStore,
    cameraStore,
  };
};
