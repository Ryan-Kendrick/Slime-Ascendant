import { createSelector, createSlice, isAllOf } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import { type RootState } from "./store"
import { getMonster } from "../gameconfig/monster"
import { EnemyState } from "../models/monsters"
import { monsterClicked, increaseTotalDotDamageDealt, monsterBeaten } from "./statsSlice"
import { prestigeReset } from "./shared/actions"

const initialState = { ...getMonster("Slime"), alive: true } as EnemyState

export const monsterSlice = createSlice({
  name: "monster",
  initialState,
  reducers: {
    spawnMonster(state, action: PayloadAction<EnemyState>) {
      return { ...action.payload, alive: true }
    },
    monsterDied: (state) => {
      state.alive = false
    },
  },
  extraReducers(builder) {
    builder.addCase(prestigeReset, () => {
      return initialState
    })
    builder.addMatcher(isAllOf(monsterClicked), (state, action) => {
      const newHealth = state.health - action.payload.damage
      state.health = newHealth
      state.alive = newHealth >= 1
    })
    builder.addMatcher(isAllOf(increaseTotalDotDamageDealt), (state, action) => {
      const newHealth = state.health - action.payload
      state.health = newHealth
      state.alive = newHealth >= 1
    })
    builder.addMatcher(isAllOf(monsterBeaten), (state, action) => {
      const newHealth = state.health - action.payload
      state.health = newHealth
      state.alive = newHealth >= 1
    })
  },
})

export const { spawnMonster, monsterDied } = monsterSlice.actions

export const selectMonsterState = createSelector(
  [(state: RootState) => state.monster],
  (monster) =>
    ({
      name: monster.name,
      level: monster.level,
      damage: monster.damage,
      attackRate: monster.attackRate,
      alive: monster.alive,
      goldValue: monster.goldValue,
      plasmaValue: monster?.plasma,
      image: monster.image,
    }) as Partial<EnemyState>,
)

export const selectMonsterHealth = (state: RootState) => state.monster.health
export const selectMonsterMaxHealth = (state: RootState) => state.monster.maxHealth
export const selectMonsterKind = (state: RootState) => state.monster.kind

export default monsterSlice.reducer
