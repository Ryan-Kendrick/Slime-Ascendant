import clsx from "clsx/lite"
import { useEffect, useRef, useState } from "react"
import { useAppSelector } from "../../redux/hooks"
import { formatSmallNumber } from "../../gameconfig/utils"
import { selectAnimationPref } from "../../redux/metaSlice"
import { selectHealth, selectRespawnTime } from "../../redux/playerSlice"

export default function PlayerHealth() {
  const { currentHealth, maxHealth } = useAppSelector(selectHealth)

  const healthRef = useRef<HTMLDivElement>(null)
  const animationPref = useAppSelector(selectAnimationPref)
  const respawnTime = useAppSelector(selectRespawnTime)
  const [currentRespawnTime, setCurrentRespawnTime] = useState(0)

  const targetHealth = useRef((currentHealth / maxHealth) * 100)
  const interpRate = 5
  const [width, setWidth] = useState(100)
  const frameRef = useRef<number>()

  useEffect(() => {
    // If there is respawn time, and no timer is running, start one
    if (respawnTime > 0) {
      if (currentRespawnTime === 0) setCurrentRespawnTime(respawnTime / 1000)
      setTimeout(() => {
        setCurrentRespawnTime(currentRespawnTime - 1)
      }, 1000)
    } else if (!respawnTime || targetHealth.current >= 0) {
      setCurrentRespawnTime(0)
    }
  }, [respawnTime, currentRespawnTime])

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
            className={clsx(
              "relative h-full transform-gpu rounded-sm bg-gradient-to-b from-hpgreen to-darkgreen transition-[width,background-color] duration-300 ease-out",
            )}></div>
          <div className="absolute bottom-0 z-10 h-3/4 w-full bg-gradient-to-b from-white/0 via-white/80 to-white/20" />
        </div>
        <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 font-passion text-6xl text-red-800">
          {currentRespawnTime > 0 && currentRespawnTime}
        </span>
      </div>
    </div>
  )
}
