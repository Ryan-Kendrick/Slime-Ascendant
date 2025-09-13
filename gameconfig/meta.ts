// Version number based on semantic versioning, see https://semver.org/
export const METADATA_CONFIG = {
  version: "v0.6.5",
  softcap: "Zone 40",
} as const

export const PERFORMANCE_CONFIG = {
  catchup: {
    shortBreakpoint: 600000, // 10 minutes
    longBreakpoint: 3600000, // 60 minutes
    chunkSize: 600000, // 10 minutes
  },

  critDisplayLimit: 10,
  fadeoutDuration: 2500, // Crit fadeout effect duration in milliseconds
  bpm: 89,
} as const
