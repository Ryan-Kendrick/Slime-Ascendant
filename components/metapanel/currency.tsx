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
    <div className={`relative flex h-[5.5rem] w-full flex-none flex-col items-center md:w-1/2 ${containerStyle}`}>
      <div className="view-transition-currency absolute left-1/2 flex h-full w-full -translate-x-1/4 items-center justify-start gap-3 md:left-4 md:translate-x-0 lg:left-8 xl:left-12 2xl:left-1/2 2xl:-translate-x-1/4">
        <div className={`h-20 w-20 ${flashAnimation && flashAnimation}`}>{image}</div>
        <span className={`w-full text-left text-4xl ${fontStyle}`}>
          {currency}
          {suffix}
        </span>
      </div>
      <div className={`${innerStyle}`} />
    </div>
  )
}
