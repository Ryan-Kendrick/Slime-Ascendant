import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { selectLastSaveCatchUp, selectLoading, selectLongCatchupDelta } from "../../redux/metaSlice"
import CombatIndex from "../combat/combatIndex"
import PanelIndex from "../metapanel/panelIndex"
import FullscreenCatchup from "./FullscreenCatchup"
import Navigation from "../nav/navigation"
import { selectBeatDamage, selectDotDamage } from "../../redux/playerSlice"
import { useGameEngine } from "../../gameconfig/customHooks"

const GameEngineProvider = () => {
  const dotDamage = useAppSelector(selectDotDamage)
  const beatDamage = useAppSelector(selectBeatDamage)
  const loading = useAppSelector(selectLoading)
  const lastSaveCatchUp = useAppSelector(selectLastSaveCatchUp)

  useGameEngine({ dotDamage, beatDamage, loading, lastSaveCatchUp })

  return null
}

export default function Main() {
  const delta = useAppSelector(selectLongCatchupDelta)

  return (
    <>
      <GameEngineProvider />
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
