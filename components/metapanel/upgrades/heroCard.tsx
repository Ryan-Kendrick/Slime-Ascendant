import clsx from "clsx/lite"
import { useEffect, useState, useRef } from "react"
import { useAppDispatch, useAppSelector } from "../../../redux/hooks"
import {
  initialiseElement,
  selectGCanAfford,
  setActiveHero,
  selectPMod,
  selectAchievementModifier,
} from "../../../redux/playerSlice"
import OneTimePurchaseUpgrade from "./oneTimePurchase"
import { UPGRADE_CONFIG } from "../../../gameconfig/upgrades"
import { Upgrade, UpgradeIdWithLevel, HeroName, UpgradeId } from "../../../models/upgrades"
import LevelUpButton from "./levelUpButton"
import { selectCurrentZoneNumber } from "../../../redux/zoneSlice"
import { initSelectorMap } from "../../../gameconfig/utils"
import { cardProps } from "../../../gameconfig/heroCard"

interface HeroCardProps {
  config: Upgrade
  OTPIcons: JSX.Element[]
  onUpgrade: (id: UpgradeId, hidden: boolean, cost: number, isAffordable: boolean) => void
  onLevelUp: (e: React.MouseEvent<HTMLButtonElement>) => void
}

export default function HeroCard({ config, OTPIcons: OTPIcons, onUpgrade, onLevelUp }: HeroCardProps) {
  const dispatch = useAppDispatch()
  const [upgradeName] = config.elementId.split("-")
  const thisHeroName = upgradeName as HeroName

  const thisHero = cardProps[thisHeroName]
  const level = useAppSelector(thisHero.level)
  const upgradeCount = useAppSelector(thisHero.upgradeCount)
  const damage = useAppSelector(thisHero.damage)
  const levelUpCost = useAppSelector(thisHero.levelUpCost)

  const canAffordLevelUp = useAppSelector(selectGCanAfford(levelUpCost))
  const nextOTPCost = UPGRADE_CONFIG.calcOTPCost(config.elementId, upgradeCount)
  const canAffordNextOTPUpgrade = useAppSelector(selectGCanAfford(nextOTPCost))

  const currentZoneNumber = useAppSelector(selectCurrentZoneNumber)
  const upgradeMod = config.OneTimePurchases.OTPModifiers.reduce((acc, cur, i) => {
    if (upgradeCount > i) return acc + cur
    return acc
  }, 0)

  const prestigeMod = useAppSelector(selectPMod)
  const achievementMod = useAppSelector(selectAchievementModifier)

  const [shouldMount, setShouldMount] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [animationComplete, setAnimationComplete] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const OTPContainerRef = useRef<HTMLDivElement>(null)

  const isNotAdventurer = upgradeName !== "adventurer"
  const thisSelector = isNotAdventurer ? initSelectorMap[thisHeroName] : null
  const heroInitState = useAppSelector(thisSelector ?? (() => undefined))
  const hasInitialised = isNotAdventurer ? thisSelector && heroInitState : true

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const updateOTPIconPositions = () => {
    if (!OTPContainerRef.current) return

    const container = OTPContainerRef.current
    const items = container.getElementsByClassName("upgrade-item")
    const containerWidth = container.offsetWidth
    const containerHeight = container.offsetHeight
    const itemWidth = 36
    const itemGap = 8

    Array.from(items).forEach((item, index) => {
      const element = item as HTMLElement
      const basePosition = 0
      element.style.left = `${basePosition}px`

      if (element.classList.contains("purchased") && isMobile) {
        const rightEdgePosition = containerWidth - itemWidth - index * (itemWidth + itemGap) + 4

        const xTravelDistance = rightEdgePosition - basePosition

        element.style.transform = `translateX(${xTravelDistance}px)`
      } else if (element.classList.contains("purchased")) {
        const rightEdgePosition = containerWidth - itemWidth - index * (itemWidth + itemGap)
        const bottomEdgePosition = containerHeight - itemWidth

        const xTravelDistance = rightEdgePosition - basePosition
        const yTravelDistance = bottomEdgePosition

        element.style.transform = `translate(${xTravelDistance}px,${yTravelDistance}px)`
      } else {
        element.style.transform = ""
      }
    })
  }

  useEffect(() => {
    if (!OTPContainerRef.current) return

    requestAnimationFrame(updateOTPIconPositions)

    const resizeObserver = new ResizeObserver(() => requestAnimationFrame(updateOTPIconPositions))
    resizeObserver.observe(OTPContainerRef.current)

    return () => resizeObserver.disconnect()
  }, [upgradeCount, OTPIcons.length, isMobile, shouldMount])

  useEffect(() => {
    if (isNotAdventurer) {
      if (hasInitialised) setAnimationComplete(true)
      if (animationComplete && !hasInitialised) dispatch(initialiseElement(thisHeroName))
    }

    if (currentZoneNumber >= config.visibleAtZone && !shouldMount) {
      setShouldMount(true)
      const fadeinTimeout = setTimeout(() => {
        setIsVisible(true)
        dispatch(setActiveHero(thisHeroName))
        const preventFurtherAnimations = setTimeout(() => {
          setAnimationComplete(true)
        }, 500)
        return () => clearTimeout(preventFurtherAnimations)
      }, 350)
      return () => clearTimeout(fadeinTimeout)
    }
  }, [currentZoneNumber, config.visibleAtZone, hasInitialised, animationComplete])

  const [isHovering, setIsHovering] = useState(false)
  const [beginDelayedAnimation, setBeginDelayedAnimation] = useState(false)
  const [hoveredOTPUpgrade, setHoveredOTPUpgrade] = useState<number | null>(null)
  const hoverAnimationDuration = "duration-500"
  const delayedAnimationRef = useRef<NodeJS.Timeout | null>(null)

  const onCardHover = () => {
    const animationDuration = Number(hoverAnimationDuration.split("-")[1])

    setIsHovering(true)
    delayedAnimationRef.current = setTimeout(() => {
      setBeginDelayedAnimation(true)
    }, animationDuration / 2)
  }

  const onCardMouseExit = () => {
    if (delayedAnimationRef.current) {
      clearTimeout(delayedAnimationRef.current)
      delayedAnimationRef.current = null
    }
    setBeginDelayedAnimation(false)
    setIsHovering(false)
  }

  const purchaseUpgradeFromLevelUpBtn = () => {
    onUpgrade(config.elementId, false, nextOTPCost, canAffordNextOTPUpgrade)
  }

  const onOTPHover = (hoveredUpgrade: number | null) => {
    setHoveredOTPUpgrade(hoveredUpgrade)
  }

  if (!shouldMount && isNotAdventurer) return null

  return (
    <div
      className={clsx(
        "flex flex-col shadow-panel rounded-b border-2 text-white",
        !animationComplete && "transition-opacity duration-1000",
        canAffordNextOTPUpgrade && level > 10 ? "border-gold" : "border-yellow-700",
        !animationComplete && !isVisible && isNotAdventurer && "opacity-0",
        isVisible && isNotAdventurer && "opacity-100",
        animationComplete && "opacity-100",
      )}
      onPointerEnter={onCardHover}
      onMouseLeave={onCardMouseExit}>
      {/* Title section */}
      <div
        className={clsx(
          `flex flex-col place-content-center grow text-center font-outline border-b border-amber-950 transition-all relative ${cardProps[thisHeroName].cardBackground}`,
          "before:absolute before:inset-0 before:transition-opacity before:duration-500 before:z-0",
          isHovering && `${thisHero.backgroundImage}`,
          isHovering ? "before:opacity-100" : "before:opacity-0",
        )}>
        <div
          className={clsx(
            "transition-transform h-full",
            hoverAnimationDuration,
            isHovering ? "translate-y-0" : "translate-y-[calc(100%-2rem)]",
          )}>
          <h2
            className={clsx(
              "text-2xl bg-black transition-colors",
              hoverAnimationDuration,
              beginDelayedAnimation ? "bg-opacity-60" : "bg-opacity-0",
            )}>
            {config.displayName}
          </h2>
        </div>
        <div
          className={clsx(
            `transition-transform ${hoverAnimationDuration} font-paytone text-lg h-full`,
            isHovering ? "translate-y-[calc(101%)]" : "translate-y-0",
          )}>
          <h3 className="inline">{config.displayStat}:</h3> {Math.round(damage)}
        </div>
        <div
          className={clsx(
            "absolute h-full w-full transition-opacity ease-in",

            isHovering ? `opacity-100 ${hoverAnimationDuration}` : "opacity-0 duration-150",
          )}>
          <div className="flex mt-[1.05rem] h-full items-center">
            {hoveredOTPUpgrade ? (
              config.OneTimePurchases.OTPDescriptions[hoveredOTPUpgrade - 1]
            ) : (
              <div className="self-center divide-y-2 w-full divide-amber-900 font-passion text-lg">
                <div className="">
                  <div className="flex justify-between translate-y-1">
                    <h4>Level</h4>
                    <p>{level}</p>
                  </div>
                </div>
                <div className="">
                  <div className="flex justify-between translate-y-1">
                    <h4>Upgrade Multiplier</h4>
                    <p>x{upgradeMod.toFixed(2)}</p>
                  </div>
                </div>
                {prestigeMod > 1 && (
                  <div className="">
                    <div className="flex justify-between translate-y-1">
                      {" "}
                      <h4>Prestige</h4>
                      <p>x{prestigeMod}</p>
                    </div>
                  </div>
                )}
                <div className="">
                  <div className="flex justify-between translate-y-">
                    {" "}
                    <h4>Achievements</h4>
                    <p>+{Math.round(achievementMod * 100)}%</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Upgrades & Levelup section */}
      <div
        className={clsx(
          "flex flex-col md:flex-row items-center py-4 px-2 md:px-4 gap-2 transition-all",
          hoverAnimationDuration,
          isHovering && "mt-4",
        )}>
        <div
          ref={OTPContainerRef}
          className="upgrade-container relative grow h-full w-full min-h-10 flex self-start md:w-64 2xl:w-72 text-white font-outline">
          {OTPIcons.map((icon, i) => {
            const isPurchased = upgradeCount > i
            const isHidden = i === 0 ? level < 10 : upgradeCount < i

            return (
              <div
                key={upgradeName + i}
                className={clsx(
                  "upgrade-item absolute transition-transform",
                  // Quick slide animation on desktop
                  isMobile ? "duration-500" : "duration-300",
                  isPurchased && "purchased",
                )}>
                <OneTimePurchaseUpgrade
                  id={`${config.elementId}.${i + 1}` as UpgradeIdWithLevel}
                  onClick={onUpgrade}
                  setHoveredOTPDescription={onOTPHover}
                  icon={icon}
                  hidden={isHidden}
                  cost={nextOTPCost}
                  isAffordable={canAffordNextOTPUpgrade}
                  isPurchased={isPurchased}
                />
              </div>
            )
          })}
        </div>
        <LevelUpButton
          id={upgradeName}
          onLevelUp={onLevelUp}
          currentLevel={level}
          levelUpCost={levelUpCost}
          isAffordable={canAffordLevelUp}
          hoveredOTPUpgrade={hoveredOTPUpgrade}
          nextOTPCost={nextOTPCost}
          purchaseOTPUpgrade={purchaseUpgradeFromLevelUpBtn}
        />
      </div>
    </div>
  )
}
