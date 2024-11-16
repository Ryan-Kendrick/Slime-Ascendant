import { PlayerCalc, UpgradeConfig } from "../models/upgrades"

export const UPGRADE_CONFIG: UpgradeConfig = {
  click: {
    elementId: "clickMulti",
    costKey: "clickMultiCosts",
    costs: [100, 400, 1000],
    levelUpCost: (currentLevel) => Math.floor(10 * Math.pow(1.1, currentLevel) - 1),
  },
  dot: {
    elementId: "dotMulti",
    costKey: "dotMultiCosts",
    costs: [5000, 10000, 25000],
    levelUpCost: (currentLevel) => Math.floor(499 + 200 * currentLevel + Math.pow(1.2, currentLevel)),
  },
  calcMultiCost: function (upgradeName, upgradeCount) {
    const costs = {
      clickMulti: this.click.costs,
      dotMulti: this.dot.costs,
    }
    return costs[upgradeName][upgradeCount]
  },
}

export const playerCalc: PlayerCalc = {
  clickDamage: (clickLevel, clickMultiUpgradeCount) => clickLevel * Math.pow(2, clickMultiUpgradeCount),
  dotDamage: function (dotLevel, dotMultiUpgradeCount) {
    const damagePerSecond = dotLevel * Math.pow(2, dotMultiUpgradeCount)
    return damagePerSecond
  },
}
