import { FlatCompat } from '@eslint/eslintrc'
import perfectionist from 'eslint-plugin-perfectionist'

const config = [
  ...new FlatCompat().extends('next/core-web-vitals', 'next/typescript'),
  perfectionist.configs['recommended-natural'],
]

export default config
