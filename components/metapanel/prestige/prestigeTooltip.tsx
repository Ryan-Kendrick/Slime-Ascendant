import React from "react"
import { PrestigeUpgradeId } from "../../../models/upgrades"
import { UPGRADE_CONFIG } from "../../../gameconfig/upgrades"

interface Props {
  visible: boolean
  position: { x: number; y: number }
  tooltipRef: React.RefObject<HTMLDivElement>
  hoveredUpgrade: PrestigeUpgradeId | null
}

export default function PrestigeTooltip({ visible, position, tooltipRef, hoveredUpgrade }: Props) {
  const upgrade = hoveredUpgrade ? UPGRADE_CONFIG.prestigeUpgrades[hoveredUpgrade] : null

  const title = upgrade?.displayName
  const description = upgrade?.tooltip

  return (
    <div
      ref={tooltipRef}
      style={{ left: position.x, top: position.y, opacity: visible ? 1 : 0 }}
      className="absolute z-20 border-b-[1px] border-l-[3px] border-r-[3px] border-t-[1px] border-white border-b-electricBlue border-t-electricBlue bg-slate-800 px-1 font-passion text-frost">
      <h3 className="text-center text-2xl">{title}</h3>
      <p className="text-lg">{description}</p>
    </div>
  )
}
