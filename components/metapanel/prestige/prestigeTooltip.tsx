import React, { memo } from "react"
import { PrestigeUpgradeId } from "../../../models/upgrades"
import { UPGRADE_CONFIG } from "../../../gameconfig/upgrades"

interface Props {
  visible: boolean
  position: { x: number; y: number }
  tooltipRef: React.RefObject<HTMLDivElement>
  hoveredUpgrade: PrestigeUpgradeId | null
}

export default memo(function PrestigeTooltip({ visible, position, tooltipRef, hoveredUpgrade }: Props) {
  const upgrade = hoveredUpgrade ? UPGRADE_CONFIG.prestigeUpgrades[hoveredUpgrade] : null

  return (
    <div
      ref={tooltipRef}
      style={{
        left: position.x,
        top: position.y,
        opacity: visible ? 1 : 0,
      }}
      className="pointer-events-none absolute z-20 w-max max-w-64 border-b-[1px] border-l-[3px] border-r-[3px] border-t-[1px] border-white border-b-electricBlue border-t-electricBlue bg-slate-800 px-1 font-passion text-frost">
      <h3 className="text-center text-2xl">{upgrade?.displayName}</h3>
      <p className="text-lg">{upgrade?.tooltip}</p>
    </div>
  )
})
