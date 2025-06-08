'use client'

export type Odds = [string, string]

export default function OddsInput({
  odds,
  setHashValues,
}: {
  odds: Odds
  setHashValues: (nextValues: Odds) => void
}) {
  return (
    <div className="flex gap-4">
      {['30', '75'].map((placeholder, index) => (
        <div className="flex flex-col" key={`odds${index + 1}`}>
          <label
            className="text-sm font-medium mb-1"
            htmlFor={`odds${index + 1}`}
          >
            Person {index + 1}&apos;s Odds
          </label>
          <div className="relative text-3xl">
            <input
              type="text"
              {...{ placeholder }}
              autoFocus={index === 0 && !odds[0]}
              className="px-3 py-2 h-20 w-30 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => {
                const newValues: Odds = [odds[0], odds[1]]
                newValues[index] = e.target.value
                setHashValues(newValues)
              }}
              value={odds[index]}
            />
            <span className="text-gray-400 absolute right-3 top-[23px]">%</span>
          </div>
        </div>
      ))}
    </div>
  )
}
