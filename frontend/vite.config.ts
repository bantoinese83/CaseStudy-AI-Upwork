import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173, // Use default Vite port to avoid conflict with Docker (3000)
    watch: {
      usePolling: true
    }
  },
  // Suppress TypeScript config warnings from parent directories
  optimizeDeps: {
    esbuildOptions: {
      logOverride: { 'this-is-undefined-in-esm': 'silent' }
    }
  }
})

