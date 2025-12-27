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
  
  // [FIX LỖI]: Định nghĩa biến global là window để các thư viện cũ không bị crash
  define: {
    global: 'window',
  },

  esbuild: {
    drop: ['console', 'debugger'],
  },
  
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
             // ... giữ nguyên code cũ của bạn
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