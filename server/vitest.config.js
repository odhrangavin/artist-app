import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      reporter: ['text', 'html', 'lcov'], // or ['text-summary', 'json'] etc.
      exclude: [
        '**/node_modules/**',
        '**/test/**',
        '**/tests/**',
        '**/*.test.js',
        '**/*.spec.js',
        '**/*.config.js'
      ],
    },
    env: {
      NODE_ENV: "test"
    }
  },
});
