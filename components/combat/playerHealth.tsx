import clsx from "clsx/lite"
import { useEffect, useRef, useState } from "react"
import { useAppSelector } from "../../redux/hooks"
import { formatSmallNumber } from "../../gameconfig/utils"
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

        return currentWidth + diff / interpRate
      })
      frameRef.current = requestAnimationFrame(animateHealth)
    }

    if (frameRef.current) cancelAnimationFrame(frameRef.current)

    frameRef.current = requestAnimationFrame(animateHealth)

    if (currentHealth < maxHealth && healthRef.current && animationPref > 0) {
      console.log("animate")
      healthRef.current?.classList.add("animate-shadow-inset")
      setTimeout(() => {
        healthRef.current?.classList.remove("animate-shadow-inset")
      }, 300)
    } else if (currentHealth < maxHealth && healthRef.current && animationPref === 0) {
      healthRef.current.classList.add("border-r-2", "border-yellow-300")
      setTimeout(() => {
        healthRef.current?.classList.remove("border-r-2", "border-yellow-300")
      }, 300)
    }

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [currentHealth, maxHealth, animationPref])

  const formattedHealth = formatSmallNumber(currentHealth)

  return (
    <div className="flex w-full flex-col items-center text-lg text-white">
      <div className="text-center">{formattedHealth}</div>
      <div className="relative mb-1 h-full w-[calc(100%-8px)] border border-frost shadow-md shadow-slate-800">
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
