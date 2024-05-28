import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  {
    extends: './vitest.config.ts',
    test: {
      name: 'mongoose',
      include: ['mongoose/**/*.spec.ts'],
    },
  },
])
