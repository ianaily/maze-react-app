import React from 'react';
import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import { getNextAreaType } from 'src/utils/areaUtils';
import { defaultMazeSize } from 'src/const/maze';
import { Point } from 'src/types/point';
import { AreaType, AreaTypes } from 'src/types/maze';
import { appLinks } from 'src/router/const';
import { StoreContext } from 'src/context/storeContext';
import { Renderer } from 'src/components/renderer';
import { Panel } from 'src/components/panels';
import { Modal } from 'src/components/modal';
import { ContextMenu } from 'src/components/contextMenu';
import { hugeSizeFrom } from './const';
import { Container, HeadControl, LeftHeadControl } from './styled';

const MazeRedactor: React.FC = observer(() => {
  const navigate = useNavigate();
  const { mazeStore, cursorStore } = React.useContext(StoreContext);
  const [showLoadModal, setShowLoadModal] = React.useState(false);
  const [enableCoords, setEnableCoords] = React.useState(true);
  const [contextMenuData, setContextMenuData] = React.useState<{
    offset: Point;
    area: Point;
  } | null>(null);

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

  const initMaze = (
    width: number = defaultMazeSize.width,
    height: number = defaultMazeSize.height,
  ) => {
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

  const handleMouseMove = (areaPoint: Point) => {
    cursorStore.setCursorPoint(areaPoint);
  };

  const handleContextMenu = (area: Point, offset: Point) => {
    setContextMenuData({ area, offset });
  };

  const handleFillArea = (type: AreaType) => {
    mazeStore.setFillAreaType(type);
    contextMenuData && mazeStore.changeAreaType(contextMenuData.area);
  };

  const handleSelectType = (type: AreaType) => {
    mazeStore.setFillAreaType(type);
  };

  const handleBack = () => {
    navigate(appLinks.mainMenu, { replace: true });
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
    <Container>
      <HeadControl>
        <LeftHeadControl>
          <Panel.Navigation onBack={handleBack} />
          <Panel.Palette
            areaType={mazeStore.fillAreaType}
            areaTypes={mazeStore.areaTypes}
            onSelect={handleSelectType}
          />
        </LeftHeadControl>
        <Panel.Generate onGenerate={initMaze} />
      </HeadControl>
      <Renderer.MazeRedactor
        maze={mazeStore.maze}
        cursor={toJS(cursorStore.cursor)}
        canvasWidth={window.innerWidth - 80}
        onKeyDown={handleKeyDown}
        onAreaClick={handleAreaClick}
        onMouseMove={handleMouseMove}
        onContextMenu={handleContextMenu}
        enableCoords={enableCoords}
      />
      <Panel.Control
        onSave={handleSave}
        enableLoad={!!mazeStore.mazeList.length}
        onLoad={() => setShowLoadModal(true)}
        enableDelete={!!mazeStore.mazeId}
        onDelete={() => handleDelete()}
      />
      {showLoadModal && (
        <Modal.LoadMaze
          mazeList={mazeStore.mazeList}
          onLoad={handleLoad}
          onDelete={handleDelete}
          onCancel={() => setShowLoadModal(false)}
        />
      )}
      {contextMenuData && (
        <ContextMenu.Redactor
          {...contextMenuData.offset}
          areaTypes={mazeStore.areaTypes}
          onSelectAreaType={handleFillArea}
          onClose={() => setContextMenuData(null)}
        />
      )}
    </Container>
  );
});

export default MazeRedactor;
