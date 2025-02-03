import { PropsWithChildren, useCallback, useEffect, useRef } from "react"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { selectClickDamage, selectDotDamage } from "../../redux/playerSlice"
import { selectMonsterState, spawnMonster } from "../../redux/monsterSlice"
import { updateDotDamageDealt, updateMonsterClicked } from "../../redux/statsSlice"
import { store } from "../../redux/store"
import { clearCatchUpTime, saveGame, selectLastSaveCatchUp, selectLoading, setLoading } from "../../redux/metaSlice"
import { EnemyState } from "../../models/monsters"
import { selectZoneState } from "../../redux/zoneSlice"

export default function Monster({ children }: PropsWithChildren) {
  const dispatch = useAppDispatch()

  const clickDamage = useAppSelector(selectClickDamage)
  const dotDamage = useAppSelector(selectDotDamage)
  const lastSaveCatchUp = useAppSelector(selectLastSaveCatchUp)
  const loading = useAppSelector(selectLoading)

  const lastSaveCatchUpRef = useRef(lastSaveCatchUp)

  // Interface between requestAnimationFrame and React to prevent infinite catchup loops
  useEffect(() => {
    lastSaveCatchUpRef.current = lastSaveCatchUp
  }, [lastSaveCatchUp])

  const { monsterName, monsterImage, monsterLevel } = useAppSelector(selectMonsterState)
  const { currentZoneNumber, zoneInView, isFarming, zoneMonsters, farmZoneMonsters, farmZoneNumber, stageNumber } =
    useAppSelector(selectZoneState)

  const tickCount = useRef(0)
  const lastFrameTime = useRef(performance.now())
  const frameRef = useRef<number>()
  const TICK_RATE = 20
  const TICK_TIME = 1000 / TICK_RATE

  const runTasks = useCallback((catchup?: boolean) => {
    // 30 seconds
    if (!catchup && tickCount.current % 600 === 0) {
      dispatch(saveGame())
    }
  }, [])

  const dealDamageOverTime = () => {
    if (dotDamage) {
      const damageThisTick = dotDamage / 20
      dispatch(updateDotDamageDealt(damageThisTick))
    }
  }

  const handleProgress = useCallback(
    (delta: number): number => {
      while (delta >= TICK_TIME) {
        tickCount.current++

        dealDamageOverTime()
        // More than 30 seconds behind, use catchup flag to prevent save spam
        if (delta >= 30000) {
          runTasks(true)
        } else {
          runTasks()
        }

        if (lastSaveCatchUpRef.current && delta <= 100) dispatch(clearCatchUpTime())
        delta -= TICK_TIME
      }
      return delta
    },
    [tickCount, dealDamageOverTime, runTasks, store],
  )

  const handleOfflineProgress = useCallback(
    async (delta: number, long?: boolean): Promise<number> => {
      dispatch(setLoading(true))
      await new Promise((resolve) => setTimeout(resolve, 0))
      try {
        if (long) {
          // TODO: Fullscreen catchup with asynchronous break
          // Split into chunks, await new Promise(resolve => setTimeout(resolve, 0))
          console.warn("Reduced offline progression to 1 hour because long catchup is yet to be implemented")
          delta = 3600000
          delta = handleProgress(delta)
        } else {
          // console.log("Processing offline ticks:", delta / TICK_RATE)
          delta = handleProgress(delta)
        }
      } catch (err) {
        console.error("Offline progress failed:", err)
      } finally {
        dispatch(setLoading(false))
      }
      return delta
    },

    [saveGame, handleProgress],
  )

  const gameLoop = useCallback(
    (currentTime: number) => {
      let delta: number
      if (lastSaveCatchUpRef.current) {
        delta = Date.now() - lastSaveCatchUpRef.current
        dispatch(clearCatchUpTime())
      } else {
        delta = currentTime - lastFrameTime.current
      }

      const handleCatchUp = async () => {
        delta = delta > 3600000 ? await handleOfflineProgress(delta, true) : await handleOfflineProgress(delta)
        lastFrameTime.current = currentTime - (delta % TICK_TIME)
        frameRef.current = requestAnimationFrame(gameLoop)
      }

      if (delta <= 600000) {
        delta = handleProgress(delta)
        lastFrameTime.current = currentTime - (delta % TICK_TIME)
        frameRef.current = requestAnimationFrame(gameLoop)
        if (loading) dispatch(setLoading(false))
        return
      }

      handleCatchUp()
    },
    [handleOfflineProgress, handleProgress, loading],
  )

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (frameRef.current) {
          cancelAnimationFrame(frameRef.current)
          frameRef.current = undefined
        }
      } else {
        setTimeout(() => {
          if (!frameRef.current) {
            frameRef.current = requestAnimationFrame(gameLoop)
          }
        }, 0)
      }
    }
    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange)
  }, [gameLoop])

  useEffect(() => {
    frameRef.current = requestAnimationFrame(gameLoop)
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [gameLoop])

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
