import "./index/style.css"
import "./index/tailwind.css"
import React from "react"
import { store } from "../redux/store"
import { Provider } from "react-redux"
import Navigation from "../components/nav/navigation"
import ReactModal from "react-modal"
import Loading from "../components/miscellanious/Loading"
import Wrapper from "../components/miscellanious/Wrapper"
import Fading from "../components/miscellanious/Fading"
import Main from "../components/miscellanious/Main"

export default function Page() {
  ReactModal.setAppElement("#root")

  return (
    <React.StrictMode>
      <Provider store={store}>
        <Wrapper>
          <div className="flex-none lg:hidden">
            <Navigation />
          </div>
          <Main />
          <Loading />
          <Fading />
        </Wrapper>
      </Provider>
    </React.StrictMode>
  )
}
