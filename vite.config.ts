import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 45321,
    strictPort: true,
    // Allow phone access via HTTPS tunnels (cloudflared / ngrok / localtunnel)
    allowedHosts: true,
  },
  preview: {
    host: '0.0.0.0',
    port: 45322,
    strictPort: true,
    allowedHosts: true,
  },
})

