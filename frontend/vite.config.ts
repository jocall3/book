import { defineConfig, splitVendorChunkPlugin } from 'vite';
import react from '@vitejs/plugin-react-swc';
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    wasm(),
    topLevelAwait(),
    splitVendorChunkPlugin(),
    visualizer({
      filename: './dist/stats.html',
      open: false,
      gzipSize: true,
    }),
  ],
  server: {
    port: 3000,
    strictPort: true,
    hmr: {
      overlay: true,
    },
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
    },
  },
  build: {
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        passes: 3,
        pure_funcs: ['console.log', 'console.info'],
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'framer-motion'],
          engine: ['./src/core/conflict-engine/engine.wasm'],
        },
        chunkFileNames: 'assets/[name]-[hash].js',
      },
    },
    reportCompressedSize: false,
    sourcemap: false,
  },
  optimizeDeps: {
    exclude: ['@ledgerhq/hw-transport-webusb'],
    esbuildOptions: {
      target: 'esnext',
    },
  },
  worker: {
    format: 'es',
    plugins: [wasm(), topLevelAwait()],
  },
});