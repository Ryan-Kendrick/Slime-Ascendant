export interface BaseEnemy {
  level: number
  baseHealth: number
  baseDamage: number
  baseAttackRate: number
}

export interface Enemy {
  name: string
  health: number
  maxHealth: number
  damage: number
  attackRate: number
  goldValue: number
  image: string
  plasma?: number
}

type MonsterKind = "regular" | "rare" | "special" | "boss"

export interface MonsterType {
  name: string
  kind: MonsterKind
  healthMulti: number
  damageMulti: number
  attackRateMulti: number
  goldMulti?: number
  imagePath: string
}

interface HealthConfig {
  base: number
  zonePower: number
  zoneCoeff: number
  levelCoeff: number
  expoStart: number
  expoGrowthRate: number
  stageMin: number
  stageMax: number
}

interface AttackConfig {
  baseDamage: number
  exp: number
  baseAttackRate: number
}

interface GoldConfig {
  healthDivisor: number
  healthMultiBonus: number
}

interface BossConfig {
  extraLevels: number
  plasmaBase: number
  plasmaLinGrowth: number
  plasmaExpoGrowth: number
  plasmaValue: (zoneNumber: number) => number
}

export interface BaseMonsterConfig {
  health: HealthConfig
  attack: AttackConfig
  gold: GoldConfig
  boss: BossConfig
  regularSpawnChance: number
  specialSpawnChance: number
}

export interface EnemyState extends Enemy {
  level: number
  kind: MonsterKind
  alive: boolean
}
