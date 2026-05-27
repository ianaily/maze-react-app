import { createContext } from 'react';
import mazeStore, { MazeStore } from 'src/stores/mazeStore';
import cursorStore, { CursorStore } from 'src/stores/cursorStore';
import configStore, { ConfigStore } from 'src/stores/configStore';

type StoreContextType = {
  mazeStore: MazeStore;
  cursorStore: CursorStore;
  configStore: ConfigStore;
};

export const StoreContext = createContext<StoreContextType>({
  mazeStore,
  cursorStore,
  configStore,
});
