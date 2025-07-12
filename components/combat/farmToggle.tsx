import clsx from "clsx/lite"
import { FarmToggleIcon } from "../svgIcons/metaIcons"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { selectIsFarming, toggleFarming } from "../../redux/zoneSlice"

export default function FarmToggle() {
  const dispatch = useAppDispatch()
  const isFarming = useAppSelector(selectIsFarming)

  function handleFarmToggle(e: React.MouseEvent<HTMLDivElement>) {
    dispatch(toggleFarming())
  }

  return (
    <div
      className={clsx(
        "absolute right-3 top-24 z-10 flex h-11 w-11 cursor-active items-center justify-center rounded-full bg-gradient-to-tr",
        isFarming ? "from-yellow-500/30 via-orange-500/30 to-white/80" : "from-yellow-500 via-orange-500 to-white/80",
      )}>
      <div
        className={clsx(
          "flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-gold via-lightgold to-white/50",
        )}>
        <div
          className={clsx(
            "h-[1.8rem] w-[1.8rem]",
            isFarming ? "border-gray-700 fill-gray-700 opacity-60" : "border-gray-100 fill-islam",
          )}
          onClick={handleFarmToggle}>
          {FarmToggleIcon()}
        </div>
      </div>
    </div>
  )
}
