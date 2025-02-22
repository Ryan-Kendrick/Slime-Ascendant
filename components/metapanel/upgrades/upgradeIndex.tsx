import { useAppDispatch, useAppSelector } from "../../../redux/hooks"
import {
  decreaseGold,
  selectGCanAfford,
  selectClickDamage,
  selectDotDamage,
  selectAdventurerLevelUpCost,
  selectWarriorLevelUpCost,
  selectGold,
  updateDotDamage,
  updateClickDamage,
  selectAdventurerDamage,
  selectWarriorDamage,
  selectLevelUpCosts,
  selectPrestigeTabVisible,
  selectInitState,
} from "../../../redux/playerSlice"
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
import { formatSmallNumber } from "../../../gameconfig/utils"
import clsx from "clsx/lite"
import { selectCurrentZoneNumber } from "../../../redux/zoneSlice"

export default function UpgradeIndex() {
  const dispatch = useAppDispatch()

  const currentZone = useAppSelector(selectCurrentZoneNumber)
  const clickDamage = useAppSelector(selectClickDamage)
  const dotDamage = useAppSelector(selectDotDamage)
  const displayClickDamage = formatSmallNumber(clickDamage)
  const displayDotDamage = formatSmallNumber(dotDamage)
  const { adventurerLevelUpCost, warriorLevelUpCost, healerLevelUpCost, mageLevelUpCost } =
    useAppSelector(selectLevelUpCosts)
  const hasPrestiged = useAppSelector(selectPrestigeTabVisible)
  const isHealerVisible = currentZone >= UPGRADE_CONFIG.healer.visibleAtZone
  const isWarriorVisible = currentZone >= UPGRADE_CONFIG.warrior.visibleAtZone

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

  return (
    <div className="flex flex-col">
      <Currency image={GoldIcon()} fontstyle="text-white font-paytone font-outline" currencySelector={selectGold} />
      <div className="flex-1 flex flex-col">
        <div className={clsx("relative grid grid-cols-2 gap-1 z-50", isHealerVisible ? "grid-rows-2" : "grid-rows-1")}>
          <HeroCard
            config={UPGRADE_CONFIG.adventurer}
            OTPIcons={[ClickOTPIcon1(), ClickOTPIcon2(), ClickOTPIcon3()]}
            onUpgrade={onUpgrade}
            onLevelUp={onLevelup}
          />
          <HeroCard
            config={UPGRADE_CONFIG.warrior}
            OTPIcons={[WarriorOTPIcon1(), WarriorOTPIcon2(), WarriorOTPIcon3()]}
            onUpgrade={onUpgrade}
            onLevelUp={onLevelup}
          />
          <HeroCard
            config={UPGRADE_CONFIG.healer}
            OTPIcons={[HealerOTPIcon1(), HealerOTPIcon2(), HealerOTPIcon3()]}
            onUpgrade={onUpgrade}
            onLevelUp={onLevelup}
          />
          <HeroCard
            config={UPGRADE_CONFIG.mage}
            OTPIcons={[MageOTPIcon1(), MageOTPIcon2(), MageOTPIcon3()]}
            onUpgrade={onUpgrade}
            onLevelUp={onLevelup}
          />
          <div
            className={clsx(
              "left-[calc(50%-0.125rem)] h-full w-1 z-10 bg-gradient-to-b ",
              !isWarriorVisible && "hidden",
              isWarriorVisible && "absolute from-purpleTopSm to-purpleMidSm md:from-purpleTop md:to-purpleMid",
              isHealerVisible &&
                "absolute from-purpleTopSm via-purpleMidSm to-purpleBottomSm md:from-purpleTop md:via-purpleMid md:to-purpleBottom",
            )}
          />
        </div>
        {(dotDamage > 0 || hasPrestiged) && (
          <div className="mb-2">
            <div className="flex flex-col text-white place-items-center w-full">
              <h2 className="text-3xl font-outline">Total</h2>
              <div className="flex text-lg w-full justify-evenly">
                <h3>Click Damage: {displayClickDamage}</h3>
                <h3>Passive Damage: {displayDotDamage}</h3>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
