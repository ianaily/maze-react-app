import {
  AudioMixer,
  AudioSystem,
  NullAudioBackend,
  type AudioBackend,
  type AudioClipAssetDocument,
  type AudioClipChannel,
  type AudioMixerChannel,
  type AudioMixerSnapshot,
  type AudioPlaybackId
} from '../../engine-audio/src/index.js';
import type { RuntimeSession } from './runtime-session.js';

export interface RuntimeAudioOptions {
  readonly backend?: AudioBackend;
  readonly mixer?: AudioMixer;
  readonly autoload?: boolean;
}

export interface RuntimeAudioBinding {
  readonly backend: AudioBackend;
  readonly mixer: AudioMixer;
  readonly system: AudioSystem;
  ensureLoaded(): Promise<void>;
  startScene(): void;
  pause(): void;
  resume(): void;
  stop(): void;
  setMasterVolume(volume: number): void;
  setChannelVolume(channel: AudioMixerChannel, volume: number): void;
  setChannelMuted(channel: AudioMixerChannel, muted: boolean): void;
  snapshotMixer(): AudioMixerSnapshot;
  dispose(): void;
}

export function attachRuntimeAudio(
  session: RuntimeSession,
  options: RuntimeAudioOptions = {}
): RuntimeAudioBinding {
  const backend = options.backend ?? new NullAudioBackend();
  const mixer = options.mixer ?? new AudioMixer();
  const system = new AudioSystem({
    audio: session.runtime.audio,
    mixer,
    backend,
    catalog: () => session.runtime.assets
  });
  session.engine.addSystem(system);

  let musicPlayback: AudioPlaybackId | undefined;
  let scenePlaying = false;

  const ensureLoaded = async (): Promise<void> => {
    const clips = session.runtime.assets?.audioClips ?? [];
    const required = collectRequiredClips(clips, session);

    for (const clip of required) {
      if (!backend.isLoaded(clip.id)) {
        try {
          await backend.load(clip);
        } catch (error) {
          if (typeof console !== 'undefined') {
            console.warn(`Failed to load audio clip "${clip.id}":`, error);
          }
        }
      }
    }
  };

  const startScene = (): void => {
    backend.resume();
    scenePlaying = true;
    playSceneMusic();
    system.startPending(session.runtime.assets);
  };

  const pause = (): void => {
    scenePlaying = false;
    backend.suspend();
  };

  const resume = (): void => {
    if (scenePlaying) {
      return;
    }

    scenePlaying = true;
    backend.resume();
  };

  const stop = (): void => {
    scenePlaying = false;

    if (musicPlayback !== undefined) {
      backend.stop(musicPlayback);
      musicPlayback = undefined;
    }

    system.stopAll();
    backend.stopAll();
  };

  const playSceneMusic = (): void => {
    const music = session.runtime.music;

    if (music === undefined) {
      return;
    }

    const clip = findClipById(session.runtime.assets?.audioClips, music.clipId);

    if (clip === undefined || !backend.isLoaded(clip.id)) {
      return;
    }

    if (musicPlayback !== undefined) {
      backend.stop(musicPlayback);
    }

    const volume = mixer.effectiveVolume('music', music.volume ?? clip.defaultVolume ?? 1);
    const loop = music.loop ?? clip.defaultLoop ?? true;

    musicPlayback = backend.play({
      clip,
      channel: 'music',
      volume,
      loop
    });
  };

  if (options.autoload === true) {
    void ensureLoaded();
  }

  return {
    backend,
    mixer,
    system,
    ensureLoaded,
    startScene,
    pause,
    resume,
    stop,
    setMasterVolume(volume): void {
      mixer.setMasterVolume(volume);
      system.applyMixerToActive();
      updateMusicVolume();
    },
    setChannelVolume(channel, volume): void {
      mixer.setChannelVolume(channel, volume);
      system.applyMixerToActive();
      updateMusicVolume();
    },
    setChannelMuted(channel, muted): void {
      mixer.setChannelMuted(channel, muted);
      system.applyMixerToActive();
      updateMusicVolume();
    },
    snapshotMixer(): AudioMixerSnapshot {
      return mixer.snapshot();
    },
    dispose(): void {
      stop();
    }
  };

  function updateMusicVolume(): void {
    if (musicPlayback === undefined) {
      return;
    }

    const music = session.runtime.music;

    if (music === undefined) {
      return;
    }

    const clip = findClipById(session.runtime.assets?.audioClips, music.clipId);
    const baseVolume = music.volume ?? clip?.defaultVolume ?? 1;
    backend.setPlaybackVolume(musicPlayback, mixer.effectiveVolume('music', baseVolume));
  }
}

function findClipById(
  clips: readonly AudioClipAssetDocument[] | undefined,
  id: string
): AudioClipAssetDocument | undefined {
  return clips?.find((entry) => entry.id === id);
}

function collectRequiredClips(
  clips: readonly AudioClipAssetDocument[],
  session: RuntimeSession
): readonly AudioClipAssetDocument[] {
  const ids = new Set<string>();
  const audio = session.runtime.audio;

  for (let index = 0; index < audio.present.length; index += 1) {
    if (audio.present[index] === 1) {
      const clipId = audio.clipId[index];

      if (clipId !== undefined && clipId.length > 0) {
        ids.add(clipId);
      }
    }
  }

  const music = session.runtime.music;

  if (music !== undefined) {
    ids.add(music.clipId);
  }

  return clips.filter((clip) => ids.has(clip.id));
}

export type { AudioClipChannel };
