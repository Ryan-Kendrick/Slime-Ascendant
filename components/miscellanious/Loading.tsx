import { useAppSelector } from "../../redux/hooks"
import { selectLoading } from "../../redux/metaSlice"

export default function Loading() {
  const loading = useAppSelector(selectLoading)
  if (!loading) return null

  return (
    <div className="fixed z-50 -mt-1 flex h-full w-full items-center justify-center bg-black/30 backdrop-blur-2xl">
      <div className="pl-[3ch] text-6xl text-white">LOADING...</div>
    </div>
  )
}
