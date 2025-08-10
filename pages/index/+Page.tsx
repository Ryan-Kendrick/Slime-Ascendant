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
import Fading from "../../components/miscellanious/Fading"

export default function Page() {
  ReactModal.setAppElement("#root")

  return (
    <React.StrictMode>
      <Provider store={store}>
        <Wrapper>
          <div className="flex-none lg:hidden">
            <Navigation />
          </div>
          <main className="flex flex-1 overflow-visible md:min-h-0">
            <div className="relative flex w-full flex-col-reverse lg:flex-row">
              <Panel />
              <Combat>
                <Navigation />
              </Combat>
            </div>
          </main>
          <Loading />
          <Fading />
        </Wrapper>
      </Provider>
    </React.StrictMode>
  )
}
