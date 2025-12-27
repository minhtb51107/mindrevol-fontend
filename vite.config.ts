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
  // [CẤU HÌNH MỚI CHO PRODUCTION]
  build: {
    // 1. Tăng giới hạn cảnh báo lên 1000kb (đỡ ngứa mắt)
    chunkSizeWarningLimit: 1000, 
    
    // 2. Tự động xóa console.log khi build (giữ lại warn và error)
    esbuild: {
      drop: ['console', 'debugger'],
    },

    // 3. Chiến thuật chia nhỏ file (Manual Chunks)
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Tách các thư viện React core ra riêng (thường ít thay đổi)
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'react-vendor';
            }
            // Tách thư viện UI nặng (Framer Motion, Lucide, Radix...)
            if (id.includes('framer-motion') || id.includes('lucide-react') || id.includes('zod')) {
              return 'ui-vendor';
            }
            // Các thư viện còn lại gom vào vendor chung
            return 'vendor';
          }
        },
      },
    },
  },
});