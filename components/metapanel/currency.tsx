import { formatSmallNumber } from "../../gameconfig/utils"
import { useAppSelector } from "../../redux/hooks"
import { selectAnimationPref } from "../../redux/metaSlice"
import { RootState } from "../../redux/store"

interface CurrencyProps {
  image: JSX.Element
  fontStyle: string
  containerStyle?: string
  innerStyle?: string
  currencySelector: (state: RootState) => number
  suffix?: string
  animateOnMount?: boolean
}

export default function Currency({
  image,
  fontStyle,
  containerStyle,
  innerStyle,
  currencySelector,
  suffix,
  animateOnMount = false,
}: CurrencyProps) {
  const currency = formatSmallNumber(useAppSelector(currencySelector))
  const animationPref = useAppSelector(selectAnimationPref)
  const flashAnimation = animateOnMount && animationPref > 0 && "white-flash"

  return (
    <div className={`relative flex h-[5.5rem] flex-none flex-col items-center ${containerStyle}`}>
      <div className="absolute left-[60%] top-1/2 flex -translate-x-[60%] -translate-y-1/2 items-center gap-3 md:left-[72%] md:-translate-x-[72%]">
        <div className={`h-20 w-20 ${flashAnimation && flashAnimation}`}>{image}</div>
        <span className={`min-w-[10ch] text-left text-4xl md:w-[15ch] ${fontStyle}`}>
          {currency}
          {suffix}
        </span>
      </div>
      <div className={`${innerStyle}`}></div>
    </div>
  )
}
