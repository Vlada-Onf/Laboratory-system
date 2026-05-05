import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig(({ mode }) => {
  return {
    // base буде '/Laboratory-system/' тільки при команді build (наприклад, під час деплою),
    // а при локальній розробці (npm run dev) залишиться '/'
    base: mode === 'production' ? '/Laboratory-system/' : '/',
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
  }
})