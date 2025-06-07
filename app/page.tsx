export default function Home() {
  return (
    <div className="min-h-screen p-8 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">Bet Calculator</h1>
      <p className="text-lg text-gray-400 mb-8">
        Calculate 2-person bets fast & fairly
      </p>

      {/* Odds inputs */}
      <div className="flex gap-4">
        <div className="flex flex-col">
          <label htmlFor="odds1" className="text-sm font-medium mb-1">
            Person 1&apos;s Odds
          </label>
          <input
            type="text"
            id="odds1"
            placeholder="30%"
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="odds2" className="text-sm font-medium mb-1">
            Person 2&apos;s Odds
          </label>
          <input
            type="text"
            id="odds2"
            placeholder="75%"
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  )
}
