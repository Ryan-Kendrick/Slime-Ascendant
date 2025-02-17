import { EnemyState } from "../models/monsters"
import { BaseZone, ZoneConfig } from "../models/zones"
import { getRandomMonster } from "./monster"

export const ZONE_CONFIG: ZoneConfig = {
  length: 30,
}
export class Zone implements BaseZone {
  zoneLength = ZONE_CONFIG.length
  zoneNumber = 1
  monsters = [] as EnemyState[]

  constructor(currentZoneNumber: number, isFarming = false, zoneLength?: number) {
    const length = (zoneLength ??= this.zoneLength)
    for (let i = 0; i < length; i++) {
      const isBoss = (i === length - 1 ? true : false) && !isFarming
      this.monsters.push(getRandomMonster(currentZoneNumber, i + 1, isBoss, isFarming))
    }
  }
}
