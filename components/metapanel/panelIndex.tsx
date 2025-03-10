import { useEffect, useMemo, useRef, useState } from "react"
import UpgradeIndex from "./upgrades/upgradeIndex"
import clsx from "clsx/lite"
import Prestige from "./prestige"
import { TabData } from "../../models/player"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import {
  selectPrestigeTabVisible,
  selectTabInView,
  selectTabAnimationComplete,
  setTabInView,
  incrementUIProgression,
  selectOneLineMaskVisible,
} from "../../redux/playerSlice"
import { selectCurrentZoneNumber } from "../../redux/zoneSlice"
import { UPGRADE_CONFIG } from "../../gameconfig/upgrades"

export default function PanelIndex() {
  const dispatch = useAppDispatch()

  const currentZone = useAppSelector(selectCurrentZoneNumber)
  const activeTab = useAppSelector(selectTabInView)
  const prestigeTabVisible = useAppSelector(selectPrestigeTabVisible)
  const tabAnimationComplete = useAppSelector(selectTabAnimationComplete)
  const [isWarriorVisible, isHealerVisible] = [
    currentZone >= UPGRADE_CONFIG.warrior.visibleAtZone,
    currentZone >= UPGRADE_CONFIG.healer.visibleAtZone,
  ]
  const [tabHeight, setTabHeight] = useState(0)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const tabRef = useRef<HTMLDivElement>(null)
  const oneLineMaskVisible = useAppSelector(selectOneLineMaskVisible)

  const renderMask = (): undefined | Mask => {
    if (activeTab !== "upgrade") return undefined
    if (!isWarriorVisible) {
      return
    } else if (isWarriorVisible) {
      if (!isHealerVisible) {
        if (!oneLineMaskVisible) {
          // Wait for the cue from heroCard.tsx that the animations are in the right state
          return
        } else {
          return oneLineMask
        }
      } else {
        const isMobile = window.innerWidth <= 768
        return isMobile ? fullMobileMask : fullMask
      }
    }
  }

  const tabs = useMemo(() => {
    const tabsToRender: TabData[] = [
      {
        id: "upgrade",
        title: "Upgrade",
        component: <UpgradeIndex />,
      },
    ]

    if (prestigeTabVisible) {
      tabsToRender.push({
        id: "prestige",
        title: "Prestige",
        component: <Prestige />,
      })
    }

    return tabsToRender
  }, [prestigeTabVisible])

  useEffect(() => {
    if (tabRef.current) {
      setTabHeight(prestigeTabVisible ? tabRef.current.scrollHeight : 0)
      if (!tabAnimationComplete) {
        const timeout = setTimeout(() => dispatch(incrementUIProgression()), 1100)
        return () => clearTimeout(timeout)
      }
    }
  }, [prestigeTabVisible])

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <>
      <div
        className={clsx(
          // Base
          "flex flex-col relative lg:basis-3/5 radius rounded-b-xl mx-2 lg:mx-3 lg:my-0 transition-[padding] duration-300",
          !isWarriorVisible && "px-2 sm:px-4 md:px-8 xl:pr-14 2xl:pr-24",
        )}>
        <div
          style={{ height: `${tabHeight}px` }}
          className={clsx(tabAnimationComplete ? "transition-none" : "transition-[height] duration-1000")}>
          {prestigeTabVisible && (
            <div ref={tabRef} className="flex gap-1 h-12 w-full">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => dispatch(setTabInView(tab.id))}
                  className={clsx(
                    "flex items-center shadow-panel-t-1 w-full px-4 py-1.5 rounded-t-lg",
                    activeTab === tab.id
                      ? "bg-gradient-to-b from-amber-400 to-orange-500 border-[3px] border-amber-800 text-white cursor-inactive"
                      : "bg-gradient-to-b from-amber-600 to-orange-700 border-[3px] border-black/60 hover:from-amber-400/90 hover:to-orange-500/90 text-orange-900 cursor-active",
                  )}>
                  <h2 className="text-lg">{tab.title}</h2>
                </button>
              ))}
            </div>
          )}
        </div>
        <div
          id="panel-content"
          className={clsx(
            "flex flex-col lg:min-w-[627px] shadow-panel rounded-t rounded-b-xl z-50",
            "bg-gradient-to-tr from-amber-400 via-orange-500 to-purple-950",
            "lg:bg-gradient-to-br lg:from-amber-400 lg:via-orange-500 lg:to-purple-950",
          )}
          style={renderMask()}>
          {tabs.find((tab) => tab.id === activeTab)?.component}
        </div>
      </div>
    </>
  )
}

interface Mask {
  maskImage: string
  maskRepeat: string
  WebkitMaskRepeat: string
  maskComposite: string
  WebkitMaskComposite: string
}

// Values defined in style.css
const oneLineMask = {
  maskImage: `linear-gradient(
    to bottom,
    black 0px,
    black var(--mask-line1-start),
    transparent var(--mask-line1-start),
    transparent var(--mask-line1-end),
    black var(--mask-line1-end),
    black 100%
)`,
  WebkitMaskImage: `linear-gradient(
    to bottom,
    black 0px,
    black var(--mask-line1-start),
    transparent var(--mask-line1-start),
    transparent var(--mask-line1-end),
    black var(--mask-line1-end),
    black 100%
)`,

  maskRepeat: "no-repeat, no-repeat",
  WebkitMaskRepeat: "no-repeat, no-repeat",
  maskComposite: "intersect",
  WebkitMaskComposite: "source-in, xor",
}

const fullMask = {
  maskImage: `
  linear-gradient(
    to bottom,
    black 0px,
    black var(--mask-line1-start),
    transparent var(--mask-line1-start),
    transparent var(--mask-line1-end),
    black var(--mask-line1-end),
    black var(--mask-line2-start),
    transparent var(--mask-line2-start),
    transparent var(--mask-line2-end),
    black var(--mask-line2-end),
    black 100%
)`,
  WebkitMaskImage: `
  linear-gradient(
    to bottom,
    black 0px,
    black var(--mask-line1-start),
    transparent var(--mask-line1-start),
    transparent var(--mask-line1-end),
    black var(--mask-line1-end),
    black var(--mask-line2-start),
    transparent var(--mask-line2-start),
    transparent var(--mask-line2-end),
    black var(--mask-line2-end),
    black 100%
)`,

  maskRepeat: "no-repeat, no-repeat",
  WebkitMaskRepeat: "no-repeat, no-repeat",
  maskComposite: "intersect",
  WebkitMaskComposite: "source-in, xor",
}

const fullMobileMask = {
  maskImage: `
  linear-gradient(
    to bottom,
    black 0px,
    black var(--mask-line1-start),
    transparent var(--mask-line1-start),
    transparent var(--mask-line1-end),
    black var(--mask-line1-end),
    black var(--mask-line2-start),
    transparent var(--mask-line2-start),
    transparent var(--mask-line2-end),
    black var(--mask-line2-end),
    black var(--mask-line3-start),
    transparent var(--mask-line3-start),
    transparent var(--mask-line3-end),
    black var(--mask-line3-end),
    black var(--mask-line4-start),
    transparent var(--mask-line4-start),
    transparent var(--mask-line4-end),
    black var(--mask-line4-end),
    black 100%
)`,
  WebkitMaskImage: `
  linear-gradient(
    to bottom,
    black 0px,
    black var(--mask-line1-start),
    transparent var(--mask-line1-start),
    transparent var(--mask-line1-end),
    black var(--mask-line1-end),
    black var(--mask-line2-start),
    transparent var(--mask-line2-start),
    transparent var(--mask-line2-end),
    black var(--mask-line2-end),
    black var(--mask-line3-start),
    transparent var(--mask-line3-start),
    transparent var(--mask-line3-end),
    black var(--mask-line3-end),
    black var(--mask-line4-start),
    transparent var(--mask-line4-start),
    transparent var(--mask-line4-end),
    black var(--mask-line4-end),
    black 100%
)`,

  maskRepeat: "no-repeat, no-repeat",
  WebkitMaskRepeat: "no-repeat, no-repeat",
  maskComposite: "intersect",
  WebkitMaskComposite: "source-in, xor",
}
