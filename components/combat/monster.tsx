import { PropsWithChildren, useCallback, useEffect, useRef } from "react"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import {
  selectBeatDamage,
  selectClickDamage,
  selectCritChance,
  selectDotDamage,
  selectMultistrikeCooldown,
} from "../../redux/playerSlice"
import { selectMonsterState } from "../../redux/monsterSlice"
import {
  selectCritState,
  updateMonsterClicked,
  selectRecentCrits,
  cleanupOldCrits,
  selectEmptyArray,
  selectEmptyCritState,
  updateMultistrikeDamageDealt,
  selectMultistrikeState,
  toggleDisplayMultistrike,
} from "../../redux/statsSlice"
import { selectAnimationPref, selectLastSaveCatchUp, selectLoading } from "../../redux/metaSlice"
import { useCritCleanup, useGameEngine } from "../../gameconfig/customHooks"
import { UPGRADE_CONFIG } from "../../gameconfig/upgrades"
import { formatSmallNumber } from "../../gameconfig/utils"

export default function Monster({ children }: PropsWithChildren) {
  const dispatch = useAppDispatch()

  const clickDamage = useAppSelector(selectClickDamage)
  const dotDamage = useAppSelector(selectDotDamage)
  const critChance = useAppSelector(selectCritChance)
  const beatDamage = useAppSelector(selectBeatDamage)
  const lastSaveCatchUp = useAppSelector(selectLastSaveCatchUp)
  const loading = useAppSelector(selectLoading)

  const animationPref = useAppSelector(selectAnimationPref)
  const usingHighQualityAnimations = animationPref > 1
  const recentCrits = useAppSelector(animationPref > 1 ? selectRecentCrits : selectEmptyArray)
  const { displayCrit, lastCritDamage } = useAppSelector(animationPref <= 1 ? selectCritState : selectEmptyCritState)
  const multistrikeCooldown = useAppSelector(selectMultistrikeCooldown) * 1000
  const { lastMultistrikeTime, displayMultistrike } = useAppSelector(selectMultistrikeState)
  const lastSaveCatchUpRef = useRef(lastSaveCatchUp)

  // Interface between requestAnimationFrame and React to prevent infinite catchup loops
  useEffect(() => {
    lastSaveCatchUpRef.current = lastSaveCatchUp
  }, [lastSaveCatchUp])

  useCritCleanup({ animationPref, recentCrits, displayCrit })

  useEffect(() => {
    if (animationPref <= 1) return

    const interval = setInterval(() => {
      dispatch(cleanupOldCrits())
    }, 5000)

    return () => clearInterval(interval)
  }, [animationPref])

  const { monsterName, monsterImage } = useAppSelector(selectMonsterState)

  useGameEngine({ dotDamage, beatDamage, loading, lastSaveCatchUp })

  useEffect(() => {
    if (displayMultistrike) {
      const timeout = setTimeout(() => {
        dispatch(toggleDisplayMultistrike())
      }, 2000)
    }
  }, [displayMultistrike])

  const handleClick = useCallback(() => {
    const isCrit = Math.random() < critChance
    const damageDealt = isCrit
      ? clickDamage *
        (UPGRADE_CONFIG.prestigeUpgradeConfig.critMultiplier +
          Math.random() / (UPGRADE_CONFIG.prestigeUpgradeConfig.critVariance * 10))
      : clickDamage

    if (multistrikeCooldown !== 0) {
      const delta = Date.now() - lastMultistrikeTime
      const isMultiStrike = delta > multistrikeCooldown

      if (isMultiStrike) {
        for (let i = 0; i < UPGRADE_CONFIG.calcMultistrikeCount(); i++) {
          const isMSCrit = Math.random() < critChance
          const multiStrikeDamage = isMSCrit
            ? clickDamage *
              (UPGRADE_CONFIG.prestigeUpgradeConfig.critMultiplier +
                Math.random() / (UPGRADE_CONFIG.prestigeUpgradeConfig.critVariance * 10))
            : clickDamage

          setTimeout(() => {
            dispatch(
              updateMultistrikeDamageDealt({
                damage: multiStrikeDamage,
                isCrit: isMSCrit,
                isMultiStrike: true,
                animationPref,
              }),
            )
          }, i * UPGRADE_CONFIG.prestigeUpgradeConfig.multistrikeDelay)
        }
      }
    }

    dispatch(updateMonsterClicked({ damage: damageDealt, isCrit, isMultiStrike: false, animationPref }))
  }, [clickDamage, critChance, dispatch, multistrikeCooldown, lastMultistrikeTime, animationPref])

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
        {usingHighQualityAnimations &&
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
                    <p className="font-outline">{formatSmallNumber(crit.damage)}</p>
                    <p className="text-white text-4xl">⚡CRITICAL HIT⚡</p>
                  </div>
                </div>
              </div>
            )
          })}
        {!usingHighQualityAnimations && displayCrit && (
          <div className="absolute inset-0 text-yellow-400 text-6xl font-bold top-0">
            <div className="flex flex-col gap-1">
              <p>{formatSmallNumber(lastCritDamage)}</p>
              <p className="text-white text-4xl">⚡CRITICAL HIT⚡</p>
            </div>
          </div>
        )}
        {usingHighQualityAnimations && displayMultistrike && (
          <div className="absolute top-16 left-16 pointer-events-none">
            <div className="absolute animate-multistrike-ring">
              <div className="w-12 h-12 border-4 border-white rounded-full" />
            </div>
          </div>
        )}

        {!usingHighQualityAnimations && displayMultistrike && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="bg-dagger absolute left-[20%] translate-x-1/2 translate-y-1/2 opacity-0 w-[64px] h-[49px] animate-multistrike-simple-1 rotate-[120deg]" />
            <div className="bg-dagger absolute left-[30%] top-20 translate-x-1/2 translate-y-1/2 opacity-0 w-[64px] h-[49px] animate-multistrike-simple-2 rotate-180" />
            <div className="bg-dagger absolute left-[60%] top-24 translate-x-1/2 translate-y-1/2 opacity-0 w-[64px] h-[49px] animate-multistrike-simple-3 -rotate-90" />
          </div>
        )}
      </button>
    </>
  )
}
