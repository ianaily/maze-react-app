import React from 'react';
import { toJS } from 'mobx';
import { MobXProviderContext, observer } from 'mobx-react';
import { useKeyboard } from 'src/hooks/useKeyboard';
import Renderer from 'src/components/renderer';
import { StoresType } from './types';

const size = { width: 32, height: 24 };

export const MazeRedactor: React.FC = observer(() => {
  const { mazeStore, cursorStore } = React.useContext(MobXProviderContext) as StoresType;
  const keyActionMap: { [key: string]: VoidFunction } = {
    r() {
      mazeStore.generate(size.width, size.height);
      cursorStore.reset();
    },
    e: () => mazeStore.changeAreaTypeToNext(cursorStore.cursor.point),
  };

  const handleKeyDown = (key: string) => {
    keyActionMap[key]?.();

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
      cursorStore.setBoxSize(size.width, size.height);
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
