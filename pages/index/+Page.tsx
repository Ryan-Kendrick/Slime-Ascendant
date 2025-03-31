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
import Loading from "../../components/Loading"

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
        <div className="absolute inset-0 bg-amber-200 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute -top-10 left-0 w-[70%] aspect-square rounded-full bg-gradient-to-r from-amber-950 to-amber-800 blur-3xl" />
            <div className="absolute top-1/3 left-1/2 w-[40%] aspect-square rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 blur-3xl" />
            <div className="absolute top-3/4 right-0 translate-x-1/4 -translate-y-3/4 w-[50%] aspect-square rounded-full bg-gradient-to-r from-purple-700 to-violet-900 blur-3xl" />
          </div>
          <div className="absolute flex flex-col lg:flex-row inset-0 overflow-hidden blur-sm">
            <div className="basis-3/5 grow" />
            <svg className="basis-2/5 h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="ray-gradient-1" x1="50%" y1="100%" x2="50%" y2="0%">
                  <stop offset="0%" className="text-white/80" stopColor="currentColor" />
                  <stop offset="80%" className="text-transparent" stopColor="currentColor" />
                </linearGradient>
              </defs>
              <polygon points="0,0 100,0 75,100 25,100" fill="url(#ray-gradient-1)" />
            </svg>
          </div>
        </div>

        <div
          style={appScale}
          className="cursor-inactive flex flex-col-reverse md:flex-col w-screen min-h-screen select-none font-sigmar overflow-y-auto overflow-x-hidden">
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
      </Provider>
    </React.StrictMode>
  )
}
