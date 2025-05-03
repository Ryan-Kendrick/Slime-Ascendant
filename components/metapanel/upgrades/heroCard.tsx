import clsx from "clsx/lite"
import { useEffect, useState, useRef } from "react"
import { useAppDispatch, useAppSelector } from "../../../redux/hooks"
import {
  initialiseElement,
  selectGCanAfford,
  setActiveHero,
  incrementUIProgression,
  selectOneLineMaskVisible,
} from "../../../redux/playerSlice"
import { selectAchievementModifier } from "../../../redux/shared/heroSelectors"
import { selectPMod } from "../../../redux/shared/heroSelectors"
import OneTimePurchaseUpgrade from "./oneTimePurchase"
import { UPGRADE_CONFIG } from "../../../gameconfig/upgrades"
import { Upgrade, UpgradeIdWithLevel, HeroName, UpgradeId } from "../../../models/upgrades"
import LevelUpButton from "./levelUpButton"
import { selectCurrentZoneNumber } from "../../../redux/zoneSlice"
import { initSelectorMap } from "../../../redux/shared/maps"
import { cardProps } from "../../../redux/shared/maps"
import { selectBreakpoint } from "../../../redux/metaSlice"

interface HeroCardProps {
  config: Upgrade
  OTPIcons: JSX.Element[]
  onUpgrade: (id: UpgradeId, hidden: boolean, cost: number, isAffordable: boolean) => void
  onLevelUp: (e: React.MouseEvent<HTMLButtonElement>) => void
  touchedHero: HeroName | undefined
}

export default function HeroCard({ config, touchedHero, OTPIcons: OTPIcons, onUpgrade, onLevelUp }: HeroCardProps) {
  const dispatch = useAppDispatch()
  const [upgradeName] = config.elementId.split("-")
  const thisHeroName = upgradeName as HeroName

  const thisHero = cardProps[thisHeroName]
  const level = useAppSelector(thisHero.level)
  const OTPUpgradeCount = useAppSelector(thisHero.upgradeCount)
  const damageAtLevel = useAppSelector(thisHero.damageAtLevel)
  const damage = useAppSelector(thisHero.damage)
  const levelUpCost = useAppSelector(thisHero.levelUpCost)
  const totalDamageContribution = useAppSelector(thisHero.totalDamageContribution)

  const canAffordLevelUp = useAppSelector(selectGCanAfford(levelUpCost))
  const nextOTPCost = UPGRADE_CONFIG.calcOTPCost(config.elementId, OTPUpgradeCount)
  const canAffordNextOTPUpgrade = useAppSelector(selectGCanAfford(nextOTPCost))

  const currentZoneNumber = useAppSelector(selectCurrentZoneNumber)
  const upgradeMod = config.OneTimePurchases.OTPModifiers.reduce((acc, cur, i) => {
    if (OTPUpgradeCount > i) return acc + cur
    return acc
  }, 0)

  const prestigeMod = useAppSelector(selectPMod)
  const achievementMod = useAppSelector(selectAchievementModifier)

  const [shouldMount, setShouldMount] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [animationComplete, setAnimationComplete] = useState(false)
  const breakpoint = useAppSelector(selectBreakpoint)
  const isMobile = breakpoint === 768
  const OTPContainerRef = useRef<HTMLDivElement>(null)

  const isNotAdventurer = upgradeName !== "adventurer"
  const isWarriorVisible = currentZoneNumber >= UPGRADE_CONFIG.warrior.visibleAtZone
  const isHealerVisible = currentZoneNumber >= UPGRADE_CONFIG.healer.visibleAtZone
  const isMageVisible = currentZoneNumber >= UPGRADE_CONFIG.mage.visibleAtZone
  const thisSelector = isNotAdventurer ? initSelectorMap[thisHeroName] : null
  const heroInitState = useAppSelector(thisSelector ?? (() => undefined))
  const hasInitialised = isNotAdventurer ? thisSelector && heroInitState : true
  const oneLineMaskVisible = useAppSelector(selectOneLineMaskVisible)

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
  }, [OTPUpgradeCount, OTPIcons.length, isMobile, shouldMount])

  useEffect(() => {
    if (isNotAdventurer) {
      if (hasInitialised) {
        setAnimationComplete(true)
        setIsVisible(true)
      }

      if (animationComplete && !hasInitialised) dispatch(initialiseElement(thisHeroName))
    }

    if (currentZoneNumber >= config.visibleAtZone && !shouldMount) {
      setShouldMount(true)
      const fadeinTimeout = setTimeout(() => {
        setIsVisible(true)
        dispatch(setActiveHero(thisHeroName))
        let allTransitionsTimeout = null as null | NodeJS.Timeout
        if (thisHeroName === "warrior") {
          if (!oneLineMaskVisible) {
            allTransitionsTimeout = setTimeout(() => dispatch(incrementUIProgression()), 1215)
          }
        }
        const preventFurtherAnimations = setTimeout(() => {
          setAnimationComplete(true)
        }, 1215)
        return () => [
          clearTimeout(preventFurtherAnimations),
          allTransitionsTimeout && clearTimeout(allTransitionsTimeout),
        ]
      }, 350)
      return () => clearTimeout(fadeinTimeout)
    }
  }, [currentZoneNumber, config.visibleAtZone, hasInitialised, animationComplete])

  const touchHoverActive = touchedHero === thisHeroName
  const [isHovering, setIsHovering] = useState(touchHoverActive ? true : false)
  const [beginDelayedAnimation, setBeginDelayedAnimation] = useState(false)
  const [hoveredOTPUpgrade, setHoveredOTPUpgrade] = useState<number | null>(null)
  const hoverAnimationDuration = "duration-500"
  const delayedAnimationRef = useRef<NodeJS.Timeout | null>(null)

  const displayDamageTable = () => {
    const animationDuration = Number(hoverAnimationDuration.split("-")[1])

    setIsHovering(true)

    if (delayedAnimationRef.current) {
      clearTimeout(delayedAnimationRef.current)
    }

    delayedAnimationRef.current = setTimeout(() => {
      setBeginDelayedAnimation(true)
    }, animationDuration / 2)
  }

  const onCardTouch = (e: React.TouchEvent) => {
    // Prevent on mouse leave event from firing
    e.preventDefault()
    const isOTPUpgrade = e.currentTarget.id.split("-")[1].substring(0, 3) === "otp"

    if (hoveredOTPUpgrade && !isOTPUpgrade) {
      setHoveredOTPUpgrade(null)
    } else {
      displayDamageTable()
    }
  }

  const hideDamageTable = () => {
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

  useEffect(() => {
    if (touchedHero === thisHeroName) {
      displayDamageTable()
    } else if (isHovering) {
      hideDamageTable()
    }
  }, [touchedHero])

  if (!shouldMount && isNotAdventurer) return null

  const heroAnimationStart = {
    adventurer: clsx(
      "transition-transform duration-700",
      isWarriorVisible ? "-left-96 max-w-none m-0 translate-x-96" : "m-auto m-auto max-w-[567px] left-0",
    ),
    warrior:
      "transition-all transform duration-[1200ms] absolute right-0 translate-x-full pointer-events-none ease-out",
    healer: "transition-all duration-[1200ms] absolute left-0 -translate-x-full pointer-events-none ease-out",
    mage: "transition-all duration-[1200ms] absolute right-0 translate-x-full pointer-events-none ease-out",
  }

  const heroPosition = {
    adventurer: "relative row-start-4 md:row-start-auto",
    warrior: "relative row-start-3 md:row-start-auto",
    healer: "relative row-start-2 md:row-start-auto",
    mage: "relative row-start-1 md:row-start-auto",
  }

  let isFirstCard = false

  if (isMobile) {
    if (thisHeroName === "warrior" && isWarriorVisible && !isHealerVisible) {
      isFirstCard = true
    } else if (thisHeroName === "healer" && isHealerVisible && !isMageVisible) {
      isFirstCard = true
    }
  }

  const beginningState = heroAnimationStart[thisHeroName]
  const gridPosition = heroPosition[thisHeroName]

  return (
    <div className={gridPosition}>
      {/* Card rounded corners mask */}
      {(isNotAdventurer || isWarriorVisible) && oneLineMaskVisible && (
        <>
          <div className="absolute rounded-full w-[6px] h-[6px] -bottom-0.5 -left-0.5 -z-10 bg-[#532105] md:bg-[#532105]" />
          <div
            className={clsx(
              "absolute rounded-full w-[6px] h-[6px] -bottom-0.5 -right-0.5 -z-10 bg-[#532105]",
              thisHeroName === "warrior" || thisHeroName === "mage" ? "md:bg-[#7D29B9]" : "md:bg-[#532105]",
            )}
          />
        </>
      )}
      <div
        id={`${thisHeroName}-card`}
        className={clsx(
          "hero-card relative flex flex-col shadow-panel border-2 rounded-b text-white h-[365px] md:h-[315px]",
          beginningState,
          touchHoverActive
            ? "border-white"
            : canAffordNextOTPUpgrade && level > 10
              ? "border-gold"
              : "border-yellow-700",
          !animationComplete && !isVisible && isNotAdventurer && "opacity-0",
          isVisible && isNotAdventurer && "opacity-100 transform-none",
          animationComplete && isNotAdventurer && "opacity-100 transition-none pointer-events-auto",
          // Negative margin to cancel gap-1 from unrendered Mage card
          isFirstCard ? "-mt-1 md:mt-0" : "mt-0",
        )}
        onMouseEnter={displayDamageTable}
        onTouchEnd={onCardTouch}
        onMouseLeave={hideDamageTable}>
        {/* Title section */}
        <div
          className={clsx(
            `flex flex-col place-content-center grow text-center font-outline border-b border-amber-950 transition-all relative ${thisHero.cardBackground}`,
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
              isHovering ? "translate-y-[calc(98%)]" : "translate-y-0",
            )}>
            <h3 className="inline">{config.displayStat}:</h3> {Math.round(damage)}
          </div>

          {/* OTP info on hover */}
          <div
            className={clsx(
              "absolute h-full w-full transition-opacity ease-in",

              isHovering ? `opacity-100 ${hoverAnimationDuration}` : "opacity-0 duration-150",
            )}>
            <div className={clsx("flex mt-8 pb-8 h-full items-center relative")}>
              <div
                className={clsx(
                  "absolute inset-0 w-full flex flex-col mt-2 transition-opacity duration-200",
                  hoveredOTPUpgrade ? "opacity-100" : "opacity-0",
                  hoveredOTPUpgrade ? "pointer-events-none" : "pointer-events-none",
                )}>
                {hoveredOTPUpgrade && (
                  <>
                    <div className="mb-4">
                      <h3 className="text-xl">{config.OneTimePurchases.OTPTitles[hoveredOTPUpgrade - 1]}</h3>
                    </div>
                    <div>
                      <p>{config.OneTimePurchases.OTPDescriptions[hoveredOTPUpgrade - 1]}</p>
                    </div>
                    <div>
                      <p>Cost: {config.OneTimePurchases.OTPCosts[hoveredOTPUpgrade - 1]}</p>
                    </div>
                  </>
                )}
              </div>

              {/*Damage calculation table  */}
              <div
                className={clsx(
                  "w-full font-passion text-xl transition-opacity duration-300",
                  hoveredOTPUpgrade ? "opacity-0" : "opacity-100",
                  hoveredOTPUpgrade ? "pointer-events-none" : "pointer-events-auto",
                )}>
                <div className="border-b-2 border-amber-900">
                  <div className="flex justify-between px-1 md:px-0.5 translate-y-0.5">
                    <h4>Base Damage</h4>
                    <p>{Math.round(damageAtLevel)}</p>
                  </div>
                </div>
                <div className="border-b-2 border-amber-900">
                  <div className="flex justify-between px-1 md:px-0.5 translate-y-0.5">
                    <h4>Upgrade Multiplier</h4>
                    <p>x{upgradeMod ? upgradeMod.toFixed(2) : "1.00"}</p>
                  </div>
                </div>
                {prestigeMod > 1 && (
                  <div className="border-b-2 border-amber-900">
                    <div className="flex justify-between px-1 md:px-0.5 translate-y-0.5">
                      <h4>Prestige</h4>
                      <p className="font-outline-electricblue">x{prestigeMod.toFixed(2)}</p>
                    </div>
                  </div>
                )}
                {achievementMod > 0 && (
                  <div className="border-b-2 border-amber-900">
                    <div className="flex justify-between px-1 md:px-0.5 translate-y-0.5">
                      <h4>Achievements</h4>
                      <p className="font-outline-gold text-black">+{Math.round(achievementMod * 100)}%</p>
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex text-3xl justify-between px-1 md:px-0.5 translate-y-1">
                    <h4>Total</h4>
                    <p className="">{Math.round(totalDamageContribution)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Upgrades & Levelup section */}
        <div
          className={clsx(
            "flex flex-col md:flex-row items-center py-2 px-2 md:px-4 gap-2 transition-all",
            hoverAnimationDuration,
            isHovering && "mt-4",
          )}>
          <div
            ref={OTPContainerRef}
            className="upgrade-container relative grow h-full w-full min-h-10 flex self-start md:w-64 2xl:w-72 text-white font-outline">
            {OTPIcons.map((icon, i) => {
              const isPurchased = OTPUpgradeCount > i
              const isHidden = i === 0 ? level < 10 : OTPUpgradeCount < i

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
                    setHoveredOTPUpgrade={setHoveredOTPUpgrade}
                    touchHandler={onCardTouch}
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
            OTPUpgradeCount={OTPUpgradeCount}
            nextOTPCost={nextOTPCost}
            purchaseOTPUpgrade={purchaseUpgradeFromLevelUpBtn}
          />
        </div>
      </div>
    </div>
  )
}
