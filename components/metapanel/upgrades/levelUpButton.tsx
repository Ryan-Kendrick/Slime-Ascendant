import clsx from "clsx/lite"
import coinURL from "/icons/coin.png"

interface LevelUpProps {
  id: string
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
  currentLevel: number
  levelUpCost: number
  isAffordable: boolean
}

export default function LevelUpButton({ id, onClick, currentLevel, levelUpCost, isAffordable }: LevelUpProps) {
  return (
    <div className="border-2 border-amber-900 ring-1 ring-amber-950">
      <div className="relative border-4 border-amber-950 bg-amber-950">
        <button
          disabled={!isAffordable}
          id={id}
          className={clsx(
            // Base
            "flex flex-col items-center py-2 px-4 min-w-32 text-white text-lg cursor-hand",
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
          onClick={onClick}>
          <span>Level {currentLevel}</span>
          <span>
            <img className="w-[1.4rem] inline-block self-center" src={`${coinURL}`} alt="gold coin" /> {levelUpCost}
          </span>
        </button>
        <div className="absolute ml-1 mt-1 mr-1 rounded-t-sm bg-white/50 inset-x-0 top-0 bottom-3/4 z-20 transition-transform duration-75 peer-enabled:peer-active:translate-y-0.5  pointer-events-none" />
        <div className="absolute ml-1 mr-1 rounded-bl bg-gradient-to-t from-white/0 to-white/50 inset-x-0 top-1/4 bottom-1/2 z-20 transition-transform duration-75 peer-enabled:peer-active:translate-y-0.5 pointer-events-none" />
      </div>{" "}
    </div>
  )
}
