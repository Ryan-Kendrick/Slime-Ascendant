import { useAppSelector } from "../../redux/hooks"
import { selectMonsterKind } from "../../redux/monsterSlice"
import clsx from "clsx/lite"

export default function Spotlight() {
  const kind = useAppSelector(selectMonsterKind)
  const isBoss = kind === "boss"

  return (
    <svg
      className="absolute -top-12 left-1/2 h-full w-[490px] -translate-x-1/2 blur-sm md:w-[550px] lg:top-0 lg:w-[110%] lg:w-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="none">
      <defs>
        <linearGradient id="ray-gradient-1" x1="50%" y1="100%" x2="50%" y2="0%">
          <stop offset="10%" className={clsx(isBoss ? "text-red-200/80" : "text-white/80")} stopColor="currentColor" />
          <stop offset="80%" className="text-transparent" stopColor="currentColor" />
        </linearGradient>
      </defs>
      <polygon points="0,0 100,0 80,100 20,100" fill="url(#ray-gradient-1)" />
    </svg>
  )
}
