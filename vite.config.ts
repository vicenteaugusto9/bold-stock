import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  root: 'frontend',           // ✅ aponta para a pasta frontend
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './frontend/src')
    }
  }
})