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
  Object.entries(heroState).forEach(([hero, values]) => {
    levels += values.level
    upgrades += values.upgradeCount
  })
  const zone = useAppSelector(selectCurrentZoneNumber)
  const plasma = useAppSelector(selectPlasma)
  const achievementMod = Math.round(useAppSelector(selectAchievementModifier) * 100)
  const pendingUpgrades = useAppSelector(selectPendingPPurchases)
  console.log(pendingUpgrades)

  return (
    <div className="flex h-full flex-col">
      <h2 className="mb-4 self-center text-2xl font-bold">Go backwards to go forwards</h2>
      <div className="flex justify-around gap-4">
        <div className="flex flex-col">
          <ul className="text-red-600">
            <h3 className="mb-1 text-3xl font-bold"> You will lose</h3>
            <li className="text-lg">Gold</li>
            <li className="text-lg">Upgrades</li>
            <li className="text-lg">Zone progress</li>
          </ul>
        </div>
        <div className="flex flex-col">
          <ul className="text-amber-700">
            <h3 className="mb-1 text-3xl font-bold"> You will keep</h3>
            <li className="text-lg">Unspent plasma</li>
            <li className="text-lg">Achievements</li>
          </ul>
        </div>
        <div className="flex flex-col">
          <ul className="text-islam">
            <h3 className="mb-1 text-3xl font-bold"> You will gain </h3>
            <p className="text-lg">Prestige upgrades</p>
            {Object.entries(pendingUpgrades).length > 0 &&
              Object.entries(pendingUpgrades).map(([upgradeName, upgrade]) => (
                <li key={upgradeName} className="text-lg">
                  {upgradeName} x{upgrade.purchaseCount}
                </li>
              ))}
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
