import { PropsWithChildren, useEffect, useRef } from "react"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { selectClickDamage, selectCritChance, selectDotDamage } from "../../redux/playerSlice"
import { selectMonsterState } from "../../redux/monsterSlice"
import { updateMonsterClicked } from "../../redux/statsSlice"
import { selectLastSaveCatchUp, selectLoading } from "../../redux/metaSlice"
import { useGameEngine } from "../../gameconfig/customHooks"
import { UPGRADE_CONFIG } from "../../gameconfig/upgrades"

export default function Monster({ children }: PropsWithChildren) {
  const dispatch = useAppDispatch()

  const clickDamage = useAppSelector(selectClickDamage)
  const dotDamage = useAppSelector(selectDotDamage)
  const critChance = useAppSelector(selectCritChance)
  const lastSaveCatchUp = useAppSelector(selectLastSaveCatchUp)
  const loading = useAppSelector(selectLoading)

  const lastSaveCatchUpRef = useRef(lastSaveCatchUp)

  // Interface between requestAnimationFrame and React to prevent infinite catchup loops
  useEffect(() => {
    lastSaveCatchUpRef.current = lastSaveCatchUp
  }, [lastSaveCatchUp])

  const { monsterName, monsterImage } = useAppSelector(selectMonsterState)

  useGameEngine({ dotDamage, loading, lastSaveCatchUp })

  function handleClick() {
    const isCrit = Math.random() < critChance
    const damageDealt = isCrit ? clickDamage * UPGRADE_CONFIG.critMultiplier : clickDamage
    dispatch(updateMonsterClicked({ damage: damageDealt, isCrit }))
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
