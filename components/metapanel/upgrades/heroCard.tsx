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
  const [isMobile, setIsMobile] = useState(false)
  const OTPContainerRef = useRef<HTMLDivElement>(null)

  const upgradeProps: UpgradeProps = {
    adventurer: {
      ...useAppSelector(selectAdventurerState),
      damage: useAppSelector(selectAdventurerDamage),
      levelUpCost: useAppSelector(selectAdventurerLevelUpCost),
    },
    warrior: {
      ...useAppSelector(selectWarriorState),
      damage: useAppSelector(selectWarriorDamage),
      levelUpCost: useAppSelector(selectWarriorLevelUpCost),
    },
    healer: {
      ...useAppSelector(selectHealerState),
      damage: useAppSelector(selectHealerDamage),
      levelUpCost: useAppSelector(selectHealerLevelUpCost),
    },
    mage: {
      ...useAppSelector(selectMageState),
      damage: useAppSelector(selectMageDamage),
      levelUpCost: useAppSelector(selectMageLevelUpCost),
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

  useEffect(() => {
    if (OTPContainerRef.current) {
      const container = OTPContainerRef.current
      const items = container.getElementsByClassName("upgrade-item")
      const containerWidth = container.offsetWidth
      const itemWidth = 40

      Array.from(items).forEach((item, index) => {
        const element = item as HTMLElement
        const basePosition = index * itemWidth
        element.style.left = `${basePosition}px`

        if (element.classList.contains("purchased") && isMobile) {
          const rightEdgePosition = containerWidth - itemWidth - index * itemWidth

          const travelDistance = rightEdgePosition - basePosition

          element.style.transform = `translateX(${travelDistance}px)`
        } else if (element.classList.contains("purchased")) {
          // Todo: Add a desktop specific animation
          const rightEdgePosition = containerWidth - itemWidth - index * itemWidth

          const travelDistance = rightEdgePosition - basePosition

          element.style.transform = `translateX(${travelDistance}px)`
        }
      })
    }
  }, [thisUpgradeProps.upgradeCount, OTPIcons.length, isMobile])

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

  if (!shouldMount && isNotAdventurer) return null

  return (
    <div
      className={clsx(
        "flex flex-col shadow-panel rounded-b border-2 transition-opacity duration-1000",
        canAffordNextOTPUpgrade && thisUpgradeProps.level > 10 ? "border-gold" : "border-yellow-700",
        isVisible && isNotAdventurer && "opacity-100",
        !animationComplete && !isVisible && isNotAdventurer && "opacity-0",
        animationComplete && "opacity-100 transition-none",
      )}>
      <div className="">Top half of card goes here</div>
      <div
        className={clsx(
          "flex flex-col md:flex-row items-center justify-between align-start py-4 px-2 md:px-4 xl:px-6 2xl:pr-8 gap-2",
        )}>
        <div
          ref={OTPContainerRef}
          className="upgrade-container relative w-full min-h-10 flex self-start md:w-64 2xl:w-72 text-white font-outline">
          {OTPIcons.map((icon, i) => {
            const isPurchased = thisUpgradeProps.upgradeCount > i
            const isHidden = i === 0 ? thisUpgradeProps.level < 10 : thisUpgradeProps.upgradeCount < i

            return (
              <div
                key={upgradeName + i}
                className={clsx(
                  "upgrade-item transition-transform",
                  // Animation properties
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
