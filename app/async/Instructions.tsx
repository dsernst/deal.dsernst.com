export const Instructions = () => (
  <ul className="mt-5 text-sm text-gray-400 space-y-1.5 text-center max-w-xs mx-auto">
    <li>You can only submit your value once.</li>
    <li>Neither side will see the other&apos;s input.</li>
    <li>
      <span className="mt-6 block text-xs">✅</span> If there is an overlap, a
      fair random win-win price will be picked between min & max.
    </li>
    <li>
      <span className="mt-6 block text-xs">❌</span> If there&apos;s no overlap,
      no hard feelings.
    </li>

    <li className="mt-6">
      <i className="text-white/75 font-bold">Hint</i>: Unlike traditional
      negotiations, both sides&apos; best move here is to enter your{' '}
      <span className="font-medium text-white/75">honest cutoff</span> point, to
      not miss potential win-win deals. &quot;Posturing&quot; is a losing
      strategy.
    </li>
  </ul>
)
