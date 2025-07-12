import { createSelector, createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import { AppDispatch, type RootState } from "./store"
import { Tab } from "../models/player"
import { playerCalc, UPGRADE_CONFIG } from "../gameconfig/upgrades"
import { setInitElementMap } from "./shared/maps"
import { PrestigeState, PrestigeUpgradeName, HeroName, UpgradeId } from "../models/upgrades"
import { prestigeReset } from "./shared/actions"
import { ACHIEVEMENT_CONFIG, AchievementCategory, ACHIEVEMENTS } from "../gameconfig/achievements"
import { checkAchievementUnlock } from "./shared/helpers"
import { selectAchievementDamage, selectAdventurerLevel, selectHeroState, selectPMod } from "./shared/heroSelectors"

const debugState = {
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

  activeHeroes: ["warrior"] as HeroName[],
  plasmaReserved: 0,
  UIProgression: 99,
  hasInitAdventurerOTP: 99,
  hasInitWarriorPane: true,
  hasInitWarriorOTP: 99,
  hasInitHealerPane: true,
  hasInitHealerOTP: 99,
  hasInitMagePane: true,
  hasInitMageOTP: 99,
  tabInView: "upgrade" as Tab,

  startDate: performance.timeOrigin,
  pDamageUpgradeCount: 300,
  pCritUpgradeCount: 300,
  pMultistrikeUpgradeCount: 300,
  pBeatUpgradeCount: 300,
  // pHealthUpgradeCount: 300,
  plasma: 1000000,
  plasmaSpent: 50000,

  pendingPPurchases: {} as Record<PrestigeUpgradeName, { cost: number; purchaseCount: number }>,
}

export const initialState = {
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

  activeHeroes: [] as HeroName[],
  plasmaReserved: 0,
  UIProgression: 0,
  hasInitAdventurerOTP: 0,
  hasInitWarriorPane: false,
  hasInitWarriorOTP: 0,
  hasInitHealerPane: false,
  hasInitHealerOTP: 0,
  hasInitMagePane: false,
  hasInitMageOTP: 0,
  tabInView: "upgrade" as Tab,

  // Preserved between runs
  startDate: performance.timeOrigin,
  pDamageUpgradeCount: 0,
  pCritUpgradeCount: 0,
  pMultistrikeUpgradeCount: 0,
  pBeatUpgradeCount: 0,
  // pHealthUpgradeCount: 0,
  plasma: 0,
  plasmaSpent: 0,

  pendingPPurchases: {} as Record<PrestigeUpgradeName, PrestigeState>,
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
    reservePlasma: (state) => {
      const cost = Object.values(state.pendingPPurchases).reduce((acc, thisUpgrade) => acc + thisUpgrade.cost, 0)
      const diff = cost - state.plasmaReserved
      state.plasmaReserved = Math.round(state.plasmaReserved + diff)
      state.plasma = Math.round(state.plasma - diff)
    },
    setPrestigeUpgradesPending: (
      state,
      action: PayloadAction<{ upgradeId: PrestigeUpgradeName; cost: number; purchaseCount: number }>,
    ) => {
      const { upgradeId, cost, purchaseCount: count } = action.payload
      state.pendingPPurchases[upgradeId] = { cost, purchaseCount: count }
    },
    resetPlasmaReserved: (state) => {
      state.plasma = Math.round(state.plasma + state.plasmaReserved)
      state.plasmaReserved = 0
      state.pendingPPurchases = {} as Record<PrestigeUpgradeName, PrestigeState>
    },
    incrementPDamageUpgradeCount: (state) => {
      state.pDamageUpgradeCount++
    },
    incrementPHealthUpgradeCount: (state) => {
      //   state.pHealthUpgradeCount++
    },
    prestigeRespec: (state) => {
      // Not implemented yet
      state.plasma += state.plasmaReserved
      state.plasma += state.plasmaSpent
      state.plasmaReserved = 0
      state.plasmaSpent = 0
      state.pDamageUpgradeCount = 0
      state.pCritUpgradeCount = 0
      state.pMultistrikeUpgradeCount = 0
      state.pBeatUpgradeCount = 0
      // state.pHealthUpgradeCount = 0
    },
    increaseAchievementModifier(state, action: PayloadAction<number>) {
      // Integer conversion to avoid floating-point imprecision
      const currentValue = Math.round(state.achievementModifier * 100)
      const payloadValue = Math.round(action.payload * 100)
      state.achievementModifier = (currentValue + payloadValue) / 100
    },
    setAchievementModifier(state, action: PayloadAction<number>) {
      state.achievementModifier = action.payload
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
      state.healerLevel = 0
      state.healerOTPUpgradeCount = 0
      state.mageLevel = 0
      state.mageOTPUpgradeCount = 0
      state.gold = 0
      state.plasmaSpent += state.plasmaReserved
      state.activeHeroes = ["adventurer"]
      state.plasmaReserved = 0
      state.UIProgression = 0
      state.hasInitAdventurerOTP = 0
      state.hasInitWarriorPane = false
      state.hasInitWarriorOTP = 0
      state.hasInitHealerPane = false
      state.hasInitHealerOTP = 0
      state.hasInitMagePane = false
      state.hasInitMageOTP = 0

      state.tabInView = "upgrade"

      state.pendingPPurchases = {} as Record<PrestigeUpgradeName, PrestigeState>

      if (action.payload.damage) state.pDamageUpgradeCount += action.payload.damage.purchaseCount
      if (action.payload["crit-chance"]) state.pCritUpgradeCount += action.payload["crit-chance"].purchaseCount
      if (action.payload.multistrike) state.pMultistrikeUpgradeCount += action.payload.multistrike.purchaseCount
      if (action.payload.beat) state.pBeatUpgradeCount += action.payload.beat.purchaseCount
      // if (action.payload.health) state.pHealthUpgradeCount += action.payload.health.purchaseCount
    })
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
  setPrestigeUpgradesPending,
  resetPlasmaReserved,
  incrementPDamageUpgradeCount,
  incrementPHealthUpgradeCount,
  prestigeRespec,
  increaseAchievementModifier,
  setAchievementModifier,
  incrementUIProgression,
  initialiseElement,
  setActiveHero,
  setTabInView,
  toggleDebugState,
} = playerSlice.actions

export const prestigeDamageMod = UPGRADE_CONFIG.prestigeUpgrades.find((pUpgrade) => pUpgrade.id === "damage")!.modifier
export const selectPrestigeState = createSelector([(state: RootState) => state.player], (player) => ({
  plasma: player.plasma,
  plasmaSpent: player.plasmaSpent,
  pDamageUpgradeCount: player.pDamageUpgradeCount,
  pCritChanceUpgradeCount: player.pCritUpgradeCount,
  pMultistrikeUpgradeCount: player.pMultistrikeUpgradeCount,
  pBeatUpgradeCount: player.pBeatUpgradeCount,
  // pHealthUpgradeCount: player.pHealthUpgradeCount,
}))
export const selectCritChance = (state: RootState) =>
  UPGRADE_CONFIG.calcAdditiveMod(
    state.player.pCritUpgradeCount,
    UPGRADE_CONFIG.prestigeUpgrades.find((pUpgrade) => pUpgrade.id === "crit-chance")!,
  )
export const selectMultistrikeCooldown = (state: RootState) =>
  UPGRADE_CONFIG.calcReduction(
    state.player.pMultistrikeUpgradeCount,
    UPGRADE_CONFIG.prestigeUpgrades.find((pUpgrade) => pUpgrade.id === "multistrike")!,
  )

export const createPendingPPurchaseSelector = (upgradeId: PrestigeUpgradeName) =>
  createSelector([(state: RootState) => state.player.pendingPPurchases], (pendingPPurchases) => {
    const purchase = pendingPPurchases[upgradeId]
    return purchase ? { cost: purchase.cost, purchaseCount: purchase.purchaseCount } : null
  })

export const selectPendingPDamage = createPendingPPurchaseSelector("damage")
export const selectPendingPCritChance = createPendingPPurchaseSelector("crit-chance")
export const selectPendingPMultistrike = createPendingPPurchaseSelector("multistrike")
export const selectPendingPBeat = createPendingPPurchaseSelector("beat")
// export const selectPendingPHealth = createPendingPPurchaseSelector("health")

export const selectGold = (state: RootState) => state.player.gold
export const selectGCanAfford = (cost: number) => createSelector([selectGold], (gold) => gold >= cost)
export const selectPlasma = (state: RootState) => state.player.plasma
export const selectPCanAfford = (cost: number) => createSelector([selectPlasma], (plasma) => plasma >= cost)
export const selectPlasmaReserved = (state: RootState) => state.player.plasmaReserved
export const selectClickDamage = createSelector(
  [
    selectAdventurerLevel,
    (state: RootState) => state.player.adventurerOTPUpgradeCount,
    selectPMod,
    selectAchievementDamage,
  ],
  (adventurerLevel, adventurerOTPUpgradeCount, pDamage, achievementDamage) =>
    playerCalc.clickDamage(adventurerLevel, adventurerOTPUpgradeCount, pDamage, achievementDamage),
)
export const selectBeatDamage = createSelector(
  [(state: RootState) => state.player.pBeatUpgradeCount, selectClickDamage],
  (pBeatUpgradeCount, clickDamage) =>
    UPGRADE_CONFIG.calcAdditiveMod(
      pBeatUpgradeCount,
      UPGRADE_CONFIG.prestigeUpgrades.find((pUpgrade) => pUpgrade.id === "beat")!,
    ) * clickDamage,
)
export const selectDotDamage = createSelector(
  [(state: RootState) => state.player.activeHeroes, selectHeroState, selectPMod, selectAchievementDamage],
  (activeHeroes, heroState, pDamage, achievementDamage) => {
    if (activeHeroes.length < 2) return 0
    const dotHeroes = activeHeroes.slice(1)
    const heroStats = dotHeroes.map((hero) => heroState[hero])

    return playerCalc.heroDamage(dotHeroes, heroStats, pDamage, achievementDamage)
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
      unlockedAchievements: state.stats.achievementsUnlocked,
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
      unlockedAchievements: state.stats.achievementsUnlocked,
      achievements: achievementData.achievements,
      value: selectDotDamage(state),
    },
  ])
}

export const updatePrestige = () => (dispatch: AppDispatch, getState: () => RootState) => {
  const purchases = getState().player.pendingPPurchases
  dispatch(prestigeReset(purchases))

  const countAchievements = ACHIEVEMENTS.prestige.count as AchievementCategory
  const spentAchievements = ACHIEVEMENTS.prestige.plasmaSpent as AchievementCategory
  const state = getState()

  checkAchievementUnlock(dispatch, [
    {
      unlockedAchievements: state.stats.achievementsUnlocked,
      achievements: countAchievements.achievements,
      value: state.stats.prestigeCount,
    },
    {
      unlockedAchievements: state.stats.achievementsUnlocked,
      achievements: spentAchievements.achievements,
      value: state.player.plasmaSpent,
    },
  ])
}

export const recalculateAchievementMod = () => (dispatch: AppDispatch, getState: () => RootState) => {
  const config = ACHIEVEMENT_CONFIG
  const state = getState()
  const unlockAchievements = state.stats.achievementsUnlocked
  let achievementModifier = 0

  {
    Object.entries(config).forEach(([feature, featureData]) => {
      if (feature === "displayName") return null
      {
        Object.entries(featureData).forEach(([categoryKey, categoryData]) => {
          if (categoryKey === "displayName") return null
          categoryData = categoryData as AchievementCategory
          {
            categoryData.achievements.forEach((achievement) => {
              const isUnlocked = unlockAchievements.find((id) => id === achievement.id)
              if (isUnlocked) {
                achievementModifier += achievement.modifier
              }
            })
          }
        })
      }
    })
  }

  dispatch(setAchievementModifier(achievementModifier))
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
  (plasma, plasmaReserved, plasmaSpent) => plasma > 0 || plasmaReserved > 0 || plasmaSpent > 0,
)

export const selectTabAnimationComplete = createSelector([selectUIProgress], (UIProgress) => UIProgress > 1)
export const selectOneLineMaskVisible = createSelector([selectUIProgress], (UIProgress) => {
  return UIProgress > 0
})

export default playerSlice.reducer
