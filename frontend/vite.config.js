import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  base: '/Laboratory-system/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve('./src'),
      '@store': resolve('./src/store'),
    },
  },
  optimizeDeps: {
    include: ['exceljs', 'file-saver']
  },
  build: {
    rollupOptions: {
      external: ['exceljs']
    }
  }
})