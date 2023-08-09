import { createContext } from 'react';
import mazeStore, { MazeStore } from 'src/stores/mazeStore';
import cursorStore, { CursorStore } from 'src/stores/cursorStore';

type StoreContextType = {
  mazeStore: MazeStore;
  cursorStore: CursorStore;
};

export const StoreContext = createContext<StoreContextType>({
  mazeStore: mazeStore,
  cursorStore: cursorStore,
});
