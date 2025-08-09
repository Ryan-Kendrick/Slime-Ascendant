import { useEffect, useRef } from "react"
import { UPGRADE_CONFIG } from "../../../gameconfig/upgrades"
import { PrestigeUpgradeId } from "../../../models/upgrades"
import { useAppSelector } from "../../../redux/hooks"
import { selectGold, selectPendingPPurchases, selectPlasma } from "../../../redux/playerSlice"
import { selectAchievementModifier, selectHeroState } from "../../../redux/shared/heroSelectors"
import { selectCurrentZoneNumber } from "../../../redux/zoneSlice"

interface Props {
  initiatePrestige: () => void
}

export default function Confirmation({ initiatePrestige }: Props) {
  const gold = useAppSelector(selectGold)
  const heroState = useAppSelector(selectHeroState)
  let levels = 0
  let upgrades = 0
  Object.entries(heroState).forEach(([_, values]) => {
    levels += values.level
    upgrades += values.upgradeCount
  })
  const zone = useAppSelector(selectCurrentZoneNumber)
  const unspentPlasma = useAppSelector(selectPlasma)
  const achievementMod = Math.round(useAppSelector(selectAchievementModifier) * 100)
  const pendingUpgrades = useAppSelector(selectPendingPPurchases)

  return (
    <div className="flex h-full flex-col">
      <h2 className="mb-4 self-center text-2xl font-bold">Go backwards to go forwards</h2>
      <div className="flex justify-around">
        <div className="flex w-[26.4vw] flex-col">
          <ul className="loss text-red-600">
            <h3 className="line-y-bottomright line-y-bottomleft mb-1 text-3xl font-bold">You will lose</h3>
            <li className="line-x-bottom line-x-top flex justify-between text-lg">
              <h4>Gold</h4>
              <p>{gold}</p>
            </li>
            <li className="line-x-bottom flex justify-between text-lg">
              <h4>Upgrades</h4>
              <p>{upgrades}</p>
            </li>
            <li className="line-x-bottom flex justify-between text-lg">
              <h4>Zone progress</h4>
              <p>{zone}</p>
            </li>
          </ul>
        </div>
        <div className="flex w-[26.4vw] flex-col">
          <ul className="keep text-amber-700">
            <h3 className="line-y-bottomright mb-1 text-3xl font-bold">You will keep</h3>
            <li className="line-x-bottom line-x-top flex justify-between text-lg">
              <h4>Unspent plasma</h4>
              <p>{unspentPlasma}</p>
            </li>
            <li className="line-x-bottom flex justify-between text-lg">
              <h4>Achievement Damage</h4>
              <p>+{achievementMod}%</p>
            </li>
          </ul>
        </div>
        <div className="flex w-[26.4vw] flex-col">
          <ul className="gain text-islam">
            <h3 className="line-x-bottom-fromright mb-1 text-3xl font-bold">You will gain</h3>
            <li className="line-x-top line-y-right text-lg">
              <h4 className="line-x-bottom-fromright text-center">Prestige upgrades</h4>
              {Object.entries(pendingUpgrades).length > 0 &&
                Object.entries(pendingUpgrades).map(([upgradeName, upgrade]) => (
                  <li key={upgradeName} className="line-x-bottom mx-4 mt-2 flex justify-between text-lg">
                    <span className="font-outline-electricBlue font-sans text-2xl font-extrabold tracking-wide text-white">
                      {UPGRADE_CONFIG.prestigeUpgrades[upgradeName as PrestigeUpgradeId].displayName}
                    </span>
                    <span className="text-frost">x{upgrade.purchaseCount}</span>
                  </li>
                ))}
            </li>
          </ul>
        </div>
      </div>
      <div className="mt-auto">
        <button
          onClick={() => initiatePrestige()}
          className="my-4 h-16 w-40 cursor-active self-start rounded-lg border-2 border-white bg-red-600 font-sans text-2xl font-bold text-white disabled:cursor-inactive">
          Confirm
        </button>
      </div>
    </div>
  )
}
