// src/types/meditation.ts
export type MeditationType = 'none' | 'sitting' | 'walking' | 'standing';

export const MEDITATION_EMOJI: Record<MeditationType, string> = {
  none: '',
  sitting: '🧘',
  walking: '🚶',
  standing: '🧍',
};

export const MEDITATION_LABEL: Record<MeditationType, string> = {
  none: '指定なし',
  sitting: '座る瞑想',
  walking: '歩く瞑想',
  standing: '立つ瞑想',
};
