import { createSelector, createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import type { AppDispatch, RootState } from "./store"
import { zoneComplete } from "./zoneSlice"
import { prestigeReset } from "./shared/actions"
import { AchievementCategory, ACHIEVEMENTS } from "../gameconfig/achievements"
import { checkAchievementUnlock } from "./shared/helpers"
import { PERFORMANCE_CONFIG } from "../gameconfig/meta"

const initialState = {
  clickCount: 0,
  totalClickDamage: 0,
  totalDotDamage: 0,
  killCount: 0,
  farmZonesCompleted: 0,
  totalZonesCompleted: 0,
  highestZoneEver: 1,
  prestigeCount: 0,
  achievementsUnlocked: [] as string[],

  // This run data
  recentCrits: [] as Array<{ id: string; damage: number; timestamp: number; position: { x: number; y: number } }>, // High animation quality
  displayCrit: false, // Medium animation quality
  lastCritDamage: 0, // Medium animation quality
  highestZone: 1,

  // Persisted data
  zoneTenCompleted: false,
}

export const statsSlice = createSlice({
  name: "stats",
  initialState,
  reducers: {
    unlockAchievement(state, action: PayloadAction<string>) {
      state.achievementsUnlocked.push(action.payload)
      console.log("Achievement unlocked", action.payload)
    },
    monsterClicked(state, action: PayloadAction<{ damage: number; isCrit: boolean; animationPref: number }>) {
      state.clickCount++
      state.totalClickDamage += action.payload.damage

      console.log("Monster clicked", action.payload.damage, "isCrit:", action.payload.isCrit)

      if (action.payload.isCrit) {
        if (action.payload.animationPref < 2 && !state.displayCrit) {
          state.displayCrit = true
          state.lastCritDamage = action.payload.damage
        } else {
          const now = Date.now()
          const critId = `crit-${now}-${Math.random()}}`
          const position = getNextCritPosition(state.recentCrits)

          state.recentCrits.push({
            id: critId,
            damage: action.payload.damage,
            timestamp: now,
            position,
          })

          if (state.recentCrits.length > PERFORMANCE_CONFIG.critDisplayLimit) {
            state.recentCrits.unshift()
          }
        }
      }
    },
    increaseTotalDotDamageDealt(state, action: PayloadAction<number>) {
      state.totalDotDamage += action.payload
    },
    incrementKillCount: (state) => {
      state.killCount++
    },
    incrementFarmZonesCompleted: (state) => {
      state.farmZonesCompleted++
    },
    removeCrit: (state, action: PayloadAction<string>) => {
      state.recentCrits = state.recentCrits.filter((crit) => crit.id !== action.payload)
    },
    cleanupOldCrits: (state) => {
      console.log("Cleaning up old crits")
      const now = Date.now()
      state.recentCrits = state.recentCrits.filter((crit) => now - crit.timestamp < 2000)
    },
    toggleDisplayCrit: (state) => {
      state.displayCrit = false
    },
    zoneTenCompleted: (state) => {
      state.zoneTenCompleted = true
    },
  },
  extraReducers(builder) {
    builder.addCase(zoneComplete, (state) => {
      state.totalZonesCompleted++
      state.highestZone++
      if (state.highestZone > state.highestZoneEver) {
        state.highestZoneEver = state.highestZone
      }
    })
    builder.addCase(prestigeReset, (state) => {
      state.prestigeCount++
      state.highestZone = 1
    })
  },
})

export const {
  unlockAchievement,
  monsterClicked,
  increaseTotalDotDamageDealt,
  incrementKillCount,
  incrementFarmZonesCompleted,
  removeCrit,
  cleanupOldCrits,
  toggleDisplayCrit,
  zoneTenCompleted,
} = statsSlice.actions

export const selectPrestigeCount = (state: RootState) => state.stats.prestigeCount

export const selectStatsState = createSelector([(state: RootState) => state.stats], (stats) => ({
  clickCount: stats.clickCount,
  totalClickDamageDealt: stats.totalClickDamage,
  totalDotDamageDealt: stats.totalDotDamage,
  killCount: stats.killCount,
  farmZonesCompleted: stats.farmZonesCompleted,
  totalZonesCompleted: stats.totalZonesCompleted,
  highestZoneEver: stats.highestZoneEver,
  highestZone: stats.highestZone,
  prestigeCount: stats.prestigeCount,
}))
export const selectUnlockedAchievements = (state: RootState) => state.stats.achievementsUnlocked

export const selectHighestZone = (state: RootState) => state.stats.highestZone
export const selectHighestZoneEver = (state: RootState) => state.stats.highestZoneEver

export const selectRecentCrits = (state: RootState) => state.stats.recentCrits
export const selectCritState = (state: RootState) => {
  return { critRecently: state.stats.displayCrit, lastCritDamage: state.stats.lastCritDamage }
}
export const selectEmptyArray = createSelector([], () => [])
export const selectEmptyCritState = createSelector([], () => ({
  critRecently: false,
  lastCritDamage: 0,
}))
const getNextCritPosition = (existingCrits: Array<any>) => {
  const basePositions = [
    { x: 0, y: 0 },
    { x: -30, y: -20 },
    { x: 30, y: -20 },
    { x: -15, y: 10 },
    { x: 15, y: 10 },
  ]

  const index = existingCrits.length

  if (index < basePositions.length) {
    return basePositions[index]
  }

  // For more than 5 crits, use circular positioning
  const angle = ((index * 360) / (existingCrits.length + 1)) * (Math.PI / 180)
  const radius = 40
  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius,
  }
}

export const updateMonsterClicked =
  (click: { damage: number; isCrit: boolean; animationPref: number }) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const { damage, isCrit, animationPref } = click
    dispatch(monsterClicked({ damage, isCrit, animationPref }))

    const countAchievements = ACHIEVEMENTS.click.count as AchievementCategory
    const damageAchievements = ACHIEVEMENTS.click.damage as AchievementCategory
    const state = getState()

    checkAchievementUnlock(dispatch, [
      {
        unlockedAchievements: state.stats.achievementsUnlocked,
        achievements: countAchievements.achievements,
        value: state.stats.clickCount,
      },
      {
        unlockedAchievements: state.stats.achievementsUnlocked,
        achievements: damageAchievements.achievements,
        value: state.stats.totalClickDamage,
      },
    ])
  }

export const updateDotDamageDealt = (damage: number) => (dispatch: AppDispatch, getState: () => RootState) => {
  dispatch(increaseTotalDotDamageDealt(damage))

  const state = getState()
  const dotAchievements = ACHIEVEMENTS.dot.damage as AchievementCategory

  checkAchievementUnlock(dispatch, [
    {
      unlockedAchievements: state.stats.achievementsUnlocked,
      achievements: dotAchievements.achievements,
      value: state.stats.totalDotDamage,
    },
  ])
}

export default statsSlice.reducer
