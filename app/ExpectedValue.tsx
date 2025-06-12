import { MidpointCalculations, round } from './calcBet'

export const ExpectedValue = ({
  calculations,
  usingLinear,
}: {
  calculations: MidpointCalculations
  usingLinear: boolean
}) => {
  const d = calculations.discounts

  return (
    <div className="text-xs mt-6 text-gray-500 flex flex-col !gap-1 w-full *:flex *:gap-1 *:justify-between *:items-center">
      <div className="self-center font-bold text-[10px]">Expected Value</div>

      {/* 2x2 table */}
      <>
        {/* First row */}
        <div className={shouldHighlight(usingLinear)}>
          <Col value={d.left.absolute}>¢</Col>
          <Mid>Absolute</Mid>
          <Col className="text-right" value={d.right.absolute}>
            ¢
          </Col>
        </div>

        {/* Second row */}
        <div className={shouldHighlight(!usingLinear)}>
          <Col value={d.left.relative}>%</Col>
          <Mid>Relative</Mid>
          <Col className="text-right" value={d.right.relative}>
            %
          </Col>
        </div>
      </>
    </div>
  )
}

const shouldHighlight = (bool: boolean) => (bool ? 'text-white/90' : '')

const Mid = ({ children }: { children: React.ReactNode }) => (
  <span className="text-gray-500 text-[10px]">{children}</span>
)

const Col = ({
  children,
  className,
  value,
}: {
  children: React.ReactNode
  className?: string
  value: number
}) => (
  <span className={`w-12 ${className}`}>
    <TinyPlus />
    {round(value * 100, 1)}
    {children}
  </span>
)

// <TinyPlus />
const TinyPlus = () => <span className="text-[10px] relative bottom-px">+</span>
