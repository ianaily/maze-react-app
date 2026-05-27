import type { AudioClipChannel } from '../../engine-asset/src/index.js';

export type AudioMixerChannel = AudioClipChannel;

export interface AudioChannelState {
  volume: number;
  muted: boolean;
}

export interface AudioMixerSnapshot {
  readonly master: AudioChannelState;
  readonly music: AudioChannelState;
  readonly sfx: AudioChannelState;
}

const clampVolume = (value: number): number => {
  if (!Number.isFinite(value)) {
    return 0;
  }

  if (value < 0) {
    return 0;
  }

  if (value > 1) {
    return 1;
  }

  return value;
};

export class AudioMixer {
  private masterVolume = 1;
  private musicVolume = 1;
  private sfxVolume = 1;
  private masterMuted = false;
  private musicMuted = false;
  private sfxMuted = false;

  getMasterVolume(): number {
    return this.masterVolume;
  }

  getChannelVolume(channel: AudioMixerChannel): number {
    return channel === 'music' ? this.musicVolume : this.sfxVolume;
  }

  isMasterMuted(): boolean {
    return this.masterMuted;
  }

  isChannelMuted(channel: AudioMixerChannel): boolean {
    return channel === 'music' ? this.musicMuted : this.sfxMuted;
  }

  setMasterVolume(volume: number): void {
    this.masterVolume = clampVolume(volume);
  }

  setChannelVolume(channel: AudioMixerChannel, volume: number): void {
    const next = clampVolume(volume);

    if (channel === 'music') {
      this.musicVolume = next;
      return;
    }

    this.sfxVolume = next;
  }

  setMasterMuted(muted: boolean): void {
    this.masterMuted = muted === true;
  }

  setChannelMuted(channel: AudioMixerChannel, muted: boolean): void {
    if (channel === 'music') {
      this.musicMuted = muted === true;
      return;
    }

    this.sfxMuted = muted === true;
  }

  effectiveVolume(channel: AudioMixerChannel, clipVolume: number): number {
    if (this.masterMuted || this.isChannelMuted(channel)) {
      return 0;
    }

    return clampVolume(clipVolume) * this.getChannelVolume(channel) * this.masterVolume;
  }

  snapshot(): AudioMixerSnapshot {
    return {
      master: { volume: this.masterVolume, muted: this.masterMuted },
      music: { volume: this.musicVolume, muted: this.musicMuted },
      sfx: { volume: this.sfxVolume, muted: this.sfxMuted }
    };
  }
}
