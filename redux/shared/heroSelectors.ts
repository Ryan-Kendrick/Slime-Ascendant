import { createSelector } from "@reduxjs/toolkit"
import { playerCalc, UPGRADE_CONFIG } from "../../gameconfig/upgrades"
import { HeroName } from "../../models/upgrades"
import type { RootState } from "../store"
import { heroStateMap } from "./maps"
import { prestigeDamageMod } from "../playerSlice"

export const createHeroSelector = (heroName: HeroName) =>
  createSelector([(state: RootState) => state.player], (player) => ({
    level: player[heroStateMap[heroName].level] as number,
    upgradeCount: player[heroStateMap[heroName].upgradeCount] as number,
  }))

export const selectAdventurerState = createHeroSelector("adventurer")
export const selectWarriorState = createHeroSelector("warrior")
export const selectHealerState = createHeroSelector("healer")
export const selectMageState = createHeroSelector("mage")
export const selectHeroState = createSelector(
  [selectAdventurerState, selectWarriorState, selectHealerState, selectMageState],
  (adventurerState, warriorState, healerState, mageState) => ({
    adventurer: adventurerState,
    warrior: warriorState,
    healer: healerState,
    mage: mageState,
  }),
)

export const selectAdventurerLevelUpCost = createSelector([selectAdventurerState], (heroState) =>
  UPGRADE_CONFIG.adventurer.levelUpCost(heroState.level),
)
export const selectWarriorLevelUpCost = createSelector([selectWarriorState], (heroState) =>
  UPGRADE_CONFIG.warrior.levelUpCost(heroState.level),
)
export const selectHealerLevelUpCost = createSelector([selectHealerState], (heroState) =>
  UPGRADE_CONFIG.healer.levelUpCost(heroState.level),
)
export const selectMageLevelUpCost = createSelector([selectMageState], (heroState) =>
  UPGRADE_CONFIG.mage.levelUpCost(heroState.level),
)
export const selectLevelUpCosts = createSelector(
  [selectAdventurerLevelUpCost, selectWarriorLevelUpCost, selectHealerLevelUpCost, selectMageLevelUpCost],
  (adventurerLevelUpCost, warriorLevelUpCost, healerLevelUpCost, mageLevelUpCost) => ({
    adventurerLevelUpCost,
    warriorLevelUpCost,
    healerLevelUpCost,
    mageLevelUpCost,
  }),
)

export const selectAdventurerLevel = (state: RootState) => state.player.adventurerLevel

export const selectAdventurerDamage = createSelector([selectAdventurerState], (adventurerState) =>
  playerCalc.heroDamage("adventurer", adventurerState),
)
export const selectWarriorDamage = createSelector([selectWarriorState], (warriorState) =>
  playerCalc.heroDamage("warrior", warriorState),
)
export const selectHealerDamage = createSelector([selectHealerState], (healerState) =>
  playerCalc.heroDamage("healer", healerState),
)
export const selectMageDamage = createSelector([selectMageState], (mageState) =>
  playerCalc.heroDamage("mage", mageState),
)

export const selectPDamageUpgradeCount = (state: RootState) => state.player.pDamageUpgradeCount
export const selectPMod = createSelector(
  [selectPDamageUpgradeCount],
  (pDamageUpgradeCount) => 1 + pDamageUpgradeCount * prestigeDamageMod,
)
export const selectAchievementModifier = (state: RootState) => state.player.achievementModifier
export const selectAchievementDamage = createSelector(
  [selectAchievementModifier],
  (achievementModifier) => 1 + achievementModifier,
)

export const selectAdventurerContribution = createSelector(
  [selectAdventurerState, selectPMod, selectAchievementDamage],
  (adventurerState, pDamage, achievementDamage) =>
    playerCalc.heroDamage("adventurer", adventurerState, pDamage, achievementDamage, true),
)
export const selectWarriorContribution = createSelector(
  [selectWarriorState, selectPMod, selectAchievementDamage],
  (warriorState, pDamage, achievementDamage) =>
    playerCalc.heroDamage("warrior", warriorState, pDamage, achievementDamage, true),
)
export const selectHealerContribution = createSelector(
  [selectHealerState, selectPMod, selectAchievementDamage],
  (healerState, pDamage, achievementDamage) =>
    playerCalc.heroDamage("healer", healerState, pDamage, achievementDamage, true),
)
export const selectMageContribution = createSelector(
  [selectMageState, selectPMod, selectAchievementDamage],
  (mageState, pDamage, achievementDamage) => playerCalc.heroDamage("mage", mageState, pDamage, achievementDamage, true),
)

export const selectAllAdventurerState = createSelector(
  [selectAdventurerState, selectAdventurerDamage, selectAdventurerLevelUpCost],
  (heroState, damage, levelUpCost) => ({
    level: heroState.level,
    upgradeCount: heroState.upgradeCount,
    damageAtLevel: playerCalc.damageAtLevel("adventurer", heroState),
    damage,
    levelUpCost,
  }),
)

export const selectAllWarriorState = createSelector(
  [selectWarriorState, selectWarriorDamage, selectWarriorLevelUpCost],
  (heroState, damage, levelUpCost) => ({
    level: heroState.level,
    upgradeCount: heroState.upgradeCount,
    damageAtLevel: playerCalc.damageAtLevel("warrior", heroState),
    damage,
    levelUpCost,
  }),
)

export const selectAllHealerState = createSelector(
  [selectHealerState, selectHealerDamage, selectHealerLevelUpCost],
  (heroState, damage, levelUpCost) => ({
    level: heroState.level,
    upgradeCount: heroState.upgradeCount,
    damageAtLevel: playerCalc.damageAtLevel("healer", heroState),
    damage,
    levelUpCost,
  }),
)

export const selectAllMageState = createSelector(
  [selectMageState, selectMageDamage, selectMageLevelUpCost],
  (heroState, damage, levelUpCost) => ({
    level: heroState.level,
    upgradeCount: heroState.upgradeCount,
    damageAtLevel: playerCalc.damageAtLevel("mage", heroState),
    damage,
    levelUpCost,
  }),
)
