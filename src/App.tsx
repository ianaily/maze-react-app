import React from 'react';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import { GlobalStyle } from 'src/styles/global';
import { mazeStore } from './stores/mazeStore';
import { cursorStore } from './stores/cursorStore';
import Renderer from 'src/components/renderer';

export default observer(() => {
  React.useEffect(() => {
    React.startTransition(() => {
      mazeStore.generate(24, 16);
      cursorStore.setEnable(true);
    });
  }, []);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key;

      key === 'r' && mazeStore.generate(24, 16);

      if (cursorStore.enabled) {
        ['ArrowUp', 'w'].includes(key) && cursorStore.toUp();
        ['ArrowRight', 'd'].includes(key) && cursorStore.toRight();
        ['ArrowDown', 's'].includes(key) && cursorStore.toDown();
        ['ArrowLeft', 'a'].includes(key) && cursorStore.toLeft();
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <React.Fragment>
      <GlobalStyle />
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
    </React.Fragment>
  );
});
