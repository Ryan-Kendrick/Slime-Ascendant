import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "./store"
import { METADATA_CONFIG } from "../gameconfig/meta"

const initialState = {
  gameVersion: METADATA_CONFIG.version,
  lastPlayed: Date.now(),
  lastSaveCatchUp: null as number | null,
  loading: false,

  // Tailwind breakpoints - sm: 768px, md: 1024px, lg: 1280px, xl: 1536px
  breakpoint: 0 as Breakpoint,
}

export const metaSlice = createSlice({
  name: "meta",
  initialState,
  reducers: {
    saveGame: (state) => {
      const now = Date.now()
      state.lastPlayed = now
      state.lastSaveCatchUp = now
    },
    clearCatchUpTime: (state) => {
      state.lastSaveCatchUp = null
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setBreakpoint: (state, action: PayloadAction<Breakpoint>) => {
      state.breakpoint = action.payload
    },
  },
})

export const { saveGame, clearCatchUpTime, setLoading, setBreakpoint } = metaSlice.actions

export const selectLastSaveCatchUp = (state: RootState) => state.meta.lastSaveCatchUp
export const selectLoading = (state: RootState) => state.meta.loading
export const selectBreakpoint = (state: RootState) => state.meta.breakpoint

export default metaSlice.reducer

type Breakpoint = 640 | 768 | 1024 | 1280 | 1536
