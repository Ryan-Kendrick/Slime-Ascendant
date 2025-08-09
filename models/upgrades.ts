import { RootState } from "../redux/store"

export type UpgradeId = "adventurer-otp" | "warrior-otp" | "healer-otp" | "mage-otp"
export type UpgradeIdWithLevel =
  | "adventurer-otp.1"
  | "adventurer-otp.2"
  | "adventurer-otp.3"
  | "warrior-otp.1"
  | "warrior-otp.2"
  | "warrior-otp.3"
export type CostKey = "clickOTPCosts" | "dotOTPCosts"

export interface UpgradeElement {
  upgradeId: UpgradeId
  purchasedUpgradeLevel: string
}

export type PrestigeUpgradeId = "damage" | "crit-chance" | "multistrike" | "beat" //| "health"

export interface PrestigeUpgrade {
  id: PrestigeUpgradeId
  displayName: string
  modDescription: string
  modSuffix: string
  changePrefix: string
  baseValue: number
  modifier: number
  priceBase: number
  priceIncrease: number
  visibleAtZone: number
  tooltip: string
}

export type PrestigeUpgrades = {
  [id in PrestigeUpgradeId]: PrestigeUpgrade
}

export interface PrestigeState {
  cost: number
  purchaseCount: number
}

export interface OTPConfig {
  OTPCosts: number[]
  OTPModifiers: number[]
  OTPTitles: string[]
  OTPDescriptions: string[]
}
export interface HeroConfig {
  visibleAtZone: number
  elementId: UpgradeId
  displayName: string
  displayStat: string
  baseDamage: number
  levelUpDamageMod: number
  OneTimePurchases: OTPConfig
  levelUpCost: (currentLevel: number) => number
}
export interface UpgradeConfig {
  adventurer: HeroConfig
  warrior: HeroConfig
  healer: HeroConfig
  mage: HeroConfig
  prestigeUpgrades: PrestigeUpgrades
  calcOTPPrice: (upgradeName: UpgradeId, upgradeCount: number) => number
  calcAdditivePrice: (atLevel: number, prestigeUpgrade: PrestigeUpgrade) => number
  calcMultiplicativePrice: (atLevel: number, prestigeUpgrade: PrestigeUpgrade) => number
  calcAdditiveMod: (atLevel: number, prestigeUpgrade: PrestigeUpgrade) => number
  calcAdditiveModIncrease: (atLevel: number, prestigeUpgrade: PrestigeUpgrade) => number
  calcReduction: (atLevel: number, prestigeUpgrade: PrestigeUpgrade) => number
  calcMultistrikeCount: () => number
  prestigeUpgradeConfig: {
    critMultiplier: number
    critVariance: number
    multistrikeDelay: number
  }
}

export interface PlayerCalc {
  clickDamage: (clickLevel: number, clickMulti: number, pDamage: number, achievementModifier: number) => number
  heroDamage: (
    heroName: HeroName | HeroName[],
    heroState: HeroState | HeroState[],
    pDamage?: number,
    achievementModifier?: number,
    displayHeroContribution?: boolean,
  ) => number
  damageAtLevel: (heroName: HeroName, heroState: HeroState) => number
}

export type HeroName = "adventurer" | "warrior" | "healer" | "mage"

export type HeroState = { level: number; upgradeCount: number }

export type UpgradeProps = {
  [key in HeroName]: {
    level: (state: RootState) => number
    upgradeCount: (state: RootState) => number
    damageAtLevel: (state: RootState) => number
    damage: (state: RootState) => number
    levelUpCost: (state: RootState) => number
    totalDamageContribution: (state: RootState) => number
    cardBackground: string
    backgroundImage: string
    radialMask?: string
  }
}
