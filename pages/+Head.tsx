// https://vike.dev/Head
import sigmarURL from "../assets/fonts/Sigmar.woff2"
import paytoneOneURL from "../assets/fonts/paytone-one.woff2"

export default function HeadDefault() {
  return (
    <>
      <link rel="preload" href="/fonts/Sigmar.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      <link rel="preload" href="/fonts/paytone-one.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
    </>
  )
}
