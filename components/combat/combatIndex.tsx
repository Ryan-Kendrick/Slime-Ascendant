import { PropsWithChildren, useEffect, useState } from "react"
import clsx from "clsx/lite"
import { useAppSelector } from "../../redux/hooks"
import { selectCurrentZoneNumber } from "../../redux/zoneSlice"
import Healthbar from "./healthbar"
import Monster from "./monster"
import ZoneMap from "./zoneMap"
import ZoneSelector from "./zoneSelector"
import FarmToggle from "./farmToggle"
import Spotlight from "../miscellanious/Spotlight"
import { selectPrestigeCount } from "../../redux/statsSlice"

export default function CombatIndex({ children }: PropsWithChildren) {
  const currentZoneNumber = useAppSelector(selectCurrentZoneNumber)

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
    <div className="relative flex flex-col lg:min-h-[822px] xl:min-h-[753px] lg:basis-2/5 text-white">
      {/* Background */}

      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute h-full w-full lg:w-auto -translate-x-[15%] lg:-translate-x-[10%] xl:-translate-x-[20%] translate-y-[20%] scale-[1.5] lg:scale-[1.55] xl:scale-[1.6] 2xl:scale-[1.7] aspect-square lg:aspect-[4/5] rounded-full bg-gradient-to-b from-yellow-400 to-orange-600 blur-3xl" />
        <div className="absolute h-full w-full lg:w-auto bg-gradient-to-r from-purple-700 to-violet-900 aspect-square lg:aspect-[4/5] rounded-full blur-3xl scale-[1.5] lg:scale-[1.45] xl:scale-[1.5] 2xl:scale-[1.6]" />

        <Spotlight />
      </div>

      <div
        className={clsx(
          "flex flex-col h-full w-full items-center relative overflow-hidden z-0",
          currentZoneNumber > 4 ? "justify-normal" : "justify-evenly",
        )}>
        {/* Absolutely positioned content container to ignore bg overflow */}
        <div className="static lg:absolute inset-0">
          <div className="flex flex-col h-full w-full items-center">
            {currentZoneNumber > 4 && (
              <div
                className={clsx(
                  "flex w-full xl:px-2 justify-center opacity-0 duration-1000",
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
      <div className="hidden lg:block items-between">{children}</div>
    </div>
  )
}
