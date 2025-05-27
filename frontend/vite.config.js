import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0', // esto es equivalente a `host: true` pero más explícito
    port: 5173,
    hmr: {
      host: '192.168.1.203', // tu IP local actual (ajústala si cambia)
      protocol: 'ws',
    },
  },
})
