'use client'

export const roles = [
  ['Buyer', 'Max Offer'],
  ['Seller', 'Min Price'],
] as const
export type Choices = 'buyer' | 'seller'

export function RoleSelector({
  onSelect,
}: {
  onSelect: (role: Choices) => void
}) {
  return (
    <div className="flex flex-col items-center gap-6">
      <h2 className="text-2xl font-semibold mb-2">Are you the...</h2>

      <div className="flex gap-4">
        {roles.map(([role, description]) => (
          <button
            className="px-8 py-4 border border-gray-300 rounded-md hover:bg-gray-100/10 active:bg-gray-100/20 transition-colors text-lg font-medium cursor-pointer"
            key={role}
            onClick={() => onSelect(role.toLowerCase() as Choices)}
          >
            Potential {role}
            <br />
            <span className="text-sm text-gray-400 font-normal">
              {description}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
