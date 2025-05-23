import clsx from "clsx/lite"
import { useEffect, useRef, useState } from "react"
import { useAppSelector } from "../../redux/hooks"
import { selectMonsterHealth, selectMonsterMaxHealth } from "../../redux/monsterSlice"
import { selectWarriorDamage } from "../../redux/shared/heroSelectors"
import { formatSmallNumber } from "../../gameconfig/utils"

export default function Healthbar() {
  const monsterHealth = useAppSelector(selectMonsterHealth)
  const monsterMaxHealth = useAppSelector(selectMonsterMaxHealth)
  const warriorDamage = useAppSelector(selectWarriorDamage)

  const targetHealth = useRef((monsterHealth / monsterMaxHealth) * 100)
  const interpRate = 5
  const [width, setWidth] = useState(100)
  const frameRef = useRef<number>()

  useEffect(() => {
    targetHealth.current = (monsterHealth / monsterMaxHealth) * 100

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

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [monsterHealth, monsterMaxHealth])

  const formattedHealth = formatSmallNumber(monsterHealth)

  return (
    <>
      <div className="text-center">{formattedHealth}</div>
      <div className="relative h-8 w-48 border border-black">
        <div className="relative h-full" style={{ width: `${Math.max(0, Math.min(100, width))}%` }}>
          <div className={clsx("h-full bg-gradient-to-b from-hpgreen to-darkgreen rounded-sm transform-gpu")}></div>
          <div className="absolute h-3/4 bottom-0 w-full bg-gradient-to-b from-white/0 via-white/80 to-white/20 z-10"></div>
        </div>
      </div>
    </>
  )
}
