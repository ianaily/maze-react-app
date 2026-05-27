import type { GameStateDocument } from './game-state-document.js';

export function validateGameStateDocument(document: GameStateDocument): void {
  if (document.version !== 1) {
    throw new Error(`Unsupported game state version: ${document.version}`);
  }

  if (!Array.isArray(document.scenes) || document.scenes.length === 0) {
    throw new Error('Game state must register at least one scene.');
  }

  const seenIds = new Set<string>();

  for (const scene of document.scenes) {
    if (typeof scene.id !== 'string' || scene.id.length === 0) {
      throw new Error('Game state scene id must be a non-empty string.');
    }

    if (seenIds.has(scene.id)) {
      throw new Error(`Duplicate game state scene id: ${scene.id}`);
    }

    seenIds.add(scene.id);
  }

  if (!seenIds.has(document.defaultSceneId)) {
    throw new Error(`Game state defaultSceneId references unknown scene: ${document.defaultSceneId}`);
  }

  for (const transition of document.transitions ?? []) {
    if (!seenIds.has(transition.fromSceneId)) {
      throw new Error(`Game state transition references unknown fromSceneId: ${transition.fromSceneId}`);
    }

    if (!seenIds.has(transition.toSceneId)) {
      throw new Error(`Game state transition references unknown toSceneId: ${transition.toSceneId}`);
    }

    if (typeof transition.eventName !== 'string' || transition.eventName.length === 0) {
      throw new Error('Game state transition requires a non-empty eventName.');
    }
  }
}
