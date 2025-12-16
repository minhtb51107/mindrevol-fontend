import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    basicSsl() // Tự động tạo HTTPS cho Frontend (Localhost)
  ],
  
  // [QUAN TRỌNG] Fix lỗi "global is not defined" của thư viện SockJS
  define: {
    global: 'window', 
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  server: {
    port: 5173,
    https: true, // Kích hoạt HTTPS cho frontend
    // Cấu hình Proxy để đẩy request sang Backend (đang chạy HTTPS 8080)
    proxy: {
      '/api': {
        target: 'https://localhost:8080', 
        changeOrigin: true,
        secure: false, // [QUAN TRỌNG] Bỏ qua lỗi chứng chỉ tự ký của Backend
      },
      '/ws': {
        target: 'https://localhost:8080',
        ws: true,      // Kích hoạt proxy cho WebSocket
        changeOrigin: true,
        secure: false, // [QUAN TRỌNG]
      },
    },
  }
})