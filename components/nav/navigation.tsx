import { memo, useState } from "react"
import ReactModal from "react-modal"
import { Styles as ModalStylesheet } from "react-modal"
import { CancelIcon } from "../svgIcons/metaIcons"
import Achievements from "./achievements"
import handURL from "/assets/icons/hand-dark.webp"
import { METADATA_CONFIG } from "../../gameconfig/meta"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { selectAnimationPref, toggleAnimationPref } from "../../redux/metaSlice"

export const Navigation = memo(function Navigation() {
  const [viewAchievements, setViewAchievements] = useState(false)

  return (
    <div className="flex relative flex-wrap justify-between items-center text-white h-full px-3 py-2 md:pb-0 lg:pb-2">
      <div className="flex flex-wrap gap-3 items-center">
        <NavigationLinkButton text="Achievements" onClick={() => setViewAchievements(true)} />
      </div>
      <div className="flex flex-wrap gap-3 items-center">
        {/* <NavigationLinkButton text="Options" onClick={() => setViewOptions(true)} /> */}
      </div>
      <ReactModal
        isOpen={viewAchievements}
        onRequestClose={() => setViewAchievements(false)}
        contentLabel="Prestige confirmation prompt"
        style={achievementsStyle}>
        <Achievements />
        <button
          className="absolute -top-3 -right-3 w-9 h-9 rounded-full bg-white ring-amber-800 ring-2 ring-inset shadow-[0_3px_5px_-2px_rgb(0_0_0_/_0.8),_0_3px_5px_-2px_rgb(0_0_0_/_0.6)] stroke-white z-[1000000] cursor-active"
          onClick={() => setViewAchievements(false)}>
          {CancelIcon()}
        </button>
      </ReactModal>
      <div className="flex flex-col">
        <AnimationQualityButton />
        <div className="self-start lg:self-end text-sm opacity-50">{METADATA_CONFIG.version}</div>
      </div>
    </div>
  )
})

type NavigationLinkButtonProps = {
  text: string
  onClick: () => void
}

export function AnimationQualityButton() {
  const dispatch = useAppDispatch()
  const animationPref = useAppSelector(selectAnimationPref)

  const animationPrefMap = {
    0: "low",
    1: "medium",
    2: "high",
  }
  const animationQuality = animationPrefMap[animationPref as keyof typeof animationPrefMap]

  return (
    <button
      className="cursor-active border border-yellow-300 -mt-0.5 bg-blue-600 p-0.5 rounded"
      onClick={() => dispatch(toggleAnimationPref(animationPref))}>
      Quality: {animationQuality}
    </button>
  )
}

export function NavigationLinkButton({ text, onClick }: NavigationLinkButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        WebkitTextStrokeColor: "black",
        WebkitTextFillColor: "white",
        WebkitTextStrokeWidth: "1px",
      }}
      className="py-3 px-6 cursor-active tracking-wider text-center uppercase transition duration-200 bg-gradient-to-tr from-red-500 via-orange-400 to-amber-500 text-white rounded-lg block border-0 shadow-lg select-none hover:bg-right-center active:transform active:scale-95 hover:scale-105"
      role="dialog">
      {text}
    </button>
  )
}

const achievementsStyle: ModalStylesheet = {
  content: {
    position: "absolute",
    top: "5%",
    right: "5%",
    bottom: "5%",
    left: "5%",
    border: "2px solid #ffcf40",
    background: "radial-gradient(circle, rgba(163,72,16,1) 0%, rgba(146,64,14,1) 35%, rgba(125,54,11,1) 100%)",
    boxShadow: "rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px",
    overflow: "visible",
    WebkitOverflowScrolling: "touch",
    borderRadius: "12px",
    outline: "none",
    padding: "20px",
    cursor: `url(${handURL}) 0 0, pointer`,
    zIndex: 1000,
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.50)",
    cursor: `url(${handURL}) 0 0, pointer`,
    zIndex: 1000,
  },
}

export default Navigation
