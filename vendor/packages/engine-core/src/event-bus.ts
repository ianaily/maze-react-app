export type EventHandler<TPayload = unknown> = (payload: TPayload) => void;

export interface EventSubscription {
  dispose(): void;
}

/**
 * Minimal synchronous typed event bus. Listeners fire in registration order at
 * the moment a `publish` call is made. Used for cross-system messaging without
 * coupling concrete system instances together.
 */
export class EventBus {
  private readonly handlers = new Map<string, Set<EventHandler<unknown>>>();

  subscribe<TPayload>(name: string, handler: EventHandler<TPayload>): EventSubscription {
    if (name.length === 0) {
      throw new Error('EventBus subscription requires a non-empty event name.');
    }

    let bucket = this.handlers.get(name);

    if (bucket === undefined) {
      bucket = new Set();
      this.handlers.set(name, bucket);
    }

    const wrapped = handler as EventHandler<unknown>;
    bucket.add(wrapped);

    return {
      dispose: () => {
        const current = this.handlers.get(name);

        if (current === undefined) {
          return;
        }

        current.delete(wrapped);

        if (current.size === 0) {
          this.handlers.delete(name);
        }
      }
    };
  }

  publish<TPayload>(name: string, payload: TPayload): void {
    const bucket = this.handlers.get(name);

    if (bucket === undefined) {
      return;
    }

    for (const handler of bucket) {
      handler(payload);
    }
  }

  clear(): void {
    this.handlers.clear();
  }

  hasListeners(name: string): boolean {
    return (this.handlers.get(name)?.size ?? 0) > 0;
  }
}
