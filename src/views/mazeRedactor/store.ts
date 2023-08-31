import React from 'react';
import { MazeStore } from 'src/stores/mazeStore';
import { CursorStore } from 'src/stores/cursorStore';
import { ConfigStore } from 'src/stores/configStore';
import { StoreContext } from 'src/context/storeContext';

type StoresType = {
  mazeStore: MazeStore;
  cursorStore: CursorStore;
  configStore: ConfigStore;
};

export const useStore = (): StoresType => {
  const { mazeStore, cursorStore, configStore } = React.useContext(StoreContext);

  return {
    mazeStore,
    cursorStore,
    configStore,
  };
};
