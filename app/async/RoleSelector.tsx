'use client'

export const roles = [
  ['Buyer', 'Max Offer'],
  ['Seller', 'Min Price'],
] as const
export type Choices = 'buyer' | 'seller'

export function RoleSelector({
  onSelect,
  selectedRole = null,
}: {
  onSelect: (role: Choices) => void
  selectedRole?: Choices | null
}) {
  return (
    <div className="flex flex-col items-center gap-6">
      <h2 className="text-2xl font-semibold mb-2">Are you the...</h2>

      <div className="flex gap-4">
        {roles.map(([role, description]) => {
          const choice = role.toLowerCase() as Choices
          const selected = selectedRole === choice
          return (
            <button
              className={`px-8 py-4 border rounded-md transition-colors text-lg font-medium cursor-pointer ${
                selected
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-gray-300 hover:bg-gray-100/10 active:bg-gray-100/20'
              }`}
              key={role}
              onClick={() => onSelect(choice)}
            >
            Potential {role}
            <br />
            <span className="text-sm text-gray-400 font-normal">
              {description}
            </span>
          </button>
          )
        })}
      </div>
    </div>
  )
}
