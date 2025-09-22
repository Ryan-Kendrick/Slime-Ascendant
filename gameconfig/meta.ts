// Version number based on semantic versioning, see https://semver.org/
export const METADATA_CONFIG = {
  version: "v0.7.0",
  softcap: "Zone 40",
} as const

export type AnimationPreference = 0 | 1 | 2

export const PERFORMANCE_CONFIG = {
  // Engine config
  animPrefGameSpeedMod: {
    0: 4,
    1: 2,
    2: 1,
  } as Record<0 | 1 | 2, number>,
  catchup: {
    shortBreakpoint: 300000, // 5 minutes
    longBreakpoint: 3600000, // 60 minutes
    chunkSize: 120000, // 120 seconds
  },

  critDisplayLimit: 10,
  fadeoutDuration: 2500, // Crit fadeout effect duration in milliseconds
  bpm: 89,
} as const
