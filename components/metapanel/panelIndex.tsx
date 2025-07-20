import React, { ReactNode, useEffect, useMemo, useRef, useState } from "react"
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
  selectDotDamage,
} from "../../redux/playerSlice"
import { selectCurrentZoneNumber } from "../../redux/zoneSlice"
import { UPGRADE_CONFIG } from "../../gameconfig/upgrades"
import { selectAnimationPref, selectBreakpoint } from "../../redux/metaSlice"

export default function PanelIndex() {
  const dispatch = useAppDispatch()

  const currentZone = useAppSelector(selectCurrentZoneNumber)
  const activeTab = useAppSelector(selectTabInView)
  const prestigeTabVisible = useAppSelector(selectPrestigeTabVisible)
  const tabAnimationComplete = useAppSelector(selectTabAnimationComplete)
  const breakpoint = useAppSelector(selectBreakpoint)
  const [isWarriorVisible, isHealerVisible, isMageVisible] = [
    currentZone >= UPGRADE_CONFIG.warrior.visibleAtZone,
    currentZone >= UPGRADE_CONFIG.healer.visibleAtZone,
    currentZone >= UPGRADE_CONFIG.mage.visibleAtZone,
  ]
  const [tabHeight, setTabHeight] = useState(0)
  const isMobile = breakpoint === 768
  const tabRef = useRef<HTMLDivElement>(null)
  const oneLineMaskVisible = useAppSelector(selectOneLineMaskVisible)
  const dotDamage = useAppSelector(selectDotDamage)
  const animationPref = useAppSelector(selectAnimationPref)

  interface MaskConfig {
    top: number
    chainImg: string[]
    mask: string
  }
  const getMaskState = (): MaskConfig | null => {
    let top = 200
    const chainImg = []
    let mask = ""

    if (activeTab !== "upgrade") return null
    if (!isWarriorVisible) {
      if (prestigeTabVisible) {
        chainImg.push("bg-chainsLeftBottom", "bg-chainsRightBottom")
        top -= 285
      }
      mask = "mask-postPrestige"
    } else if (!isMobile) {
      if (!isMageVisible && !isHealerVisible) {
        if (!oneLineMaskVisible || (!dotDamage && !prestigeTabVisible)) {
          // Wait for the cue from heroCard.tsx that the animations are in the right state & damageTotals component visible
          return null
        } else {
          chainImg.push("bg-chainsLeftBottom", "bg-chainsRightBottom")
          top -= 369
          mask = "mask-single"
        }
      } else if (isHealerVisible) {
        chainImg.push("bg-chainsLeft", "bg-chainsRight")
        mask = "mask-full"
      }
    } else {
      if (!isMageVisible && !isHealerVisible) {
        if (!oneLineMaskVisible || (!dotDamage && !prestigeTabVisible)) {
          return null
        } else {
          chainImg.push("bg-chainsLeft", "bg-chainsRight")
          mask = "mask-mobile-double"
        }
      } else if (!isMageVisible && isHealerVisible) {
        chainImg.push("bg-chainsLeft", "bg-chainsRight")
        mask = "mask-mobile-triple"
      } else {
        chainImg.push("bg-chainsLeft", "bg-chainsRight")
        mask = "mask-mobile-full"
      }
    }
    return { top, chainImg, mask }
  }
  const maskClasses = getMaskState()

  const renderMobileChains = (): ReactNode => {
    let j = 0
    const elements = []

    if (maskClasses && maskClasses.mask === "mask-mobile-full") {
      j = 4
    } else if (maskClasses && maskClasses.mask === "mask-mobile-triple") {
      j = 3
    } else if (maskClasses && maskClasses.mask === "mask-mobile-double") {
      j = 2
    }

    if (j === 0) {
      elements.push(
        <React.Fragment key={1}>
          <div
            key={`left-${1}`}
            style={{ top: `${-36}px` }}
            className={clsx(
              `pointer-events-none absolute h-full w-[311px]`,
              "left-0 bg-no-repeat",
              "bg-chainsLeftBottom",
            )}
          />
          <div
            key={`right-${1}`}
            style={{ top: `${-36}px` }}
            className={clsx(
              `pointer-events-none absolute h-full w-[311px]`,
              "right-0 bg-no-repeat",
              "bg-chainsRightBottom",
            )}
          />
        </React.Fragment>,
      )
    } else {
      for (let i = 0; i < j || j === 0; i++) {
        let top = 246 + i * 365 // px to gap plus card height
        if (!prestigeTabVisible) top -= 48

        if (j === 0) {
          elements.push(
            <React.Fragment key={i}>
              <div
                key={`left-${i}`}
                style={{ top: `(${-36}px` }}
                className={clsx(
                  `pointer-events-none absolute h-full w-[311px]`,
                  "left-0 bg-no-repeat",
                  "bg-chainsLeftBottom",
                )}
              />
              <div
                key={`right-${i}`}
                style={{ top: `${-36}px` }}
                className={clsx(
                  `pointer-events-none absolute h-full w-[311px]`,
                  "right-0 bg-no-repeat",
                  "bg-chainsRightBottom",
                )}
              />
            </React.Fragment>,
          )
          break
        }

        const drawFullMask = i === j - 2
        if (drawFullMask) {
          elements.push(
            <React.Fragment key={i}>
              <div
                key={`left-${i}`}
                style={{ top: `${top + 58}px` }}
                className={clsx(
                  `pointer-events-none absolute h-full w-[311px]`,
                  "left-0 bg-no-repeat",
                  "bg-chainsLeft",
                )}
              />
              <div
                key={`right-${i}`}
                style={{ top: `${top + 58}px` }}
                className={clsx(
                  `pointer-events-none absolute h-full w-[311px]`,
                  "right-0 bg-no-repeat",
                  "bg-chainsRight",
                )}
              />
            </React.Fragment>,
          )
          break
        } else {
          elements.push(
            <React.Fragment key={i}>
              <div
                key={`left-${i}`}
                style={{ top: `${top}px` }}
                className={clsx(
                  `pointer-events-none absolute h-full w-[311px]`,
                  "left-0 bg-no-repeat",
                  "bg-chainsLeftPartial",
                )}
              />
              <div
                key={`right-${i}`}
                style={{ top: `${top}px` }}
                className={clsx(
                  `pointer-events-none absolute h-full w-[311px]`,
                  "right-0 bg-no-repeat",
                  "bg-chainsRightPartial",
                )}
              />
            </React.Fragment>,
          )
        }
      }
    }

    return elements
  }

  const tabs = useMemo(() => {
    const tabsToRender: TabData[] = [
      {
        id: "upgrade",
        title: "Upgrade",
        component: <UpgradeIndex />,
        activeStyle: `before:bg-slate-500 before:absolute before:-left-2 before:-top-4 before:h-24 before:w-44 before:blur before:rotate-45 
          
          pb-[9px] bg-frost border-t-[3px] border-l-[3px] border-r-[3px] border-amber-700 text-white cursor-inactive`,
        inactiveStyle: `before:bg-slate-300 before:hover:bg-slate-400 before:absolute before:-left-4 before:-top-4 before:h-28 before:w-52 before:blur-lg before:rotate-45

        after:bg-frost after:absolute after:inset-0 after:-z-10

          bg-gradient-to-b from-amber-700/40 to-orange-800/40 border-[3px] border-black/60 hover:from-amber-600/10 hover:to-orange-700/10 hover:text-orange-800 text-orange-900 cursor-active`,
      },
    ]

    if (prestigeTabVisible) {
      tabsToRender.push({
        id: "prestige",
        title: "Prestige",
        component: <Prestige />,
        activeStyle: `before:bg-slate-500 before:absolute before:-left-2 before:-top-4 before:h-24 before:w-44 before:blur before:rotate-45

          pb-[9px] bg-frost border-t-[3px] border-l-[3px] border-r-[3px] border-amber-700 text-frost font-outline-electricBlue cursor-inactive`,
        inactiveStyle: `before:bg-slate-300 before:hover:bg-slate-400 before:absolute before:-left-4 before:-top-4 before:h-28 before:w-52 before:blur-lg before:rotate-45

        after:bg-frost after:absolute after:inset-0 after:-z-10 

          bg-gradient-to-b from-amber-700/40 to-orange-800/40 border-[3px] border-black/60 hover:from-amber-600/10 hover:to-orange-700/10 hover:text-orange-800 text-orange-900 cursor-active`,
      })
    }

    return tabsToRender
  }, [prestigeTabVisible])

  useEffect(() => {
    if (tabRef.current) {
      setTabHeight(prestigeTabVisible ? tabRef.current.scrollHeight : 0)
      if (oneLineMaskVisible && !tabAnimationComplete) {
        const timeout = setTimeout(() => dispatch(incrementUIProgression()), 1100)
        return () => clearTimeout(timeout)
      }
    }
  }, [prestigeTabVisible])

  return (
    <div className="relative mx-2 duration-300 md:mb-3 lg:mx-3 lg:my-0 lg:max-w-[59%] lg:basis-3/5">
      <div className="pointer-events-none absolute right-10 top-0 -z-20 aspect-square h-full w-full scale-[1.5] overflow-clip rounded-full bg-gradient-to-r from-amber-950 to-amber-800 blur-3xl md:scale-[1.45]" />
      <div
        className={clsx(
          "flex flex-col rounded-b-xl",
          !isWarriorVisible && "px-2 sm:px-4 md:px-8 xl:pr-14 2xl:pr-24",
          oneLineMaskVisible ? "transition-none" : "transition-[padding]",
        )}>
        {isMobile ? (
          renderMobileChains()
        ) : (
          <>
            <div
              style={{ top: `${maskClasses?.top}px` }}
              className={clsx(
                `pointer-events-none absolute hidden h-[150%] w-[311px] md:block`,
                "left-16 bg-no-repeat",
                maskClasses && maskClasses.chainImg[0],
              )}
            />
            <div
              style={{ top: `${maskClasses?.top}px` }}
              className={clsx(
                `pointer-events-none absolute hidden h-[150%] w-[311px] md:block`,
                "right-16 bg-no-repeat",
                maskClasses && maskClasses.chainImg[1],
              )}
            />
          </>
        )}
        <div
          style={{ height: `${tabHeight}px` }}
          className={clsx(tabAnimationComplete ? "transition-none" : "transition-[height] duration-1000")}>
          {prestigeTabVisible && (
            <div ref={tabRef} className="z-10 flex h-12 w-full gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => dispatch(setTabInView(tab.id))}
                  className={clsx(
                    "relative flex w-full items-center overflow-hidden rounded-t-lg px-4 py-1.5 shadow-panel-t-1",
                    activeTab === tab.id ? tab.activeStyle : tab.inactiveStyle,
                  )}>
                  <h2 className={clsx("z-10 text-xl", animationPref > 0 && "transition-color, duration-500")}>
                    {tab.title}
                  </h2>
                </button>
              ))}
            </div>
          )}
        </div>
        <div
          id="panel-content"
          className={clsx(
            "relative z-20 flex flex-col rounded-b-xl rounded-t lg:min-w-[627px]",
            "bg-gradient-to-tr from-amber-400 via-orange-500 to-purpleOrange",
            "lg:bg-gradient-to-br lg:from-amber-400 lg:via-orange-500 lg:to-purpleOrange",
            activeTab === "upgrade" && "shadow-panel-main",
            activeTab === "prestige" && "lg:shadow-panel-prestige",
            activeTab === "prestige" && "xl:shadow-panel-prestige-2",
            activeTab === "prestige" && "2xl:shadow-panel-prestige-3",
            maskClasses && maskClasses.mask,
          )}>
          {tabs.find((tab) => tab.id === activeTab)?.component}
        </div>
      </div>
    </div>
  )
}
