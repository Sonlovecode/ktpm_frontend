import axios from 'axios';

// Lấy API URL từ biến môi trường, fallback về localhost nếu chưa có
const API_URL = import.meta.env.VITE_API_URL || 'https://ktpm-backend.onrender.com';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Gắn token tự động vào request (nếu có)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Xử lý lỗi trả về (nhất là lỗi 401 hoặc lỗi server)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Nếu token hết hạn hoặc không hợp lệ
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        if (!window.location.href.includes('/login')) {
          // Dùng window.location.href nếu không sử dụng React Router
          window.location.href = '/login';
        }
      }
      // Nếu server lỗi (Render die, network down, etc.)
      else if (error.response.status >= 500) {
        alert('Server đang bảo trì. Vui lòng thử lại sau!');
      }
      // Các lỗi khác (404, 403,...)
      else if (error.response.status === 404) {
        alert('Không tìm thấy dữ liệu yêu cầu.');
      } else if (error.response.status === 403) {
        alert('Bạn không có quyền truy cập vào dữ liệu này.');
      }
    } else {
      
      alert('Không thể kết nối đến máy chủ. Vui lòng kiểm tra mạng hoặc thử lại sau!');
    }
    return Promise.reject(error);
  }
);

// Product APIs
export const productAPI = {
  getAll: () => api.get('/api/v2/products'),
  getById: (id) => api.get(`/api/v2/products/${id}`),
  search: (query) => api.get(`/api/v2/products/search?q=${query}`),
  create: (productData) => api.post('/api/v2/products', productData),
  update: (id, productData) => api.put(`/api/v2/products/${id}`, productData),
  delete: (id) => api.delete(`/api/v2/products/${id}`),
  updateStatus: (id, status) => api.patch(`/api/v2/products/${id}/status`, { status }),
  getCategories: () => api.get('/api/v2/products/categories'),
};

// Auth APIs
export const authAPI = {
  login: (credentials) => api.post('/api/v1/auth/login', credentials),
  register: (userData) => api.post('/api/v1/auth/register', userData),
  logout: () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  },
  checkAuth: () => api.get('/api/v1/auth/check'),
};



export default api;
