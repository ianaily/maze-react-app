import React from 'react';
import { Provider } from 'mobx-react';
import { GlobalStyle } from 'src/styles/global';
import MazeStore from 'src/stores/mazeStore';
import CursorStore from 'src/stores/cursorStore';
import { MazeRedactor } from 'src/views/mazeRedactor';

export default function App() {
  const mazeStore = React.useMemo(() => new MazeStore(), []);
  const cursorStore = React.useMemo(() => new CursorStore(), []);

  return (
    <React.Fragment>
      <Provider mazeStore={mazeStore} cursorStore={cursorStore}>
        <GlobalStyle />
        <MazeRedactor />
      </Provider>
    </React.Fragment>
  );
}
