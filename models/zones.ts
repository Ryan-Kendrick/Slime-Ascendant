import { Enemy } from "./monsters"
export interface BaseZone {
  zoneLength?: number
  zoneNumber: number
  monsters: Enemy[]
}

export interface ZoneConfig {
  length: number
}

export interface Stage {
  thisStageNumber: number
  isSpecial: boolean
  iconVisible: boolean
  isCurrentStage: boolean
  isCompleted: boolean
}
