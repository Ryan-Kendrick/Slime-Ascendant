import { Dispatch, isAnyOf, Middleware } from "@reduxjs/toolkit"
import { selectMonsterState, spawnMonster } from "../monsterSlice"
import { selectZoneState, incrementStageNumber, refreshFarmZone, setZoneInView, zoneComplete } from "../zoneSlice"
import { ZONE_CONFIG } from "../../gameconfig/zone"
import { EnemyState } from "../../models/monsters"
import { increaseGold, increasePlasma } from "../playerSlice"
import { incrementFarmZonesCompleted, incrementKillCount } from "../statsSlice"
import { RootState, store } from "../store"
import { AchievementCategory, ACHIEVEMENTS } from "../../gameconfig/achievements"
import { checkAchievementUnlock } from "../shared/helpers"
import { monsterClicked, increaseTotalDotDamageDealt } from "../statsSlice"

export const deathMiddleware: Middleware = (store) => (next) => (action) => {
  const nextAction = next(action)

  if (!isAnyOf(monsterClicked, increaseTotalDotDamageDealt)(action)) return nextAction

  const state: RootState = store.getState()
  const { monsterAlive, monsterGoldValue, monsterPlasmaValue } = selectMonsterState(state)

  if (monsterAlive) return nextAction

  const {
    currentZoneNumber,
    zoneMonsters,
    stageNumber: currentStage,
    isFarming,
    farmZoneMonsters,
    farmStageNumber,
    zoneInView,
  } = selectZoneState(state)

  const dispatch = store.dispatch
  const zoneLength = ZONE_CONFIG.length

  dispatch(incrementKillCount())
  dispatch(increaseGold(monsterGoldValue))
  let nextMonster: undefined | EnemyState

  const isProgressing = zoneInView === currentZoneNumber
  const stageNumber = isProgressing ? currentStage : farmStageNumber

  // Zone transition
  if (stageNumber === zoneLength) {
    // When highest zone
    if (isProgressing) {
      updateZonesCompleted(dispatch)
      if (currentZoneNumber > 9) dispatch(increasePlasma(monsterPlasmaValue))

      // Highest zone & farming toggled; zone transition in place
      if (isFarming) {
        const newFarmZoneMonsters = selectZoneState(store.getState()).farmZoneMonsters
        if (newFarmZoneMonsters) nextMonster = newFarmZoneMonsters[0]
      } else {
        const newZoneMonsters = selectZoneState(store.getState()).zoneMonsters
        nextMonster = newZoneMonsters[0]
      }

      // When farming and farming is toggled, continue; else goto zoneInView useEffect block
    } else if (zoneInView < currentZoneNumber) {
      updateFarmAchievements(dispatch)
      if (isFarming && farmZoneMonsters) {
        dispatch(refreshFarmZone())
        const newFarmZoneMonsters = selectZoneState(store.getState()).farmZoneMonsters
        if (newFarmZoneMonsters) nextMonster = newFarmZoneMonsters[0]
      } else if (!isFarming) {
        dispatch(setZoneInView(currentZoneNumber))
      } else throw new Error("Logic error during farm zone transition")
    } else throw new Error("Logic error during highest zone transition")

    // Stage transition case
  } else {
    dispatch(incrementStageNumber())
    if (zoneInView < currentZoneNumber && farmZoneMonsters) {
      nextMonster = farmZoneMonsters[stageNumber]
    } else {
      nextMonster = zoneMonsters[stageNumber]
    }
  }
  // Spawn the next monster when we didn't jump to zoneInView transition
  if (nextMonster) {
    dispatch(spawnMonster(nextMonster))
  }

  return nextAction
}

function updateZonesCompleted(dispatch: Dispatch) {
  dispatch(zoneComplete())
  const state = store.getState()
  const countAchievements = ACHIEVEMENTS.zone.count as AchievementCategory
  const progressAchievements = ACHIEVEMENTS.zone.progression as AchievementCategory

  checkAchievementUnlock(dispatch, [
    {
      achievements: countAchievements.achievements,
      value: state.stats.totalZonesCompleted,
    },
    {
      achievements: progressAchievements.achievements,
      value: state.stats.highestZoneEver,
    },
  ])
}

function updateFarmAchievements(dispatch: Dispatch) {
  dispatch(incrementFarmZonesCompleted())
  const state = store.getState()
  const countAchievements = ACHIEVEMENTS.zone.farm as AchievementCategory

  checkAchievementUnlock(dispatch, [
    {
      achievements: countAchievements.achievements,
      value: state.stats.farmZonesCompleted,
    },
  ])
}
