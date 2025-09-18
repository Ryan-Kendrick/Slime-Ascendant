import React, { useState, useEffect, useRef, useCallback } from "react"
import { useAppDispatch, useAppSelector } from "../redux/hooks"
import {
  clearCatchUpTime,
  saveGame,
  selectBreakpoint,
  selectOTPPos,
  setBreakpoint,
  setLongCatchupProcessed,
  setLoading,
  setLongCatchupDelta,
  setOTPPos,
  addLongCatchupProcessed,
} from "../redux/metaSlice"
import { removeCrit, toggleDisplayCrit, updateBeatDamageDealt, updateDotDamageDealt } from "../redux/statsSlice"
import { HeroName, PrestigeUpgradeId } from "../models/upgrades"
import { AnimationPreference, PERFORMANCE_CONFIG } from "./meta"

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
  beatDamage: number
  loading: boolean
  lastSaveCatchUp: number | null
  abortCatchup: boolean
  animationPref: AnimationPreference
}

export function useGameEngine(props: EngineProps) {
  const dispatch = useAppDispatch()
  const { dotDamage, beatDamage, loading, lastSaveCatchUp, abortCatchup, animationPref } = props

  const dotDamageRef = useRef(dotDamage)
  const beatDamageRef = useRef(beatDamage)
  const lastSaveCatchUpRef = useRef(lastSaveCatchUp)
  const abortCatchupRef = useRef(abortCatchup)

  const tickCount = useRef(0)
  const lastLoopTime = useRef(Date.now())
  const frameRef = useRef<number>()
  const TICK_RATE = 20 / PERFORMANCE_CONFIG.animPrefGameSpeedMod[animationPref]
  const TICK_TIME = 1000 / TICK_RATE

  const lastBeatTime = useRef<number | null>(beatDamage ? performance.now() : null)
  const bpm = PERFORMANCE_CONFIG.bpm
  const BEAT_TIME = 60000 / bpm

  useEffect(() => {
    abortCatchupRef.current = abortCatchup
  }, [abortCatchup])
  useEffect(() => {
    dotDamageRef.current = dotDamage
  }, [dotDamage])
  useEffect(() => {
    beatDamageRef.current = beatDamage
  }, [beatDamage])
  useEffect(() => {
    lastSaveCatchUpRef.current = lastSaveCatchUp
  }, [lastSaveCatchUp])

  const dealDamageOverTime = () => {
    if (dotDamageRef.current > 0) {
      const damageThisTick = dotDamageRef.current / TICK_RATE
      dispatch(updateDotDamageDealt(damageThisTick))
    }
  }

  const dealDamageOnBeat = () => {
    dispatch(updateBeatDamageDealt(beatDamageRef.current))
  }

  const handleProgress = (delta: number, beatDelta: number, saving: boolean): number[] => {
    let processedDelta = 0
    let processedBeats = 0

    const useBeatCatchup = beatDamageRef.current > 0 && beatDelta >= BEAT_TIME * 2

    while (delta >= TICK_TIME) {
      tickCount.current++

      dealDamageOverTime()

      // Save every 30s during realtime gameplay
      if (saving && tickCount.current % 600 === 0) dispatch(saveGame())

      // Process beats in catchup mode;
      if (useBeatCatchup) {
        const beatToProcess = (processedDelta + TICK_TIME) / BEAT_TIME > processedBeats
        if (beatToProcess) {
          dealDamageOnBeat()
          processedBeats++
        }
      }

      delta -= TICK_TIME
      processedDelta += TICK_TIME
    }

    return [delta, beatDelta]
  }

  const handleOfflineProgress = async (props: {
    delta: number
    beatDelta: number
    longCatchup: boolean
  }): Promise<number[]> => {
    let { delta, beatDelta } = props
    const longCatchup = props.longCatchup

    if (longCatchup) {
      // Performance logging ──────────────────────────────────────────────
      // const totalDelta = delta
      // const startTime = performance.now() // ← record start
      // ─────────────────────────────────────────────────────────────────
      dispatch(setLongCatchupDelta(delta))
      await new Promise((resolve) => setTimeout(resolve, 0))

      const MAX_CHUNK_SIZE = PERFORMANCE_CONFIG.catchup.chunkSize

      while (delta > TICK_TIME) {
        if (abortCatchupRef.current) return [0]
        const chunk = Math.min(delta, MAX_CHUNK_SIZE)
        console.log("Processing chunk", chunk, "of", delta)
        const [chunkDelta] = handleProgress(chunk, chunk, false)
        const processed = chunk - chunkDelta
        delta -= processed
        dispatch(addLongCatchupProcessed(processed))

        // Performance logging ─────────────────────────────────────────────
        // const elapsed = performance.now() - startTime
        // const processedTotal = totalDelta - delta
        // const progress = processedTotal / totalDelta
        // const estTotalTime = elapsed / progress
        // const remainingTime = estTotalTime - elapsed

        // console.log(
        //   `[Catchup] processedTotal=${processedTotal}ms (${(progress * 100).toFixed(
        //     1,
        //   )}%), elapsed=${elapsed.toFixed(0)}ms, ETA=${remainingTime.toFixed(0)}ms`,
        // )
        // ─────────────────────────────────────────────────────────────────

        await new Promise((resolve) => setTimeout(resolve, 0))
      }

      dispatch(setLongCatchupProcessed(true))
    } else {
      dispatch(setLoading(true))
      await new Promise((resolve) => setTimeout(resolve, 0))
      ;[delta, beatDelta] = handleProgress(delta, beatDelta, false)
      dispatch(setLoading(false))
    }

    return [delta, beatDelta]
  }

  // Added useCallback to stabilise the game loop. This probably makes a stale closure for
  const gameLoop = useCallback(
    (currentTime: number) => {
      let delta: number
      let beatDelta = 0
      if (lastSaveCatchUpRef.current) {
        delta = Date.now() - lastSaveCatchUpRef.current
        beatDelta = delta
      } else {
        delta = currentTime - lastLoopTime.current
        if (lastBeatTime.current) beatDelta = currentTime - lastBeatTime.current
      }
      const onRegularTime = delta <= PERFORMANCE_CONFIG.catchup.shortBreakpoint

      const handleCatchUp = async () => {
        const longCatchup = delta > PERFORMANCE_CONFIG.catchup.longBreakpoint
        ;[delta, beatDelta] = await handleOfflineProgress({ delta, beatDelta, longCatchup })
        lastLoopTime.current = currentTime - (delta % TICK_TIME)
        if (lastBeatTime.current) lastBeatTime.current = currentTime - (beatDelta % BEAT_TIME)
        dispatch(clearCatchUpTime())
        frameRef.current = requestAnimationFrame(gameLoop)
      }

      if (onRegularTime) {
        const shouldBeatNow = beatDelta >= BEAT_TIME && beatDelta < BEAT_TIME * 2

        if (shouldBeatNow) {
          dealDamageOnBeat()
          beatDelta -= BEAT_TIME
        }
        ;[delta, beatDelta] = handleProgress(delta, beatDelta, true)
        lastLoopTime.current = currentTime - (delta % TICK_TIME)
        if (lastBeatTime.current) lastBeatTime.current = currentTime - (beatDelta % BEAT_TIME)
        if (lastSaveCatchUpRef.current) dispatch(clearCatchUpTime())
        frameRef.current = requestAnimationFrame(gameLoop)
        if (loading) dispatch(setLoading(false))
        return
      } else {
        handleCatchUp()
      }
    },
    [TICK_TIME, BEAT_TIME],
  )

  useEffect(() => {
    frameRef.current = requestAnimationFrame(gameLoop)
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [gameLoop])

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

export const useConfetti = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [jsConfetti, setJSConfetti] = useState(null as any)
  const [hasTriggeredConfetti, setHasTriggeredConfetti] = useState(false)

  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://cdn.jsdelivr.net/npm/js-confetti@latest/dist/js-confetti.browser.js"
    script.async = true

    script.onload = () => {
      // @ts-ignore
      const confettiInstance = new window.JSConfetti()
      setJSConfetti(confettiInstance)
    }

    document.head.appendChild(script)
    return () => {
      document.head.removeChild(script)
    }
  }, [])

  const triggerConfetti = () => {
    if (jsConfetti) {
      jsConfetti.addConfetti()
      setHasTriggeredConfetti(true)
    }
  }

  return { triggerConfetti, hasTriggeredConfetti }
}

export const useKeypressEasterEgg = () => {
  const [shouldConfetti, setShouldConfetti] = useState(false)
  useEffect(() => {
    const phrase = ["i", " ", "a", "m", " ", "m", "u", "m"]
    const keys = [] as string[]

    const handleKeyDown = (event: KeyboardEvent) => {
      keys.push(event.key.toLowerCase())
      if (keys.length > phrase.length) keys.shift()

      if (keys.length === phrase.length) {
        for (let i = 0; i < keys.length; i++) {
          if (keys[i] !== phrase[i]) return false
          if (i === 7 && keys[i] === phrase[i]) {
            setShouldConfetti(true)
            setTimeout(() => setShouldConfetti(false), 100)
          }
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [])
  return shouldConfetti
}

interface ToolTipProps {
  containerRef: React.RefObject<HTMLElement>
  tooltipRef: React.RefObject<HTMLDivElement>
}

type Position = {
  x: number
  y: number
}

export const useToolTip = ({ containerRef, tooltipRef }: ToolTipProps) => {
  const [isVisible, setIsVisible] = useState(false)
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 })
  const [isPositionReady, setPositionReady] = useState(false)
  const animationFrame = useRef(0)

  const calculatePosition = useCallback(
    (e: MouseEvent): Position => {
      if (!tooltipRef.current || !containerRef.current) return { x: 0, y: 0 }

      const containerRect = containerRef.current.getBoundingClientRect()
      const tooltipRect = tooltipRef.current.getBoundingClientRect()
      const { clientX, clientY } = e

      const offset = { x: 40, y: -28 }
      const margin = 4
      const tooltipHeight = 96 // Greater than expected height to ensure visual stability

      let left = clientX + offset.x
      let top = clientY - containerRect.top - tooltipHeight + offset.y

      left = Math.min(left, window.innerWidth - tooltipRect.width - containerRect.left - margin)
      top = Math.max(top, -containerRect.top + margin)

      return { x: left, y: top }
    },
    [containerRef, tooltipRef],
  )

  const setVisibility = useCallback(
    (prestigeUpgradeId: PrestigeUpgradeId | null, e?: MouseEvent) => {
      const visible = !!prestigeUpgradeId
      setIsVisible(visible)
      if (visible && e) {
        const newPosition = calculatePosition(e)
        setPosition(newPosition)
        setPositionReady(true)
      } else if (!visible) {
        setPositionReady(false)
      }
    },
    [calculatePosition],
  )

  useEffect(() => {
    if (!containerRef.current || !tooltipRef.current) return

    const handleMouseMove = (e: MouseEvent) => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current)
      }

      if (!tooltipRef || !tooltipRef.current) return

      if (isVisible) {
        animationFrame.current = requestAnimationFrame(() => {
          const newPosition = calculatePosition(e)
          setPosition(newPosition)
        })
      }
    }
    const container = containerRef.current
    container.addEventListener("mousemove", handleMouseMove, { passive: true })

    return () => {
      container.removeEventListener("mousemove", handleMouseMove)
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current)
      }
    }
  }, [isVisible, tooltipRef, containerRef, calculatePosition])

  return { position, setIsVisible: setVisibility, isPositionReady }
}
