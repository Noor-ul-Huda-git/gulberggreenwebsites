import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      'gulberggreens.com.pk',
      'www.gulberggreens.com.pk',
    ],
    // So VITE_API_BASE_URL=/api hits Django during `npm run dev` (same as nginx in production).
    proxy: {
      '/api': { target: 'http://127.0.0.1:8000', changeOrigin: true },
      // Django static (optional if you use `/static/...` URL). Large PDFs need a long timeout.
      '/static': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        timeout: 600_000,
        proxyTimeout: 600_000,
      },
    },
  },
})
