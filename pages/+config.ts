import vikeReact from "vike-react/config"
import type { Config } from "vike/types"
import logoURL from "../assets/icons/logo.svg"

export default {
  title: "Slime Ascendant",
  description: "The Incremental Adventure",
  image: logoURL,
  favicon: logoURL,
  ssr: false,
  passToClient: ["user"],
  extends: vikeReact,
} satisfies Config
