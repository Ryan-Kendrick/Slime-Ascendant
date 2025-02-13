import clsx from "clsx/lite"
import coinURL from "/assets/icons/coin.png"
import { formatNumber } from "../../../gameconfig/utils"

interface LevelUpProps {
  id: string
  onLevelUp: (e: React.MouseEvent<HTMLButtonElement>) => void
  currentLevel: number
  levelUpCost: number
  isAffordable: boolean
  hoveredOTPUpgrade: number | null
  nextOTPCost: number
  purchaseOTPUpgrade: () => void
}

export default function LevelUpButton({
  id,
  onLevelUp,
  currentLevel,
  levelUpCost,
  isAffordable,
  hoveredOTPUpgrade,
  purchaseOTPUpgrade,
  nextOTPCost,
}: LevelUpProps) {
  const displayCost = formatNumber(levelUpCost)

  return (
    <div className="w-full md:w-auto border-2 border-amber-900 ring-1 ring-amber-950">
      <div className="w-full md:w-auto relative border-4 border-amber-950 bg-amber-950">
        <button
          disabled={!isAffordable}
          id={id}
          className={clsx(
            // Base
            "flex flex-col items-center py-2 px-4 w-full md:w-auto min-w-32 text-white text-xl font-paytone cursor-hand",
            "border-2 border-amber-300",
            "transition-all duration-75",
            "shadow-[0_0_8px_0px_rgba(251,191,36,0.9),inset_0_0_4px_-1px_rgba(251,191,36,0.8)]",

            // Enabled
            "enabled:hover:border-amber-200",
            "enabled:hover:shadow-[0_0_6px_0px_rgba(251,191,36,1),inset_0_0_6px_-1px_rgba(251,191,36,0.9)]",

            // Pressed
            "peer",
            "enabled:active:translate-y-0.5",
            "enabled:active:shadow-[0_0_3px_0px_rgba(251,191,36,0.8),inset_0_0_8px_-1px_rgba(251,191,36,1)]",
            "enabled:active:border-amber-400",

            isAffordable ? "bg-blue-600 hover:bg-blue-700 active:bg-blue-800" : "bg-blue-950 border-amber-950",
          )}
          onClick={hoveredOTPUpgrade ? purchaseOTPUpgrade : onLevelUp}>
          {hoveredOTPUpgrade ? (
            <>
              <span className="z-30 block lg:hidden">Upgrade</span>
              <span className="z-30 hidden lg:block">Level {currentLevel}</span>
            </>
          ) : (
            <span className="z-30">Level {currentLevel}</span>
          )}
          <span className="text-lg">
            <img className="w-[1.4rem] inline-block self-center" src={`${coinURL}`} alt="gold coin" />{" "}
            {hoveredOTPUpgrade ? (
              <>
                <span className="inline lg:hidden">{nextOTPCost}</span>
                <span className="hidden lg:inline">{levelUpCost}</span>
              </>
            ) : (
              displayCost
            )}
          </span>
        </button>
        <div className="absolute ml-1 mt-1 mr-1 rounded-t-sm bg-blue-300/50 inset-x-0 top-0 bottom-3/4 z-20 transition-transform duration-75 peer-enabled:peer-active:translate-y-0.5  pointer-events-none" />
        <div className="absolute ml-1 mr-1 rounded-bl bg-gradient-to-t from-blue-300/0 to-blue-300/50 inset-x-0 top-[calc(25%+0.0009rem)] bottom-1/2 z-20 transition-transform duration-75 peer-enabled:peer-active:translate-y-0.5 pointer-events-none" />
      </div>{" "}
    </div>
  )
}
