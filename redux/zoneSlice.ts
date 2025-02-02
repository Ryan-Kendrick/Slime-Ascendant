import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "./store"
import { EnemyState } from "../models/monsters"
import { Zone } from "../gameconfig/zone"
import { getMonster } from "../gameconfig/monster"
import { prestigeReset } from "./shared/actions"

interface ZoneState {
  currentZoneNumber: number
  currentZoneLength: number
  monsters: EnemyState[]
  nextStageIndex: number
  isFarming: boolean
  farmZoneMonsters: null | EnemyState[]
  farmZoneNumber: null | number
  farmStageIndex: number
  farmZoneLength: number
  zoneInView: number
}

const firstZone = new Zone(1)
firstZone.monsters = [getMonster("Slime"), ...firstZone.monsters.slice(1)]
const initialState: ZoneState = {
  // Progression zone data
  currentZoneNumber: firstZone.zoneNumber,
  currentZoneLength: firstZone.zoneLength,
  monsters: firstZone.monsters,
  nextStageIndex: 1,
  // Farming zone data
  isFarming: false,
  farmZoneMonsters: null,
  farmZoneNumber: null,
  farmStageIndex: 1,
  farmZoneLength: 30,
  // Display logic
  zoneInView: 1,
}

// Todo: implement return to zone action
export const zoneSlice = createSlice({
  name: "zone",
  initialState,
  reducers: {
    zoneComplete: (state) => {
      const thisZone = state.currentZoneNumber
      state.currentZoneNumber++
      const nextZone = new Zone(state.currentZoneNumber)
      state.monsters = nextZone.monsters
      state.nextStageIndex = 1
      if (!state.isFarming) {
        state.zoneInView++
      } else {
        const thisFarmZone = new Zone(thisZone, true)
        state.farmZoneNumber = thisZone
        state.farmStageIndex = 1
        state.zoneInView = thisZone
        state.farmZoneMonsters = thisFarmZone.monsters
      }
    },
    incrementStageNumber: (state) => {
      if (state.zoneInView === state.currentZoneNumber) {
        state.nextStageIndex++
        if (state.nextStageIndex > state.currentZoneLength) {
          state.nextStageIndex = 1
          console.error("Something went wrong, stage index exceeded zone length")
        }
      } else {
        state.farmStageIndex++
      }
    },
    zoneSelection(state, action: PayloadAction<number>) {
      const zoneNumber = state.currentZoneNumber - action.payload

      if (zoneNumber === state.zoneInView) {
        return
      } else if (zoneNumber === state.currentZoneNumber) {
        state.zoneInView = zoneNumber
        state.isFarming = false
      } else {
        const thisFarmZone = new Zone(zoneNumber, true)
        state.farmZoneNumber = zoneNumber
        state.farmStageIndex = 1
        state.farmZoneMonsters = thisFarmZone.monsters
        state.isFarming = true
        state.zoneInView = zoneNumber
      }
    },
    refreshFarmZone: (state) => {
      if (!state.farmZoneNumber) throw "Failed to initialise farm zone number"
      const thisFarmZone = new Zone(state.farmZoneNumber, true)
      state.farmStageIndex = 1
      state.farmZoneMonsters = thisFarmZone.monsters
    },
    setMonsters(state, action: PayloadAction<EnemyState[]>) {
      state.monsters = action.payload
    },
    toggleFarming: (state) => {
      state.isFarming = !state.isFarming
    },
    setZoneLength(state, action: PayloadAction<number>) {
      state.currentZoneLength = action.payload
    },
    setZoneInView(state, action: PayloadAction<number>) {
      state.zoneInView = action.payload
    },
  },
  extraReducers(builder) {
    builder.addCase(prestigeReset, (state) => {
      const newZone = new Zone(1)

      state.currentZoneNumber = newZone.zoneNumber
      state.currentZoneLength = newZone.zoneLength
      state.monsters = newZone.monsters
      state.nextStageIndex = 1
      state.isFarming = false
      state.farmZoneMonsters = null
      state.farmZoneNumber = null
      state.farmStageIndex = 1
      state.farmZoneLength = 30
      state.zoneInView = 1
    })
  },
})

export const {
  zoneComplete,
  incrementStageNumber,
  zoneSelection,
  refreshFarmZone,
  setMonsters,
  toggleFarming,
  setZoneLength,
  setZoneInView,
} = zoneSlice.actions

export const selectZoneState = createSelector([(state: RootState) => state.zone], (zone) => ({
  currentZoneNumber: zone.currentZoneNumber,
  currentZoneLength: zone.currentZoneLength,
  zoneMonsters: zone.monsters,
  stageNumber: zone.nextStageIndex,
  isFarming: zone.isFarming,
  farmZoneMonsters: zone.farmZoneMonsters,
  farmZoneNumber: zone.farmZoneNumber,
  farmZoneLength: zone.farmZoneLength,
  farmStageNumber: zone.farmStageIndex,
  zoneInView: zone.zoneInView,
}))

export const selectCurrentZoneNumber = (state: RootState) => state.zone.currentZoneNumber
export const selectIsFarming = (state: RootState) => state.zone.isFarming

export default zoneSlice.reducer
