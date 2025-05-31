import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "./store"
import { METADATA_CONFIG } from "../gameconfig/meta"
import { UPGRADE_CONFIG } from "../gameconfig/upgrades"
import { HeroName } from "../models/upgrades"
import { heroIndexMap, heroNames } from "./shared/maps"
import { StatementSync } from "node:sqlite"

const initialState = {
  gameVersion: METADATA_CONFIG.version,
  lastPlayed: Date.now(),
  lastSaveCatchUp: null as number | null,
  loading: false,
  OTPPos: heroNames.map((thisHero) => {
    return Array.from({ length: UPGRADE_CONFIG[thisHero].OneTimePurchases.OTPCosts.length }, () => ({
      x: 0,
      y: 0 as number | true,
    }))
  }),

  breakpoint: 0 as Breakpoint, // Tailwind breakpoints - sm: 768px, md: 1024px, lg: 1280px, xl: 1536px
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
    setOTPPos: (
      state,
      action: PayloadAction<{
        hero: HeroName
        otpIndex: number
        position: { x: number; y: number | true }
      }>,
    ) => {
      const { hero, otpIndex, position } = action.payload
      const heroIndex = heroNames.findIndex((heroName) => heroName === hero)

      state.OTPPos[heroIndex][otpIndex] = position
    },
    setBreakpoint: (state, action: PayloadAction<Breakpoint>) => {
      state.breakpoint = action.payload
    },
  },
})

export const { saveGame, clearCatchUpTime, setLoading, setOTPPos, setBreakpoint } = metaSlice.actions

export const selectLastSaveCatchUp = (state: RootState) => state.meta.lastSaveCatchUp
export const selectLoading = (state: RootState) => state.meta.loading
export const selectBreakpoint = (state: RootState) => state.meta.breakpoint
export const selectOTPPos = (hero: HeroName) =>
  createSelector([(state: RootState) => state.meta.OTPPos, () => heroIndexMap[hero]], (otpPos, heroIndex) => {
    return otpPos[heroIndex]
  })
// export const selectOTPPos = (hero: HeroName) => (state: RootState) => state.meta.OTPPos[heroIndexMap[hero]]

export default metaSlice.reducer

type Breakpoint = 640 | 768 | 1024 | 1280 | 1536
