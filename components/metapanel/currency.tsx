import { formatSmallNumber } from "../../gameconfig/utils"
import { useAppSelector } from "../../redux/hooks"
import { RootState } from "../../redux/store"

interface CurrencyProps {
  image: JSX.Element
  fontStyle: string
  containerStyle?: string
  innerStyle?: string
  currencySelector: (state: RootState) => number
  suffix?: string
}

export default function Currency({
  image,
  fontStyle,
  containerStyle,
  innerStyle,
  currencySelector,
  suffix,
}: CurrencyProps) {
  const currency = formatSmallNumber(useAppSelector(currencySelector))

  return (
    <div className={`relative flex flex-none flex-col h-[5.5rem] items-center ${containerStyle}`}>
      <div className="flex absolute items-center gap-3 top-1/2 left-[60%] md:left-[72%] -translate-x-[60%] md:-translate-x-[72%] -translate-y-1/2">
        <div className="w-20 h-20">{image}</div>
        <span className={`text-4xl min-w-[10ch] md:w-[15ch] text-left ${fontStyle}`}>
          {currency}
          {suffix}
        </span>
      </div>
      <div className={`${innerStyle}`}></div>
    </div>
  )
}
