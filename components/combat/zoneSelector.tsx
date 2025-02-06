import clsx from "clsx/lite"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { selectZoneState, zoneSelected } from "../../redux/zoneSlice"
import { useState } from "react"

export default function ZoneSelector() {
  const dispatch = useAppDispatch()
  const { currentZoneNumber, zoneInView } = useAppSelector(selectZoneState)
  const [prevZone, setPrevZone] = useState(currentZoneNumber)

  const selectedZones = Array.from({ length: 5 }, (cur, acc) => acc + 1)

  function handleZoneChange(e: React.MouseEvent<HTMLButtonElement>) {
    const [elementName, deltaSuffix] = e.currentTarget.id.split(".")
    const zoneDelta = Number(deltaSuffix) - 1
    const nextZone = currentZoneNumber - zoneDelta

    // prevZone used by spawn middleware to be determine if zone transition is needed
    dispatch(zoneSelected({ nextZone, prevZone: prevZone }))
    setPrevZone(nextZone)
  }

  const opacitySteps = ["opacity-100", "opacity-90", "opacity-80", "opacity-70", "opacity-60"]
  const scaleSteps = ["scale-100", "scale-95", "scale-90", "scale-85", "scale-80"]

  return (
    <div className="flex justify-around flex-row-reverse h-20 mx-2 lg:my-2 border-2 rounded-xl border-white bg-black bg-opacity-30 w-full gap-2 py-2 px-4">
      {selectedZones.map((zoneIndex) => {
        const thisZoneNumber = currentZoneNumber - zoneIndex + 1

        return (
          <button
            key={`outer.${zoneIndex}`}
            id={`zone-delta.${zoneIndex}`}
            className={clsx(
              "flex h-16 w-[7.111rem] border-4",
              scaleSteps[zoneIndex - 1],
              zoneInView === thisZoneNumber ? "border-yellow-500" : "border-gray-800",
            )}
            onClick={handleZoneChange}>
            <div
              key={`inner.${zoneIndex}`}
              className={clsx(
                "flex justify-center h-full w-full bg-meadow bg-no-repeat bg-cover text-black text-xl",
                opacitySteps[zoneIndex - 1],
              )}>
              {`${thisZoneNumber}`}
            </div>
          </button>
        )
      })}
    </div>
  )
}
