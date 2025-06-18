//@ts-nocheck

import { UpgradeProps, HeroState } from "../models/upgrades"
import { RootState } from "../redux/store"
import { initialState } from "../redux/playerSlice"
import * as LZString from "lz-string"
import { METADATA_CONFIG } from "./meta"

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
    { threshold: 1e9, suffix: "b" },
    { threshold: 1e6, suffix: "m" },
  ]

  for (const { threshold, suffix } of tiers) {
    if (num > threshold) {
      if (threshold === 1e6) {
        if (num < 1e8) return (num / threshold).toFixed(2) + suffix
        return Math.floor(num / threshold) + suffix
      } else {
        if (num < threshold * 100) return (num / threshold).toFixed(2) + suffix
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

    gameState.meta.breakpoint ??= 0

    if (Number(saveMinorVersion) < 4) {
      setTimeout(() => {
        alert(`
Attention Slime Slayer!

Your save from ${saveVersion} doesn't quite fit into the ${currentVersion} world.

The time has come to start a brand new adventure.`)
      }, 100)
      return undefined
    } else if (Number(saveMinorVersion) === 5) {
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
      meta: { ...gameState.meta, gameVersion: METADATA_CONFIG.version },
    }
  } catch (err) {
    console.error(`Error loading from local storage: ${err}`)

    return undefined
  }
}
