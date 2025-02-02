import { createSelector, createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import type { AppDispatch, RootState } from "./store"
import { zoneComplete } from "./zoneSlice"
import { prestigeReset } from "./shared/actions"
import { AchievementCategory, ACHIEVEMENTS } from "../gameconfig/achievements"
import { checkAchievementUnlock } from "./shared/helpers"

interface StatsState {
  clickCount: number
  totalClickDamage: number
  totalDotDamage: number
  killCount: number
  farmZonesCompleted: number
  totalZonesCompleted: number
  highestZoneEver: number
  prestigeCount: number
  achievementsUnlocked: string[]
  highestZone: number
  zoneTenCompleted: boolean
}

const initialState: StatsState = {
  clickCount: 0,
  totalClickDamage: 0,
  totalDotDamage: 0,
  killCount: 0,
  farmZonesCompleted: 0,
  totalZonesCompleted: 0,
  highestZoneEver: 1,
  prestigeCount: 0,
  achievementsUnlocked: [],

  // This run data
  highestZone: 1,

  // Persisted data
  zoneTenCompleted: false,
}

export const statsSlice = createSlice({
  name: "stats",
  initialState,
  reducers: {
    unlockAchievement(state, action: PayloadAction<string>) {
      if (!state.achievementsUnlocked.includes(action.payload)) {
        state.achievementsUnlocked.push(action.payload)
        console.log("Achievement unlocked", action.payload)
      }
    },
    monsterClicked(state, action: PayloadAction<number>) {
      state.clickCount++
      state.totalClickDamage += action.payload
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
  zoneTenCompleted,
} = statsSlice.actions

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

export const selectHighestZoneEver = (state: RootState) => state.stats.highestZoneEver
export const selectZoneTenComplete = createSelector(
  [(state: RootState) => state.stats.highestZone],
  (highestZone) => highestZone > 10,
)

export const updateMonsterClicked = (damage: number) => (dispatch: AppDispatch, getState: () => RootState) => {
  dispatch(monsterClicked(damage))

  const countAchievements = ACHIEVEMENTS.click.count as AchievementCategory
  const damageAchievements = ACHIEVEMENTS.click.damage as AchievementCategory
  const state = getState()

  checkAchievementUnlock(dispatch, [
    {
      achievements: countAchievements.achievements,
      value: state.stats.clickCount,
    },
    {
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
      achievements: dotAchievements.achievements,
      value: state.stats.totalDotDamage,
    },
  ])
}

export default statsSlice.reducer
