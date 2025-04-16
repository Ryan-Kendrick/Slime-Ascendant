import "./style.css"
import "./tailwind.css"
import React from "react"
import Panel from "../../components/metapanel/panelIndex"
import Combat from "../../components/combat/combatIndex"
import { store } from "../../redux/store"
import { Provider } from "react-redux"
import Navigation from "../../components/nav/navigation"
import { useForcedDPI } from "../../gameconfig/customHooks"
import ReactModal from "react-modal"
import Loading from "../../components/miscellanious/Loading"
import Spotlight from "../../components/miscellanious/Spotlight"

export default function Page() {
  ReactModal.setAppElement("#root")

  const currentScale = useForcedDPI()
  const inverseScale = 1 / currentScale

  const appScale: React.CSSProperties | undefined =
    inverseScale !== 1
      ? {
          transform: `scale(${inverseScale})`,
          transformOrigin: "top left",
          width: `${100 * currentScale}vw`,
          height: `${100 * currentScale}vh`,
          position: "absolute",
          top: 0,
          left: 0,
        }
      : undefined

  return (
    <React.StrictMode>
      <Provider store={store}>
        <div style={appScale} className="cursor-inactive select-none font-sigmar overflow-hidden">
          <div className="z-0 bg-amber-200 w-screen min-h-screen relative flex flex-col-reverse md:flex-col overflow-hidden">
            <div className="flex-none">
              <Navigation />
            </div>
            <main className="flex flex-1 md:min-h-0 overflow-visible">
              <div className="relative flex w-full flex-col-reverse lg:flex-row">
                <Panel />
                {/* <div className="lg:basis-3/5" /> */}
                <Combat />
              </div>
            </main>
            <Loading />
          </div>
        </div>
      </Provider>
    </React.StrictMode>
  )
}
