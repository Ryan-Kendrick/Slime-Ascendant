import { HeroName, PrestigeUpgradeId } from "./upgrades"

export type Tab = "upgrade" | "prestige"

export interface TabData {
  id: Tab
  title: string
  component: JSX.Element
  activeStyle: string
  inactiveStyle: string
}

export interface PlayerState {
  adventurerLevel: number
  adventurerOTPUpgradeCount: number
  warriorLevel: number
  warriorOTPUpgradeCount: number
  healerLevel: number
  healerOTPUpgradeCount: number
  mageLevel: number
  mageOTPUpgradeCount: number

  gold: number
  plasma: number
  plasmaReserved: number
  achievementModifier: number

  activeHeroes: HeroName[]
  UIProgression: number
  hasInitAdventurerOTP: number
  hasInitWarriorPane: boolean
  hasInitWarriorOTP: number
  hasInitHealerPane: boolean
  hasInitHealerOTP: number
  hasInitMagePane: boolean
  hasInitMageOTP: number
  tabInView: Tab

  plasmaSpent: number
  startDate: number
  pDamageUpgradeCount: number
  pCritUpgradeCount: number
  pMultistrikeUpgradeCount: number
  pBeatUpgradeCount: number
  // pHealthUpgradeCount: number]

  pendingPPurchases: Record<PrestigeUpgradeId, { cost: number; purchaseCount: number }>
}
