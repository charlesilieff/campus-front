/* eslint-disable @typescript-eslint/naming-convention */
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import visualizer from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
// eslint-disable-next-line import/no-default-export
export default defineConfig({
  plugins: [react(), tsconfigPaths({ projects: ['./tsconfig.json'] })],
  server: { port: 1234 },
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
    },
    chunkSizeWarningLimit: 1500
  }
})
