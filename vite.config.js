import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
  ],
  build: {
    outDir: 'build',
    rollupOptions: {
      input: {
        main: './index.html',
        background: './src/service-worker.js'
      },
      output: {
          entryFileNames: '[name].js',
          assetFileNames: '[name][extname]'
      }
    },
  },
});
