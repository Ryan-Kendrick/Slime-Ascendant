import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "./store"
import { METADATA_CONFIG } from "../gameconfig/meta"
import { HeroName } from "../models/upgrades"
import { heroIndexMap, heroNames } from "./shared/helpers"
import { prestigeReset } from "./shared/actions"
import { constructOTPPosArr } from "./shared/helpers"

export const initialState = {
  gameVersion: METADATA_CONFIG.version,
  lastPlayed: Date.now(),
  lastSaveCatchUp: null as number | null,
  loading: false,
  OTPPos: constructOTPPosArr(),
  animationPref: 2, // Low: 0, Medium: 1, High: 2

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
    setAnimationPref: (state, action: PayloadAction<number>) => {
      state.animationPref = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setOTPPos: (
      state,
      action: PayloadAction<{
        hero: HeroName
        otpIndex: number
        position: { x: number; y: number }
      }>,
    ) => {
      const { hero, otpIndex, position } = action.payload
      const heroIndex = heroNames.findIndex((heroName) => heroName === hero)

      state.OTPPos[heroIndex][otpIndex] = position
    },
    setBreakpoint: (state, action: PayloadAction<Breakpoint>) => {
      state.breakpoint = action.payload
    },
    toggleAnimationPref: (state, action: PayloadAction<number>) => {
      if (state.animationPref !== 2) {
        state.animationPref++
      } else {
        state.animationPref = 0
      }
    },
  },
  extraReducers(builder) {
    builder.addCase(prestigeReset, (state) => {
      state.OTPPos = initialState.OTPPos
    })
  },
})

export const { saveGame, clearCatchUpTime, setLoading, setOTPPos, setBreakpoint, toggleAnimationPref } =
  metaSlice.actions

export const selectLastSaveCatchUp = (state: RootState) => state.meta.lastSaveCatchUp
export const selectLoading = (state: RootState) => state.meta.loading
export const selectBreakpoint = (state: RootState) => state.meta.breakpoint
export const selectOTPPos = (hero: HeroName) =>
  createSelector([(state: RootState) => state.meta.OTPPos, () => heroIndexMap[hero]], (otpPos, heroIndex) => {
    return otpPos[heroIndex]
  })
export const selectAnimationPref = (state: RootState) => state.meta.animationPref
// export const selectOTPPos = (hero: HeroName) => (state: RootState) => state.meta.OTPPos[heroIndexMap[hero]]

export default metaSlice.reducer

type Breakpoint = 640 | 768 | 1024 | 1280 | 1536
