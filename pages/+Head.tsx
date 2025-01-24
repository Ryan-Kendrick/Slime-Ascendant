// https://vike.dev/Head
import sigmarURL from "../assets/fonts/Sigmar.woff2"
import paytoneOneURL from "../assets/fonts/paytone-one.woff2"

export default function HeadDefault() {
  return (
    <>
      <link rel="preload" href={sigmarURL} as="font" type="font/woff2" crossOrigin="anonymous" />
      <link rel="preload" href={paytoneOneURL} as="font" type="font/woff2" crossOrigin="anonymous" />
    </>
  )
}
