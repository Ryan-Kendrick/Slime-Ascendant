import { HeroName, HeroState, PlayerCalc, UpgradeConfig } from "../models/upgrades"

export const PLAYER_CONFIG = {
  baseHealth: 10,
} as const

export const UPGRADE_CONFIG: UpgradeConfig = {
  adventurer: {
    visibleAtZone: 1,
    elementId: "adventurer-otp",
    displayName: "Adventurer",
    displayStat: "Click Damage",
    baseDamage: 1,
    levelUpDamageMod: 1,
    OneTimePurchases: {
      OTPCosts: [100, 400, 1000],
      OTPModifiers: [2, 2, 2],
      OTPTitles: ["Upgrade 1", "Upgrade 2", "Upgrade 3"],
      OTPDescriptions: [
        "Increase Passive Damage by 100%",
        "Increase Passive Damage by 100%",
        "Increase Passive Damage by 100%",
      ],
    },
    levelUpCost: (currentLevel) => {
      const base = 10
      const growthRate = 1.05

      return Math.floor(base * (1 + Math.log10(currentLevel)) * Math.pow(growthRate, currentLevel))
    },
  },
  warrior: {
    visibleAtZone: 3,
    elementId: "warrior-otp",
    displayName: "Warrior",
    displayStat: "Passive Damage",
    baseDamage: 5,
    levelUpDamageMod: 4,
    OneTimePurchases: {
      OTPCosts: [8000, 15000, 25000],
      OTPModifiers: [2, 2, 2],
      OTPTitles: ["Upgrade 1", "Upgrade 2", "Upgrade 3"],
      OTPDescriptions: [
        "Increase Passive Damage by 100%",
        "Increase Passive Damage by 100%",
        "Increase Passive Damage by 100%",
      ],
    },
    levelUpCost: (currentLevel) => {
      const base = 500
      const growthRate = 1.07

      return Math.floor(base * (1 + Math.log10(currentLevel + 1)) * Math.pow(growthRate, currentLevel))
    },
  },
  healer: {
    visibleAtZone: 13,
    elementId: "healer-otp",
    displayName: "Healer",
    displayStat: "Passive Damage",
    baseDamage: 70,
    levelUpDamageMod: 50,
    OneTimePurchases: {
      OTPCosts: [150000, 250000, 400000],
      OTPModifiers: [2, 2, 2],
      OTPTitles: ["Upgrade 1", "Upgrade 2", "Upgrade 3"],
      OTPDescriptions: [
        "Increase Passive Damage by 100%",
        "Increase Passive Damage by 100%",
        "Increase Passive Damage by 100%",
      ],
    },
    levelUpCost: (currentLevel) => {
      const base = 5000
      const growthRate = 1.08

      return Math.floor(base * (1 + Math.log10(currentLevel + 1)) * Math.pow(growthRate, currentLevel))
    },
  },
  mage: {
    visibleAtZone: 22,
    elementId: "mage-otp",
    displayName: "Mage",
    displayStat: "Passive Damage",
    baseDamage: 300,
    levelUpDamageMod: 100,
    OneTimePurchases: {
      OTPCosts: [1000000, 2500000, 5000000],
      OTPModifiers: [2, 2, 2],
      OTPTitles: ["Upgrade 1", "Upgrade 2", "Upgrade 3"],
      OTPDescriptions: [
        "Increase Passive Damage by 100%",
        "Increase Passive Damage by 100%",
        "Increase Passive Damage by 100%",
      ],
    },
    levelUpCost: (currentLevel) => {
      const base = 8000
      const growthRate = 1.09

      return Math.floor(base * (1 + Math.log10(currentLevel + 1)) * Math.pow(growthRate, currentLevel))
    },
  },
  calcOTPPrice: function (upgradeName, upgradeCount) {
    const costs = {
      "adventurer-otp": this.adventurer.OneTimePurchases.OTPCosts,
      "warrior-otp": this.warrior.OneTimePurchases.OTPCosts,
      "healer-otp": this.healer.OneTimePurchases.OTPCosts,
      "mage-otp": this.mage.OneTimePurchases.OTPCosts,
    }
    return costs[upgradeName][upgradeCount]
  },
  prestigeUpgrades: {
    damage: {
      id: "damage",
      displayName: "Damage",
      modDescription: "Increase",
      modSuffix: "%",
      changePrefix: "+",
      priceBase: 2,
      priceIncrease: 1,
      baseValue: 0.05,
      modifier: 0.05,
      visibleAtZone: 10,
      tooltip: "Increases Damage by 5% per level",
    },
    health: {
      id: "health",
      displayName: "Health",
      modDescription: "Increase",
      modSuffix: "%",
      changePrefix: "+",
      priceBase: 5,
      priceIncrease: 3,
      baseValue: 0.05,
      modifier: 0.05,
      visibleAtZone: 10,
      tooltip: "Increases Health by 5% per level",
    },
    "crit-chance": {
      id: "crit-chance",
      displayName: "Critical Hit",
      modDescription: "Chance",
      modSuffix: "%",
      changePrefix: "+",
      priceBase: 50,
      priceIncrease: 0.2,
      baseValue: 0.05,
      modifier: 0.01,
      visibleAtZone: 20,
      tooltip: "Increases Critical Hit chance by 1% per level",
    },
    multistrike: {
      id: "multistrike",
      displayName: "Multistrike",
      modDescription: "Cooldown",
      modSuffix: "s",
      changePrefix: "-",
      priceBase: 8,
      priceIncrease: 0.4,
      baseValue: 40,
      modifier: 0.02,
      visibleAtZone: 25,
      tooltip: "Reduces Multistrike cooldown by 2% per level",
    },
    beat: {
      id: "beat",
      displayName: "Stalactide",
      modDescription: "Click Damage",
      modSuffix: "%",
      changePrefix: "+",
      priceBase: 100,
      priceIncrease: 2,
      baseValue: 3,
      modifier: 0.2,
      visibleAtZone: 30,
      tooltip: "Increase Stalactide damage by 20% per level",
    },
  },

  calcAdditivePrice(atLevel, upgrade): number {
    return atLevel !== 0 ? upgrade.priceBase + (atLevel - 1) * upgrade.priceIncrease : 0
  },
  calcMultiplicativePrice(atLevel, upgrade): number {
    return atLevel !== 0 ? upgrade.priceBase * Math.pow(1 + upgrade.priceIncrease, atLevel - 1) : 0
  },
  calcAdditiveMod(atLevel, upgrade): number {
    return atLevel !== 0 ? upgrade.baseValue + (atLevel - 1) * upgrade.modifier : 0
  },
  calcAdditiveModIncrease(atLevel, upgrade): number {
    return atLevel !== 0 ? atLevel * upgrade.modifier : 0
  },
  calcReduction(atLevel, upgrade): number {
    return atLevel !== 0 ? upgrade.baseValue * Math.pow(1 - upgrade.modifier, atLevel - 1) : 0
  },
  calcMultistrikeCount(): number {
    return 4
  },

  // Extended balance config
  prestigeUpgradeConfig: {
    critMultiplier: 2.5,
    critVariance: 0.3,
    multistrikeDelay: 100,
  },
} as const

export const playerCalc: PlayerCalc = {
  clickDamage: (clickLevel, clickOTPUpgradeCount, pDamage, achievementModifier): number =>
    UPGRADE_CONFIG.adventurer.baseDamage +
    (clickLevel - 1) * Math.pow(2, clickOTPUpgradeCount) * pDamage * achievementModifier,
  heroDamage: (heroName, heroState, pDamage?, achievementModifier?, displayHeroContribution?): number => {
    let damage = 0

    // If damage for all heroes is being added, return total effective dot damage
    if (Array.isArray(heroName) && Array.isArray(heroState) && pDamage && achievementModifier) {
      for (let i = 0; i < heroName.length; i++) {
        const { baseDamage, levelUpDamageMod: levelUpMod, OneTimePurchases } = UPGRADE_CONFIG[heroName[i]]
        const { level, upgradeCount } = heroState[i]

        if (level === 0) continue

        let damageInc = baseDamage + (level - 1) * levelUpMod
        const upgradeModifiers = OneTimePurchases.OTPModifiers.slice(0, upgradeCount)

        for (const mod of upgradeModifiers) {
          damageInc *= mod
        }
        damage += damageInc
      }
      damage *= pDamage * achievementModifier

      // Else if damage is being calculated for a single hero
    } else if (typeof heroName === "string") {
      const { baseDamage, levelUpDamageMod: levelUpMod, OneTimePurchases } = UPGRADE_CONFIG[heroName as HeroName]
      const { level, upgradeCount } = heroState as HeroState
      if (level === 0) return 0
      damage += baseDamage + (level - 1) * levelUpMod
      const upgradeModifiers = OneTimePurchases.OTPModifiers.slice(0, upgradeCount)

      for (const mod of upgradeModifiers) {
        damage *= mod
      }

      // When total damage contribution is being calculated for display on a hero card
      if (displayHeroContribution) {
        if (pDamage && achievementModifier) {
          damage *= pDamage * achievementModifier
        } else if (achievementModifier) {
          damage *= achievementModifier
        } else {
          throw new Error(
            `Unexpected values in display hero contribution calculation: ${heroName} ${heroState} ${pDamage} ${achievementModifier}`,
          )
        }
      }
    } else {
      throw new Error(
        `Unexpected values in hero damage calculation: ${heroName} ${heroState} ${pDamage} ${achievementModifier}`,
      )
    }
    return damage
  },
  damageAtLevel: (heroName, heroState): number => {
    const { baseDamage, levelUpDamageMod } = UPGRADE_CONFIG[heroName]
    return baseDamage + (heroState.level - 1) * levelUpDamageMod
  },
} as const
