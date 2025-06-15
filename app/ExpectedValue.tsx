import { useState } from 'react'

import { MidpointCalculations, round } from './calcBet'
import { ClickableClasses } from './Calculation'

type Units = '%' | '¢'

export const ExpectedValue = ({
  calculations,
  usingLinear,
}: {
  calculations: MidpointCalculations
  usingLinear: boolean
}) => {
  const d = calculations.discounts
  const [showCondensed, setShowCondensed] = useState(true)

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
    <div
      className={`${ClickableClasses} mt-6 text-xs text-gray-500 -mx-3 px-1.5 -left-1.5 relative`}
      onClick={() => setShowCondensed(!showCondensed)}
    >
      {showCondensed ? (
        // Condensed view
        <div className="flex w-full justify-between items-center">
          {/* Left label */}
          <div className="self-center font-bold text-[10px]">
            Each Person&apos;s <span className="text-white/70">EV</span>
          </div>

          {/* Right value */}
          <div className="text-white/90">
            {!usingLinear ? (
              <Col symbol="%" value={d.left.relative} />
            ) : (
              <Col symbol="¢" value={d.left.absolute} />
            )}
          </div>
        </div>
      ) : (
        // Expanded view
        <div className="flex flex-col !gap-1 w-full *:flex *:gap-1 *:justify-between *:items-center">
          {/* Table title */}
          <div className="self-center font-bold text-[10px]">
            Expected Value
          </div>

          {/* 2x2 table */}
          <>
            <Row label="absolute" symbol="¢" type="linear" />
            <Row label="relative" symbol="%" type="relative" />
          </>
        </div>
      )}
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
