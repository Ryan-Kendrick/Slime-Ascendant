import { type AppDispatch } from "../store"
import { unlockAchievement } from "../statsSlice"
import { increaseAchievementModifier } from "../playerSlice"
import { type Achievement } from "../../gameconfig/achievements"
import { createSelector } from "@reduxjs/toolkit"
import { playerCalc } from "../../gameconfig/upgrades"

interface AchievementCheck {
  unlockedAchievements: string[]
  achievements: Achievement[]
  value: number
}

export const checkAchievementUnlock = (dispatch: AppDispatch, check: AchievementCheck[]) => {
  check.forEach(({ unlockedAchievements, achievements, value }) => {
    while (achievements.length > 0 && value >= achievements[0].condition) {
      const nextAchievement = achievements[0]
      const isUnlocked = unlockedAchievements.find((achievementId) => achievementId === nextAchievement.id)
      if (isUnlocked) {
        achievements.shift()
        continue
      } else {
        achievements.shift()
        dispatch(unlockAchievement(nextAchievement.id))
        dispatch(increaseAchievementModifier(nextAchievement.modifier))
      }
    }
  })
}
