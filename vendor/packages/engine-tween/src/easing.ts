export type EasingFunction = (t: number) => number;

export type EasingName =
  | 'linear'
  | 'ease-in-quad'
  | 'ease-out-quad'
  | 'ease-in-out-quad'
  | 'ease-in-cubic'
  | 'ease-out-cubic'
  | 'ease-in-out-cubic'
  | 'ease-in-elastic'
  | 'ease-out-elastic'
  | 'ease-in-bounce'
  | 'ease-out-bounce';

const TAU = Math.PI * 2;

const clamp01 = (t: number): number => Math.min(Math.max(t, 0), 1);

const easeOutBounceCurve = (t: number): number => {
  const n = 7.5625;
  const d = 2.75;

  if (t < 1 / d) {
    return n * t * t;
  }

  if (t < 2 / d) {
    const shifted = t - 1.5 / d;
    return n * shifted * shifted + 0.75;
  }

  if (t < 2.5 / d) {
    const shifted = t - 2.25 / d;
    return n * shifted * shifted + 0.9375;
  }

  const shifted = t - 2.625 / d;
  return n * shifted * shifted + 0.984_375;
};

export const easings: Readonly<Record<EasingName, EasingFunction>> = {
  linear: (t) => clamp01(t),
  'ease-in-quad': (t) => {
    const clamped = clamp01(t);
    return clamped * clamped;
  },
  'ease-out-quad': (t) => {
    const clamped = clamp01(t);
    return 1 - (1 - clamped) * (1 - clamped);
  },
  'ease-in-out-quad': (t) => {
    const clamped = clamp01(t);
    return clamped < 0.5
      ? 2 * clamped * clamped
      : 1 - Math.pow(-2 * clamped + 2, 2) / 2;
  },
  'ease-in-cubic': (t) => {
    const clamped = clamp01(t);
    return clamped * clamped * clamped;
  },
  'ease-out-cubic': (t) => {
    const clamped = clamp01(t);
    const inverted = 1 - clamped;
    return 1 - inverted * inverted * inverted;
  },
  'ease-in-out-cubic': (t) => {
    const clamped = clamp01(t);
    return clamped < 0.5
      ? 4 * clamped * clamped * clamped
      : 1 - Math.pow(-2 * clamped + 2, 3) / 2;
  },
  'ease-in-elastic': (t) => {
    const clamped = clamp01(t);

    if (clamped === 0 || clamped === 1) {
      return clamped;
    }

    return -Math.pow(2, 10 * clamped - 10) * Math.sin((clamped * 10 - 10.75) * (TAU / 3));
  },
  'ease-out-elastic': (t) => {
    const clamped = clamp01(t);

    if (clamped === 0 || clamped === 1) {
      return clamped;
    }

    return Math.pow(2, -10 * clamped) * Math.sin((clamped * 10 - 0.75) * (TAU / 3)) + 1;
  },
  'ease-in-bounce': (t) => 1 - easeOutBounceCurve(1 - clamp01(t)),
  'ease-out-bounce': (t) => easeOutBounceCurve(clamp01(t))
};

export function applyEasing(name: EasingName, t: number): number {
  return easings[name](t);
}
