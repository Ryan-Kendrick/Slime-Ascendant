import { Middleware } from "@reduxjs/toolkit"
import { saveGame } from "../metaSlice"
import { saveToLocalStorage } from "../../gameconfig/utils"

export const saveMiddleware: Middleware = (store) => (next) => (action) => {
  const nextAction = next(action)

  if (saveGame.match(action)) {
    saveToLocalStorage(store.getState())
  }

  return nextAction
}
