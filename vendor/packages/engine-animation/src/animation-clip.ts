export interface AnimationFrame {
  readonly frameId: string;
  readonly durationSeconds: number;
}

export interface AnimationClipEvent {
  readonly name: string;
  readonly atSeconds: number;
}

export interface AnimationClipDefinition {
  readonly id: string;
  readonly frames: readonly AnimationFrame[];
  readonly loop?: boolean;
  readonly events?: readonly AnimationClipEvent[];
}

export interface AnimationClip {
  readonly id: string;
  readonly frames: readonly AnimationFrame[];
  readonly loop: boolean;
  readonly events: readonly AnimationClipEvent[];
  readonly durationSeconds: number;
}

export class AnimationLibrary {
  private readonly clips: AnimationClip[] = [];
  private readonly clipIndexById = new Map<string, number>();

  add(definition: AnimationClipDefinition): number {
    if (this.clipIndexById.has(definition.id)) {
      throw new Error(`Animation clip already exists: ${definition.id}`);
    }

    const clip = compileClip(definition);
    const index = this.clips.length;

    this.clips.push(clip);
    this.clipIndexById.set(clip.id, index);
    return index;
  }

  get(index: number): AnimationClip {
    const clip = this.clips[index];

    if (clip === undefined) {
      throw new Error(`Animation clip index does not exist: ${index}`);
    }

    return clip;
  }

  list(): readonly AnimationClip[] {
    return this.clips;
  }

  findIndex(id: string): number {
    const index = this.clipIndexById.get(id);

    if (index === undefined) {
      throw new Error(`Animation clip does not exist: ${id}`);
    }

    return index;
  }
}

const compileClip = (definition: AnimationClipDefinition): AnimationClip => {
  if (definition.id.length === 0) {
    throw new Error('Animation clip id must not be empty.');
  }

  if (definition.frames.length === 0) {
    throw new Error(`Animation clip must contain at least one frame: ${definition.id}`);
  }

  let durationSeconds = 0;

  for (const frame of definition.frames) {
    if (frame.frameId.length === 0) {
      throw new Error(`Animation frame id must not be empty in clip: ${definition.id}`);
    }

    if (!Number.isFinite(frame.durationSeconds) || frame.durationSeconds <= 0) {
      throw new Error(`Animation frame duration must be positive in clip: ${definition.id}`);
    }

    durationSeconds += frame.durationSeconds;
  }

  const events = [...(definition.events ?? [])].sort((left, right) => left.atSeconds - right.atSeconds);

  for (const event of events) {
    if (event.name.length === 0) {
      throw new Error(`Animation event name must not be empty in clip: ${definition.id}`);
    }

    if (!Number.isFinite(event.atSeconds) || event.atSeconds < 0 || event.atSeconds > durationSeconds) {
      throw new Error(`Animation event time is outside clip duration in clip: ${definition.id}`);
    }
  }

  return {
    id: definition.id,
    frames: [...definition.frames],
    loop: definition.loop ?? true,
    events,
    durationSeconds
  };
};
