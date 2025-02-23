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
        "absolute flex items-center justify-center right-3 top-1 rounded-full w-11 h-11 z-10 bg-gradient-to-tr cursor-active",
        isFarming ? "from-yellow-500/30 via-orange-500/30 to-white/80" : "from-yellow-500 via-orange-500 to-white/80",
      )}>
      <div
        className={clsx(
          "flex items-center justify-center w-9 h-9 bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-gold via-lightgold to-white/50 rounded-full overflow-hidden",
        )}>
        <div
          className={clsx(
            "w-[1.8rem] h-[1.8rem]",
            isFarming ? "fill-gray-700 border-gray-700 opacity-60" : "fill-islam border-gray-100",
          )}
          onClick={handleFarmToggle}>
          {FarmToggleIcon()}
        </div>
      </div>
    </div>
  )
}
