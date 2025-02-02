import { configureStore, Middleware } from "@reduxjs/toolkit"
import statsReducer from "./statsSlice"
import monsterReducer from "./monsterSlice"
import { deathMiddleware } from "./middleware/deathMiddleware"
import zoneReducer from "./zoneSlice"
import playerReducer from "./playerSlice"
import metaReducer from "./metaSlice"
import { loadFromLocalStorage } from "../gameconfig/utils"
import { saveMiddleware } from "./middleware/saveMiddleware"

export interface StoreState {
  monster: ReturnType<typeof monsterReducer>
  player: ReturnType<typeof playerReducer>
  stats: ReturnType<typeof statsReducer>
  zone: ReturnType<typeof zoneReducer>
  meta: ReturnType<typeof metaReducer>
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
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(saveMiddleware, deathMiddleware),
})

export type RootState = StoreState
export type AppDispatch = typeof store.dispatch
