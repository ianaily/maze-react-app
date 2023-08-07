import React from 'react';
import { toJS } from 'mobx';
import { MobXProviderContext, observer } from 'mobx-react';
import { useKeyboard } from 'src/hooks/useKeyboard';
import Renderer from 'src/components/renderer';

const size = { width: 32, height: 24 };
export const MazeRedactor: React.FC = observer(() => {
  const { mazeStore, cursorStore } = React.useContext(MobXProviderContext);

  const handleKeyDown = (key: string) => {
    key === 'r' && mazeStore.generate(size.width, size.height);

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
      mazeStore.generate(size.width, size.height);
      cursorStore.setEnable(true);
    });
  }, []);

  return (
    <React.Fragment>
      <Renderer
        maze={mazeStore.maze}
        cursor={toJS(cursorStore.cursor)}
        canvasWidth={1280}
        canvasHeight={1024}
      />
    </React.Fragment>
  );
});
