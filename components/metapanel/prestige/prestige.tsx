import clsx from "clsx/lite"
import { useState } from "react"
import PrestigeButton from "./prestigeButton"
import { useAppDispatch, useAppSelector } from "../../../redux/hooks"
import { UPGRADE_CONFIG } from "../../../gameconfig/upgrades"
import Currency from "../currency"
import { PlasmaIcon } from "../../svgIcons/resourceIcons"
import {
  resetPlasmaReserved,
  selectPlasma,
  selectPlasmaReserved,
  reservePlasma,
  updatePrestige,
  setPrestigeUpgradesPending,
} from "../../../redux/playerSlice"
import { PrestigeUpgradeId } from "../../../models/upgrades"
import ReactModal from "react-modal"
import { Styles as ModalStylesheet } from "react-modal"
import { CancelIcon } from "../../svgIcons/metaIcons"
import { selectHighestZone, selectHighestZoneEver } from "../../../redux/statsSlice"
import handURL from "/assets/icons/hand-dark.webp"
import { selectAnimationPref, setFading } from "../../../redux/metaSlice"
import { PERFORMANCE_CONFIG } from "../../../gameconfig/meta"
import Confirmation from "./confirmation"

export default function Prestige() {
  const dispatch = useAppDispatch()
  const plasmaSelector = selectPlasma
  const plasmaReserved = useAppSelector(selectPlasmaReserved)
  const highZoneEver = useAppSelector(selectHighestZoneEver)
  const highestZone = useAppSelector(selectHighestZone)
  const animationPref = useAppSelector(selectAnimationPref)
  const fullAnimations = animationPref > 1
  const zoneTenComplete = highestZone > 10

  const [prestigeDialogue, setPrestigeDialogue] = useState(false)
  const [prestigeIntent, setPrestigeIntent] = useState(false)
  const [resetCounter, setResetCounter] = useState(0)

  const onReset = () => {
    setResetCounter((prev) => prev + 1)
    dispatch(resetPlasmaReserved())
  }

  const initiatePrestige = () => {
    setPrestigeIntent(true)
    setTimeout(() => {
      dispatch(setFading(true))
      setTimeout(() => {
        dispatch(updatePrestige())
      }, PERFORMANCE_CONFIG.fadeoutDuration)
    }, 4000)
  }

  function onUpdatePurchase(e: React.MouseEvent<HTMLButtonElement>, cost: number, purchaseCount: number) {
    const upgradeId = e.currentTarget.id as PrestigeUpgradeId

    dispatch(setPrestigeUpgradesPending({ upgradeId, cost, purchaseCount }))
    dispatch(reservePlasma())
  }

  return (
    <div className="m-2 flex h-full min-h-[722px] flex-col rounded-lg border-2 border-cyan-500/50 bg-cyan-900/60 p-3 before:bg-blue-200">
      <Currency
        key={resetCounter}
        image={PlasmaIcon()}
        fontStyle="text-cyan-300 font-paytone"
        currencySelector={plasmaSelector}
        suffix={plasmaReserved > 0 ? `  (-${plasmaReserved})` : undefined}
      />
      <div className="mx-2 flex flex-wrap items-start justify-center gap-2 font-sans">
        {Object.values(UPGRADE_CONFIG.prestigeUpgrades).map((prestigeUpgrade) => {
          if (prestigeUpgrade.visibleAtZone > highZoneEver) return null

          return (
            <PrestigeButton
              key={prestigeUpgrade.id + resetCounter}
              config={prestigeUpgrade}
              onClick={onUpdatePurchase}
              hidden={highZoneEver < prestigeUpgrade.visibleAtZone}
            />
          )
        })}
      </div>

      <div className="relative flex h-full w-full grow items-end justify-center gap-4">
        <button
          onClick={() => setPrestigeDialogue(true)}
          disabled={!zoneTenComplete}
          className={clsx(
            "portal-btn cursor-active disabled:cursor-inactive",
            fullAnimations ? "portal-btn-animated" : "portal-btn-simple",
            prestigeIntent && "portal-btn-prestige z-10",
            !zoneTenComplete && "portal-btn-disabled",
          )}>
          <span className="portal-btn-text">Prestige</span>
          {fullAnimations && (
            <>
              <div className="portal-rings">
                <div className="portal-ring portal-ring-1" />
                <div className="portal-ring portal-ring-2" />
                <div className="portal-ring portal-ring-3" />
              </div>
            </>
          )}
        </button>
        <button
          onClick={onReset}
          disabled={!plasmaReserved}
          className={clsx(
            "my-4 h-16 w-40 cursor-active rounded-lg border-2 border-black bg-gray-700 font-paytone text-2xl text-white disabled:cursor-inactive",
            !plasmaReserved && "bg-gray-800 opacity-50",
          )}>
          Reset
        </button>
      </div>
      <PrestigeModal
        prestigeDialogue={prestigeDialogue}
        prestigeIntent={prestigeIntent}
        setPrestigeDialogue={setPrestigeDialogue}
        initiatePrestige={initiatePrestige}
      />
    </div>
  )
}

interface ModalProps {
  prestigeDialogue: boolean
  prestigeIntent: boolean
  setPrestigeDialogue: (isOpen: boolean) => void
  initiatePrestige: () => void
}

function PrestigeModal({ prestigeDialogue, prestigeIntent, setPrestigeDialogue, initiatePrestige }: ModalProps) {
  return (
    <ReactModal
      isOpen={prestigeDialogue && !prestigeIntent}
      onRequestClose={() => setPrestigeDialogue(false)}
      contentLabel="Prestige confirmation prompt"
      style={confirmPrestigeStyle}>
      <Confirmation initiatePrestige={initiatePrestige} />
      <button
        className="absolute -right-3 -top-3 z-[1000000] h-9 w-9 cursor-active rounded-full bg-white stroke-white shadow-[0_3px_5px_-2px_rgb(0_0_0_/_0.8),_0_3px_5px_-2px_rgb(0_0_0_/_0.6)] ring-2 ring-inset ring-amber-800 disabled:cursor-inactive"
        onClick={() => setPrestigeDialogue(false)}>
        {CancelIcon()}
      </button>
    </ReactModal>
  )
}

const confirmPrestigeStyle: ModalStylesheet = {
  content: {
    position: "absolute",
    top: "10%",
    right: "10%",
    bottom: "10%",
    left: "10%",
    boxShadow: "0px 0px 21px 12px rgba(0,0,0,0.46) inset",
    border: "2px solid #a5f3fc",
    background: "radial-gradient(circle,rgba(14, 116, 144, 1) 25%, rgba(21, 94, 117, 1) 75%)",
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
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    cursor: `url(${handURL}) 0 0, pointer`,
    zIndex: 1000,
  },
}
