import clsx from "clsx/lite"
import { useState } from "react"
import { PrestigeUpgrade } from "../../models/upgrades"
import { prestigeUpgradeMap } from "../../redux/shared/maps"
import { useAppSelector } from "../../redux/hooks"
import { selectPCanAfford } from "../../redux/playerSlice"
import { MinPlasmaIcon } from "../svgIcons/resourceIcons"
import e from "express"

interface PrestigeBtnProps {
  config: PrestigeUpgrade
  onClick: (e: React.MouseEvent<HTMLButtonElement>, cost: number, purchaseCount: number) => void
  hidden: boolean
}

export default function PrestigeButton({ config, onClick: onUpdatePurchase, hidden }: PrestigeBtnProps) {
  const thisUpgradeName = config.id
  const thisUpgrade = prestigeUpgradeMap[thisUpgradeName]
  const upgradeCount = useAppSelector(thisUpgrade.selector)
  const pendingPurchases = useAppSelector(thisUpgrade.pendingPurchases || (() => ({ cost: 0, purchaseCount: 0 })))
  const { cost: totalCost, purchaseCount } = pendingPurchases || { cost: 0, purchaseCount: 0 }
  const costCalc = thisUpgrade.cost

  const [purchasePrice, setPurchasePrice] = useState(Math.ceil(costCalc(upgradeCount + purchaseCount + 1, config)))
  const isAffordable = useAppSelector(selectPCanAfford(purchasePrice))

  const formatCurrentValue = (): string => {
    if (thisUpgradeName === "multistrike") return thisUpgrade.calcModifier(upgradeCount, config).toFixed(2)
    if (upgradeCount === 1) return (config.baseValue * 100).toFixed(0)
    if (upgradeCount > 1) return (thisUpgrade.calcModifier(upgradeCount, config) * 100).toFixed(0)
    return "0"
  }

  const formatPendingIncrease = (): string => {
    let pendingInc: number

    if (thisUpgradeName === "multistrike") {
      if (upgradeCount === 0 && purchaseCount === 1) {
        pendingInc = config.baseValue
      } else {
        const current = thisUpgrade.calcModifier(upgradeCount, config)
        const after = thisUpgrade.calcModifier(purchaseCount + upgradeCount, config)

        pendingInc = Math.round(current * 100 - after * 100) / 100
      }
    } else if (purchaseCount === 1 && upgradeCount === 0) {
      pendingInc = Math.round(config.baseValue * 100)
    } else if (upgradeCount === 0 && purchaseCount > 1) {
      pendingInc = Math.round(thisUpgrade.calcModifier(purchaseCount, config) * 100)
    } else {
      pendingInc = Math.round(thisUpgrade.calcModifierIncrease(purchaseCount, config) * 100)
    }

    return pendingInc.toFixed(2)
  }

  function onSelectPrestigeUpgrade(
    e: React.MouseEvent<HTMLButtonElement>,
    upgradeCount: number,
    purchasePrice: number,
    toPurchase: number,
  ) {
    const tempUpgradeCount = upgradeCount + toPurchase + 1
    const newTotalCost = purchasePrice + totalCost

    onUpdatePurchase(e, newTotalCost, toPurchase + 1)
    setPurchasePrice(Math.ceil(thisUpgrade.cost(tempUpgradeCount + 1, config)))
  }
  return (
    <button
      key={thisUpgradeName}
      id={thisUpgradeName}
      onClick={(e) => {
        onSelectPrestigeUpgrade(e, upgradeCount, purchasePrice, purchaseCount)
      }}
      disabled={!isAffordable || hidden}
      className={clsx(
        "relative flex w-56 cursor-active items-center justify-center gap-2 rounded-lg border border-cyan-500 bg-cyan-800/50 px-2 py-2 text-lg text-cyan-300 shadow-lg shadow-cyan-500/20 transition-all duration-300 disabled:cursor-inactive",
        "hover:bg-cyan-700/80 hover:shadow-cyan-500/40 disabled:border-black disabled:bg-cyan-800/50 disabled:text-gray-300/80 disabled:shadow-none",
      )}>
      {hidden && (
        <div className={clsx("absolute z-10 flex h-full w-full items-center justify-center rounded-lg bg-black")}>
          <p className="font-bold text-red-500">Reach Zone {config.visibleAtZone}</p>
        </div>
      )}
      <div className="relative flex flex-col items-center">
        <h3 className="font-outline-electricBlue mb-1 text-3xl font-extrabold tracking-wide text-blue-200">
          {" "}
          {config.title}
        </h3>
        <p>
          Level: {upgradeCount} {purchaseCount > 0 && `(+${purchaseCount})`}
        </p>
        <div>
          {upgradeCount > 0 && (
            <p>
              {config.modDescription}: {formatCurrentValue()}
              {config.modSuffix}
              {purchaseCount > 0 && (
                <span className="pl-1">
                  {upgradeCount === 0 && `${config.modDescription}: 0 `}
                  {thisUpgradeName === "multistrike" && upgradeCount === 0
                    ? `(+${Math.abs(Number(formatPendingIncrease()))}${config.modSuffix})` // Hack to display cooldown as a gain at level 0
                    : `(${config.changePrefix}${formatPendingIncrease()}${config.modSuffix})`}
                </span>
              )}
            </p>
          )}
        </div>
        <p className="flex">
          Price:{" "}
          <span className={clsx("flex font-bold", isAffordable ? "text-blue-200" : "text-red-500")}>
            {<span className="-mr-[0.18rem] self-center">{MinPlasmaIcon()}</span>}
            {purchasePrice}
          </span>
        </p>
      </div>
    </button>
  )
}

{
  /* alt style
<button
      key={config.id}
      id={config.id}
      onClick={(e) => {
        setToPurchase(toPurchase + 1)
        onPrestige(e, cost, isAffordable)
      }}
      disabled={!isAffordable}
      className={clsx(
        "relative w-56 cursor-active disabled:cursor-inactive font-extrabold bg-black text-white py-4 px-6 rounded-lg flex items-center justify-center gap-2 border-2 border-pink-500 shadow-lg shadow-pink-500/20 transition-[background-color,box-shadow] duration-300 overflow-hidden group",
        "hover:bg-gray-900 hover:shadow-pink-500/40",
      )}>
      <div
        className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 opacity-20 
            group-hover:opacity-30 transition-opacity"
      />
      <span className="text-xl relative z-10">
        {config.title} {upgradeCount} {toPurchase && toPurchase}
      </span>
    </button> */
}
