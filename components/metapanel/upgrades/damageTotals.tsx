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
        <div className="flex flex-col mt-auto font-arialBlack text-[#2c1810] items-center justify-end w-full">
          <h2 className="text-2xl z-10 text-shadow tracking-widest">TOTAL</h2>
          <div className="flex text-lg w-full z-10 justify-center gap-6">
            <h3>Click: {displayClickDamage}</h3>
            <span className="text-base mt-0.5 opacity-80">|</span>
            <h3>Passive: {displayDotDamage}</h3>
          </div>
        </div>
      </div>
      <div className="absolute shadow-panel-main inset-0 z-0 bg-gold" />
    </div>
  )
}
