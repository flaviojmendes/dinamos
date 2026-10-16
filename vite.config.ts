import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    manifest: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Keep React and its shared helpers together. Splitting each tool's
          // dependencies manually can pull the runtime into a lazy tool chunk
          // and make initialization depend on chunk allocation order.
          if (
            /\/node_modules\/(react|react-dom|scheduler)\//.test(id) ||
            id.includes('\0commonjsHelpers')
          ) {
            return 'vendor-react'
          }
          // Let Rollup split the remaining dependencies around route imports.
        },
      },
    },
  },
  server: {
    proxy: {
      '/api': {
        target: process.env.API_PROXY_TARGET || 'https://designlab-392139337985.us-east1.run.app',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
