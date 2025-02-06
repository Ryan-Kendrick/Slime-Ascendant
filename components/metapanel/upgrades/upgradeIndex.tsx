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

export default function UpgradeIndex() {
  const dispatch = useAppDispatch()

  const clickDamage = useAppSelector(selectClickDamage)
  const dotDamage = useAppSelector(selectDotDamage)
  const { adventurerLevelUpCost, warriorLevelUpCost, healerLevelUpCost, mageLevelUpCost } =
    useAppSelector(selectLevelUpCosts)
  const hasPrestiged = useAppSelector(selectPrestigeTabVisible)

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

  function onUpgrade(
    e: React.MouseEvent<HTMLImageElement> | React.MouseEvent<HTMLDivElement>,
    hidden: boolean,
    cost: number,
    isAffordable: boolean,
  ) {
    if (!isAffordable || hidden) return
    const [upgradeId, purchasedUpgradeLevel] = e.currentTarget.id.split(".") as [UpgradeId, string]
    let upgradeAction

    if (upgradeId === "adventurer-otp") {
      upgradeAction = updateClickDamage(upgradeId)
    } else {
      upgradeAction = updateDotDamage(upgradeId)
    }

    dispatch(upgradeAction)
    dispatch(decreaseGold(cost))
  }

  return (
    <div className="h-full flex flex-col">
      <Currency image={GoldIcon()} fontstyle="text-white font-paytone font-outline" currencySelector={selectGold} />
      <div className="flex-1 grid grid-cols-2 gap-1 grid-rows-[1fr_1fr_auto]">
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
        {(dotDamage > 0 || hasPrestiged) && (
          <div className="col-span-2 mb-2">
            <div className="flex flex-col text-white place-items-center w-full">
              <h2 className="text-3xl font-outline">Total</h2>
              <div className="flex text-lg w-full justify-evenly">
                <h3>Click Damage: {Math.round(clickDamage)}</h3>
                <h3>Passive Damage: {Math.round(dotDamage)}</h3>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
