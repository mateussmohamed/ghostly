import react from '@vitejs/plugin-react'
import reactRefresh from '@vitejs/plugin-react-refresh'
import { defineConfig } from 'vite'
import { autoComplete, Plugin as importToCDN } from 'vite-plugin-cdn-import'

/** @type {import('vite').UserConfig} */
export default defineConfig({
  build: {
    outDir: './dist/docs',
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDom'
        }
      }
    }
  },
  plugins: [
    react(),
    importToCDN({
      modules: [autoComplete('react'), autoComplete('react-dom')]
    }),
    reactRefresh()
  ]
})
