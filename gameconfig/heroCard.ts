import { HeroName, UpgradeProps } from "../models/upgrades"
import {
  selectAdventurerContribution,
  selectAllAdventurerState,
  selectAllHealerState,
  selectAllMageState,
  selectAllWarriorState,
  selectHealerContribution,
  selectMageContribution,
  selectWarriorContribution,
} from "../redux/playerSlice"
import { RootState } from "../redux/store"

type HeroStateFunctions = {
  level: (state: RootState) => number
  upgradeCount: (state: RootState) => number
  damageAtLevel: (state: RootState) => number
  damage: (state: RootState) => number
  levelUpCost: (state: RootState) => number
  totalDamageContribution: (state: RootState) => number
}

const heroStateSelectors = {
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

const populateHeroState = (heroName: HeroName): HeroStateFunctions => {
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
    cardBackground: "bg-electricblue/50",
    backgroundImage: "before:bg-[url('/assets/icons/mageBg.svg')]",
  },
}
