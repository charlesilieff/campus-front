import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import visualizer from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths({ projects: ['./tsconfig.json'] })],

  define: {
    'process.env': process.env
  },
  resolve: {
    alias: {
      '~bootswatch': resolve(__dirname, './node_modules/bootswatch')
    }
  },
  assetsInclude: ['**/*.webp'],
  build: {
    rollupOptions: {
      plugins: [visualizer({ emitFile: true, filename: 'stats.html', open: true })]
    }
  }
})
