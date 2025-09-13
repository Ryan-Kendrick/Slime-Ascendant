import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { selectFullscreenCatchup, selectLongCatchupDelta, setFullScreenCatchup } from "../../redux/metaSlice"
import CombatIndex from "../combat/combatIndex"
import PanelIndex from "../metapanel/panelIndex"
import FullscreenCatchup from "./FullscreenCatchup"
import Navigation from "../nav/navigation"

export default function Main() {
  // Run game engine from here
  const dispatch = useAppDispatch()
  dispatch(setFullScreenCatchup(3600000 + 3600000))
  const doFullscreenCatchup = useAppSelector(selectFullscreenCatchup)
  const delta = useAppSelector(selectLongCatchupDelta)
  console.log(doFullscreenCatchup, delta)

  return (
    <>
      {doFullscreenCatchup ? (
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
