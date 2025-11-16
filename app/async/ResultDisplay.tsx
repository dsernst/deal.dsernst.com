import Link from 'next/link'

type MPCResult = {
  hasOverlap: boolean
  result: null | number
}

export function ResultDisplay({ result }: { result: MPCResult }) {
  if (!result.hasOverlap)
    return (
      <div className="flex flex-col items-center gap-4">
        <p className="text-2xl">❌ No overlap, sorry</p>
        <p className="text-gray-400 text-sm">
          The seller&apos;s minimum is higher than the buyer&apos;s maximum.
        </p>

        <ReturnHomeLink />
      </div>
    )

  if (result.result === null)
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="text-2xl font-bold">✅ A deal is possible</div>

        <ReturnHomeLink />
      </div>
    )

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-gray-400">
        Deal possible &nbsp;✅&nbsp; Your win-win price is:
      </p>
      <div className="text-4xl font-bold">${result.result.toFixed(2)}</div>
      <p className="text-sm text-gray-400 text-center mt-4">
        Tell the sender to open the link to see the deal.
      </p>

      <ReturnHomeLink />
    </div>
  )
}

const ReturnHomeLink = () => (
  <Link
    className="text-sm mt-16 text-gray-600 block hover:underline"
    href="/async"
  >
    <span className="text-xs">↩</span> Home
  </Link>
)
