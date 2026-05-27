import React from 'react';
import { useNavigate } from 'react-router';
import { observer } from 'mobx-react-lite';
import { appLinks } from 'src/router/const';
import { Modal } from 'src/components/modal';
import { useKeyboard } from 'src/hooks/useKeyboard';
import { startGameRunner, type GameRunner, type GameRunnerStats } from 'src/game/runner';
import {
  Container,
  HudCell,
  HudFrame,
  HudHint,
  LoadingLabel,
  Viewport,
} from './styled';
import { useStore } from './store';

const formatElapsed = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const Gameplay: React.FC = observer(() => {
  const { mazeStore } = useStore();
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const runnerRef = React.useRef<GameRunner | null>(null);
  const [showPauseModal, setShowPauseModal] = React.useState(false);
  const [won, setWon] = React.useState(false);
  const [ready, setReady] = React.useState(false);
  const [runKey, setRunKey] = React.useState(0);
  const [stats, setStats] = React.useState<GameRunnerStats>({
    elapsedMs: 0,
    coinsCollected: 0,
    totalCoins: 0,
  });
  const navigate = useNavigate();

  const handleMainMenu = () => {
    navigate(appLinks.mainMenu, { replace: true });
  };

  const restart = React.useCallback(async () => {
    runnerRef.current?.dispose();
    runnerRef.current = null;
    setReady(false);
    setWon(false);
    await mazeStore.getRandomSavedMaze();
    setRunKey((key) => key + 1);
  }, [mazeStore]);

  useKeyboard((key) => {
    if (key === 'Escape') {
      setShowPauseModal((show) => !show);
      return;
    }
    if (key === 'KeyR') {
      void restart();
    }
  });

  React.useEffect(() => {
    let cancelled = false;

    const init = async () => {
      if (mazeStore.isEmpty) {
        await mazeStore.getRandomSavedMaze();
      }

      const canvas = canvasRef.current;
      if (!canvas || cancelled) {
        return;
      }

      const runner = await startGameRunner({
        canvas,
        maze: mazeStore.maze,
        onWin: () => setWon(true),
        onStats: (next) => setStats(next),
      });

      if (cancelled) {
        runner.dispose();
        return;
      }

      runnerRef.current = runner;
      setReady(true);
    };

    void init();

    return () => {
      cancelled = true;
      runnerRef.current?.dispose();
      runnerRef.current = null;
    };
  }, [mazeStore, runKey]);

  return (
    <Container>
      <Viewport ref={canvasRef} />
      {!ready && <LoadingLabel>Loading…</LoadingLabel>}
      {ready && (
        <HudFrame>
          <HudCell>
            <span>Time</span>
            <span>{formatElapsed(stats.elapsedMs)}</span>
          </HudCell>
          <HudCell>
            <span>Coins</span>
            <span>
              {stats.coinsCollected} / {stats.totalCoins}
            </span>
          </HudCell>
        </HudFrame>
      )}
      {ready && <HudHint>WASD / Arrows to move · R to restart · Esc to pause</HudHint>}
      {showPauseModal && (
        <Modal.Pause onMainMenu={handleMainMenu} onCancel={() => setShowPauseModal(false)} />
      )}
      {won && <Modal.GameMessage>You Win!</Modal.GameMessage>}
    </Container>
  );
});

export default Gameplay;
