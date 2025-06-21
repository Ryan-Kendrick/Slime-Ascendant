import React, { useState, useEffect, useRef } from "react"
import { useAppDispatch, useAppSelector } from "../redux/hooks"
import {
  clearCatchUpTime,
  saveGame,
  selectBreakpoint,
  selectOTPPos,
  setBreakpoint,
  setLoading,
  setOTPPos,
} from "../redux/metaSlice"
import { removeCrit, toggleDisplayCrit, updateDotDamageDealt } from "../redux/statsSlice"
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

export function useBreakpointTracker(storedBreakpoint: number) {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const handleResize = () => {
      const currentWidth = window.innerWidth

      // Tailwind breakpoints - sm: 768px, md: 1024px, lg: 1280px, xl: 1536px
      if (storedBreakpoint !== 768 && currentWidth < 768) {
        dispatch(setBreakpoint(768))
      } else if (storedBreakpoint !== 1024 && currentWidth >= 768 && currentWidth < 1024) {
        dispatch(setBreakpoint(1024))
      } else if (storedBreakpoint !== 1280 && currentWidth >= 1024 && currentWidth < 1280) {
        dispatch(setBreakpoint(1280))
      } else if (storedBreakpoint !== 1536 && currentWidth >= 1280) {
        dispatch(setBreakpoint(1536))
      }
    }

    window.addEventListener("resize", handleResize)
    handleResize()

    return () => window.removeEventListener("resize", handleResize)
  }, [storedBreakpoint])
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
      dispatch(clearCatchUpTime())
    }
    return delta
  }

  const gameLoop = (currentTime: number) => {
    let delta: number
    if (lastSaveCatchUpRef.current) {
      delta = Date.now() - lastSaveCatchUpRef.current
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

  const handleTouchEnd = (e: TouchEvent) => {
    if (e.target instanceof Element) {
      const heroCardElement = e.target.closest(".hero-card")?.id as HeroName | undefined

      if (heroCardElement) {
        const selectedHero = heroCardElement?.split("-")[0] as HeroName
        setSelectedHeroCard(selectedHero)
      } else {
        setSelectedHeroCard(undefined)
      }
    }
  }

  useEffect(() => {
    document.addEventListener("touchend", handleTouchEnd, true)
    return () => document.removeEventListener("touchend", handleTouchEnd, true)
  }, [])

  return selectedHeroCard
}

interface UseOTPPositionsProps {
  heroName: HeroName
  OTPUpgradeCount: number
  iconsLength: number
  shouldMount: boolean
}

export function useOTPPositions({
  heroName,
  OTPUpgradeCount,
  iconsLength,
  shouldMount,
}: UseOTPPositionsProps): React.RefObject<HTMLDivElement> {
  const dispatch = useAppDispatch()
  const breakpoint = useAppSelector(selectBreakpoint)
  const isMobile = breakpoint === 768

  const OTPContainerRef = useRef<HTMLDivElement>(null)
  const stateOTPPositions = useAppSelector(selectOTPPos(heroName))
  const hasRestoredPositions = useRef(false)
  const updateOTPPosTimeout = useRef<NodeJS.Timeout | null>(null)

  const calculatePurchasedPosition = (index: number, containerWidth: number, containerHeight: number) => {
    const itemWidth = 36
    const itemGap = 8
    const rightEdgePosition = containerWidth - itemWidth - index * (itemWidth + itemGap)

    if (isMobile) {
      return { x: rightEdgePosition + 4, y: 0 }
    } else {
      const bottomEdgePosition = containerHeight - itemWidth
      return { x: rightEdgePosition, y: bottomEdgePosition }
    }
  }

  const restoreOTPPositions = () => {
    if (!OTPContainerRef.current) return

    const container = OTPContainerRef.current
    const items = container.getElementsByClassName("upgrade-item")

    Array.from(items).forEach((item, index) => {
      const savedPos = stateOTPPositions[index]
      if (!savedPos || (savedPos.x === 0 && savedPos.y === 0)) return

      const element = item as HTMLElement

      element.style.left = `${savedPos.x}px`
      element.style.top = `${typeof savedPos.y === "number" ? savedPos.y : 0}px`
    })

    hasRestoredPositions.current = true
  }

  const updateOTPIconPositions = () => {
    if (!OTPContainerRef.current) return

    const container = OTPContainerRef.current
    const items = container.getElementsByClassName("upgrade-item")
    const containerWidth = container.offsetWidth
    const containerHeight = container.offsetHeight

    const newPositions: { x: number; y: number }[] = []

    Array.from(items).forEach((item, index) => {
      const element = item as HTMLElement
      let restingPosition = { x: 0, y: 0 }

      if (element.classList.contains("purchased")) {
        restingPosition = calculatePurchasedPosition(index, containerWidth, containerHeight)

        const oldX = Number(element.style.left.replace("px", "")) || 0
        const oldY = Number(element.style.top.replace("px", "")) || 0
        const xDistance = restingPosition.x - oldX
        const yDistance = restingPosition.y - oldY

        element.style.transform = `translate(${xDistance}px, ${yDistance}px)`
      } else {
        element.style.transform = ""
      }

      newPositions.push(restingPosition)
    })

    if (updateOTPPosTimeout.current) {
      clearTimeout(updateOTPPosTimeout.current)
    }

    updateOTPPosTimeout.current = setTimeout(() => {
      newPositions.forEach((position, index) => {
        dispatch(
          setOTPPos({
            hero: heroName,
            otpIndex: index,
            position,
          }),
        )
      })
    }, 5000)
  }

  useEffect(() => {
    if (!OTPContainerRef.current) return

    if (!hasRestoredPositions.current) {
      restoreOTPPositions()
    } else {
      requestAnimationFrame(updateOTPIconPositions)
    }

    const resizeObserver = new ResizeObserver(() => requestAnimationFrame(updateOTPIconPositions))
    resizeObserver.observe(OTPContainerRef.current)

    return () => {
      if (updateOTPPosTimeout.current) {
        clearTimeout(updateOTPPosTimeout.current)
      }
      resizeObserver.disconnect()
    }
  }, [OTPUpgradeCount, iconsLength, isMobile, shouldMount])

  return OTPContainerRef
}

type AnimationProps = {
  animationPref: number
  recentCrits: Array<{ id: string; damage: number; timestamp: number }>
  displayCrit: boolean
}

export const useCritCleanup = (animationState: AnimationProps) => {
  const { animationPref, recentCrits, displayCrit } = animationState
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (animationPref < 2) {
      if (displayCrit) {
        const timeout = setTimeout(() => {
          dispatch(toggleDisplayCrit())
        }, 2000)
      }
    } else {
      if (displayCrit) dispatch(toggleDisplayCrit())
      if (recentCrits.length === 0) return

      const timeouts = recentCrits.map((crit) =>
        setTimeout(() => {
          dispatch(removeCrit(crit.id))
        }, 2000),
      )

      return () => timeouts.forEach(clearTimeout)
    }
  }, [animationPref, recentCrits, displayCrit])
}
