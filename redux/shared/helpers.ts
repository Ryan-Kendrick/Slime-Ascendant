import type { AppDispatch, RootState } from "../store"
import { selectStatsState, unlockAchievement } from "../statsSlice"
import { increaseAchievementModifier, selectClickDamage, selectDotDamage, selectPrestigeState } from "../playerSlice"
import { type Achievement } from "../../gameconfig/achievements"

export const achievementSelectorMap: Record<string, (state: RootState) => number> = {
  "click-count": (state) => selectStatsState(state).clickCount,
  "click-damage": (state) => selectStatsState(state).totalClickDamageDealt,
  "dot-damage": (state) => selectStatsState(state).totalDotDamageDealt,
  "zone-count": (state) => selectStatsState(state).totalZonesCompleted,
  "zone-farm": (state) => selectStatsState(state).farmZonesCompleted,
  "zone-progression": (state) => selectStatsState(state).highestZoneEver,
  "prestige-count": (state) => selectStatsState(state).prestigeCount,
  "click-value": (state) => selectClickDamage(state),
  "dot-value": (state) => selectDotDamage(state),
  "prestige-plasmaspent": (state) => selectPrestigeState(state).plasmaSpent,
}

interface AchievementCheck {
  achievements: Achievement[]
  value: number
}

export const checkAchievementUnlock = (dispatch: AppDispatch, check: AchievementCheck[]) => {
  check.forEach(({ achievements, value }) => {
    const nextAchievement = achievements[0]
    if (nextAchievement && value >= nextAchievement.condition) {
      achievements.shift()
      dispatch(unlockAchievement(nextAchievement.id))
      dispatch(increaseAchievementModifier(nextAchievement.modifier))
    }
  })
}
