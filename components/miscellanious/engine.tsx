import { useGameEngine } from "../../gameconfig/customHooks"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { selectLastSaveCatchUp, selectLoading } from "../../redux/metaSlice"
import { selectBeatDamage, selectDotDamage } from "../../redux/playerSlice"

// GameEngineProvider.tsx
export const GameEngineProvider = () => {
  const dispatch = useAppDispatch()
  const dotDamage = useAppSelector(selectDotDamage)
  const beatDamage = useAppSelector(selectBeatDamage)
  const loading = useAppSelector(selectLoading)
  const lastSaveCatchUp = useAppSelector(selectLastSaveCatchUp)

  useGameEngine({ dotDamage, beatDamage, loading, lastSaveCatchUp })

  return null // No UI rendering
}
