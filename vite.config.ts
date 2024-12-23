import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/zoho': {
        target: 'https://www.zohoapis.in',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/zoho/, ''),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.removeHeader('Origin')
          })
        },
      },
      '/token': {
        target: 'https://accounts.zoho.in',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/token/, ''),
      },
      '/tokenn': 'https://accounts.zoho.in',
    },
  },
})
