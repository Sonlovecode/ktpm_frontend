import axios from 'axios';

// Cập nhật URL API backend trên Render
const API_URL = 'https://ktpm-backend.onrender.com';  // Thay đổi thành URL backend trên Render

const authService = {
    // Đăng ký
    register: async (userData) => {
        try {
            console.log("Gửi request đăng ký:", userData);
            const response = await axios.post(`${API_URL}/api/v1/register`, userData);
            console.log("Response từ server:", response.data);
            
            if (response.data.token) {
                localStorage.setItem('user', JSON.stringify(response.data));
            }
            return response.data;
        } catch (error) {
            console.error("Lỗi đăng ký:", error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Đăng ký thất bại');
        }
    },
    
    // Đăng nhập
    login: async (credentials) => {
        try {
            const response = await axios.post(`${API_URL}/api/v1/login`, credentials);
            if (response.data.token) {
                localStorage.setItem('user', JSON.stringify(response.data));
            }
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Đăng nhập thất bại');
        }
    },
    
    // Đăng xuất
    logout: () => {
        localStorage.removeItem('user');
    },
    
    // Lấy thông tin người dùng hiện tại
    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },
    
    // Lấy token để gắn vào headers
    getAuthHeader: () => {
        const user = authService.getCurrentUser();
        if (user && user.token) {
            return { Authorization: `Bearer ${user.token}` };
        }
        return {};
    },
    
    // Kiểm tra có phải là admin không - ĐÃ CHỈNH SỬA: luôn trả về true
    isAdmin: () => {
        return true; // Tạm thời cho phép tất cả tài khoản đều có quyền admin
    },
    
    // Kiểm tra đã đăng nhập chưa
    isLoggedIn: () => {
        const user = authService.getCurrentUser();
        return !!user;
    }
};

export default authService;
