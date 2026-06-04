import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup'
import remarkGfm from 'remark-gfm'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // MDX must run before the React plugin so Fast Refresh sees the emitted JSX.
    { enforce: 'pre', ...mdx({ remarkPlugins: [remarkGfm], providerImportSource: '@mdx-js/react' }) },
    react({ include: /\.(jsx|tsx|mdx)$/ }),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'https://designlab-392139337985.us-east1.run.app',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
