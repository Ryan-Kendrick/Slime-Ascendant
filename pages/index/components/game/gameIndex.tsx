import React from "react"
import {
  decreaseGold,
  increaseClickDamage,
  incrementClickLevel,
  selectClickLevel,
  selectGold,
} from "../../../../redux/playerSlice"
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks"
import { upgradeCost } from "../../../../gameconfig/upgrades"

export default function Game() {
  const gold = useAppSelector(selectGold)
  const clickLevel = useAppSelector(selectClickLevel)
  const dispatch = useAppDispatch()

  const clickUpgradeCost = upgradeCost.clickCost(clickLevel)

  function upgradeHandler(e: React.MouseEvent<HTMLButtonElement>) {
    const upgradeName = e.currentTarget.id
    switch (upgradeName) {
      case "click-damage":
        if (gold >= clickUpgradeCost) {
          dispatch(incrementClickLevel())
          dispatch(increaseClickDamage(1))
          dispatch(decreaseGold(clickUpgradeCost))
        } // Do I need an upgrade slice?
    }
  }

  return (
    <div className="flex flex-col basis-3/5 bg-gradient-to-b from-amber-300 to-amber-950">
      <div id="gold-cont" className="flex basis-1/6 relative">
        <div className="absolute flex items-center gap-1 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <img className="w-1/2 " src="/coin-icon.png" alt="gold coin" />
          <div className="text-3xl">{gold}</div>
        </div>
      </div>
      {/* Upgrades elements need to be pulled out into their own components, this is stanky already */}
      <div className="divide-y-2 divide-slate-500">
        <div className="flex w-full items-start justify-between align-start py-4 px-4">
          <div className="flex flex-col items-center">
            <div>Click Damage</div>
            <div>{clickLevel}</div>
          </div>
          <button
            id="click-damage"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
            onClick={upgradeHandler}>
            Level up {clickUpgradeCost}
          </button>
        </div>
        <div className="flex w-full items-start justify-between align-start py-4 px-4">
          <div>Placeholder</div>
          <button
            id="placeholder"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
            onClick={upgradeHandler}>
            Placeholder
          </button>
        </div>
        <div className="flex w-full items-start justify-between align-start py-4 px-4">
          <div>Placeholder</div>
          <button
            id="placeholder"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
            onClick={upgradeHandler}>
            Placeholder
          </button>
        </div>
      </div>
    </div>
  )
}
