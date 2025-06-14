import clsx from "clsx/lite"
import { useEffect, useState } from "react"
import PrestigeButton from "./prestigeButton"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { UPGRADE_CONFIG } from "../../gameconfig/upgrades"
import Currency from "./currency"
import { PlasmaIcon } from "../svgIcons/resourceIcons"
import {
  resetPlasmaReserved,
  selectPlasma,
  selectPlasmaReserved,
  reservePlasma,
  updatePrestige,
  setPrestigeUpgradesPending,
} from "../../redux/playerSlice"
import { PrestigeUpgradeName } from "../../models/upgrades"
import ReactModal from "react-modal"
import { Styles as ModalStylesheet } from "react-modal"
import { CancelIcon } from "../svgIcons/metaIcons"
import { selectHighestZone, selectHighestZoneEver } from "../../redux/statsSlice"
import handURL from "/assets/icons/hand-dark.webp"

export default function Prestige() {
  const dispatch = useAppDispatch()
  const plasmaSelector = selectPlasma
  const plasmaReserved = useAppSelector(selectPlasmaReserved)
  const highZoneEver = useAppSelector(selectHighestZoneEver)
  const highestZone = useAppSelector(selectHighestZone)
  const zoneTenComplete = highestZone > 10

  const [confirmPrestige, setConfirmPrestige] = useState(false)
  const [resetCounter, setResetCounter] = useState(0) // Force remount of prestige buttons to destroy state

  const onReset = () => {
    setResetCounter((prev) => prev + 1)
    dispatch(resetPlasmaReserved())
  }

  function onUpdatePurchase(e: React.MouseEvent<HTMLButtonElement>, cost: number, purchaseCount: number) {
    const upgradeId = e.currentTarget.id as PrestigeUpgradeName

    dispatch(setPrestigeUpgradesPending({ upgradeId, cost, purchaseCount }))
    dispatch(reservePlasma())
  }

  return (
    <div className="flex flex-col h-full">
      <Currency
        key={resetCounter}
        image={PlasmaIcon()}
        fontStyle="text-cyan-300 font-paytone"
        currencySelector={plasmaSelector}
        suffix={plasmaReserved > 0 ? `  (-${plasmaReserved})` : undefined}
      />
      <div className="flex mx-2 font-sans gap-2">
        {UPGRADE_CONFIG.prestige.map((prestigeUpgrade) => (
          <PrestigeButton
            key={prestigeUpgrade.id + resetCounter}
            config={prestigeUpgrade}
            onClick={onUpdatePurchase}
            hidden={!(highZoneEver >= prestigeUpgrade.visibleAtZone)}
          />
        ))}
      </div>
      <div className="relative flex grow gap-4 h-full w-full items-end justify-center">
        <button
          onClick={() => setConfirmPrestige(true)}
          disabled={!zoneTenComplete}
          className={clsx(
            "w-40 h-16 my-4 cursor-active rounded-lg border-2 border-white bg-red-600 text-white font-sans font-extrabold text-2xl",
            !zoneTenComplete && "opacity-50 bg-red-800",
          )}>
          Prestige
        </button>
        <button
          onClick={onReset}
          disabled={!zoneTenComplete}
          className={clsx(
            "w-40 h-16 my-4 cursor-active rounded-lg border-2 border-black bg-gray-700 text-white font-sans font-extrabold text-2xl",
            !zoneTenComplete && "opacity-50 bg-gray-800",
          )}>
          Reset
        </button>
      </div>
      <ReactModal
        isOpen={confirmPrestige}
        onRequestClose={() => setConfirmPrestige(false)}
        contentLabel="Prestige confirmation prompt"
        style={confirmPrestigeStyle}>
        <div className="flex h-full flex-col">
          <button
            className="absolute -top-3 -right-3 w-9 h-9 rounded-full bg-white ring-amber-800 ring-2 ring-inset shadow-[0_3px_5px_-2px_rgb(0_0_0_/_0.8),_0_3px_5px_-2px_rgb(0_0_0_/_0.6)] stroke-white z-[1000000] cursor-active disabled:cursor-inactive"
            onClick={() => setConfirmPrestige(false)}>
            {CancelIcon()}
          </button>
          <h2 className="self-center text-2xl font-bold mb-4">Go backwards to go forwards</h2>
          <div className="flex gap-4 justify-around">
            <div className="flex flex-col">
              <ul className="text-red-600">
                <h3 className="text-xl font-bold mb-1"> You will lose</h3>
                <li>Gold</li>
                <li>Upgrades</li>
                <li>Zone progress</li>
              </ul>
            </div>
            <div className="flex flex-col">
              <ul className="text-amber-700">
                <h3 className="text-xl font-bold mb-1"> You will keep</h3>
                <li>Unspent plasma</li>
                <li>Achievements</li>
              </ul>
            </div>
            <div className="flex flex-col">
              <ul className="text-islam">
                <h3 className="text-xl font-bold mb-1"> You will gain </h3>
                <p>Prestige upgrades</p>
              </ul>
            </div>
          </div>
          <div className="mt-auto">
            <button
              onClick={() => dispatch(updatePrestige())}
              className="w-40 h-16 my-4 self-start cursor-active disabled:cursor-inactive rounded-lg border-2 border-white bg-red-600 text-white font-sans font-bold text-2xl">
              Confirm
            </button>
          </div>
        </div>
      </ReactModal>
    </div>
  )
}

const confirmPrestigeStyle: ModalStylesheet = {
  content: {
    position: "absolute",
    top: "10%",
    right: "10%",
    bottom: "10%",
    left: "10%",
    border: "1px solid #7DF9FF",
    background: "#fff",
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
    backgroundColor: "rgba(255, 255, 255, 0.75)",
    cursor: `url(${handURL}) 0 0, pointer`,
    zIndex: 1000,
  },
}
