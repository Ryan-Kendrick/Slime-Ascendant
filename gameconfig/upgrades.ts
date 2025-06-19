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
  prestige: [
    {
      id: "damage",
      title: "Damage",
      modDescription: "Increase",
      modSuffix: "%",
      changePrefix: "+",
      priceBase: 2,
      priceIncrease: 1,
      baseValue: 0.05,
      modifier: 0.05,
      visibleAtZone: 10,
      tooltip: "Increase damage by 5%",
    },
    {
      id: "crit-chance",
      title: "Critical Hit",
      modDescription: "Chance",
      modSuffix: "%",
      changePrefix: "+",
      priceBase: 50,
      priceIncrease: 25,
      baseValue: 0.05,
      modifier: 0.01,
      visibleAtZone: 20,
      tooltip: "Increase critical hit chance by 1%",
    },
    {
      id: "multistrike",
      title: "Multistrike",
      modDescription: "Cooldown",
      modSuffix: "s",
      changePrefix: "-",
      priceBase: 80,
      priceIncrease: 10,
      baseValue: 40,
      modifier: 0.02,
      visibleAtZone: 25,
      tooltip: "Reduce multistrike cooldown by 2%",
    },
    {
      id: "beat",
      title: "Stalactide",
      modDescription: "Click Damage",
      modSuffix: "%",
      changePrefix: "+",
      priceBase: 100,
      priceIncrease: 20,
      baseValue: 3,
      modifier: 0.2,
      visibleAtZone: 30,
      tooltip: "Increase Stalactide damage by 20%",
    },

    // { id: "health", title: "Health", basePrice: 2, additiveInc: 1, modifier: 0.05, unlocked: true, tooltip: "" },
  ],
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
    return atLevel !== 0 ? upgrade.baseValue * Math.pow(1 - upgrade.modifier, atLevel) : 0
  },

  // Extended balance config
  critMultiplier: 2.5,
} as const

export const playerCalc: PlayerCalc = {
  clickDamage: (clickLevel, clickOTPUpgradeCount, pDamage, achievementModifier): number =>
    clickLevel * Math.pow(2, clickOTPUpgradeCount) * pDamage * achievementModifier,
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
