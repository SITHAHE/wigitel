import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// base: './' — чтобы сайт работал и из подпапки (GitHub Pages)
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
})
