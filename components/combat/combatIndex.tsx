import { useEffect, useState } from "react"
import clsx from "clsx/lite"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { selectCurrentZoneNumber } from "../../redux/zoneSlice"
import Healthbar from "./healthbar"
import Monster from "./monster"
import ZoneMap from "./zoneMap"
import ZoneSelector from "./zoneSelector"
import { toggleDebugState } from "../../redux/playerSlice"
import { CookieEnjoyerIcon } from "../svgIcons/stageIcons"
import FarmToggle from "./farmToggle"

export default function CombatIndex() {
  const dispatch = useAppDispatch()
  const currentZoneNumber = useAppSelector(selectCurrentZoneNumber)

  function debug() {
    dispatch(toggleDebugState())
  }

  const [shouldMount, setShouldMount] = useState(false)
  const [fadeIn, setFadeIn] = useState(false)
  const [hasFadedIn, setHasFadedIn] = useState(false)

  useEffect(() => {
    if (currentZoneNumber > 5 && !hasFadedIn) {
      setHasFadedIn(true)
    } else if (currentZoneNumber > 4 && !shouldMount) {
      setShouldMount(true)
      const timeout = setTimeout(() => setFadeIn(true), 350)
      return () => clearTimeout(timeout)
    }
  }, [currentZoneNumber])

  return (
    <div className={clsx("flex flex-col lg:min-h-[822px] xl:min-h-[753px] lg:basis-2/5 text-white overflow-y-auto")}>
      {currentZoneNumber > 4 && (
        <div
          className={clsx(
            "flex justify-center opacity-0 duration-1000",
            shouldMount ? "transition-opacity" : "transition-none",
            fadeIn && "opacity-100",
            hasFadedIn && "opacity-100 transition-none",
          )}>
          <ZoneSelector />
        </div>
      )}
      <div
        className={clsx(
          "flex flex-col h-full items-center relative overflow-y-auto",
          currentZoneNumber > 4 ? "justify-normal" : "justify-evenly",
        )}>
        {/* <div className="absolute top-0 left-0 w-7 h-7 z-20 opacity-10 fill-white" onClick={debug}>
          {CookieEnjoyerIcon()}
        </div> */}
        {currentZoneNumber > 4 && (
          <div
            className={clsx(
              "opacity-0 duration-300",
              shouldMount ? "transition-opacity" : "transition-none",
              fadeIn && "opacity-100",
              hasFadedIn && "opacity-100 transition-none",
            )}>
            <FarmToggle />
          </div>
        )}
        <Monster>
          <Healthbar />
        </Monster>
        <ZoneMap />
      </div>
    </div>
  )
}
