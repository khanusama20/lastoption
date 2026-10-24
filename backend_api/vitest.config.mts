import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    exclude: ['dist/**', 'node_modules/**'],
    env: {
      NODE_ENV: 'test',
    },
    setupFiles: ['./src/__tests__/setup.ts'],
  },
});
