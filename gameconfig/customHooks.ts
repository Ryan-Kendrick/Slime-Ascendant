import { useState, useEffect, useRef } from "react"
import { useAppDispatch } from "../redux/hooks"
import { clearCatchUpTime, saveGame, setLoading } from "../redux/metaSlice"
import { updateDotDamageDealt } from "../redux/statsSlice"
import { HeroName } from "../models/upgrades"

export function useForcedDPI(): number {
  const getDPIScale = () => (window.matchMedia("(min-width: 1024px)").matches ? window.devicePixelRatio : 1)

  const [dpiScale, setDpiScale] = useState(getDPIScale)

  useEffect(() => {
    const queries = [
      window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`),
      window.matchMedia("(min-width: 1024px)"),
    ]

    const handleChange = () => setDpiScale(getDPIScale())

    queries.forEach((query) => query.addEventListener("change", handleChange))

    return () => queries.forEach((query) => query.removeEventListener("change", handleChange))
  }, [])

  return dpiScale
}

interface EngineProps {
  dotDamage: number
  loading: boolean
  lastSaveCatchUp: number | null
}

export function useGameEngine(props: EngineProps) {
  const dispatch = useAppDispatch()
  const { dotDamage, loading, lastSaveCatchUp } = props

  const tickCount = useRef(0)
  const lastFrameTime = useRef(performance.now())
  const frameRef = useRef<number>()
  const TICK_RATE = 20
  const TICK_TIME = 1000 / TICK_RATE

  const lastSaveCatchUpRef = useRef(lastSaveCatchUp)
  useEffect(() => {
    lastSaveCatchUpRef.current = lastSaveCatchUp
  }, [lastSaveCatchUp])

  const runTasks = (catchup?: boolean) => {
    // 30 seconds
    if (!catchup && tickCount.current % 600 === 0) {
      dispatch(saveGame())
    }
  }

  const dealDamageOverTime = () => {
    if (dotDamage) {
      const damageThisTick = dotDamage / 20
      dispatch(updateDotDamageDealt(damageThisTick))
    }
  }

  const handleProgress = (delta: number): number => {
    while (delta >= TICK_TIME) {
      tickCount.current++

      dealDamageOverTime()
      // More than 30 seconds behind, use catchup flag to prevent save spam
      if (delta >= 30000) {
        runTasks(true)
      } else {
        runTasks()
      }

      if (lastSaveCatchUpRef.current && delta <= 100) {
        dispatch(clearCatchUpTime())
      }
      delta -= TICK_TIME
    }
    return delta
  }

  const handleOfflineProgress = async (delta: number, long?: boolean): Promise<number> => {
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
  }

  const gameLoop = (currentTime: number) => {
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
  }

  useEffect(() => {
    frameRef.current = requestAnimationFrame(gameLoop)
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  })

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
  })
}

export function useTouchObserver() {
  const [selectedHeroCard, setSelectedHeroCard] = useState<HeroName | undefined>(undefined)

  const handleTouchStart = (e: TouchEvent) => {
    if (e.target instanceof Element) {
      const selectedHeroCardElement = e.target.closest(".hero-card")?.id as HeroName | undefined
      const selectedHero = selectedHeroCardElement?.split("-")[0] as HeroName
      setSelectedHeroCard(selectedHero)
    }
  }

  useEffect(() => {
    document.addEventListener("touchend", handleTouchStart)
    return () => document.removeEventListener("touchend", handleTouchStart)
  }, [])

  return selectedHeroCard
}
