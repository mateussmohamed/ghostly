import { resolve } from 'path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

/** @type {import('vite').UserConfig} */
export default defineConfig({
  build: {
    outDir: './dist/lib',
    lib: {
      entry: resolve(__dirname, 'lib/index.ts'),
      name: 'Ghostly',
      formats: ['es', 'cjs'],
      fileName: 'index'
    },
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
  plugins: [react(), dts({ outputDir: './dist' })]
})
