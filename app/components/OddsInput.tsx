export default function OddsInput() {
  return (
    <div className="flex gap-4">
      {[30, 75].map((placeholder, index) => (
        <div key={`odds${index + 1}`} className="flex flex-col">
          <label
            htmlFor={`odds${index + 1}`}
            className="text-sm font-medium mb-1"
          >
            Person {index + 1}&apos;s Odds
          </label>
          <input
            type="text"
            placeholder={placeholder + '%'}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      ))}
    </div>
  )
}
