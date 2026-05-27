import type { GameVariableValue } from './game-state-document.js';

export class GameVariables {
  private readonly entries = new Map<string, GameVariableValue>();

  has(key: string): boolean {
    return this.entries.has(key);
  }

  get<T extends GameVariableValue>(key: string): T | undefined;
  get(key: string): GameVariableValue | undefined {
    return this.entries.get(key);
  }

  set(key: string, value: GameVariableValue): void {
    if (key.length === 0) {
      throw new Error('Game variable key must not be empty.');
    }

    if (typeof value !== 'number' && typeof value !== 'boolean' && typeof value !== 'string') {
      throw new Error(`Unsupported game variable value type for "${key}".`);
    }

    if (typeof value === 'number' && !Number.isFinite(value)) {
      throw new Error(`Game variable "${key}" must be a finite number.`);
    }

    this.entries.set(key, value);
  }

  delete(key: string): boolean {
    return this.entries.delete(key);
  }

  clear(): void {
    this.entries.clear();
  }

  keys(): IterableIterator<string> {
    return this.entries.keys();
  }

  toJSON(): Record<string, GameVariableValue> {
    const out: Record<string, GameVariableValue> = {};

    for (const [key, value] of this.entries) {
      out[key] = value;
    }

    return out;
  }

  loadFrom(payload: Readonly<Record<string, GameVariableValue>>): void {
    this.entries.clear();

    for (const [key, value] of Object.entries(payload)) {
      this.set(key, value);
    }
  }
}
