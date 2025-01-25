import { createSelector, createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import { AppDispatch, type RootState } from "./store"
import { PlayerState, Tab } from "../models/player"
import { playerCalc, UPGRADE_CONFIG } from "../gameconfig/upgrades"
import { heroStateMap, setInitElementMap } from "../gameconfig/utils"
import { PrestigeState, PrestigeUpgradeName, HeroName, UpgradeId, HeroState } from "../models/upgrades"
import { prestigeReset } from "./shared/actions"
import { AchievementCategory, ACHIEVEMENTS } from "../gameconfig/achievements"
import { checkAchievementUnlock } from "./shared/helpers"

const debugState: PlayerState = {
  adventurerLevel: 500,
  adventurerOTPUpgradeCount: 3,
  warriorLevel: 500,
  warriorOTPUpgradeCount: 3,
  healerLevel: 500,
  healerOTPUpgradeCount: 3,
  mageLevel: 500,
  mageOTPUpgradeCount: 3,

  gold: 1000000,
  achievementModifier: 0,

  activeHeroes: ["warrior"],
  plasmaReserved: 0,
  UIProgression: 99,
  hasInitAdventurerOTP: 99,
  hasInitWarriorPane: true,
  hasInitWarriorOTP: 99,
  hasInitHealerPane: true,
  hasInitHealerOTP: 99,
  hasInitMagePane: true,
  hasInitMageOTP: 99,
  tabInView: "upgrade",

  startDate: performance.timeOrigin,
  pDamageUpgradeCount: 300,
  // pHealthUpgradeCount: 300,
  plasma: 1000000,
  plasmaSpent: 50000,
}

const initialState: PlayerState = {
  adventurerLevel: 1,
  adventurerOTPUpgradeCount: 0,
  warriorLevel: 0,
  warriorOTPUpgradeCount: 0,
  healerLevel: 0,
  healerOTPUpgradeCount: 0,
  mageLevel: 0,
  mageOTPUpgradeCount: 0,

  gold: 0,
  achievementModifier: 0,

  activeHeroes: [],
  plasmaReserved: 0,
  // Prevents animation triggering again on mount
  UIProgression: 0,
  hasInitAdventurerOTP: 0,
  hasInitWarriorPane: false,
  hasInitWarriorOTP: 0,
  hasInitHealerPane: false,
  hasInitHealerOTP: 0,
  hasInitMagePane: false,
  hasInitMageOTP: 0,
  tabInView: "upgrade",

  // Preserved between runs
  startDate: performance.timeOrigin,
  pDamageUpgradeCount: 0,
  // pHealthUpgradeCount: 0,
  plasma: 0,
  plasmaSpent: 0,
}

export const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    incrementAdventurerLevel: (state) => {
      state.adventurerLevel++
    },
    incrementAdventurerOTPUpgradeCount: (state) => {
      state.adventurerOTPUpgradeCount++
    },
    incrementWarriorLevel: (state) => {
      state.warriorLevel++
    },
    incrementWarriorOTPUpgradeCount: (state) => {
      state.warriorOTPUpgradeCount++
    },
    incrementHealerLevel: (state) => {
      state.healerLevel++
    },
    incrementHealerOTPUpgradeCount: (state) => {
      state.healerOTPUpgradeCount++
    },
    incrementMageLevel: (state) => {
      state.mageLevel++
    },
    incrementMageOTPUpgradeCount: (state) => {
      state.mageOTPUpgradeCount++
    },
    increaseGold(state, action: PayloadAction<number>) {
      state.gold += action.payload
    },
    decreaseGold(state, action: PayloadAction<number>) {
      state.gold -= action.payload
    },
    increasePlasma(state, action: PayloadAction<number>) {
      state.plasma += action.payload
    },
    reservePlasma(state, action: PayloadAction<number>) {
      const diff = action.payload - state.plasmaReserved
      state.plasmaReserved += diff
      state.plasma -= diff
    },
    resetPlasmaReserved: (state) => {
      state.plasma += state.plasmaReserved
      state.plasmaReserved = 0
    },
    incrementPDamageUpgradeCount: (state) => {
      state.pDamageUpgradeCount++
    },
    incrementPHealthUpgradeCount: (state) => {
      //   state.pHealthUpgradeCount++
    },
    prestigeRespec: (state) => {
      state.plasma += state.plasmaReserved
      state.plasma += state.plasmaSpent
      state.plasmaReserved = 0
      state.plasmaSpent = 0
      state.pDamageUpgradeCount = 0
      // state.pHealthUpgradeCount = 0
    },
    increaseAchievementModifier(state, action: PayloadAction<number>) {
      // Integer conversion to avoid floating-point imprecision
      const currentValue = Math.round(state.achievementModifier * 100)
      const payloadValue = Math.round(action.payload * 100)
      state.achievementModifier = (currentValue + payloadValue) / 100
    },
    incrementUIProgression: (state) => {
      state.UIProgression++
    },
    initialiseElement(state, action: PayloadAction<UpgradeId | HeroName>) {
      setInitElementMap[action.payload](state)
    },
    setActiveHero(state, action: PayloadAction<HeroName>) {
      if (!state.activeHeroes.includes(action.payload)) {
        state.activeHeroes.push(action.payload)
      }
    },
    setTabInView: (state, action: PayloadAction<Tab>) => {
      state.tabInView = action.payload
    },
    toggleDebugState: (state) => {
      if (state.adventurerLevel < 500) {
        return (state = debugState)
      } else {
        return (state = {
          ...initialState,
          activeHeroes: ["adventurer", "warrior", "healer"],
          gold: 1000000,
          plasma: 1000000,
        })
      }
    },
  },
  extraReducers(builder) {
    builder.addCase(prestigeReset, (state, action: PayloadAction<Record<PrestigeUpgradeName, PrestigeState>>) => {
      state.adventurerLevel = 1
      state.adventurerOTPUpgradeCount = 0
      state.warriorLevel = 0
      state.warriorOTPUpgradeCount = 0
      state.gold = 0
      state.plasmaSpent += state.plasmaReserved
      state.activeHeroes = ["adventurer"]
      state.plasmaReserved = 0
      state.hasInitAdventurerOTP = 0
      state.hasInitWarriorPane = false
      state.hasInitWarriorOTP = 0

      state.tabInView = "upgrade"

      state.pDamageUpgradeCount += action.payload.damage.purchaseCount
      // state.pHealthUpgradeCount += action.payload.health.purchaseCount
    })
    // builder.addCase("stats/zoneTenCompleted", (state) => {})
  },
})

export const {
  incrementAdventurerLevel,
  incrementAdventurerOTPUpgradeCount,
  incrementWarriorLevel,
  incrementWarriorOTPUpgradeCount,
  incrementHealerLevel,
  incrementHealerOTPUpgradeCount,
  incrementMageLevel,
  incrementMageOTPUpgradeCount,
  increaseGold,
  decreaseGold,
  increasePlasma,
  reservePlasma,
  resetPlasmaReserved,
  incrementPDamageUpgradeCount,
  incrementPHealthUpgradeCount,
  prestigeRespec,
  increaseAchievementModifier,
  incrementUIProgression,
  initialiseElement,
  setActiveHero,
  setTabInView,
  toggleDebugState,
} = playerSlice.actions

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

export const selectAdventurerLevelUpCost = (state: RootState) =>
  UPGRADE_CONFIG.adventurer.levelUpCost(state.player.adventurerLevel)
export const selectWarriorLevelUpCost = (state: RootState) =>
  UPGRADE_CONFIG.warrior.levelUpCost(state.player.warriorLevel)
export const selectHealerLevelUpCost = (state: RootState) => UPGRADE_CONFIG.healer.levelUpCost(state.player.healerLevel)
export const selectMageLevelUpCost = (state: RootState) => UPGRADE_CONFIG.mage.levelUpCost(state.player.mageLevel)
export const selectLevelUpCosts = createSelector(
  [selectAdventurerLevelUpCost, selectWarriorLevelUpCost, selectHealerLevelUpCost, selectMageLevelUpCost],
  (adventurerLevelUpCost, warriorLevelUpCost, healerLevelUpCost, mageLevelUpCost) => ({
    adventurerLevelUpCost,
    warriorLevelUpCost,
    healerLevelUpCost,
    mageLevelUpCost,
  }),
)

const prestigeDamageMod = UPGRADE_CONFIG.prestige.find((pUpgrade) => pUpgrade.id === "damage")!.modifier
export const selectPrestigeState = createSelector([(state: RootState) => state.player], (player) => ({
  plasma: player.plasma,
  plasmaSpent: player.plasmaSpent,
  pDamageUpgradeCount: player.pDamageUpgradeCount,
  // pHealthUpgradeCount: player.pHealthUpgradeCount,
}))

export const selectAdventurerLevel = (state: RootState) => state.player.adventurerLevel
export const selectGold = (state: RootState) => state.player.gold
export const selectGCanAfford = (cost: number) => (state: RootState) => selectGold(state) >= cost
export const selectPlasma = (state: RootState) => state.player.plasma
export const selectPCanAfford = (cost: number) => createSelector([selectPlasma], (plasma) => plasma >= cost)
export const selectPlasmaReserved = (state: RootState) => state.player.plasmaReserved
const selectPDamageUpgradeCount = (state: RootState) => state.player.pDamageUpgradeCount
export const selectAchievementModifier = (state: RootState) => state.player.achievementModifier

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
export const selectClickDamage = (state: RootState): number =>
  playerCalc.clickDamage(
    state.player.adventurerLevel,
    state.player.adventurerOTPUpgradeCount,
    1 + state.player.pDamageUpgradeCount * prestigeDamageMod,
    1 + state.player.achievementModifier,
  )
export const selectDotDamage = createSelector(
  [
    (state: RootState) => state.player.activeHeroes,
    selectHeroState,
    selectPDamageUpgradeCount,
    selectAchievementModifier,
  ],
  (activeHeroes, heroState, pDamageUpgradeCount, achievementModifier) => {
    if (activeHeroes.length < 1) return 0

    const heroes = activeHeroes.slice(1)
    const heroStats = [] as HeroState[]

    for (const hero of heroes) {
      const thisHeroState = heroState[hero]
      heroStats.push(thisHeroState)
    }

    return playerCalc.heroDamage(
      heroes,
      heroStats,
      1 + pDamageUpgradeCount * prestigeDamageMod,
      1 + achievementModifier,
    )
  },
)

export const updateClickDamage = (whatChanged: string) => (dispatch: AppDispatch, getState: () => RootState) => {
  switch (whatChanged) {
    case "adventurer-levelup":
      dispatch(incrementAdventurerLevel())
      break
    case "adventurer-otp":
      dispatch(incrementAdventurerOTPUpgradeCount())
      break
    case "pDamage":
      break
    default:
      throw new Error("Unexpected updateDotDamage argument: " + whatChanged)
  }

  const achievementData = ACHIEVEMENTS.click.value as AchievementCategory
  const state = getState()

  checkAchievementUnlock(dispatch, [
    {
      achievements: achievementData.achievements,
      value: selectClickDamage(state),
    },
  ])
}

export const updateDotDamage = (whatChanged: string) => (dispatch: AppDispatch, getState: () => RootState) => {
  switch (whatChanged) {
    case "warrior-levelup":
      dispatch(incrementWarriorLevel())
      break
    case "warrior-otp":
      dispatch(incrementWarriorOTPUpgradeCount())
      break
    case "healer-levelup":
      dispatch(incrementHealerLevel())
      break
    case "healer-otp":
      dispatch(incrementHealerOTPUpgradeCount())
      break
    case "mage-levelup":
      dispatch(incrementMageLevel())
      break
    case "mage-otp":
      dispatch(incrementMageOTPUpgradeCount())
      break
    case "pDamage":
      break
    default:
      throw new Error("Unexpected updateDotDamage argument: " + whatChanged)
  }

  const achievementData = ACHIEVEMENTS.dot.value as AchievementCategory
  const state = getState()

  checkAchievementUnlock(dispatch, [
    {
      achievements: achievementData.achievements,
      value: selectDotDamage(state),
    },
  ])
}

export const updatePrestige =
  (prestigePurchase: Record<PrestigeUpgradeName, PrestigeState>) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(prestigeReset(prestigePurchase))

    const countAchievements = ACHIEVEMENTS.prestige.count as AchievementCategory
    const spentAchievements = ACHIEVEMENTS.prestige.plasmaSpent as AchievementCategory
    const state = getState()

    checkAchievementUnlock(dispatch, [
      {
        achievements: countAchievements.achievements,
        value: state.stats.prestigeCount,
      },
      {
        achievements: spentAchievements.achievements,
        value: state.player.plasmaSpent,
      },
    ])
  }

export const selectInitState = createSelector(
  [(state: RootState) => state.player],
  ({
    hasInitAdventurerOTP,
    hasInitWarriorPane,
    hasInitWarriorOTP,
    hasInitHealerPane,
    hasInitHealerOTP,
    hasInitMagePane,
    hasInitMageOTP,
  }) => ({
    hasInitAdventurerOTP,
    hasInitWarriorPane,
    hasInitWarriorOTP,
    hasInitHealerPane,
    hasInitHealerOTP,
    hasInitMagePane,
    hasInitMageOTP,
  }),
)

export const selectUIProgress = (state: RootState) => state.player.UIProgression
export const selectTabInView = (state: RootState) => state.player.tabInView
export const selectPrestigeTabVisible = createSelector(
  [selectPlasma, selectPlasmaReserved, (state: RootState) => state.player.plasmaSpent],
  (plasma, plasmaReserved, plasmaSpent) => plasma || plasmaReserved || plasmaSpent > 0,
)
export const selectTabAnimationComplete = createSelector([selectUIProgress], (UIProgress) => UIProgress > 0)

export default playerSlice.reducer
