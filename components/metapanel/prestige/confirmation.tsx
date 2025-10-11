import { UPGRADE_CONFIG } from "../../../gameconfig/upgrades"
import { PrestigeUpgradeId } from "../../../models/upgrades"
import { useAppSelector } from "../../../redux/hooks"
import { selectGold, selectPendingPPurchases, selectPlasma } from "../../../redux/playerSlice"
import { selectAchievementModifier, selectHeroState } from "../../../redux/shared/heroSelectors"
import { selectCurrentZoneNumber } from "../../../redux/zoneSlice"
import topologyURL from "../../../assets/icons/topologyBg.svg"
import clsx from "clsx/lite"

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
  const actuallyPendingUpgrades = Object.entries(pendingUpgrades).length > 0

  return (
    <div className="relative flex h-full flex-col overflow-hidden">
      <h2 className="mb-4 self-center border-b-2 border-frost text-2xl font-bold text-frost">
        Go backward to go forward
      </h2>
      <div className="grid grid-rows-[60%_1fr] gap-[80px] lg:block">
        <div className="grid grid-flow-col grid-cols-2 justify-around lg:grid-cols-3">
          <div className="flex flex-col">
            <ul className="loss">
              <h3 className="line-y-bottomright line-y-bottomleft text-shadow-long mb-1 text-center text-3xl font-bold text-red-500">
                You will lose
              </h3>
              <li className="line-x-bottom line-x-top flex justify-between p-1 text-lg text-frost">
                <h4>Gold</h4>
                <p className="font-bold text-red-500">{gold}</p>
              </li>
              <li className="line-x-bottom flex justify-between p-1 text-lg text-frost">
                <h4>Upgrades</h4>
                <p className="font-bold text-red-500">{upgrades}</p>
              </li>
              <li className="line-x-bottom flex justify-between p-1 text-lg text-frost">
                <h4>Zone progress</h4>
                <p className="font-bold text-red-500">{zone}</p>
              </li>
            </ul>
          </div>
          <div className="flex flex-col">
            <ul className="keep">
              <h3 className="line-y-bottomright line-x-bottom-fromright-mobile text-shadow-long mb-1 text-center text-3xl font-bold text-amber-500">
                You will keep
              </h3>
              <li className="line-x-bottom line-x-top flex justify-between p-1 text-lg text-frost">
                <h4>Unspent plasma</h4>
                <p className="font-bold text-amber-500">{unspentPlasma}</p>
              </li>
              <li className="line-x-bottom flex justify-between p-1 text-lg text-frost">
                <h4>Achievement Damage</h4>
                <p className="font-bold text-amber-500">+{achievementMod}%</p>
              </li>
            </ul>
          </div>
          <div className="flex hidden flex-col lg:block">
            <ul className="gain text-green-500">
              <h3 className="line-x-bottom-fromright text-shadow-long mb-1 text-center text-3xl font-bold">
                You will gain
              </h3>
              <li className="line-x-top line-y-right text-xl">
                <h4
                  className={clsx(
                    "line-x-bottom-fromright p-1 text-center font-extrabold tracking-wider",
                    actuallyPendingUpgrades
                      ? "font-outline-electricBlue text-shadow-dark"
                      : "font-outline-none text-shadow-none text-green-100/70",
                  )}>
                  Prestige upgrades
                </h4>
                {actuallyPendingUpgrades &&
                  Object.entries(pendingUpgrades).map(([upgradeName, upgrade]) => (
                    <li key={upgradeName} className="line-x-bottom mx-4 mt-2 flex justify-between text-lg">
                      <span className="font-outline-electricBlue mb-1 font-sans text-2xl font-extrabold tracking-wide text-white">
                        {UPGRADE_CONFIG.prestigeUpgrades[upgradeName as PrestigeUpgradeId].displayName}
                      </span>
                      <span className="self-end text-xl text-frost">x{upgrade.purchaseCount}</span>
                    </li>
                  ))}
              </li>
            </ul>
          </div>
        </div>
        <div className="block flex flex-col lg:hidden">
          <ul className="gain text-green-500">
            <h3 className="line-x-bottom-fromright line-y-left-mobile text-shadow-long mb-1 text-center text-3xl font-bold">
              You will gain
            </h3>
            <li className="line-x-top line-y-right text-xl">
              <h4
                className={clsx(
                  "line-x-bottom-fromright p-1 text-center font-extrabold tracking-wider",
                  actuallyPendingUpgrades
                    ? "font-outline-electricBlue text-shadow-dark"
                    : "font-outline-none text-shadow-none text-green-100/70",
                )}>
                Prestige upgrades
              </h4>
              {actuallyPendingUpgrades &&
                Object.entries(pendingUpgrades).map(([upgradeName, upgrade]) => (
                  <ul key={upgradeName}>
                    <li key={upgradeName} className="line-x-bottom mx-4 mt-2 flex justify-between text-lg">
                      <span className="font-outline-electricBlue mb-1 font-sans text-2xl font-extrabold tracking-wide text-white">
                        {UPGRADE_CONFIG.prestigeUpgrades[upgradeName as PrestigeUpgradeId].displayName}
                      </span>
                      <span className="self-end text-xl text-frost">x{upgrade.purchaseCount}</span>
                    </li>
                  </ul>
                ))}
            </li>
          </ul>
        </div>
      </div>
      <div className="mt-auto min-h-[120px] pt-7">
        <button
          onClick={() => initiatePrestige()}
          className="confirm-btn cursor-active self-start disabled:cursor-inactive">
          Confirm
        </button>
      </div>
      <div className="absolute -bottom-0 left-0 -z-10 h-96 w-96 -translate-x-1/4 translate-y-1/4">
        <img
          src={topologyURL}
          alt="Topology Background"
          className="h-full w-full animate-[pulse_4s_cubic-bezier(0.4,_0,_0.6,_1)_infinite] object-contain"
        />
      </div>
    </div>
  )
}
