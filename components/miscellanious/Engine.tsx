import { useGameEngine } from "../../gameconfig/customHooks"
import { useAppSelector } from "../../redux/hooks"
import { selectAnimationPref, selectLastSaveCatchUp, selectLoading } from "../../redux/metaSlice"
import { selectBeatDamage, selectDotDamage } from "../../redux/playerSlice"

export const GameEngineProvider = () => {
  const dotDamage = useAppSelector(selectDotDamage)
  const beatDamage = useAppSelector(selectBeatDamage)
  const loading = useAppSelector(selectLoading)
  const lastSaveCatchUp = useAppSelector(selectLastSaveCatchUp)
  const animationPref = useAppSelector(selectAnimationPref)

  useGameEngine({ dotDamage, beatDamage, loading, lastSaveCatchUp, animationPref })

  return null
}
