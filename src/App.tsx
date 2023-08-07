import React from 'react';
import { observer, Provider } from 'mobx-react';
import { toJS } from 'mobx';
import { GlobalStyle } from 'src/styles/global';
import MazeStore from 'src/stores/mazeStore';
import CursorStore from 'src/stores/cursorStore';
import { useKeyboard } from 'src/hooks/useKeyboard';
import Renderer from 'src/components/renderer';

export default observer(() => {
  const mazeStore = React.useMemo(() => new MazeStore(), []);
  const cursorStore = React.useMemo(() => new CursorStore(), []);

  const handleKeyDown = (key: string) => {
    key === 'r' && mazeStore.generate(24, 16);

    if (cursorStore.enabled) {
      ['ArrowUp', 'w'].includes(key) && cursorStore.toUp();
      ['ArrowRight', 'd'].includes(key) && cursorStore.toRight();
      ['ArrowDown', 's'].includes(key) && cursorStore.toDown();
      ['ArrowLeft', 'a'].includes(key) && cursorStore.toLeft();
    }
  };

  useKeyboard(handleKeyDown);

  React.useEffect(() => {
    React.startTransition(() => {
      mazeStore.generate(24, 16);
      cursorStore.setEnable(true);
    });
  }, []);

  return (
    <React.Fragment>
      <GlobalStyle />
      <Provider mazeStore={mazeStore} cursorStore={cursorStore}>
        <p style={{ fontSize: '16px', color: 'white', margin: '16px' }}>
          {cursorStore.cursor.point.x} : {cursorStore.cursor.point.y}
        </p>
        <div>
          <Renderer
            maze={mazeStore.maze}
            cursor={toJS(cursorStore.cursor)}
            canvasWidth={1280}
            canvasHeight={1024}
          />
        </div>
      </Provider>
    </React.Fragment>
  );
});
