import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // 加载以VITE_开头的环境变量
  const env = loadEnv(mode, process.cwd())

  return {
    plugins: [react()],
    server: {
      port: 8080,
      proxy: {
        '/api': {
          target: env.VITE_BASE_URL || 'http://localhost:3001',
          changeOrigin: true,
        }
      }
    },
    base: './',
  }
})
