import React, { PropsWithChildren, useCallback, useEffect, useRef, useState } from "react"
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
  const [multistrikePos, setMultistrikePos] = useState({ x: 0, y: 0 })
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

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
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
          if (animationPref > 1) {
            const rect = e.currentTarget.getBoundingClientRect()
            setMultistrikePos({
              x: e.clientX - rect.left,
              y: e.clientY - rect.top,
            })
          }

          for (let i = 0; i < UPGRADE_CONFIG.calcMultistrikeCount(); i++) {
            let multiStrikeDamage = clickDamage
            const isMSCrit = Math.random() < critChance

            if (isMSCrit)
              multiStrikeDamage *=
                UPGRADE_CONFIG.prestigeUpgradeConfig.critMultiplier +
                Math.random() / (UPGRADE_CONFIG.prestigeUpgradeConfig.critVariance * 10)

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
    },
    [clickDamage, critChance, dispatch, multistrikeCooldown, lastMultistrikeTime, animationPref],
  )

  return (
    <>
      <div className="flex w-full flex-col items-center">
        <div className="relative flex w-full justify-center text-2xl">
          <div className="text-center">{monsterName}</div>
        </div>
        <div className="">{children}</div>
      </div>

      <button
        className="relative flex h-[27rem] max-h-[34rem] flex-grow items-end hover:cursor-dagger"
        onClick={(e) => handleClick(e)}>
        <img
          className="pointer-events-none h-full max-h-full w-full object-cover lg:object-contain"
          src={monsterImage}
          alt={monsterName}
        />
        {usingHighQualityAnimations &&
          recentCrits.map((crit) => {
            if (!crit.id) return null
            return (
              <div
                key={crit.id}
                className="pointer-events-none absolute inset-0 flex items-center justify-center"
                style={{
                  transform: `translate(${crit.position.x}px, ${crit.position.y}px)`,
                }}>
                <div className="absolute top-12 animate-float-up text-6xl font-bold text-yellow-300">
                  <div className="flex flex-col gap-1">
                    <p className="font-outline">{formatSmallNumber(crit.damage)}</p>
                    <p className="text-4xl text-white">⚡CRITICAL HIT⚡</p>
                  </div>
                </div>
              </div>
            )
          })}
        {!usingHighQualityAnimations && displayCrit && (
          <div className="absolute inset-0 top-0 text-6xl font-bold text-yellow-400">
            <div className="flex flex-col gap-1">
              <p>{formatSmallNumber(lastCritDamage)}</p>
              <p className="text-4xl text-white">⚡CRITICAL HIT⚡</p>
            </div>
          </div>
        )}
        {usingHighQualityAnimations && displayMultistrike && (
          <div style={{ top: multistrikePos.y, left: multistrikePos.x }} className="pointer-events-none absolute">
            <div className="absolute animate-multistrike-ring">
              <div className="h-12 w-12 rounded-full border-4 border-white" />
            </div>
          </div>
        )}

        {!usingHighQualityAnimations && displayMultistrike && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="absolute left-[20%] h-[49px] w-[64px] translate-x-1/2 translate-y-1/2 rotate-[120deg] animate-multistrike-simple-1 bg-dagger opacity-0" />
            <div className="absolute left-[30%] top-20 h-[49px] w-[64px] translate-x-1/2 translate-y-1/2 rotate-180 animate-multistrike-simple-2 bg-dagger opacity-0" />
            <div className="absolute left-[60%] top-24 h-[49px] w-[64px] translate-x-1/2 translate-y-1/2 -rotate-90 animate-multistrike-simple-3 bg-dagger opacity-0" />
          </div>
        )}
      </button>
    </>
  )
}
