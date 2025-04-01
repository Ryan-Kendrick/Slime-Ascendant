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
import Background from "../../components/miscellanious/background"

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
        <Background>
          <div
            style={appScale}
            className="relative z-10 cursor-inactive flex flex-col-reverse md:flex-col w-screen min-h-screen select-none font-sigmar overflow-y-auto overflow-x-hidden">
            <div className="flex-none">
              <Navigation />
            </div>
            <main className="flex flex-1 md:min-h-0">
              <div className="flex w-full flex-col-reverse lg:flex-row">
                <Panel />
                <Combat />
              </div>
            </main>
            <Loading />
          </div>
        </Background>
      </Provider>
    </React.StrictMode>
  )
}
