import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
  },
  coverage: {
      reporter: ['text', 'html', 'lcov'], // or ['text-summary', 'json'] etc.
      exclude: [
        '**/node_modules/**',
        '**/test/**',
        '**/tests/**',
        '**/*.test.js',
        '**/*.spec.js',
      ],
    },
})
