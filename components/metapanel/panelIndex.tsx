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
import { selectBreakpoint } from "../../redux/metaSlice"

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
        top -= 347 // Minus px to gap + card height + 32px for mb-8 on adventurer card container
      }
      mask = "mask-postPrestige"
    } else if (!isMobile) {
      if (!isMageVisible && !isHealerVisible) {
        if (!oneLineMaskVisible || (!dotDamage && !prestigeTabVisible)) {
          // Wait for the cue from heroCard.tsx that the animations are in the right state & damageTotals component visible
          return null
        } else {
          chainImg.push("bg-chainsLeftBottom", "bg-chainsRightBottom")
          top -= 347 // Minus px to gap + card height
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
      console.log("THIS")
      elements.push(
        <React.Fragment key={1}>
          <div
            key={`left-${1}`}
            style={{ top: `${-36}px` }}
            className={clsx(
              `absolute h-full w-[311px] pointer-events-none`,
              "left-0  bg-no-repeat",
              "bg-chainsLeftBottom",
            )}
          />
          <div
            key={`right-${1}`}
            style={{ top: `${-36}px` }}
            className={clsx(
              `absolute h-full w-[311px] pointer-events-none`,
              "right-0  bg-no-repeat",
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
                  `absolute h-full w-[311px] pointer-events-none`,
                  "left-0  bg-no-repeat",
                  "bg-chainsLeftBottom",
                )}
              />
              <div
                key={`right-${i}`}
                style={{ top: `${-36}px` }}
                className={clsx(
                  `absolute h-full w-[311px] pointer-events-none`,
                  "right-0  bg-no-repeat",
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
                  `absolute h-full w-[311px] pointer-events-none`,
                  "left-0  bg-no-repeat",
                  "bg-chainsLeft",
                )}
              />
              <div
                key={`right-${i}`}
                style={{ top: `${top + 58}px` }}
                className={clsx(
                  `absolute h-full w-[311px] pointer-events-none`,
                  "right-0  bg-no-repeat",
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
                  `absolute h-full w-[311px] pointer-events-none`,
                  "left-0  bg-no-repeat",
                  "bg-chainsLeftPartial ",
                )}
              />
              <div
                key={`right-${i}`}
                style={{ top: `${top}px` }}
                className={clsx(
                  `absolute h-full w-[311px] pointer-events-none`,
                  "right-0  bg-no-repeat",
                  "bg-chainsRightPartial ",
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
      if (oneLineMaskVisible && !tabAnimationComplete) {
        const timeout = setTimeout(() => dispatch(incrementUIProgression()), 1100)
        return () => clearTimeout(timeout)
      }
    }
  }, [prestigeTabVisible])

  return (
    <div
      className={clsx(
        // Pseudo element background
        "before:absolute before:w-full before:h-full before:bg-gradient-to-r before:from-amber-950 before:to-amber-800 before:top-0 before:right-10 before:scale-[1.5] before:md:scale-[1.45] before:aspect-square before:rounded-full before:blur-3xl before:-z-10 before:pointer-events-none",

        "flex flex-col relative lg:basis-3/5 radius rounded-b-xl mx-2 lg:mx-3 md:mb-3 lg:my-0 duration-300",
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
              `absolute hidden md:block h-[150%] w-[311px] pointer-events-none`,
              "left-16  bg-no-repeat",
              maskClasses && maskClasses.chainImg[0],
            )}
          />
          <div
            style={{ top: `${maskClasses?.top}px` }}
            className={clsx(
              `absolute hidden md:block h-[150%] w-[311px] pointer-events-none`,
              "right-16  bg-no-repeat",
              maskClasses && maskClasses.chainImg[1],
            )}
          />
        </>
      )}
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
          "relative flex flex-col lg:min-w-[627px] shadow-panel-main rounded-t rounded-b-xl z-50",
          "bg-gradient-to-tr from-amber-400 via-orange-500 to-purpleOrange",
          "lg:bg-gradient-to-br lg:from-amber-400 lg:via-orange-500 lg:to-purpleOrange",
          maskClasses && maskClasses.mask,
        )}>
        {tabs.find((tab) => tab.id === activeTab)?.component}
      </div>
    </div>
  )
}
