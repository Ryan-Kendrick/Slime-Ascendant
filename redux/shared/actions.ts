import { createAction } from "@reduxjs/toolkit"
import { PrestigeState, PrestigeUpgradeId } from "../../models/upgrades"

export const prestigeReset = createAction<Record<PrestigeUpgradeId, PrestigeState>>("prestige/reset")
