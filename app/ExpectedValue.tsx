import { MidpointCalculations, round } from './calcBet'

type Units = '%' | '¢'

export const ExpectedValue = ({
  calculations,
  usingLinear,
}: {
  calculations: MidpointCalculations
  usingLinear: boolean
}) => {
  const d = calculations.discounts

  const Row = ({
    label,
    symbol,
    type,
  }: {
    label: 'absolute' | 'relative'
    symbol: Units
    type: 'linear' | 'relative'
  }) => (
    <div className={usingLinear === (type === 'linear') ? 'text-white/90' : ''}>
      <Col {...{ symbol }} value={d.left[label]} />
      <Mid>{toTitleCase(label)}</Mid>
      <Col {...{ symbol }} value={d.right[label]} />
    </div>
  )

  return (
    <div className="text-xs mt-6 text-gray-500 flex flex-col !gap-1 w-full *:flex *:gap-1 *:justify-between *:items-center">
      <div className="self-center font-bold text-[10px]">Expected Value</div>

      {/* 2x2 table */}
      <>
        <Row label="absolute" symbol="¢" type="linear" />
        <Row label="relative" symbol="%" type="relative" />
      </>
    </div>
  )
}

const Mid = ({ children }: { children: React.ReactNode }) => (
  <span className="text-gray-500 text-[10px]">{children}</span>
)

const Col = ({ symbol, value }: { symbol: Units; value: number }) => (
  <span className="w-12 last:text-right">
    <TinyPlus />
    {round(value * 100, 1)}
    {symbol}
  </span>
)

// <TinyPlus />
const TinyPlus = () => <span className="text-[10px] relative bottom-px">+</span>

const toTitleCase = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)
