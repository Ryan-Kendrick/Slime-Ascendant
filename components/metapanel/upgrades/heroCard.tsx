import clsx from "clsx/lite"
import { useEffect, useState, useRef } from "react"
import { useAppDispatch, useAppSelector } from "../../../redux/hooks"
import {
  initialiseElement,
  selectGCanAfford,
  selectAdventurerLevelUpCost,
  selectWarriorLevelUpCost,
  selectAdventurerState,
  selectWarriorState,
  selectHealerState,
  selectMageState,
  selectWarriorDamage,
  selectHealerDamage,
  selectMageDamage,
  selectAdventurerDamage,
  setActiveHero,
  selectHealerLevelUpCost,
  selectMageLevelUpCost,
} from "../../../redux/playerSlice"
import OneTimePurchaseUpgrade from "./oneTimePurchase"
import { UPGRADE_CONFIG } from "../../../gameconfig/upgrades"
import { Upgrade, UpgradeIdWithLevel, HeroName, UpgradeProps } from "../../../models/upgrades"
import LevelUpButton from "./levelUpButton"
import { selectCurrentZoneNumber } from "../../../redux/zoneSlice"
import { initSelectorMap } from "../../../gameconfig/utils"

interface HeroCardProps {
  config: Upgrade
  OTPIcons: JSX.Element[]
  onUpgrade: (e: React.MouseEvent<HTMLDivElement>, hidden: boolean, cost: number, isAffordable: boolean) => void
  onLevelUp: (e: React.MouseEvent<HTMLButtonElement>) => void
}

export default function HeroCard({ config, OTPIcons: OTPIcons, onUpgrade, onLevelUp }: HeroCardProps) {
  const dispatch = useAppDispatch()
  const [upgradeName] = config.elementId.split("-")
  const thisHeroName = upgradeName as HeroName

  const upgradeProps: UpgradeProps = {
    adventurer: {
      ...useAppSelector(selectAdventurerState),
      damage: useAppSelector(selectAdventurerDamage),
      levelUpCost: useAppSelector(selectAdventurerLevelUpCost),
      cardBackground: "bg-orange-200/50",
    },
    warrior: {
      ...useAppSelector(selectWarriorState),
      damage: useAppSelector(selectWarriorDamage),
      levelUpCost: useAppSelector(selectWarriorLevelUpCost),
      cardBackground: "bg-red-300/50",
    },
    healer: {
      ...useAppSelector(selectHealerState),
      damage: useAppSelector(selectHealerDamage),
      levelUpCost: useAppSelector(selectHealerLevelUpCost),
      cardBackground: "bg-green-300/50",
    },
    mage: {
      ...useAppSelector(selectMageState),
      damage: useAppSelector(selectMageDamage),
      levelUpCost: useAppSelector(selectMageLevelUpCost),
      cardBackground: "bg-electricblue/50",
    },
  }
  const thisUpgradeProps = upgradeProps[thisHeroName]
  const damage = upgradeProps[thisHeroName].damage

  const canAffordLevelUp = useAppSelector(selectGCanAfford(thisUpgradeProps.levelUpCost))
  const nextOTPCost = UPGRADE_CONFIG.calcOTPCost(config.elementId, thisUpgradeProps.upgradeCount)
  const canAffordNextOTPUpgrade = useAppSelector(selectGCanAfford(nextOTPCost))

  const currentZoneNumber = useAppSelector(selectCurrentZoneNumber)

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

  const handleUpgradeWithAnimation = (
    e: React.MouseEvent<HTMLDivElement>,
    hidden: boolean,
    cost: number,
    isAffordable: boolean,
  ) => onUpgrade(e, hidden, cost, isAffordable)

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
  }, [thisUpgradeProps.upgradeCount, OTPIcons.length, isMobile, shouldMount])

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
  const [hoverAnimationsComplete, setHoverAnimationsComplete] = useState(false)
  const hoverAnimationDuration = "duration-500"

  const onCardHover = () => {
    const animationDuration = Number(hoverAnimationDuration.split("-")[1])

    setIsHovering(true)
    setTimeout(() => {
      setHoverAnimationsComplete(true)
    }, animationDuration / 2)
    console.log("onHover")
  }
  const onCardMouseExit = () => {
    setHoverAnimationsComplete(false)
    setIsHovering(false)
    console.log("onExit")
  }

  if (!shouldMount && isNotAdventurer) return null

  return (
    <div
      className={clsx(
        "flex flex-col shadow-panel rounded-b border-2 text-white",
        !animationComplete && "transition-opacity duration-1000",
        canAffordNextOTPUpgrade && thisUpgradeProps.level > 10 ? "border-gold" : "border-yellow-700",
        !animationComplete && !isVisible && isNotAdventurer && "opacity-0",
        isVisible && isNotAdventurer && "opacity-100",
        animationComplete && "opacity-100",
      )}
      onPointerEnter={onCardHover}
      onMouseLeave={onCardMouseExit}>
      {/* Title section */}
      <div
        className={clsx(
          `flex flex-col place-content-center grow text-center font-outline border-b border-amber-950 transition-all relative ${upgradeProps[thisHeroName].cardBackground}`,
          "before:absolute before:inset-0 before:bg-[url('/assets/icons/cogs.svg')] before:opacity-0 before:transition-opacity before:duration-500 before:z-0",
          isHovering && "before:opacity-100",
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
              hoverAnimationsComplete ? "bg-opacity-60" : "bg-opacity-0",
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
            "absolute transition-opacity ease-in mt-[1.125rem]",

            isHovering ? `opacity-100 ${hoverAnimationDuration}` : "opacity-0 duration-150",
          )}>
          This is a test description yo yo yo so 300% damage by 3x4 some lore goes here yeyeye joke
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
            const isPurchased = thisUpgradeProps.upgradeCount > i
            const isHidden = i === 0 ? thisUpgradeProps.level < 10 : thisUpgradeProps.upgradeCount < i

            return (
              <div
                key={upgradeName + i}
                className={clsx(
                  "upgrade-item absolute transition-transform",
                  // Quick slide animation on desktop
                  isMobile ? "duration-500" : "duration-200",
                  isPurchased && "purchased",
                )}>
                <OneTimePurchaseUpgrade
                  id={`${config.elementId}.${i + 1}` as UpgradeIdWithLevel}
                  onClick={(e) => handleUpgradeWithAnimation(e, false, nextOTPCost, canAffordNextOTPUpgrade)}
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
          onClick={onLevelUp}
          currentLevel={thisUpgradeProps.level}
          levelUpCost={thisUpgradeProps.levelUpCost}
          isAffordable={canAffordLevelUp}
        />
      </div>
    </div>
  )
}
