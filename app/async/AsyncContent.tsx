'use client'

import { useState } from 'react'

import { description, title } from '../constants'
import { Input } from './Input'
import { RoleSelector } from './RoleSelector'

type Role = 'buyer' | 'seller' | null

export function Content() {
  const [role, setRole] = useState<Role>(null)
  const [value, setValue] = useState<null | string>(null)

  return (
    <div
      className="min-h-screen p-8 pt-4 flex flex-col items-center justify-center"
      style={{ minHeight: '100dvh' }} // ignore iOS bottom bar
    >
      <h1 className="text-4xl font-bold mb-1">{title}</h1>
      <p className="text-lg text-gray-400 mb-8">{description}</p>

      {!role ? (
        <RoleSelector onSelect={setRole} />
      ) : !value ? (
        <Input onSubmit={setValue} role={role} />
      ) : (
        <div>
          {/* TODO: Next steps after Alice submits value */}
          <p className="text-gray-400">
            Role: {role}, Value: {value}
          </p>
        </div>
      )}

      {/* Learn more */}
      <a
        className="text-sm text-gray-400 mt-16 block hover:underline"
        href="https://github.com/dsernst/deal.dsernst.com#dealdsernstcom"
        target="_blank"
      >
        Learn more
      </a>
    </div>
  )
}
