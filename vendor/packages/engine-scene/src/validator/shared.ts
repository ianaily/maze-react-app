export const requireFiniteNumber = (kind: string, id: string, field: string, value: unknown): void => {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(`${kind} "${id}" requires a finite ${field}. Received: ${String(value)}`);
  }
};
