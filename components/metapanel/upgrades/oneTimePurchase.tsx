import clsx from "clsx/lite"
import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../../redux/hooks"
import { initialiseElement } from "../../../redux/playerSlice"
import { UpgradeId, UpgradeIdWithLevel } from "../../../models/upgrades"
import { initSelectorMap } from "../../../gameconfig/utils"

interface OneTimePurchaseProps {
  id: UpgradeIdWithLevel
  icon: JSX.Element
  onClick: (id: UpgradeId, hidden: boolean, cost: number, isAffordable: boolean) => void
  setHoveredOTPDescription: (selectedUpgrade: number | null) => void
  cost: number
  isAffordable: boolean
  isPurchased: boolean
  hidden: boolean
}

export default function OneTimePurchaseUpgrade({
  id,
  icon,
  onClick: onUpgrade,
  setHoveredOTPDescription,
  hidden,
  cost,
  isAffordable,
  isPurchased,
}: OneTimePurchaseProps) {
  const dispatch = useAppDispatch()

  const [shouldMount, setShouldMount] = useState(false)
  const [shimmer, setShimmer] = useState(false)
  const [heroId, OTPstr] = id.split(".") as [UpgradeId, string]
  const OTPNumber = Number(OTPstr)
  const thisSelector = initSelectorMap[heroId]
  const hasInitialised = useAppSelector(thisSelector) as number

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch") {
      const isNotMobile = window.matchMedia("(min-width: 1024px)").matches
      if (isNotMobile) {
        onUpgrade(heroId, hidden, cost, isAffordable)
      } else {
        onUpgrade(heroId, hidden, cost, isAffordable)
      }
    }
  }

  useEffect(() => {
    if (hasInitialised >= OTPNumber) return undefined

    if (!hidden && !shouldMount) {
      setShouldMount(true)
      const timeout = setTimeout(() => {
        setShimmer(true)
        dispatch(initialiseElement(heroId))
      }, 400)

      return () => clearTimeout(timeout)
    }
  }, [hidden, hasInitialised])

  return (
    <div
      id={id}
      className={clsx(
        "relative",
        // Shimmer effect
        "before:absolute before:inset-0 before:rounded-lg",
        "before:bg-[linear-gradient(60deg,transparent_50%,rgba(255,255,255,0.1)_50%,transparent_75%,transparent_100%)]",
        "before:bg-[length:400%_200%]",
        "before:bg-[position:-150%_0]",
        "before:transition-[background-position] before:duration-[2000ms]",
        "before:z-30",
        shimmer && "before:bg-[position:150%_0]",
        hidden && "-z-10 pointer-events-none",
        !hidden && "pointer-events-auto z-auto",
      )}
      onPointerUp={(e) => handlePointerUp(e)}
      onPointerEnter={() => setHoveredOTPDescription(OTPNumber)}
      onMouseLeave={() => setHoveredOTPDescription(null)}>
      <div
        className={clsx(
          // Base
          "relative cursor-pointer rounded-lg",
          "ring-2 ring-offset-2 ring-amber-800",
          "opacity-0 transition-all duration-1000",

          // Conditionals
          hidden && "invisible",
          !hidden && "opacity-100",
          !isPurchased && !isAffordable && "ring-offset-yellow-600 opacity-60",
          isPurchased || !isAffordable ? "ring-offset-yellow-700" : "ring-offset-yellow-300",
        )}>
        <div
          className={clsx(
            "absolute inset-0 rounded-lg z-10",
            "bg-gradient-to-br from-amber-600 to-amber-800",
            isAffordable && !isPurchased ? "opacity-100" : "opacity-30",
          )}
        />
        {isPurchased && <div className="absolute inset-[2px] bg-amber-950/60 rounded-md z-10" />}
        <div className="relative z-20 w-8 h-8 flex items-center justify-center p-1 text-amber-400">{icon}</div>
      </div>
    </div>
  )
}
