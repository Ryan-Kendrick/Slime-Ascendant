import { createSelector, createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import type { AppDispatch, RootState } from "./store"
import { zoneComplete } from "./zoneSlice"
import { prestigeReset } from "./shared/actions"
import { AchievementCategory, ACHIEVEMENTS } from "../gameconfig/achievements"
import { checkAchievementUnlock } from "./shared/helpers"
import { PERFORMANCE_CONFIG } from "../gameconfig/meta"
import { getNextCritPosition } from "../gameconfig/utils"

export const initialState = {
  clickCount: 0,
  totalClickDamage: 0,
  totalDotDamage: 0,
  killCount: 0,
  farmZonesCompleted: 0,
  totalZonesCompleted: 0,
  highestZoneEver: 1,
  prestigeCount: 0,
  totalMultistrikeDamage: 0,
  achievementsUnlocked: [] as string[],

  // This run data
  recentCrits: [] as Array<{ id: string; damage: number; timestamp: number; position: { x: number; y: number } }>, // High animation quality
  displayCrit: false, // Medium animation quality
  lastCritDamage: 0, // Medium animation quality
  lastMultistrikeTime: 0,
  displayMultistrike: false,
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
    monsterClicked(
      state,
      action: PayloadAction<{ damage: number; isCrit: boolean; isMultiStrike: boolean; animationPref: number }>,
    ) {
      if (!state.lastMultistrikeTime) state.lastMultistrikeTime = 1
      if (!action.payload.isMultiStrike) {
        state.clickCount++
        state.totalClickDamage += action.payload.damage
      } else {
        state.lastMultistrikeTime = Date.now()
        state.displayMultistrike = true
        state.totalMultistrikeDamage += action.payload.damage
      }

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
      const now = Date.now()
      state.recentCrits = state.recentCrits.filter((crit) => now - crit.timestamp < 2000)
    },
    toggleDisplayCrit: (state) => {
      state.displayCrit = false
    },
    toggleDisplayMultistrike: (state) => {
      state.displayMultistrike = false
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
      state.recentCrits = []
      state.displayCrit = false
      state.lastCritDamage = 0
      state.lastMultistrikeTime = 0
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
  toggleDisplayMultistrike,
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
export const selectCritState = createSelector([(state: RootState) => state.stats], (stats) => ({
  displayCrit: stats.displayCrit,
  lastCritDamage: stats.lastCritDamage,
}))
export const selectEmptyArray = createSelector([], () => [])
export const selectEmptyCritState = createSelector([], () => ({
  displayCrit: false,
  lastCritDamage: 0,
}))
export const selectMultistrikeState = createSelector([(state: RootState) => state.stats], (stats) => ({
  lastMultistrikeTime: stats.lastMultistrikeTime,
  displayMultistrike: stats.displayMultistrike,
}))

export const updateMonsterClicked =
  (click: { damage: number; isCrit: boolean; isMultiStrike: boolean; animationPref: number }) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const { damage, isCrit, isMultiStrike, animationPref } = click
    dispatch(monsterClicked({ damage, isCrit, isMultiStrike, animationPref }))

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

export const updateMultistrikeDamageDealt =
  (click: { damage: number; isCrit: boolean; isMultiStrike: true; animationPref: number }) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const { damage, isCrit, isMultiStrike, animationPref } = click
    dispatch(monsterClicked({ damage, isCrit, isMultiStrike, animationPref }))

    // Possible future achievement implementation
  }

export default statsSlice.reducer
