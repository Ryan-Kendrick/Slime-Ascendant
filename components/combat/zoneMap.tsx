import clsx from "clsx/lite"
import { useAppSelector } from "../../redux/hooks"
import { selectZoneState } from "../../redux/zoneSlice"
import { BossIcon, CookieEnjoyerIcon, MoneybagIcon } from "../svgIcons/stageIcons"

export default function ZoneMap() {
  const {
    currentZoneLength,
    zoneMonsters,
    stageNumber,
    farmZoneMonsters,
    farmZoneNumber,
    farmZoneLength,
    farmStageNumber,
    zoneInView,
  } = useAppSelector(selectZoneState)

  const isFarmZone = zoneInView === farmZoneNumber
  const zoneLength = isFarmZone ? farmZoneLength : currentZoneLength
  const stages = Array.from({ length: zoneLength }, (cur, acc) => acc + 1)

  const currentStage = isFarmZone && farmZoneMonsters ? farmStageNumber : stageNumber
  const monsters = isFarmZone && farmZoneMonsters ? farmZoneMonsters : zoneMonsters
  if (!monsters) throw new Error("Failed to retrieve monsters for zone")

  const getIcon = (stageIndex: number): JSX.Element | undefined => {
    const monster = monsters[stageIndex]
    switch (monster.kind) {
      case "rare":
        if (monster.name === "Gem Crab") return MoneybagIcon()
        break
      case "boss":
        return BossIcon()
      default:
        return undefined
    }
  }

  return (
    <div className="flex items-end opacity-100">
      <div className="flex w-[20rem] border-2 md:w-[32rem] md:border-0 lg:w-[20rem] lg:border-2 xl:w-[32rem] xl:border-0 2xl:w-[40rem] 2xl:border-2 mb-2 flex-wrap-reverse content-start border-gray-300 box-content z-10">
        {stages.map((stageNumber) => (
          <div
            key={stageNumber}
            className={clsx(
              "flex relative h-8 w-16 border-2 border-gray-300 items-center justify-center",
              stageNumber < currentStage && "bg-islam",
              stageNumber === currentStage && stageNumber !== zoneLength && "bg-yellow-500",

              stageNumber > currentStage && stageNumber !== zoneLength && "bg-gray-800",
              !isFarmZone && stageNumber === zoneLength && stageNumber !== currentStage && "bg-red-600",
              !isFarmZone && stageNumber === zoneLength && stageNumber === currentStage && "bg-orange-400",
              isFarmZone && farmZoneMonsters && stageNumber === zoneLength && "bg-gray-800",
              isFarmZone &&
                farmZoneMonsters &&
                stageNumber === currentStage &&
                stageNumber === zoneLength &&
                "bg-yellow-500",
            )}>
            <div className="flex bg-gradient-to-tr from-white/30 to-blue-700/20 w-full h-full items-center justify-center">
              <div className="w-7 fill-white">{getIcon(stageNumber - 1)}</div>
            </div>
          </div>
        ))}
      </div>{" "}
    </div>
  )
}
