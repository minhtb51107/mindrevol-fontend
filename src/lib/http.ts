// src/lib/http.ts
import axios from 'axios';

// Đổi URL này nếu Backend của bạn chạy port khác
const BASE_URL = 'http://localhost:8080/api/v1';

export const http = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Tự động đính kèm Token nếu có (chuẩn bị cho tương lai)
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor: Xử lý lỗi gọn gàng
http.interceptors.response.use(
  (response) => response,
  (error) => {
    // Nếu API trả về lỗi 401 (Hết hạn token), sau này ta sẽ xử lý logout tại đây
    return Promise.reject(error.response?.data || error);
  }
);