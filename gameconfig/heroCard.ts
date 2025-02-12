import { HeroName, UpgradeProps } from "../models/upgrades"
import {
  selectAllAdventurerState,
  selectAllHealerState,
  selectAllMageState,
  selectAllWarriorState,
} from "../redux/playerSlice"
import { RootState } from "../redux/store"

type HeroStateFunctions = {
  level: (state: RootState) => number
  upgradeCount: (state: RootState) => number
  damageAtLevel: (state: RootState) => number
  damage: (state: RootState) => number
  levelUpCost: (state: RootState) => number
}

const heroStateSelectors = {
  adventurer: selectAllAdventurerState,
  warrior: selectAllWarriorState,
  healer: selectAllHealerState,
  mage: selectAllMageState,
} as const

const populateHeroState = (heroName: HeroName): HeroStateFunctions => {
  const thisSelector = heroStateSelectors[heroName]

  const thisHeroState = {
    level: (state: RootState) => thisSelector(state).level,
    upgradeCount: (state: RootState) => thisSelector(state).upgradeCount,
    damageAtLevel: (state: RootState) => thisSelector(state).damageAtLevel,
    damage: (state: RootState) => thisSelector(state).damage,
    levelUpCost: (state: RootState) => thisSelector(state).levelUpCost,
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
