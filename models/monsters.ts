export interface BaseEnemy {
  level: number
  baseHealth: number
}

export interface Enemy {
  name: string
  maxHealth: number
  health: number
  goldValue: number
  image: string
  plasma?: number
}

type MonsterKind = "regular" | "rare" | "special" | "boss"

export interface MonsterType {
  name: string
  kind: MonsterKind
  healthMulti: number
  goldMulti?: number
  imagePath: string
}

interface HealthConfig {
  base: number
  growth: number
  smoothing: number
}

interface GoldConfig {
  healthDivisor: number
  healthMultiBonus: number
}

interface BossConfig {
  extraLevels: 20
  plasmaExpoGrowth: number
  plasmaLinGrowth: number
  plasmaValue: (zoneNumber: number) => number
}

export interface BaseMonsterConfig {
  health: HealthConfig
  gold: GoldConfig
  boss: BossConfig
  regularSpawnChance: number
  specialSpawnChance: number
}

export interface EnemyState extends Enemy {
  level: number
  kind: MonsterKind
}
