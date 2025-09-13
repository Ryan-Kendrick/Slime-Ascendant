import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import {
  selectLongCatchupProcessed,
  selectLastSaveCatchUp,
  selectLoading,
  selectLongCatchupDelta,
  setLongCatchupProcessed,
  setLongCatchupDelta,
} from "../../redux/metaSlice"
import CombatIndex from "../combat/combatIndex"
import PanelIndex from "../metapanel/panelIndex"
import FullscreenCatchup from "./FullscreenCatchup"
import Navigation from "../nav/navigation"
import { selectBeatDamage, selectDotDamage } from "../../redux/playerSlice"
import { useEffect, useRef } from "react"
import { useGameEngine } from "../../gameconfig/customHooks"

export default function Main() {
  const dispatch = useAppDispatch()

  const delta = useAppSelector(selectLongCatchupDelta)
  const longCatchupProcessed = useAppSelector(selectLongCatchupProcessed)
  const lastSaveCatchUp = useAppSelector(selectLastSaveCatchUp)
  const dotDamage = useAppSelector(selectDotDamage)
  const beatDamage = useAppSelector(selectBeatDamage)
  const loading = useAppSelector(selectLoading)

  const lastSaveCatchUpRef = useRef(lastSaveCatchUp)

  // Interface between requestAnimationFrame and React to prevent infinite catchup loops
  useEffect(() => {
    lastSaveCatchUpRef.current = lastSaveCatchUp
  }, [lastSaveCatchUp])
  console.log(delta)

  useGameEngine({ dotDamage, beatDamage, loading, lastSaveCatchUp })

  return (
    <>
      {delta ? (
        <FullscreenCatchup />
      ) : (
        <main className="flex flex-1 overflow-visible md:min-h-0">
          <div className="relative flex w-full flex-col-reverse lg:flex-row">
            <PanelIndex />
            <CombatIndex>
              <Navigation />
            </CombatIndex>
          </div>
        </main>
      )}
    </>
  )
}
