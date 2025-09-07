import { useState } from "react"
import { PrestigeUpgrade, PrestigeUpgradeId } from "../../../models/upgrades"
import { prestigeUpgradeMap } from "../../../redux/shared/maps"
import { useAppSelector } from "../../../redux/hooks"
import { selectPCanAfford } from "../../../redux/playerSlice"
import { MinPlasmaIcon } from "../../svgIcons/resourceIcons"
import { selectAnimationPref } from "../../../redux/metaSlice"
import clsx from "clsx/lite"

interface PrestigeBtnProps {
  config: PrestigeUpgrade
  updateCart: (e: React.MouseEvent<HTMLButtonElement>, cost: number, purchaseCount: number) => void
  showToolTip: (id: PrestigeUpgradeId | null, e?: React.MouseEvent<HTMLButtonElement>) => void
  hidden: boolean
}

export default function PrestigeButton({ config, updateCart, showToolTip, hidden }: PrestigeBtnProps) {
  const animationPref = useAppSelector(selectAnimationPref)
  const fullAnimations = animationPref > 1

  const thisUpgradeName = config.id
  const thisUpgrade = prestigeUpgradeMap[thisUpgradeName]
  const upgradeCount = useAppSelector(thisUpgrade.selector)
  const pendingPurchases = useAppSelector(thisUpgrade.pendingPurchases || (() => ({ cost: 0, purchaseCount: 0 })))
  const { cost: totalCost, purchaseCount } = pendingPurchases || { cost: 0, purchaseCount: 0 }
  const costCalc = thisUpgrade.cost

  const [purchasePrice, setPurchasePrice] = useState(Math.ceil(costCalc(upgradeCount + purchaseCount + 1, config)))
  const isAffordable = useAppSelector(selectPCanAfford(purchasePrice))
  const canPurchase = isAffordable && !hidden

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
    if (!canPurchase) return

    const tempUpgradeCount = upgradeCount + toPurchase + 1
    const newTotalCost = purchasePrice + totalCost

    updateCart(e, newTotalCost, toPurchase + 1)
    setPurchasePrice(Math.ceil(thisUpgrade.cost(tempUpgradeCount + 1, config)))
  }
  return (
    <button
      key={thisUpgradeName}
      id={thisUpgradeName}
      onClick={(e) => {
        onSelectPrestigeUpgrade(e, upgradeCount, purchasePrice, purchaseCount)
      }}
      onMouseEnter={(e) => showToolTip(thisUpgradeName, e)}
      onMouseLeave={() => showToolTip(null)}
      className={clsx(
        "relative flex w-56 cursor-active items-center justify-center gap-2 rounded-lg border px-2 py-2 text-lg transition-[background-color,color,opacity] duration-300",
        canPurchase
          ? "border-cyan-500 bg-cyan-800/50 text-cyan-300 hover:border-frost"
          : "cursor-inactive border-black bg-cyan-800/50 text-gray-300/80",
        hidden && "button-hidden",
        isAffordable ? "affordable" : "unaffordable",
        fullAnimations ? "prestige-upgrade-btn" : "prestige-upgrade-btn-simple",
      )}>
      {hidden && (
        <div className={clsx("absolute z-10 flex h-full w-full items-center justify-center rounded-lg bg-black")}>
          <p className="font-bold text-red-500">Reach Zone {config.visibleAtZone}</p>
        </div>
      )}
      <div className="relative z-10 flex flex-col items-center">
        <h3 className="font-outline-electricBlue mb-1 text-3xl font-extrabold tracking-wide text-blue-200">
          {" "}
          {config.displayName}
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
            {<span className="m-0.5 self-center">{MinPlasmaIcon()}</span>}
            {purchasePrice}
          </span>
        </p>
      </div>
    </button>
  )
}
