import clsx from "clsx/lite"
import { useAppSelector } from "../../redux/hooks"
import { selectZoneState } from "../../redux/zoneSlice"
import { BossIcon, CookieEnjoyerIcon, ErrantPlasmaIcon, GemCrabIcon, MoneybagIcon } from "../svgIcons/stageIcons"
import { Stage } from "../../models/zones"

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
  const currentStage = isFarmZone && farmZoneMonsters ? farmStageNumber : stageNumber
  const monsters = isFarmZone && farmZoneMonsters ? farmZoneMonsters : zoneMonsters

  if (!monsters) throw new Error("Failed to retrieve monsters for zone")

  const getIcon = (stageIndex: number): JSX.Element | undefined => {
    const monster = monsters[stageIndex]
    switch (monster.kind) {
      case "special":
        if (monster.name === "Errant Plasma") return ErrantPlasmaIcon()
        break
      case "rare":
        if (monster.name === "Gem Crab") return GemCrabIcon()
        break
      case "boss":
        return BossIcon()
      default:
        return undefined
    }
  }

  const stages: Stage[] = Array.from({ length: zoneLength }, (_, i): Stage => {
    const thisStageNumber = i + 1
    const isSpecial = !isFarmZone && monsters[i].kind === "special"
    const delta = thisStageNumber - currentStage
    const iconVisible = !isSpecial || delta < 3

    return {
      thisStageNumber,
      isCurrentStage: currentStage === thisStageNumber,
      isCompleted: thisStageNumber < currentStage,
      isSpecial,
      iconVisible,
    }
  })
  console.log(stages)
  return (
    <div className="flex items-end opacity-100">
      <div className="flex w-[20rem] border-2 md:w-[32rem] md:border-0 lg:w-[20rem] lg:border-2 xl:w-[32rem] xl:border-0 2xl:w-[40rem] 2xl:border-2 mb-2 flex-wrap-reverse content-start border-gray-300 box-content z-10">
        {stages.map((stage) => {
          const { thisStageNumber, isCurrentStage, isCompleted, isSpecial, iconVisible } = stage
          return (
            <div
              key={thisStageNumber}
              className={clsx(
                "flex relative h-8 w-16 border-2 border-gray-300 items-center justify-center",
                isCompleted && "bg-islam",
                isCurrentStage && thisStageNumber !== zoneLength && "bg-yellow-500",

                thisStageNumber > currentStage && thisStageNumber !== zoneLength && "bg-gray-800",
                !isFarmZone && thisStageNumber === zoneLength && thisStageNumber !== currentStage && "bg-red-600",
                !isFarmZone && thisStageNumber === zoneLength && isCurrentStage && "bg-orange-400",
                isFarmZone && farmZoneMonsters && thisStageNumber === zoneLength && "bg-gray-800",
                isFarmZone && farmZoneMonsters && isCurrentStage && thisStageNumber === zoneLength && "bg-yellow-500",
                isSpecial && "bg-fuchsia-500",
              )}>
              <div className="flex bg-gradient-to-tr from-white/30 to-blue-700/20 w-full h-full items-center justify-center">
                <div className={clsx("w-8 h-7", isSpecial && !iconVisible && "hidden")}>
                  {getIcon(thisStageNumber - 1)}
                </div>
              </div>
            </div>
          )
        })}
      </div>{" "}
    </div>
  )
}
