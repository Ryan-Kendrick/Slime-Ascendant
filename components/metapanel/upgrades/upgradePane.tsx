import clsx from "clsx/lite"
import { useEffect, useState } from "react"
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
  selectClickDamage,
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

interface UpgradePaneProps {
  config: Upgrade
  OTPIcons: JSX.Element[]
  onUpgrade: (e: React.MouseEvent<HTMLDivElement>, hidden: boolean, cost: number, isAffordable: boolean) => void
  onLevelUp: (e: React.MouseEvent<HTMLButtonElement>) => void
}

export default function UpgradePane({ config, OTPIcons: OTPIcons, onUpgrade, onLevelUp }: UpgradePaneProps) {
  const dispatch = useAppDispatch()
  const [upgradeName] = config.elementId.split("-")
  const thisHeroName = upgradeName as HeroName

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
  // const canAffordThisUpgrade = (level: number) =>
  //   useAppSelector(selectGCanAfford(UPGRADE_CONFIG.calcOTPCost(config.elementId, level)))

  const currentZoneNumber = useAppSelector(selectCurrentZoneNumber)

  const [shouldMount, setShouldMount] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [animationComplete, setAnimationComplete] = useState(false)

  const isNotAdventurer = upgradeName !== "adventurer"

  const thisSelector = isNotAdventurer ? initSelectorMap[thisHeroName] : null
  const hasInitialised = isNotAdventurer ? thisSelector && useAppSelector(thisSelector) : true

  useEffect(() => {
    if (isNotAdventurer) {
      // If already initialised, skip animation sequence
      if (hasInitialised) setAnimationComplete(true)
      // Once animation is completed, dispatch to store
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
        "flex w-full items-start justify-between align-start py-4 px-2 md:px-4 xl:px-6 2xl:pr-8 gap-2 shadow-md border-t-purple-950 border-b-purple-950 border-x-2 transition-opacity duration-1000",
        upgradeName === "adventurer" ? "border-y-2" : "border-b-2",
        canAffordNextOTPUpgrade && thisUpgradeProps.level > 10 ? "border-x-gold" : "border-x-yellow-700",
        isVisible && isNotAdventurer && "opacity-100",
        !animationComplete && !isVisible && isNotAdventurer && "opacity-0",
        animationComplete && "opacity-100 transition-none",
      )}>
      <div className="flex gap-1 flex-col w-40 md:w-52 2xl:w-56 items-center text-white font-outline">
        <div className="text-2xl">{config.displayName}</div>
        <div className="self-center">
          {config.displayStat}: <span className="">{Math.round(damage)}</span>
        </div>
        <div className="flex gap-2.5 pt-1">
          {OTPIcons.map((icon, i) => (
            <OneTimePurchaseUpgrade
              key={upgradeName + i}
              id={`${config.elementId}.${i + 1}` as UpgradeIdWithLevel}
              onClick={onUpgrade}
              icon={icon}
              hidden={i === 0 ? thisUpgradeProps.level < 10 : thisUpgradeProps.upgradeCount < i}
              cost={nextOTPCost}
              isAffordable={canAffordNextOTPUpgrade}
              isPurchased={thisUpgradeProps.upgradeCount > i}
            />
          ))}
        </div>
      </div>
      <LevelUpButton
        id={upgradeName}
        onClick={onLevelUp}
        currentLevel={thisUpgradeProps.level}
        levelUpCost={thisUpgradeProps.levelUpCost}
        isAffordable={canAffordLevelUp}
      />
    </div>
  )
}
