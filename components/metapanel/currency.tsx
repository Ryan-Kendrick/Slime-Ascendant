import { useAppSelector } from "../../redux/hooks"
import { RootState } from "../../redux/store"

interface CurrencyProps {
  image: JSX.Element
  fontstyle: string
  currencySelector: (state: RootState) => number
  suffix?: string
}

export default function Currency({ image, fontstyle, currencySelector, suffix }: CurrencyProps) {
  const currency = useAppSelector(currencySelector)

  return (
    <div className="relative flex flex-none flex-col h-[5.5rem] items-center">
      <div className="flex absolute items-center gap-3 top-1/2 left-[60%] md:left-[72%] transform -translate-x-[60%] md:-translate-x-[72%] -translate-y-1/2">
        <div className="w-20 h-20">{image}</div>
        <span className={`text-3xl md:text-4xl min-w-[10ch] md:w-[15ch] text-left ${fontstyle}`}>
          {currency}
          {suffix}
        </span>
      </div>
    </div>
  )
}
