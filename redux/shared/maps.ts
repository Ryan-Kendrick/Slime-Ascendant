import { PlayerState } from "../../models/player"
import { HeroName, PrestigeUpgrade, PrestigeUpgradeName, UpgradeId, UpgradeProps } from "../../models/upgrades"
import {
  selectClickDamage,
  selectDotDamage,
  selectGCanAfford,
  selectInitState,
  selectPendingPBeat,
  selectPendingPCritChance,
  selectPendingPDamage,
  selectPendingPMultistrike,
  selectPrestigeState,
  updateClickDamage,
  updateDotDamage,
} from "../playerSlice"
import {
  selectAdventurerLevelUpCost,
  selectHealerLevelUpCost,
  selectMageContribution,
  selectMageLevelUpCost,
  selectWarriorLevelUpCost,
} from "./heroSelectors"
import { selectHealerContribution } from "./heroSelectors"
import { selectWarriorContribution } from "./heroSelectors"
import { selectAdventurerContribution } from "./heroSelectors"
import {
  selectAllAdventurerState,
  selectAllHealerState,
  selectAllMageState,
  selectAllWarriorState,
} from "./heroSelectors"
import { selectStatsState } from "../statsSlice"
import type { RootState } from "../store"
import { UPGRADE_CONFIG } from "../../gameconfig/upgrades"

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

export type HeroStateFunctions = {
  level: (state: RootState) => number
  upgradeCount: (state: RootState) => number
  damageAtLevel: (state: RootState) => number
  damage: (state: RootState) => number
  levelUpCost: (state: RootState) => number
  totalDamageContribution: (state: RootState) => number
}

export const heroStateSelectors = {
  adventurer: {
    allState: selectAllAdventurerState,
    totalDamageContribution: selectAdventurerContribution,
  },
  warrior: {
    allState: selectAllWarriorState,
    totalDamageContribution: selectWarriorContribution,
  },
  healer: {
    allState: selectAllHealerState,
    totalDamageContribution: selectHealerContribution,
  },
  mage: {
    allState: selectAllMageState,
    totalDamageContribution: selectMageContribution,
  },
} as const

export const populateHeroState = (heroName: HeroName): HeroStateFunctions => {
  const heroStateSelector = heroStateSelectors[heroName].allState
  const damageContributionSelector = heroStateSelectors[heroName].totalDamageContribution

  const thisHeroState = {
    level: (state: RootState) => heroStateSelector(state).level,
    upgradeCount: (state: RootState) => heroStateSelector(state).upgradeCount,
    damageAtLevel: (state: RootState) => heroStateSelector(state).damageAtLevel,
    damage: (state: RootState) => heroStateSelector(state).damage,
    levelUpCost: (state: RootState) => heroStateSelector(state).levelUpCost,
    totalDamageContribution: (state: RootState) => damageContributionSelector(state),
  } as HeroStateFunctions

  return thisHeroState
}

export const cardProps: UpgradeProps = {
  adventurer: {
    ...populateHeroState("adventurer"),
    cardBackground: "bg-orange-200/50",
    backgroundImage: "before:bg-[url('/assets/icons/adventurerBg.svg')]",
  },
  warrior: {
    ...populateHeroState("warrior"),
    cardBackground: "bg-red-300/50",
    backgroundImage: "before:bg-[url('/assets/icons/warriorBg.svg')]",
  },
  healer: {
    ...populateHeroState("healer"),
    cardBackground: "bg-green-300/50",
    backgroundImage: "before:bg-[url('/assets/icons/healerBg.svg')]",
  },
  mage: {
    ...populateHeroState("mage"),
    cardBackground: "bg-electricBlue/50",
    backgroundImage: "before:bg-[url('/assets/icons/mageBg.svg')]",
  },
}

export const heroStateMap: Record<HeroName, { level: keyof PlayerState; upgradeCount: keyof PlayerState }> = {
  adventurer: {
    level: "adventurerLevel",
    upgradeCount: "adventurerOTPUpgradeCount",
  },
  warrior: {
    level: "warriorLevel",
    upgradeCount: "warriorOTPUpgradeCount",
  },
  healer: {
    level: "healerLevel",
    upgradeCount: "healerOTPUpgradeCount",
  },
  mage: {
    level: "mageLevel",
    upgradeCount: "mageOTPUpgradeCount",
  },
} as const

export const setInitElementMap: Record<UpgradeId | HeroName, (state: PlayerState) => void> = {
  "adventurer-otp": (state: PlayerState) => {
    state.hasInitAdventurerOTP++
  },
  "warrior-otp": (state: PlayerState) => {
    state.hasInitWarriorOTP++
  },
  "healer-otp": (state: PlayerState) => {
    state.hasInitHealerOTP++
  },
  "mage-otp": (state: PlayerState) => {
    state.hasInitMageOTP++
  },
  adventurer: () => true,
  warrior: (state: PlayerState) => {
    state.hasInitWarriorPane = true
  },
  healer: (state: PlayerState) => {
    state.hasInitHealerPane = true
  },
  mage: (state: PlayerState) => {
    state.hasInitMagePane = true
  },
} as const

export const initSelectorMap: Record<UpgradeId | HeroName, (state: RootState) => number | boolean> = {
  "adventurer-otp": (state: RootState) => selectInitState(state).hasInitAdventurerOTP,
  "warrior-otp": (state: RootState) => selectInitState(state).hasInitWarriorOTP,
  "healer-otp": (state: RootState) => selectInitState(state).hasInitHealerOTP,
  "mage-otp": (state: RootState) => selectInitState(state).hasInitMageOTP,
  adventurer: () => true,
  warrior: (state: RootState) => selectInitState(state).hasInitWarriorPane,
  healer: (state: RootState) => selectInitState(state).hasInitHealerPane,
  mage: (state: RootState) => selectInitState(state).hasInitMagePane,
} as const

type PrestigeUpgradeMap = {
  [upgradeName in PrestigeUpgradeName]: {
    selector: (state: RootState) => number
    cost: (atLevel: number, prestigeUpgrade: PrestigeUpgrade) => number
    calcModifier: (atLevel: number, prestigeUpgrade: PrestigeUpgrade) => number
    calcModifierIncrease: (atLevel: number, prestigeUpgrade: PrestigeUpgrade) => number
    pendingPurchases: (state: RootState) => { cost: number; purchaseCount: number } | null
  }
}

export const prestigeUpgradeMap: PrestigeUpgradeMap = {
  damage: {
    selector: (state: RootState) => selectPrestigeState(state).pDamageUpgradeCount,
    cost: UPGRADE_CONFIG.calcAdditivePrice,
    calcModifier: UPGRADE_CONFIG.calcAdditiveMod,
    calcModifierIncrease: UPGRADE_CONFIG.calcAdditiveModIncrease,
    pendingPurchases: (state: RootState) => selectPendingPDamage(state),
  },
  "crit-chance": {
    selector: (state) => selectPrestigeState(state).pCritChanceUpgradeCount,
    cost: UPGRADE_CONFIG.calcMultiplicativePrice,
    calcModifier: UPGRADE_CONFIG.calcAdditiveMod,
    calcModifierIncrease: UPGRADE_CONFIG.calcAdditiveModIncrease,

    pendingPurchases: (state) => selectPendingPCritChance(state),
  },
  multistrike: {
    selector: (state) => selectPrestigeState(state).pMultistrikeUpgradeCount,
    cost: UPGRADE_CONFIG.calcMultiplicativePrice,
    calcModifier: UPGRADE_CONFIG.calcReduction,
    calcModifierIncrease: (atLevel, upgrade) => upgrade.baseValue - UPGRADE_CONFIG.calcReduction(atLevel, upgrade),
    pendingPurchases: (state) => selectPendingPMultistrike(state),
  },
  beat: {
    selector: (state) => selectPrestigeState(state).pBeatUpgradeCount,
    cost: UPGRADE_CONFIG.calcMultiplicativePrice,
    calcModifier: UPGRADE_CONFIG.calcAdditiveMod,
    calcModifierIncrease: UPGRADE_CONFIG.calcAdditiveModIncrease,

    pendingPurchases: (state) => selectPendingPBeat(state),
  },
} as const
