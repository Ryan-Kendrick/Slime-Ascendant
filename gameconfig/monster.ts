import { BaseEnemy, Enemy, MonsterType, BaseMonsterConfig, EnemyState } from "../models/monsters"
import { ZONE_CONFIG } from "./zone"
import caveTrollURL from "../assets/monsters/cave-troll.webp"
import dagonmireURL from "../assets/monsters/dagonmire.webp"
import errantPlasmaURL from "../assets/monsters/errnat-plasma.webp"
import forestGuardURL from "../assets/monsters/forest-guard.webp"
import gemCrabURL from "../assets/monsters/gem-crab.webp"
import ohcreJellyURL from "../assets/monsters/ochre-jelly.webp"
import pollenRuntURL from "../assets/monsters/pollen-runt.webp"
import wailShroomURL from "../assets/monsters/wail-shroom.webp"
import slimeURL from "../assets/monsters/slime.webp"
import jungleProwlerURL from "../assets/monsters/jungle-prowler.webp"
import toothURL from "../assets/monsters/tooth.webp"

const MONSTER_CONFIG: BaseMonsterConfig = {
  health: {
    base: 10,
    growth: 1.1,
    smoothing: 6,
  },
  gold: {
    healthDivisor: 4,
    healthMultiBonus: 1.5,
  },
  boss: {
    extraLevels: 20,
    plasmaExpoGrowth: 1.2,
    plasmaLinGrowth: 1.3,
    plasmaValue: function (zoneNumber) {
      return Math.round(Math.pow(this.plasmaExpoGrowth, zoneNumber - 1 * this.plasmaLinGrowth))
    },
  },
  regularSpawnChance: 0.97,
  specialSpawnChance: 0.005,
  // attack etc.
}

const MONSTER_VARIATIONS: MonsterType[] = [
  { name: "Cave Troll", kind: "regular", healthMulti: 2.5, imagePath: `${caveTrollURL}` },
  { name: "Dagonmire Spawn", kind: "regular", healthMulti: 1.3, imagePath: `${dagonmireURL}` },
  { name: "Forest Guard", kind: "regular", healthMulti: 1.75, imagePath: `${forestGuardURL}` },
  { name: "Ochre Jelly", kind: "regular", healthMulti: 1.1, imagePath: `${ohcreJellyURL}` },
  { name: "Pollen Runt", kind: "regular", healthMulti: 1.2, imagePath: `${pollenRuntURL}` },
  { name: "Wail Shroom", kind: "regular", healthMulti: 1, imagePath: `${wailShroomURL}` },
  { name: "Slime", kind: "regular", healthMulti: 1, imagePath: `${slimeURL}` },
  { name: "Jungle Prowler", kind: "regular", healthMulti: 1.4, imagePath: `${jungleProwlerURL}` },
]

const BOSS_VARIATIONS: MonsterType[] = [{ name: "Tooth", kind: "boss", healthMulti: 2, imagePath: `${toothURL}` }]
const RARE_VARIATIONS: MonsterType[] = [
  {
    name: "Gem Crab",
    kind: "rare",
    healthMulti: 0.5,
    goldMulti: 20,
    imagePath: `${gemCrabURL}`,
  },
]
const SPECIAL_VARIATIONS: MonsterType[] = [
  { name: "Errant Plasma", kind: "special", healthMulti: 1, goldMulti: 0, imagePath: `${errantPlasmaURL}` },
]

class BaseMonster implements BaseEnemy {
  level = 0
  basehealth = 0
  get baseHealth(): number {
    const { base, growth, smoothing } = MONSTER_CONFIG.health
    return base * Math.sqrt(this.level) * Math.pow(growth, this.level / smoothing)
  }

  constructor(zoneNumber: number, stageNumber: number, isBoss: boolean) {
    this.level = (zoneNumber - 1) * ZONE_CONFIG.length + stageNumber
    if (isBoss) this.level += MONSTER_CONFIG.boss.extraLevels
  }
}

class Monster extends BaseMonster implements Enemy {
  name
  kind
  health
  maxHealth
  image
  goldValue
  plasma?: number

  constructor(config: MonsterType, zoneNumber: number, stageNumber: number, isBoss: boolean) {
    super(zoneNumber, stageNumber, isBoss)
    this.name = config.name
    this.kind = config.kind
    const healthMulti = config.healthMulti
    this.health = Math.floor(this.baseHealth * healthMulti)
    this.maxHealth = this.health
    this.image = config.imagePath
    const goldMulti = config.goldMulti ?? 1
    const { healthDivisor, healthMultiBonus } = MONSTER_CONFIG.gold
    this.goldValue = Math.floor((this.baseHealth / healthDivisor) * (healthMulti * healthMultiBonus) * goldMulti)
    if (isBoss) this.plasma = MONSTER_CONFIG.boss.plasmaValue(zoneNumber)
  }
}

export function getRandomMonster(
  zoneNumber = 1,
  stageNumber = 1,
  isBoss = false,
  isFarming = false,
  rareMonsterBonus = 0,
): EnemyState {
  let randomMonster: MonsterType
  if (isBoss) {
    randomMonster = BOSS_VARIATIONS[Math.floor(Math.random() * BOSS_VARIATIONS.length)]
  } else {
    const randomValue = Math.random()
    const regularSpawnChance = MONSTER_CONFIG.regularSpawnChance * Math.pow(0.99, rareMonsterBonus)
    const specialSpawnChance = MONSTER_CONFIG.specialSpawnChance

    if (specialSpawnChance > randomValue && zoneNumber > 10 && !isFarming) {
      randomMonster = SPECIAL_VARIATIONS[Math.floor(Math.random() * SPECIAL_VARIATIONS.length)]
    } else if (regularSpawnChance > randomValue) {
      randomMonster = MONSTER_VARIATIONS[Math.floor(Math.random() * MONSTER_VARIATIONS.length)]
    } else {
      randomMonster = RARE_VARIATIONS[Math.floor(Math.random() * RARE_VARIATIONS.length)]
    }
  }
  const newMonster = serializableMonster(new Monster(randomMonster, zoneNumber, stageNumber, isBoss))
  return newMonster
}

export function getMonster(monsterName: string, zoneNumber = 1, stageNumber = 1, isBoss = false): EnemyState {
  const allMonsters = MONSTER_VARIATIONS.concat(BOSS_VARIATIONS, RARE_VARIATIONS, SPECIAL_VARIATIONS)
  for (const monster of allMonsters) {
    if (monster.name === monsterName) return serializableMonster(new Monster(monster, zoneNumber, stageNumber, isBoss))
  }
  throw new Error(`Monster not found: ${monsterName}`)
}

function serializableMonster(monster: Monster): EnemyState {
  const serializable = {
    name: monster.name,
    kind: monster.kind,
    level: monster.level,
    health: monster.health,
    maxHealth: monster.maxHealth,
    goldValue: monster.goldValue,
    image: monster.image,
    plasma: monster?.plasma,
  }
  return serializable
}
