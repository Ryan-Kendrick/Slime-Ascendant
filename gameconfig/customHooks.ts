import { useState, useEffect } from "react"

export function useForcedDPI(): number {
  const getDPIScale = () => (window.matchMedia("(min-width: 1024px)").matches ? window.devicePixelRatio : 1)

  const [dpiScale, setDpiScale] = useState(getDPIScale)

  useEffect(() => {
    const queries = [
      window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`),
      window.matchMedia("(min-width: 1024px)"),
    ]

    const handleChange = () => setDpiScale(getDPIScale())

    queries.forEach((query) => query.addEventListener("change", handleChange))

    return () => queries.forEach((query) => query.removeEventListener("change", handleChange))
  }, [])

  return dpiScale
}
