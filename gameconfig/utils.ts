//@ts-nocheck

import { PrestigeUpgradeName, HeroName, UpgradeId, UpgradeProps, HeroState } from "../models/upgrades"
import { RootState } from "../redux/store"
import { PlayerState } from "../models/player"
import { initialState, selectInitState, selectPrestigeState } from "../redux/playerSlice"
import * as LZString from "lz-string"
import { METADATA_CONFIG } from "./meta"

export const heroStateMap: Record<HeroName, { level: keyof PlayerState; upgradeCount: keyof PlayerState }> = {
  adventurer: {
    level: "adventurerLevel",
    upgradeCount: "adventurerOTPUpgradeCount",
  },
  warrior: {
    level: "warriorLevel",
    upgradeCount: "warriorOTPUpgradeCount",
  },
  healer: {
    level: "healerLevel",
    upgradeCount: "healerOTPUpgradeCount",
  },
  mage: {
    level: "mageLevel",
    upgradeCount: "mageOTPUpgradeCount",
  },
} as const

export const setInitElementMap: Record<UpgradeId | HeroName, (state: PlayerState) => void> = {
  "adventurer-otp": (state: PlayerState) => {
    state.hasInitAdventurerOTP++
  },
  "warrior-otp": (state: PlayerState) => {
    state.hasInitWarriorOTP++
  },
  "healer-otp": (state: PlayerState) => {
    state.hasInitHealerOTP++
  },
  "mage-otp": (state: PlayerState) => {
    state.hasInitMageOTP++
  },
  adventurer: (state: PlayerState) => true,
  warrior: (state: PlayerState) => {
    state.hasInitWarriorPane = true
  },
  healer: (state: PlayerState) => {
    state.hasInitHealerPane = true
  },
  mage: (state: PlayerState) => {
    state.hasInitMagePane = true
  },
} as const

export const initSelectorMap: Record<UpgradeId | HeroName, (state: RootState) => number | boolean> = {
  "adventurer-otp": (state: PlayerState) => selectInitState(state).hasInitAdventurerOTP,
  "warrior-otp": (state: PlayerState) => selectInitState(state).hasInitWarriorOTP,
  "healer-otp": (state: PlayerState) => selectInitState(state).hasInitHealerOTP,
  "mage-otp": (state: PlayerState) => selectInitState(state).hasInitMageOTP,
  warrior: (state: PlayerState) => selectInitState(state).hasInitWarriorPane,
  healer: (state: PlayerState) => selectInitState(state).hasInitHealerPane,
  mage: (state: PlayerState) => selectInitState(state).hasInitMagePane,
} as const

export const prestigeUpgradeMap: Record<PrestigeUpgradeName, (state: RootState) => number> = {
  damage: (state) => selectPrestigeState(state).pDamageUpgradeCount,
  health: (state) => selectPrestigeState(state).pHealthUpgradeCount,
} as const

export function serialize(classInstance) {
  if (classInstance == null || typeof classInstance !== "object") return classInstance

  if (Array.isArray(classInstance)) return classInstance.map(serialize)

  const serialized = {}

  for (const key of Object.keys(classInstance)) {
    serialized[key] = serialize(classInstance[key])
  }

  return serialized
}

export function formatSmallNumber(num: number): string {
  num = Math.round(num)

  const tiers = [
    { threshold: 1e15, suffix: "q" },
    { threshold: 1e10, suffix: "b" },
    { threshold: 1e6, suffix: "m" },
  ]

  for (const { threshold, suffix } of tiers) {
    if (num > threshold) {
      if (threshold === 1e6) {
        if (num < 1e8) return (num / threshold).toFixed(2) + suffix
        return Math.floor(num / threshold) + suffix
      } else {
        if (num < threshold * 100) return (num / (threshold / 10)).toFixed(2) + suffix
        return Math.floor(num / threshold) + suffix
      }
    }
  }

  return num.toString()
}

export function saveToLocalStorage(state: RootState): void {
  try {
    const base64GameState = LZString.compressToBase64(JSON.stringify(state))
    localStorage.setItem("gameState", base64GameState)
    console.log("Saved to local storage", state)
  } catch (err) {
    console.error(`Error saving to local storage: ${err}`)
  }
}
export function loadFromLocalStorage(): RootState | undefined {
  try {
    const base64GameState = localStorage.getItem("gameState")
    if (!base64GameState) return undefined

    const gameState = JSON.parse(LZString.decompressFromBase64(base64GameState)) as RootState

    console.log("Decompressed from local storage", gameState)

    const saveVersion = gameState.meta?.gameVersion
    if (!saveVersion) return undefined

    const saveMinorVersion = saveVersion.split(".")?.[1]
    const currentVersion = METADATA_CONFIG.version
    const currentMinorVersion = currentVersion.split(".")[1]

    if (Number(saveMinorVersion) < 4) {
      setTimeout(() => {
        alert(`
Attention Slime Slayer!

Your save from ${saveVersion} doesn't quite fit into the ${currentVersion} world.

The time has come to start a brand new adventure.`)
      }, 100)
      return undefined
    } else if (Number(saveMinorVersion) === 4) {
      setTimeout(() => {
        alert(`
Attention Slime Slayer!

Your save from ${saveVersion} doesn't quite fit into the ${currentVersion} world.

We managed to salvage your achievements, but the time has come to start a new adventure.`)
      }, 100)
      return {
        player: { ...initialState, achievementModifier: gameState.player.achievementModifier },
        stats: { ...gameState.stats },
        meta: { ...gameState.meta, gameVersion: METADATA_CONFIG.version },
      }
    }

    return {
      ...gameState,
      player: { ...gameState.player, tabInView: "upgrade" },
      meta: { ...gameState.meta, lastSaveCatchUp: null, gameVersion: METADATA_CONFIG.version },
    }
  } catch (err) {
    console.error(`Error loading from local storage: ${err}`)

    return undefined
  }
}
