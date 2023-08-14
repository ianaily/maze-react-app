import React from 'react';
import { MazeStore } from 'src/stores/mazeStore';
import { CursorStore } from 'src/stores/cursorStore';
import { StoreContext } from 'src/context/storeContext';

type StoresType = {
  mazeStore: MazeStore;
  cursorStore: CursorStore;
};

export const useStore = (): StoresType => {
  const { mazeStore, cursorStore } = React.useContext(StoreContext);

  return {
    mazeStore,
    cursorStore,
  };
};
