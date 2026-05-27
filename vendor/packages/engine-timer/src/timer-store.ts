import type { EntityId } from '../../engine-core/src/index.js';

export const TIMER_INACTIVE = 0;
export const TIMER_ACTIVE = 1;

export interface TimerHandle {
  readonly entity: EntityId;
  readonly slot: number;
}

/**
 * Per-entity SoA store of countdown timers. A timer is just an integer tick
 * counter that decrements on every fixed update and publishes an event when it
 * hits zero. Useful for hitstun / cooldown / freeze-frames / spawn delays.
 *
 * A single entity may own multiple timers — the slot index identifies one.
 */
export class TimerStore {
  private readonly slotsByEntity = new Map<EntityId, TimerSlot[]>();

  add(entity: EntityId, ticks: number, eventName: string): TimerHandle {
    if (!Number.isInteger(ticks) || ticks <= 0) {
      throw new Error(`Timer ticks must be a positive integer. Received: ${ticks}`);
    }

    if (eventName.length === 0) {
      throw new Error('Timer requires a non-empty eventName.');
    }

    let slots = this.slotsByEntity.get(entity);

    if (slots === undefined) {
      slots = [];
      this.slotsByEntity.set(entity, slots);
    }

    const slot: TimerSlot = {
      active: TIMER_ACTIVE,
      remainingTicks: ticks,
      totalTicks: ticks,
      eventName
    };

    const slotIndex = slots.findIndex((entry) => entry.active === TIMER_INACTIVE);

    if (slotIndex === -1) {
      slots.push(slot);
      return { entity, slot: slots.length - 1 };
    }

    slots[slotIndex] = slot;
    return { entity, slot: slotIndex };
  }

  cancel(handle: TimerHandle): void {
    const slots = this.slotsByEntity.get(handle.entity);
    const slot = slots?.[handle.slot];

    if (slot === undefined) {
      return;
    }

    slot.active = TIMER_INACTIVE;
  }

  cancelAll(entity: EntityId): void {
    const slots = this.slotsByEntity.get(entity);

    if (slots === undefined) {
      return;
    }

    for (const slot of slots) {
      slot.active = TIMER_INACTIVE;
    }
  }

  remove(entity: EntityId): void {
    this.slotsByEntity.delete(entity);
  }

  remaining(handle: TimerHandle): number {
    const slot = this.slotsByEntity.get(handle.entity)?.[handle.slot];

    if (slot === undefined || slot.active === TIMER_INACTIVE) {
      return 0;
    }

    return slot.remainingTicks;
  }

  entities(): IterableIterator<EntityId> {
    return this.slotsByEntity.keys();
  }

  slotsOf(entity: EntityId): readonly TimerSlot[] {
    return this.slotsByEntity.get(entity) ?? [];
  }
}

export interface TimerSlot {
  active: 0 | 1;
  remainingTicks: number;
  totalTicks: number;
  eventName: string;
}
