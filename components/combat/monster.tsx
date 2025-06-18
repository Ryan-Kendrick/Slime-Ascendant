import { PropsWithChildren, useEffect, useRef } from "react"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { selectClickDamage, selectCritChance, selectDotDamage } from "../../redux/playerSlice"
import { selectMonsterState } from "../../redux/monsterSlice"
import { critProcessed, selectCritState, updateMonsterClicked } from "../../redux/statsSlice"
import { selectAnimationPref, selectLastSaveCatchUp, selectLoading } from "../../redux/metaSlice"
import { useGameEngine } from "../../gameconfig/customHooks"
import { UPGRADE_CONFIG } from "../../gameconfig/upgrades"

export default function Monster({ children }: PropsWithChildren) {
  const dispatch = useAppDispatch()

  const clickDamage = useAppSelector(selectClickDamage)
  const critChance = useAppSelector(selectCritChance)
  const { critRecently, lastCritDamage } = useAppSelector(selectCritState)
  const dotDamage = useAppSelector(selectDotDamage)
  const lastSaveCatchUp = useAppSelector(selectLastSaveCatchUp)
  const loading = useAppSelector(selectLoading)

  const lastSaveCatchUpRef = useRef(lastSaveCatchUp)
  const animationPref = useAppSelector(selectAnimationPref)

  // Interface between requestAnimationFrame and React to prevent infinite catchup loops
  useEffect(() => {
    lastSaveCatchUpRef.current = lastSaveCatchUp
  }, [lastSaveCatchUp])

  useEffect(() => {
    if (critRecently) {
      const timeout = setTimeout(() => {
        dispatch(critProcessed())
      }, 2000)
    }
  }, [critRecently])

  const { monsterName, monsterImage } = useAppSelector(selectMonsterState)

  useGameEngine({ dotDamage, loading, lastSaveCatchUp })

  function handleClick() {
    const isCrit = Math.random() < critChance
    const damageDealt = isCrit ? clickDamage * UPGRADE_CONFIG.critMultiplier : clickDamage
    dispatch(updateMonsterClicked({ damage: damageDealt, isCrit }))
  }

  const displayCrit = critRecently && animationPref > 1
  const displaySimpleAnimation = critRecently && animationPref <= 1

  return (
    <>
      <div className="flex flex-col w-full items-center">
        <div className="relative flex w-full justify-center text-2xl">
          <div className="text-center">{monsterName}</div>
        </div>
        <div className="">{children}</div>
      </div>

      <button
        className="relative flex flex-grow items-end h-[27rem] max-h-[34rem] hover:cursor-dagger"
        onClick={handleClick}>
        <img
          className="max-h-full h-full w-full object-cover lg:object-contain pointer-events-none"
          src={monsterImage}
          alt={monsterName}
        />
        {displayCrit && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="animate-float-up text-yellow-300 text-6xl font-bold absolute top-12">
              <div className="flex flex-col gap-1">
                <p>{lastCritDamage.toLocaleString()}</p>
                <p className="text-white text-4xl">⚡CRITICAL HIT⚡</p>
              </div>
            </div>
          </div>
        )}
        {displaySimpleAnimation && (
          <div className="absolute inset-0 text-yellow-400 text-6xl font-bold top-0">
            <div className="flex flex-col gap-1">
              <p>{lastCritDamage.toLocaleString()}</p>
              <p className="text-white text-4xl">⚡CRITICAL HIT⚡</p>
            </div>
          </div>
        )}
      </button>
    </>
  )
}
