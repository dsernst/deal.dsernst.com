export function OneShotAgreement({
  ModeSwitcher,
  overlapOnly,
}: {
  ModeSwitcher: React.ReactNode
  overlapOnly: boolean
}) {
  return (
    <div className="max-w-xl text-center mt-24 border-t border-white/10 pt-14 gap-5 flex flex-col">
      {ModeSwitcher}

      <h2 className="text-[21px] font-semibold mt-8">
        Agreement for {overlapOnly ? 'Finding Possible Deals' : 'Win-Win Deals'}
      </h2>
      <p>
        We each have a <b className="text-cyan-200">private cut-off point</b> —
        <br />
        the seller{`'`}s true minimum and buyer{`'`}s maximum for doing this
        deal.
      </p>

      <p>
        We agree to run this protocol{' '}
        <b className="italic text-cyan-200">once</b>, honestly inputting our
        true values.
      </p>

      <p>
        If there{`'`}s <b className="text-pink-300">no overlap</b>, we both walk
        away with no hard feelings.
      </p>
      <p>
        If there <b className="text-green-300">is an overlap</b>, the protocol
        will{' '}
        {overlapOnly
          ? 'let us know, without revealing our private cut-offs points'
          : 'pick a fair-random price in that range, and we commit to accepting the outcome'}
        .
      </p>

      <p>
        No retries
        {overlapOnly
          ? ". No need to waste either of our time if there isn't a win-win deal possible in the first place"
          : ', no second rounds, no re-opening the negotiation afterward'}
        .
      </p>
    </div>
  )
}
