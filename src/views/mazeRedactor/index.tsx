import React from 'react';
import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import { toast } from 'react-toastify';
import { getNextAreaType } from 'src/utils/areaUtils';
import { Point } from 'src/types/point';
import { AreaTypes } from 'src/types/maze';
import { StoreContext } from 'src/context/storeContext';
import { Renderer } from 'src/components/renderer';
import { ControlPanel } from 'src/components/controlPanel';
import { PalettePanel } from 'src/components/palettePanel';
import { GeneratePanel } from 'src/components/generatePanel';
import { LoadMazeModal } from './loadMazeModal';
import { hugeSizeFrom } from './const';
import { HeadControl } from './styled';

const defaultSize = { width: 32, height: 24 };

export const MazeRedactor: React.FC = observer(() => {
  const { mazeStore, cursorStore } = React.useContext(StoreContext);
  const [showLoadModal, setShowLoadModal] = React.useState(false);
  const [enableCoords, setEnableCoords] = React.useState(true);

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

  const initMaze = (width: number = defaultSize.width, height: number = defaultSize.height) => {
    const tooBig = width > hugeSizeFrom || height > hugeSizeFrom;

    setEnableCoords(!tooBig);
    mazeStore.generate(width, height);
    cursorStore.setBoxSize(width, height);
    cursorStore.setEnable(true);
    cursorStore.reset();
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

  const handleAreaClick = (areaPoint: Point) => {
    mazeStore.changeAreaType(areaPoint);
  };

  const handleSave = () => {
    mazeStore.save().then(() => toast('Saved!'));
  };

  const handleLoad = (mazeId: string) => {
    mazeStore.load(mazeId).then(() => {
      cursorStore.setBoxSize(mazeStore.width, mazeStore.height);
      cursorStore.reset();
      toast('Loaded!');
    });
  };

  const handleDelete = (mazeId?: string) => {
    mazeStore.delete(mazeId).then(async () => {
      toast('Deleted!');
      await mazeStore.loadMazeList();
      !mazeId && initMaze();
    });
  };

  React.useEffect(() => {
    mazeStore.loadMazeList();
    React.startTransition(() => initMaze());
  }, []);

  return (
    <React.Fragment>
      <HeadControl>
        <PalettePanel
          areaType={mazeStore.fillAreaType}
          areaTypes={Object.values(AreaTypes)}
          onSelect={(type) => mazeStore.setFillAreaType(type)}
        />
        <GeneratePanel onGenerate={initMaze} />
      </HeadControl>
      <Renderer
        maze={mazeStore.maze}
        cursor={toJS(cursorStore.cursor)}
        canvasWidth={window.innerWidth - 80}
        onKeyDown={handleKeyDown}
        onAreaClick={handleAreaClick}
        enableCoords={enableCoords}
      />
      <ControlPanel
        onSave={handleSave}
        enableLoad={!!mazeStore.mazeList.length}
        onLoad={() => setShowLoadModal(true)}
        enableDelete={!!mazeStore.mazeId}
        onDelete={() => handleDelete()}
      />
      {showLoadModal && (
        <LoadMazeModal
          mazeList={mazeStore.mazeList}
          onLoad={handleLoad}
          onDelete={handleDelete}
          onCancel={() => setShowLoadModal(false)}
        />
      )}
    </React.Fragment>
  );
});
