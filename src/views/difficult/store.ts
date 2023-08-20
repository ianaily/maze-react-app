import React from 'react';
import { MazeStore } from 'src/stores/mazeStore';
import { StoreContext } from 'src/context/storeContext';

type StoresType = {
  mazeStore: MazeStore;
};

export const useStore = (): StoresType => {
  const { mazeStore } = React.useContext(StoreContext);

  return { mazeStore };
};
