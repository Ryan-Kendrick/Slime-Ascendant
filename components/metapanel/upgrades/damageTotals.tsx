import { formatSmallNumber } from "../../../gameconfig/utils"
import { useAppSelector } from "../../../redux/hooks"
import { selectClickDamage, selectDotDamage, selectPrestigeTabVisible } from "../../../redux/playerSlice"

export default function DamageTotals() {
  const clickDamage = useAppSelector(selectClickDamage)
  const dotDamage = useAppSelector(selectDotDamage)
  const displayClickDamage = formatSmallNumber(clickDamage)
  const displayDotDamage = formatSmallNumber(dotDamage)

  const hasPrestiged = useAppSelector(selectPrestigeTabVisible)

  if (!dotDamage && !hasPrestiged) return null

  return (
    <div className="relative">
      <div className="mb-2 h-28 flex">
        <div className="flex flex-col mt-auto text-white items-center justify-end w-full">
          <h2 className="text-3xl font-outline z-10">Total</h2>
          <div className="flex text-lg w-full z-10 justify-evenly font-outline">
            <h3>Click Damage: {displayClickDamage}</h3>
            <h3>Passive Damage: {displayDotDamage}</h3>
          </div>
        </div>
      </div>
      <div className="absolute shadow-panel-main inset-0 z-0 bg-gradient-to-r from-cyan-300 via-cyan-400 to-emerald-500" />
    </div>
  )
}
