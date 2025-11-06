import type { RouteSync } from "vike/types"

export const route: RouteSync = (pageContext) => {
  const { urlPathname } = pageContext

  // Match /, /chat, and /achievements
  if (urlPathname === "/" || urlPathname === "/chat" || urlPathname === "/achievements") {
    return true
  }

  return false
}
