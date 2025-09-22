import clsx from "clsx/lite"
import { useEffect, useRef, useState } from "react"
import { useAppSelector } from "../../redux/hooks"
import { formatSmallNumber } from "../../gameconfig/utils"
import { PERFORMANCE_CONFIG } from "../../gameconfig/meta"
import { selectAnimationPref } from "../../redux/metaSlice"
import { selectHealth } from "../../redux/playerSlice"

export default function PlayerHealth() {
  const { currentHealth, maxHealth } = useAppSelector(selectHealth)

  const healthRef = useRef<HTMLDivElement>(null)
  const animationPref = useAppSelector(selectAnimationPref)

  const targetHealth = useRef((currentHealth / maxHealth) * 100)
  const interpRate = 5
  const [width, setWidth] = useState(100)
  const frameRef = useRef<number>()

  useEffect(() => {
    targetHealth.current = (currentHealth / maxHealth) * 100

    const animateHealth = () => {
      setWidth((currentWidth) => {
        const diff = targetHealth.current - currentWidth

        if (Math.abs(diff) < 0.8) {
          return targetHealth.current
        }

        if (healthRef.current && animationPref > 0) {
          setTimeout(() => {
            healthRef.current?.classList.add("animate-shadow-inset")
          }, 60000 / PERFORMANCE_CONFIG.bpm)
          setTimeout(
            () => {
              healthRef.current?.classList.remove("animate-shadow-inset")
            },
            (60000 / PERFORMANCE_CONFIG.bpm) * 0.85,
          )
        } else if (healthRef.current && animationPref === 0) {
          healthRef.current.classList.add("border-r-2", "border-yellow-300")
          setTimeout(
            () => {
              healthRef.current?.classList.remove("border-r-2", "border-yellow-300")
            },
            (60000 / PERFORMANCE_CONFIG.bpm) * 0.6,
          )
        }

        return currentWidth + diff / interpRate
      })
      frameRef.current = requestAnimationFrame(animateHealth)
    }

    if (frameRef.current) cancelAnimationFrame(frameRef.current)

    frameRef.current = requestAnimationFrame(animateHealth)
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [currentHealth, maxHealth, animationPref])
  console.log(currentHealth)
  const formattedHealth = formatSmallNumber(currentHealth)
  console.log(formattedHealth)

  return (
    <div className="flex w-full flex-col items-center text-lg text-white">
      <div className="text-center">{formattedHealth}</div>
      <div className="relative mb-1 h-full w-[calc(100%-8px)] border border-black">
        <div className="relative h-full" style={{ width: `${Math.max(0, Math.min(100, width))}%` }}>
          <div
            ref={healthRef}
            className={clsx("h-full transform-gpu rounded-sm bg-gradient-to-b from-hpgreen to-darkgreen")}
          />
          <div className="absolute bottom-0 z-10 h-3/4 w-full bg-gradient-to-b from-white/0 via-white/80 to-white/20" />
        </div>
      </div>
    </div>
  )
}
