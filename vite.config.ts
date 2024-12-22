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
        target: 'https://www.zohoapis.in', // Base API URL
        changeOrigin: true, // Change the origin to match the target
        rewrite: (path) => path.replace(/^\/zoho/, ''), // Remove '/zoho' from the path before forwarding
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.removeHeader('Origin') // Remove the Origin header
          })
        },
      },
      '/token': {
        target: 'https://accounts.zoho.in',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/token/, ''),
      },
    },
  },
})
