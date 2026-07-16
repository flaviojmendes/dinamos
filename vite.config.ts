import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          if (id.includes('firebase')) return 'vendor-firebase'
          if (id.includes('framer-motion')) return 'vendor-motion'
          if (id.includes('@excalidraw')) return 'vendor-excalidraw'
          if (id.includes('mermaid') || id.includes('cytoscape') || id.includes('elkjs')) {
            return 'vendor-diagrams'
          }
          if (id.includes('@uiw/react-md-editor') || id.includes('@uiw/react-markdown-preview')) {
            return 'vendor-mdeditor'
          }
          if (id.includes('react-syntax-highlighter') || id.includes('refractor')) {
            return 'vendor-highlight'
          }
          if (id.includes('@mdx-js')) return 'vendor-mdx'
          if (id.includes('reactflow') || id.includes('@reactflow')) return 'vendor-reactflow'
          if (id.includes('recharts')) return 'vendor-charts'
          if (id.includes('i18next') || id.includes('react-i18next')) return 'vendor-i18n'
          if (id.includes('lucide-react')) return 'vendor-icons'
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
