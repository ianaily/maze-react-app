import type { GameStateSnapshot } from './game-state-document.js';

export function serializeSnapshot(snapshot: GameStateSnapshot): string {
  return JSON.stringify(snapshot);
}

export function parseSnapshot(payload: string): GameStateSnapshot {
  const parsed = JSON.parse(payload) as Partial<GameStateSnapshot>;

  if (parsed.version !== 1) {
    throw new Error(`Unsupported game state snapshot version: ${String(parsed.version)}`);
  }

  if (typeof parsed.currentSceneId !== 'string' || parsed.currentSceneId.length === 0) {
    throw new Error('Snapshot must carry a non-empty currentSceneId.');
  }

  if (parsed.variables === undefined || typeof parsed.variables !== 'object') {
    throw new Error('Snapshot must carry a variables map.');
  }

  return {
    version: 1,
    currentSceneId: parsed.currentSceneId,
    variables: { ...parsed.variables }
  };
}
