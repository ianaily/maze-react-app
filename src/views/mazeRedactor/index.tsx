import React from 'react';
import { toJS } from 'mobx';
import { MobXProviderContext, observer } from 'mobx-react';
import { useKeyboard } from 'src/hooks/useKeyboard';
import { getNextAreaType } from 'src/utils/areaUtils';
import { AreaTypes } from 'src/types/maze';
import { Renderer } from 'src/components/renderer';
import { ControlPanel } from 'src/components/controlPanel';
import { StoresType } from './types';
import { LoadMazeModal } from './loadMazeModal';

const size = { width: 32, height: 24 };

export const MazeRedactor: React.FC = observer(() => {
  const { mazeStore, cursorStore } = React.useContext(MobXProviderContext) as StoresType;
  const [showLoadModal, setShowLoadModal] = React.useState(false);

  const keyActionMap: { [key: string]: VoidFunction } = {
    'r': () => initMaze(),
    'e': () => fillWithNextType(),
    'f': () => mazeStore.changeAreaType(cursorStore.cursor.point),
    '1': () => mazeStore.changeAreaType(cursorStore.cursor.point, AreaTypes.Wall),
    '2': () => mazeStore.changeAreaType(cursorStore.cursor.point, AreaTypes.Way),
    '3': () => mazeStore.changeAreaType(cursorStore.cursor.point, AreaTypes.Thread),
    '4': () => mazeStore.changeAreaType(cursorStore.cursor.point, AreaTypes.Center),
    '5': () => mazeStore.changeAreaType(cursorStore.cursor.point, AreaTypes.Enter),
    '6': () => mazeStore.changeAreaType(cursorStore.cursor.point, AreaTypes.Exit),
  };

  const fillWithNextType = () => {
    const type = mazeStore.utils.getAreaType(cursorStore.cursor.point);
    const nextType = getNextAreaType(type);

    mazeStore.changeAreaType(cursorStore.cursor.point, nextType);
  };

  const initMaze = () => {
    mazeStore.generate(size.width, size.height);
    cursorStore.setBoxSize(size.width, size.height);
    cursorStore.setEnable(true);
    cursorStore.reset();
  };

  const handleKeyDown = (key: string) => {
    if (showLoadModal) {
      return;
    }

    keyActionMap[key]?.();

    if (cursorStore.enabled) {
      ['ArrowUp', 'w'].includes(key) && cursorStore.toUp();
      ['ArrowRight', 'd'].includes(key) && cursorStore.toRight();
      ['ArrowDown', 's'].includes(key) && cursorStore.toDown();
      ['ArrowLeft', 'a'].includes(key) && cursorStore.toLeft();
    }
  };

  const handleSave = () => {
    mazeStore.save().then(() => console.log('saved!'));
  };

  const handleUpdate = () => {
    mazeStore.update().then(() => console.log('updated!'));
  };

  const handleLoad = (mazeId: string) => {
    mazeStore.load(mazeId).then(() => {
      cursorStore.setBoxSize(mazeStore.width, mazeStore.height);
      cursorStore.reset();
      console.log('loaded!');
    });
  };

  useKeyboard(handleKeyDown);

  React.useEffect(() => {
    mazeStore.loadMazeList();
    React.startTransition(() => initMaze());
  }, []);

  return (
    <React.Fragment>
      <Renderer
        maze={mazeStore.maze}
        cursor={toJS(cursorStore.cursor)}
        canvasWidth={1280}
        canvasHeight={1024}
      />
      <ControlPanel
        onSave={handleSave}
        onUpdate={handleUpdate}
        enableUpdate={!!mazeStore.mazeId}
        enableLoad={!!mazeStore.mazeList.length}
        onLoad={() => setShowLoadModal(true)}
      />
      {showLoadModal && (
        <LoadMazeModal
          mazeList={mazeStore.mazeList}
          onLoad={handleLoad}
          onCancel={() => setShowLoadModal(false)}
        />
      )}
    </React.Fragment>
  );
});
