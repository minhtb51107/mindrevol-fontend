import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  // [SỬA LẠI]: Đưa esbuild ra ngoài, nằm ở cấp root
  esbuild: {
    drop: ['console', 'debugger'],
  },

  // Cấu hình Build nằm riêng ở đây
  build: {
    chunkSizeWarningLimit: 1000,
    
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'react-vendor';
            }
            if (id.includes('framer-motion') || id.includes('lucide-react') || id.includes('zod')) {
              return 'ui-vendor';
            }
            return 'vendor';
          }
        },
      },
    },
  },
});