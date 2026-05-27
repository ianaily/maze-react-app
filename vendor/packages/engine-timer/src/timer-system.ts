import type { EventBus, System, World } from '../../engine-core/src/index.js';
import { TIMER_ACTIVE, type TimerStore } from './timer-store.js';

export interface TimerCompleteEvent {
  readonly entity: number;
  readonly eventName: string;
  readonly totalTicks: number;
}

export interface TimerSystemOptions {
  readonly timers: TimerStore;
  readonly bus: EventBus;
  readonly priority?: number;
}

export class TimerSystem implements System {
  readonly name = 'timers';
  readonly priority: number;

  private readonly timers: TimerStore;
  private readonly bus: EventBus;

  constructor(options: TimerSystemOptions) {
    this.timers = options.timers;
    this.bus = options.bus;
    this.priority = options.priority ?? -200;
  }

  fixedUpdate(world: World): void {
    for (const entity of this.timers.entities()) {
      if (!world.hasEntity(entity)) {
        continue;
      }

      const slots = this.timers.slotsOf(entity);

      for (const slot of slots) {
        if (slot.active !== TIMER_ACTIVE) {
          continue;
        }

        slot.remainingTicks -= 1;

        if (slot.remainingTicks <= 0) {
          slot.active = 0;
          this.bus.publish<TimerCompleteEvent>(slot.eventName, {
            entity: entity as unknown as number,
            eventName: slot.eventName,
            totalTicks: slot.totalTicks
          });
        }
      }
    }
  }
}
