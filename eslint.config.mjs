import { FlatCompat } from '@eslint/eslintrc'

const config = [
  ...new FlatCompat().extends('next/core-web-vitals', 'next/typescript'),
]

export default config
