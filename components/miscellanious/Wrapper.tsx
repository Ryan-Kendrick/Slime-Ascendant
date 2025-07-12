import { PropsWithChildren } from "react"
import { useBreakpointTracker, useForcedDPI } from "../../gameconfig/customHooks"
import { useAppSelector } from "../../redux/hooks"
import { selectBreakpoint } from "../../redux/metaSlice"
import { selectPrestigeCount } from "../../redux/statsSlice"

export default function Wrapper({ children }: PropsWithChildren) {
  // Reverse OS DPI scaling so the game looks as intended on high resolution displays
  const currentScale = useForcedDPI()
  const inverseScale = 1 / currentScale

  const appScale: React.CSSProperties | undefined =
    inverseScale !== 1
      ? {
          transform: `scale(${inverseScale})`,
          transformOrigin: "top left",
          width: `${100 * currentScale}vw`,
          height: `${100 * currentScale}vh`,
          position: "absolute",
          top: 0,
          left: 0,
        }
      : undefined

  // Track screen width globally
  const breakpoint = useAppSelector(selectBreakpoint)
  useBreakpointTracker(breakpoint)

  // Force component remount on prestige
  const prestigeCount = useAppSelector(selectPrestigeCount)

  return (
    <div
      key={`prestige-${prestigeCount}`}
      style={appScale}
      className="min-h-screen w-screen cursor-inactive select-none overflow-hidden font-sigmar lg:h-screen">
      {children}
    </div>
  )
}
