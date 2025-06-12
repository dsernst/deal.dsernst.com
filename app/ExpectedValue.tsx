import { MidpointCalculations, round } from './calcBet'

export const ExpectedValue = ({
  calculations,
  usingLinear,
}: {
  calculations: MidpointCalculations
  usingLinear: boolean
}) => {
  return (
    <div className="text-xs mt-6 text-gray-500 flex flex-col !gap-1 w-full *:flex *:gap-1 *:justify-between *:items-center">
      <div className="self-center font-bold text-[10px]">Expected Value</div>
      <div className={usingLinear ? 'text-white/90' : ''}>
        <span className="w-12">
          <TinyPlus />
          {round(calculations.discounts.left.absolute * 100, 1)}¢
        </span>
        <span className="text-gray-500 text-[10px]">Absolute</span>
        <span className="w-12 text-right">
          <TinyPlus />
          {round(calculations.discounts.right.absolute * 100, 1)}¢
        </span>
      </div>
      <div className={usingLinear ? '' : 'text-white/90'}>
        <span className="w-12">
          <TinyPlus />
          {round(calculations.discounts.left.relative * 100, 1)}%
        </span>
        <span className="text-gray-500 text-[10px]">Relative</span>
        <span className="w-12 text-right">
          <TinyPlus />
          {round(calculations.discounts.right.relative * 100, 1)}%
        </span>
      </div>
    </div>
  )
}

// <TinyPlus />
const TinyPlus = () => <span className="text-[10px] relative bottom-px">+</span>
