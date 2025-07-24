import clsx from "clsx/lite"
import React, { useEffect, useState, useRef } from "react"
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
import { selectAnimationPref, selectBreakpoint, selectOTPPos, setOTPPos } from "../../../redux/metaSlice"
import { useOTPPositions } from "../../../gameconfig/customHooks"

interface HeroCardProps {
  config: Upgrade
  OTPIcons: JSX.Element[]
  onUpgrade: (id: UpgradeIdWithLevel, hidden: boolean, cost: number, isAffordable: boolean) => void
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
  const nextOTPCost = UPGRADE_CONFIG.calcOTPPrice(config.elementId, OTPUpgradeCount)
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
  const animationPref = useAppSelector(selectAnimationPref)
  const animationsEnabled = animationPref > 0

  const OTPContainerRef = useOTPPositions({
    heroName: thisHeroName,
    OTPUpgradeCount,
    iconsLength: OTPIcons.length,
    shouldMount,
  })

  const isNotAdventurer = upgradeName !== "adventurer"
  const isWarriorVisible = currentZoneNumber >= UPGRADE_CONFIG.warrior.visibleAtZone
  const isHealerVisible = currentZoneNumber >= UPGRADE_CONFIG.healer.visibleAtZone
  const isMageVisible = currentZoneNumber >= UPGRADE_CONFIG.mage.visibleAtZone
  const thisSelector = isNotAdventurer ? initSelectorMap[thisHeroName] : null
  const heroInitState = useAppSelector(thisSelector ?? (() => undefined))
  const hasInitialised = isNotAdventurer ? thisSelector && heroInitState : true
  const oneLineMaskVisible = useAppSelector(selectOneLineMaskVisible)

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
      dispatch(setActiveHero(thisHeroName))
      const fadeinTimeout = setTimeout(() => {
        setIsVisible(true)
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
  const [touchedOTPUpgrade, setTouchedOTPUpgrade] = useState<UpgradeIdWithLevel | null>(null)
  const hoverAnimationDuration = "duration-500"
  const delayedAnimationRef = useRef<NodeJS.Timeout | null>(null)

  const displayDamageTable = () => {
    const animationDuration = Number(hoverAnimationDuration.split("-")[1])

    setIsHovering(true)

    if (delayedAnimationRef.current) {
      clearTimeout(delayedAnimationRef.current)
    }

    if (animationsEnabled) {
      delayedAnimationRef.current = setTimeout(() => {
        setBeginDelayedAnimation(true)
      }, animationDuration / 2)
    } else {
      setBeginDelayedAnimation(true)
    }
  }

  const onCardTouch = (e: React.TouchEvent) => {
    // Prevent on mouse leave event from firing
    e.preventDefault()

    const isOTPUpgrade = e.currentTarget.id.split("-")[1].substring(0, 3) === "otp"

    if (isOTPUpgrade) setTouchedOTPUpgrade(e.currentTarget.id as UpgradeIdWithLevel)

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
    if (!touchedOTPUpgrade) return

    onUpgrade(touchedOTPUpgrade, false, nextOTPCost, canAffordNextOTPUpgrade)
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
          <div className="absolute -bottom-0.5 -left-0.5 -z-10 h-[6px] w-[6px] rounded-full bg-[#532105] md:bg-[#532105]" />
          <div
            className={clsx(
              "absolute -bottom-0.5 -right-0.5 -z-10 h-[6px] w-[6px] rounded-full bg-[#532105]",
              thisHeroName === "warrior" || thisHeroName === "mage" ? "md:bg-[#7D29B9]" : "md:bg-[#532105]",
            )}
          />
        </>
      )}
      <div
        id={`${thisHeroName}-card`}
        className={clsx(
          "hero-card relative flex h-[365px] flex-col rounded-b border-2 text-white shadow-panel md:h-[315px]",
          beginningState,
          touchHoverActive
            ? "border-white"
            : canAffordNextOTPUpgrade && level > 10
              ? "border-gold"
              : "border-yellow-700",
          !animationComplete && !isVisible && isNotAdventurer && "opacity-0",
          isVisible && isNotAdventurer && "transform-none opacity-100",
          animationComplete && isNotAdventurer && "pointer-events-auto opacity-100 transition-none",
          // Negative margin to cancel gap-1 from unrendered Mage card
          isFirstCard ? "-mt-1 md:mt-0" : "mt-0",
        )}
        onMouseEnter={displayDamageTable}
        onTouchEnd={onCardTouch}
        onMouseLeave={hideDamageTable}>
        {/* Title section */}
        <div
          className={clsx(
            `font-outline relative flex grow flex-col place-content-center border-b border-amber-950 text-center ${thisHero.cardBackground}`,
            "before:absolute before:inset-0 before:z-0 before:duration-500",
            animationsEnabled
              ? "transition-all before:transition-opacity before:duration-500"
              : "transition-none before:transition-none",
            isHovering && `${thisHero.backgroundImage}`,
            isHovering ? "before:opacity-100" : "before:opacity-0",
          )}>
          <div
            className={clsx(
              "h-full",
              animationsEnabled ? "transition-transform" : "transition-none",
              hoverAnimationDuration,
              isHovering ? "translate-y-0" : "translate-y-[calc(100%-2rem)]",
            )}>
            <h2
              className={clsx(
                "bg-black text-2xl",
                animationsEnabled ? "transition-colors" : "transition-none",
                hoverAnimationDuration,
                beginDelayedAnimation ? "bg-opacity-60" : "bg-opacity-0",
              )}>
              {config.displayName}
            </h2>
          </div>
          <div
            className={clsx(
              `${hoverAnimationDuration} h-full font-paytone text-lg`,
              animationsEnabled ? "transition-transform" : "transition-none",

              isHovering ? "translate-y-[calc(98%)]" : "translate-y-0",
            )}>
            <h3 className="inline">{config.displayStat}:</h3> {Math.round(damage)}
          </div>

          {/* OTP info on hover */}
          <div
            className={clsx(
              "absolute h-full w-full",
              animationsEnabled ? "transition-opacity ease-in" : "transition-none",
              isHovering ? `opacity-100 ${hoverAnimationDuration}` : "opacity-0 duration-150",
            )}>
            <div className={clsx("relative mt-8 flex h-full items-center pb-8")}>
              <div
                className={clsx(
                  "absolute inset-0 mt-2 flex w-full flex-col",
                  animationsEnabled ? "transition-opacity duration-200" : "transition-none",
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
                  "w-full font-passion text-xl",
                  animationsEnabled ? "transition-opacity duration-300" : "transition-none",
                  hoveredOTPUpgrade ? "opacity-0" : "opacity-100",
                  hoveredOTPUpgrade ? "pointer-events-none" : "pointer-events-auto",
                )}>
                <div className="border-b-2 border-amber-900">
                  <div className="flex translate-y-0.5 justify-between px-1 md:px-0.5">
                    <h4>Base Damage</h4>
                    <p>{Math.round(damageAtLevel)}</p>
                  </div>
                </div>
                <div className="border-b-2 border-amber-900">
                  <div className="flex translate-y-0.5 justify-between px-1 md:px-0.5">
                    <h4>Upgrade Multiplier</h4>
                    <p>x{upgradeMod ? upgradeMod.toFixed(2) : "1.00"}</p>
                  </div>
                </div>
                {prestigeMod > 1 && (
                  <div className="border-b-2 border-amber-900">
                    <div className="flex translate-y-0.5 justify-between px-1 md:px-0.5">
                      <h4>Prestige</h4>
                      <p className="font-outline-electricBlue">x{prestigeMod.toFixed(2)}</p>
                    </div>
                  </div>
                )}
                {achievementMod > 0 && (
                  <div className="border-b-2 border-amber-900">
                    <div className="flex translate-y-0.5 justify-between px-1 md:px-0.5">
                      <h4>Achievements</h4>
                      <p className="font-outline-gold text-black">+{Math.round(achievementMod * 100)}%</p>
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex translate-y-1 justify-between px-1 text-3xl md:px-0.5">
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
            "flex flex-col items-center gap-2 px-2 py-2 md:flex-row md:px-4",
            animationsEnabled ? "transition-all" : "transition-none",
            hoverAnimationDuration,
            isHovering && "mt-4",
          )}>
          <div
            ref={OTPContainerRef}
            className="upgrade-container font-outline relative flex h-full min-h-10 w-full grow self-start text-white md:w-64 2xl:w-72">
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
