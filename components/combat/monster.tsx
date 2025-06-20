import { PropsWithChildren, useCallback, useEffect, useMemo, useRef } from "react"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { selectClickDamage, selectCritChance, selectDotDamage } from "../../redux/playerSlice"
import { selectMonsterState } from "../../redux/monsterSlice"
import {
  selectCritState,
  updateMonsterClicked,
  selectRecentCrits,
  cleanupOldCrits,
  selectEmptyArray,
  selectEmptyCritState,
} from "../../redux/statsSlice"
import { selectAnimationPref, selectLastSaveCatchUp, selectLoading } from "../../redux/metaSlice"
import { useAnimationCleanup, useGameEngine } from "../../gameconfig/customHooks"
import { UPGRADE_CONFIG } from "../../gameconfig/upgrades"
import { formatSmallNumber } from "../../gameconfig/utils"

export default function Monster({ children }: PropsWithChildren) {
  const dispatch = useAppDispatch()

  const clickDamage = useAppSelector(selectClickDamage)
  const critChance = useAppSelector(selectCritChance)
  const dotDamage = useAppSelector(selectDotDamage)
  const lastSaveCatchUp = useAppSelector(selectLastSaveCatchUp)
  const loading = useAppSelector(selectLoading)

  const animationPref = useAppSelector(selectAnimationPref)
  const recentCrits = useAppSelector(animationPref > 1 ? selectRecentCrits : selectEmptyArray)
  const { critRecently, lastCritDamage } = useAppSelector(animationPref <= 1 ? selectCritState : selectEmptyCritState)

  const lastSaveCatchUpRef = useRef(lastSaveCatchUp)

  // Interface between requestAnimationFrame and React to prevent infinite catchup loops
  useEffect(() => {
    lastSaveCatchUpRef.current = lastSaveCatchUp
  }, [lastSaveCatchUp])

  useAnimationCleanup({ animationPref, recentCrits, critRecently })

  useEffect(() => {
    if (animationPref <= 1) return

    const interval = setInterval(() => {
      dispatch(cleanupOldCrits())
    }, 5000)

    return () => clearInterval(interval)
  }, [animationPref])

  const { monsterName, monsterImage } = useAppSelector(selectMonsterState)

  useGameEngine({ dotDamage, loading, lastSaveCatchUp })

  function handleClick() {
    // const isCrit = Math.random() < critChance
    const isCrit = true
    const damageDealt = isCrit
      ? clickDamage *
        (UPGRADE_CONFIG.prestigeUpgradeConfig.critMultiplier +
          Math.random() / (UPGRADE_CONFIG.prestigeUpgradeConfig.critVariance * 10))
      : clickDamage
    dispatch(updateMonsterClicked({ damage: damageDealt, isCrit, animationPref }))
  }

  const showCritAnimation = animationPref > 1

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
        {showCritAnimation &&
          recentCrits.map((crit) => {
            if (!crit.id) return null
            return (
              <div
                key={crit.id}
                className="absolute inset-0 pointer-events-none flex items-center justify-center"
                style={{
                  transform: `translate(${crit.position.x}px, ${crit.position.y}px)`,
                }}>
                <div className="animate-float-up text-yellow-300 text-6xl font-bold absolute top-12">
                  <div className="flex flex-col gap-1">
                    <p>{formatSmallNumber(crit.damage)}</p>
                    <p className="text-white text-4xl">⚡CRITICAL HIT⚡</p>
                  </div>
                </div>
              </div>
            )
          })}
        {!showCritAnimation && (
          <div className="absolute inset-0 text-yellow-400 text-6xl font-bold top-0">
            <div className="flex flex-col gap-1">
              <p>{formatSmallNumber(lastCritDamage)}</p>
              <p className="text-white text-4xl">⚡CRITICAL HIT⚡</p>
            </div>
          </div>
        )}
      </button>
    </>
  )
}
