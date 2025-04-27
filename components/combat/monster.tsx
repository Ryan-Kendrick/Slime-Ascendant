import { PropsWithChildren, useEffect, useRef } from "react"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { selectClickDamage, selectDotDamage } from "../../redux/playerSlice"
import { selectMonsterState } from "../../redux/monsterSlice"
import { updateMonsterClicked } from "../../redux/statsSlice"
import { selectLastSaveCatchUp, selectLoading } from "../../redux/metaSlice"
import { selectZoneState } from "../../redux/zoneSlice"
import { useGameEngine } from "../../gameconfig/customHooks"

export default function Monster({ children }: PropsWithChildren) {
  const dispatch = useAppDispatch()

  const clickDamage = useAppSelector(selectClickDamage)
  const dotDamage = useAppSelector(selectDotDamage)
  const lastSaveCatchUp = useAppSelector(selectLastSaveCatchUp)
  const loading = useAppSelector(selectLoading)

  console.log(lastSaveCatchUp)

  const lastSaveCatchUpRef = useRef(lastSaveCatchUp)

  // Interface between requestAnimationFrame and React to prevent infinite catchup loops
  useEffect(() => {
    lastSaveCatchUpRef.current = lastSaveCatchUp
  }, [lastSaveCatchUp])

  const { monsterName, monsterImage, monsterLevel } = useAppSelector(selectMonsterState)
  const { currentZoneNumber, zoneInView, isFarming, zoneMonsters, farmZoneMonsters, farmZoneNumber, stageNumber } =
    useAppSelector(selectZoneState)

  useGameEngine({ dotDamage, loading, lastSaveCatchUp })

  function handleClick() {
    dispatch(updateMonsterClicked(clickDamage))
    // Goto !monsterAlive useEffect if monster died
  }

  return (
    <>
      <div className="flex flex-col w-full items-center">
        <div className="relative flex w-full justify-center text-2xl">
          <div className="text-center">{monsterName}</div>
        </div>
        <div className="">{children}</div>
      </div>
      <button className="flex flex-grow items-end h-[27rem] max-h-[34rem] hover:cursor-dagger" onClick={handleClick}>
        <img
          className="max-h-full h-full w-full object-cover lg:object-contain pointer-events-none"
          src={monsterImage}
          alt={monsterName}
        />
      </button>
    </>
  )
}
