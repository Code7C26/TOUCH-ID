import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()], // tailwindcss() genera solo las clases que usamos
  server: { port: 5173 },
})
