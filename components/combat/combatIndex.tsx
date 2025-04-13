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
import Spotlight from "../miscellanious/Spotlight"

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
    <div className="relative lg:min-h-[822px] xl:min-h-[753px] lg:basis-2/5 text-white">
      {/* Background */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute h-full w-full bg-gradient-to-r from-purple-700 to-violet-900 aspect-square rounded-full blur-3xl scale-[1.6]" />
        <Spotlight />
      </div>

      <div
        className={clsx(
          "flex flex-col h-full w-full items-center relative overflow-hidden z-0",
          currentZoneNumber > 4 ? "justify-normal" : "justify-evenly",
        )}>
        {/* Absolutely positioned content container to ignore background */}
        <div className="static lg:absolute inset-0">
          <div className="flex flex-col h-full w-full items-center">
            {currentZoneNumber > 4 && (
              <div
                className={clsx(
                  "flex w-full justify-center opacity-0 duration-1000",
                  shouldMount ? "transition-opacity" : "transition-none",
                  fadeIn && "opacity-100",
                  hasFadedIn && "opacity-100 transition-none",
                )}>
                <ZoneSelector />
              </div>
            )}
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
      </div>
    </div>
  )
}
