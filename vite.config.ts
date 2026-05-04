import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@features': path.resolve(__dirname, 'src/features'),
      '@services': path.resolve(__dirname, 'src/services'),
      '@calculations': path.resolve(__dirname, 'src/calculations'),
      '@theme': path.resolve(__dirname, 'src/theme'),
      '@shell': path.resolve(__dirname, 'src/shell'),
    },
  },
})
