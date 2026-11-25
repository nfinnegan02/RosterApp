import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 8080,
    proxy: {'/api': 'http://localhost:3000'},
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Hide Sass deprecation warnings coming from Bootstrap's own source
        quietDeps: true,
        silenceDeprecations: ['import', 'color-functions', 'global-builtin', 'if-function'],
      },
    },
  },
  plugins: [react()],
})
