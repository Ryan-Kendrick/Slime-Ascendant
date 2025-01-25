import { configureStore, Middleware } from "@reduxjs/toolkit"
import statsReducer from "./statsSlice"
import monsterReducer from "./monsterSlice"
import zoneReducer from "./zoneSlice"
import playerReducer from "./playerSlice"
import metaReducer, { saveGame } from "./metaSlice"
import { loadFromLocalStorage, saveToLocalStorage } from "../gameconfig/utils"

export interface StoreState {
  monster: ReturnType<typeof monsterReducer>
  player: ReturnType<typeof playerReducer>
  stats: ReturnType<typeof statsReducer>
  zone: ReturnType<typeof zoneReducer>
  meta: ReturnType<typeof metaReducer>
}

const saveMiddleware: Middleware = (store) => (next) => (action) => {
  const nextAction = next(action)

  if (saveGame.match(action)) {
    saveToLocalStorage(store.getState())
  }

  return nextAction
}

export const store = configureStore({
  reducer: {
    monster: monsterReducer,
    player: playerReducer,
    stats: statsReducer,
    zone: zoneReducer,
    meta: metaReducer,
  },
  preloadedState: loadFromLocalStorage(),
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(saveMiddleware),
})

export type RootState = StoreState
export type AppDispatch = typeof store.dispatch
