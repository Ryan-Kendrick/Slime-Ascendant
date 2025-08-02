import { useEffect, useRef, useState } from "react"
import { useAppSelector } from "../../redux/hooks"
import { selectFading } from "../../redux/metaSlice"

export default function Fading() {
  const fading = useAppSelector(selectFading)
  const fadeTimer = useRef<NodeJS.Timeout | null>(null)
  const fadeIncrease = useRef<NodeJS.Timeout | null>(null)
  const [fadeIntensity, setFadeIntensity] = useState(0)

  useEffect(() => {
    if (fading) {
      // Fadeout duration 2500ms in PERFORMANCE_CONFIG.fadeoutDuration
      if (!fadeIncrease.current) {
        fadeIncrease.current = setInterval(() => {
          setFadeIntensity((prev) => prev + 0.05)
        }, 50)
      }
    } else {
      if (fadeTimer.current) {
        clearTimeout(fadeTimer.current)
        fadeTimer.current = null
      }

      if (fadeIncrease.current) {
        clearInterval(fadeIncrease.current)
        fadeIncrease.current = null
      }
      setFadeIntensity(0)
    }

    return () => {
      if (fadeIncrease.current) {
        clearInterval(fadeIncrease.current)
        fadeIncrease.current = null
      }
      if (fadeTimer.current) {
        clearTimeout(fadeTimer.current)
        fadeTimer.current = null
      }
    }
  }, [fading])

  if (!fading) return null

  return (
    <div
      className="fixed inset-0 z-50 bg-black transition-all ease-in-out"
      style={{
        backgroundColor: `rgba(0, 0, 0, ${fadeIntensity})`,
        backdropFilter: `blur(${fadeIntensity * 100}px)`,
      }}
    />
  )
}
