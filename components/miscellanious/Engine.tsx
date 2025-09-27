import { shallowEqual } from "react-redux"
import { useGameEngine } from "../../gameconfig/customHooks"
import { useAppSelector } from "../../redux/hooks"
import { selectAbortCatchup, selectAnimationPref, selectLastSaveCatchUp, selectLoading } from "../../redux/metaSlice"
import { selectMonsterState } from "../../redux/monsterSlice"
import { selectBeatDamage, selectDotDamage, selectRespawnTime } from "../../redux/playerSlice"

export const GameEngineProvider = () => {
  const monsterState = useAppSelector(selectMonsterState, shallowEqual)
  const respawnTime = useAppSelector(selectRespawnTime)
  const dotDamage = useAppSelector(selectDotDamage)
  const beatDamage = useAppSelector(selectBeatDamage)
  const loading = useAppSelector(selectLoading)
  const lastSaveCatchUp = useAppSelector(selectLastSaveCatchUp)
  const abortCatchup = useAppSelector(selectAbortCatchup)
  const animationPref = useAppSelector(selectAnimationPref)

  useGameEngine({
    monsterState,
    respawnTime,
    dotDamage,
    beatDamage,
    loading,
    lastSaveCatchUp,
    abortCatchup,
    animationPref,
  })

  return null
}
