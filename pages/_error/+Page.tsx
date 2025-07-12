import React from "react"
import { usePageContext } from "vike-react/usePageContext"
import faviconURL from "../../assets/icons/logo.svg"

export default function Page() {
  const { is404 } = usePageContext()
  if (is404) {
    return (
      <div className="flex flex-col place-items-center text-red-500">
        <h1 className="text-4xl font-bold">404 Page Not Found</h1>
        <p className="mb-2 text-3xl">This page could not be found.</p>
        <img src={faviconURL} alt="Slime Ascend logo" className="h-1/2 w-1/2" />
      </div>
    )
  }
  return (
    <div className="flex flex-col place-items-center text-red-500">
      <h1 className="text-4xl font-bold">500 Internal Server Error</h1>
      <p className="mb-2 text-3xl">Something went wrong.</p>
      <img src={faviconURL} alt="Slime Ascend logo" className="h-1/2 w-1/2" />
    </div>
  )
}
