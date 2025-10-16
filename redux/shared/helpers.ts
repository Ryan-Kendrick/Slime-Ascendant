import { type AppDispatch } from "../store"
import { unlockAchievement } from "../statsSlice"
import { increaseAchievementModifier } from "../playerSlice"
import { type Achievement } from "../../gameconfig/achievements"
import { UPGRADE_CONFIG } from "../../gameconfig/upgrades"
import { HeroName } from "../../models/upgrades"

interface AchievementCheck {
  unlockedAchievements: string[]
  achievements: Achievement[]
  value: number
}

export const checkAchievementUnlock = (dispatch: AppDispatch, check: AchievementCheck[]) => {
  check.forEach(({ unlockedAchievements, achievements, value }) => {
    while (achievements.length > 0 && value >= achievements[0].condition) {
      const nextAchievement = achievements[0]
      console.log(check)
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

export const heroNames: HeroName[] = ["adventurer", "warrior", "healer", "mage"] as const
const constructIndexMap = () => {
  const heroIndexMap = {} as Record<HeroName, number>
  heroNames.map((heroName, index) => {
    heroIndexMap[heroName] = index
  })
  return heroIndexMap
}

export const heroIndexMap = constructIndexMap()

export const constructOTPPosArr = (): { x: number; y: number | true }[][] => {
  return heroNames.map((thisHero) => {
    return Array.from({ length: UPGRADE_CONFIG[thisHero].OneTimePurchases.OTPCosts.length }, () => ({
      x: 0,
      y: 0,
    }))
  })
}
