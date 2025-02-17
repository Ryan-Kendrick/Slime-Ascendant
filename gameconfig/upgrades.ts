import { HeroName, HeroState, PlayerCalc, UpgradeConfig } from "../models/upgrades"

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

      return Math.floor(base * (1 + Math.log10(currentLevel)) * Math.pow(growthRate, currentLevel) - 1)
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
    visibleAtZone: 12,
    elementId: "healer-otp",
    displayName: "Healer",
    displayStat: "Passive Damage",
    baseDamage: 60,
    levelUpDamageMod: 40,
    OneTimePurchases: {
      OTPCosts: [75000, 100000, 250000],
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
  calcOTPCost: function (upgradeName, upgradeCount) {
    const costs = {
      "adventurer-otp": this.adventurer.OneTimePurchases.OTPCosts,
      "warrior-otp": this.warrior.OneTimePurchases.OTPCosts,
      "healer-otp": this.healer.OneTimePurchases.OTPCosts,
      "mage-otp": this.mage.OneTimePurchases.OTPCosts,
    }
    return costs[upgradeName][upgradeCount]
  },
  prestige: [
    {
      id: "damage",
      title: "Damage",
      modDescription: "Increase",
      modSuffix: "%",
      basePrice: 2,
      additiveInc: 1,
      modifier: 0.05,
      unlocked: true,
      tooltip: "Increase damage by 5%",
    },
    // { id: "health", title: "Health", basePrice: 2, additiveInc: 1, modifier: 0.05, unlocked: true, tooltip: "" },
  ],
  calcAdditiveCost(atLevel, prestigeUpgrade): number {
    return (((atLevel - 1) * atLevel) / 2) * prestigeUpgrade.additiveInc + prestigeUpgrade.basePrice * atLevel
  },
} as const

export const playerCalc: PlayerCalc = {
  clickDamage: (clickLevel, clickOTPUpgradeCount, pDamage, achievementModifier): number =>
    clickLevel * Math.pow(2, clickOTPUpgradeCount) * pDamage * achievementModifier,
  heroDamage: (heroName, heroState, pDamage?, achievementModifier?): number => {
    let damage = 0

    if (Array.isArray(heroName) && Array.isArray(heroState) && pDamage && achievementModifier) {
      for (let i = 0; i < heroName.length; i++) {
        const { baseDamage, levelUpDamageMod: levelUpMod, OneTimePurchases } = UPGRADE_CONFIG[heroName[i]]
        const { level, upgradeCount } = heroState[i]

        if (level === 0) continue

        damage += baseDamage + (level - 1) * levelUpMod
        const upgradeModifiers = OneTimePurchases.OTPModifiers.slice(0, upgradeCount)

        for (const mod of upgradeModifiers) {
          damage *= mod
        }
      }
      // If damage for all heroes is being added, return total effective dot damage
      damage *= pDamage * achievementModifier
    } else if (typeof heroName === "string") {
      const { baseDamage, levelUpDamageMod: levelUpMod, OneTimePurchases } = UPGRADE_CONFIG[heroName as HeroName]
      const { level, upgradeCount } = heroState as HeroState
      if (level === 0) return 0
      damage += baseDamage + (level - 1) * levelUpMod
      const upgradeModifiers = OneTimePurchases.OTPModifiers.slice(0, upgradeCount)

      for (const mod of upgradeModifiers) {
        damage *= mod
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
