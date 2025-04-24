import "./style.css"
import "./tailwind.css"
import React from "react"
import Panel from "../../components/metapanel/panelIndex"
import Combat from "../../components/combat/combatIndex"
import { store } from "../../redux/store"
import { Provider } from "react-redux"
import Navigation from "../../components/nav/navigation"
import ReactModal from "react-modal"
import Loading from "../../components/miscellanious/Loading"
import Wrapper from "../../components/miscellanious/Wrapper"

export default function Page() {
  ReactModal.setAppElement("#root")

  return (
    <React.StrictMode>
      <Provider store={store}>
        <Wrapper>
          <div className="w-full h-full relative z-0 bg-amber-200 flex flex-col-reverse md:flex-col">
            <div className="flex-none">
              <Navigation />
            </div>
            <main className="flex flex-1 md:min-h-0 overflow-visible">
              <div className="relative flex w-full flex-col-reverse lg:flex-row">
                <Panel />
                <Combat />
              </div>
            </main>
            <Loading />
          </div>
        </Wrapper>
      </Provider>
    </React.StrictMode>
  )
}
