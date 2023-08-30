import React from 'react';
import { MazeStore } from 'src/stores/mazeStore';
import { ConfigStore } from 'src/stores/configStore';
import { StoreContext } from 'src/context/storeContext';

type StoresType = {
  mazeStore: MazeStore;
  configStore: ConfigStore;
};

export const useStore = (): StoresType => {
  const { mazeStore, configStore } = React.useContext(StoreContext);

  return { mazeStore, configStore };
};
