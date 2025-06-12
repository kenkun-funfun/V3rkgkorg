// src/lib/constants.ts
export const MODE = {
  START_SCREEN: 'START_SCREEN',
  RUNNING: 'RUNNING',
  PAUSED: 'PAUSED',
} as const;

export type ModeType = keyof typeof MODE;
