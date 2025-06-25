import { useAppDispatch, useAppSelector } from "../../../redux/hooks"
import {
  decreaseGold,
  selectGCanAfford,
  selectClickDamage,
  selectDotDamage,
  selectGold,
  updateDotDamage,
  updateClickDamage,
  selectPrestigeTabVisible,
  selectOneLineMaskVisible,
} from "../../../redux/playerSlice"
import { selectLevelUpCosts } from "../../../redux/shared/heroSelectors"
import {
  ClickOTPIcon1,
  ClickOTPIcon2,
  ClickOTPIcon3,
  ClickOTPIcon4,
  HealerOTPIcon1,
  HealerOTPIcon2,
  HealerOTPIcon3,
  HealerOTPIcon4,
  MageOTPIcon1,
  MageOTPIcon2,
  MageOTPIcon3,
  MageOTPIcon4,
  WarriorOTPIcon1,
  WarriorOTPIcon2,
  WarriorOTPIcon3,
  WarriorOTPIcon4,
} from "../../svgIcons/OTPIcons"
import { UPGRADE_CONFIG } from "../../../gameconfig/upgrades"
import { HeroName, UpgradeId } from "../../../models/upgrades"
import HeroCard from "./heroCard"
import Currency from "../currency"
import { GoldIcon } from "../../svgIcons/resourceIcons"
import clsx from "clsx/lite"
import { selectCurrentZoneNumber } from "../../../redux/zoneSlice"
import { useTouchObserver } from "../../../gameconfig/customHooks"
import DamageTotals from "./damageTotals"

export default function UpgradeIndex() {
  const dispatch = useAppDispatch()

  const currentZone = useAppSelector(selectCurrentZoneNumber)

  const { adventurerLevelUpCost, warriorLevelUpCost, healerLevelUpCost, mageLevelUpCost } =
    useAppSelector(selectLevelUpCosts)
  const hasPrestiged = useAppSelector(selectPrestigeTabVisible)
  const isHealerVisible = currentZone >= UPGRADE_CONFIG.healer.visibleAtZone
  const isWarriorVisible = currentZone >= UPGRADE_CONFIG.warrior.visibleAtZone
  const isMageVisible = currentZone >= UPGRADE_CONFIG.mage.visibleAtZone
  const oneLineMaskVisible = useAppSelector(selectOneLineMaskVisible)

  const LevelUp = {
    adventurer: {
      cost: adventurerLevelUpCost,
      canAfford: useAppSelector(selectGCanAfford(adventurerLevelUpCost)),
      action: updateClickDamage("adventurer-levelup"),
    },
    warrior: {
      cost: warriorLevelUpCost,
      canAfford: useAppSelector(selectGCanAfford(warriorLevelUpCost)),
      action: updateDotDamage("warrior-levelup"),
    },
    healer: {
      cost: healerLevelUpCost,
      canAfford: useAppSelector(selectGCanAfford(healerLevelUpCost)),
      action: updateDotDamage("healer-levelup"),
    },
    mage: {
      cost: mageLevelUpCost,
      canAfford: useAppSelector(selectGCanAfford(mageLevelUpCost)),
      action: updateDotDamage("mage-levelup"),
    },
  }

  function onLevelup(e: React.MouseEvent<HTMLButtonElement>) {
    const levelUpId = e.currentTarget.id as HeroName

    const { cost, canAfford, action } = LevelUp[levelUpId]

    if (canAfford) {
      dispatch(action)
      dispatch(decreaseGold(cost))
    } else if (!cost) {
      throw new Error(`Unexpected levelup target ${levelUpId}`)
    }
  }

  function onUpgrade(id: UpgradeId, hidden: boolean, cost: number, isAffordable: boolean) {
    if (!isAffordable || hidden) return
    let upgradeAction

    if (id === "adventurer-otp") {
      upgradeAction = updateClickDamage(id)
    } else {
      upgradeAction = updateDotDamage(id)
    }

    dispatch(upgradeAction)
    dispatch(decreaseGold(cost))
  }

  const touchedHero = useTouchObserver()

  return (
    <div className="flex flex-col">
      <Currency
        image={GoldIcon()}
        fontStyle="text-white font-paytone font-outline"
        containerStyle="[border-image:linear-gradient(40deg,#C0C0C0,#868686,#E7E7E7,#868686,#868686)_20] border-2 border-solid border-transparent rounded-t bg-slate-300/20
        after:content-[''] after:w-full after:h-full after:[background:radial-gradient(circle_120px_at_15%_-30%,#E2DFD2,transparent),radial-gradient(circle_160px_at_100%_80%,#36454F80,transparent)]
        "
        innerStyle="currency-gold-inner"
        currencySelector={selectGold}
      />
      <div className="flex-1 flex flex-col">
        <div
          className={clsx(
            "relative grid gap-1 -mt-1 md:mt-0 z-50",
            isWarriorVisible
              ? isHealerVisible
                ? isMageVisible
                  ? "grid-cols-1 md:grid-cols-2 -mt-0 md:mt-0 mb-0"
                  : "grid-cols-1 md:grid-cols-2 -mt-0 md:mt-0 mb-0"
                : "grid-cols-1 md:grid-cols-2 -mt-1 md:mt-0 mb-0"
              : "grid-cols-1 -mt-1 md:mt-0 mb-8",
          )}>
          <HeroCard
            config={UPGRADE_CONFIG.adventurer}
            touchedHero={touchedHero}
            OTPIcons={[ClickOTPIcon1(), ClickOTPIcon2(), ClickOTPIcon3()]}
            onUpgrade={onUpgrade}
            onLevelUp={onLevelup}
          />
          <HeroCard
            config={UPGRADE_CONFIG.warrior}
            touchedHero={touchedHero}
            OTPIcons={[WarriorOTPIcon1(), WarriorOTPIcon2(), WarriorOTPIcon3()]}
            onUpgrade={onUpgrade}
            onLevelUp={onLevelup}
          />
          <HeroCard
            config={UPGRADE_CONFIG.healer}
            touchedHero={touchedHero}
            OTPIcons={[HealerOTPIcon1(), HealerOTPIcon2(), HealerOTPIcon3()]}
            onUpgrade={onUpgrade}
            onLevelUp={onLevelup}
          />
          <HeroCard
            config={UPGRADE_CONFIG.mage}
            touchedHero={touchedHero}
            OTPIcons={[MageOTPIcon1(), MageOTPIcon2(), MageOTPIcon3()]}
            onUpgrade={onUpgrade}
            onLevelUp={onLevelup}
          />
          {/* Vertical mask to go with the horizonal mask in panelIndex on large screens*/}
          <div
            className={clsx(
              "hidden md:block left-[calc(50%-0.125rem)] h-full w-1 z-10 bg-[#723209]",
              (oneLineMaskVisible && !hasPrestiged) || (hasPrestiged && isWarriorVisible) ? "md:absolute" : "md:hidden",
              isHealerVisible && "md:absolute",
            )}
          />
        </div>
        <DamageTotals />
      </div>
    </div>
  )
}
