export type Tab = "upgrade" | "prestige"

export interface TabData {
  id: Tab
  title: string
  component: JSX.Element
}
