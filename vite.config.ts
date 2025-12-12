import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    basicSsl() // Tự động tạo chứng chỉ HTTPS (Bắt buộc cho FB Login)
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // Giữ lại cấu hình đường dẫn tắt
    },
  },
  server: {
    port: 5173,
    // host: true, // Bỏ comment dòng này nếu muốn truy cập từ điện thoại chung wifi
  }
})