// src/pages/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/auth';
import { adminAPI,  } from '../api'; // Import các API cần thiết
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';


import '../styles/AdminDashboard.css';
import axios from 'axios';

const AdminDashboard = () => {
  const [auth] = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [countUsers, setCountUsers] = useState(0);
  
  // Xác định menu item nào đang active dựa trên đường dẫn hiện tại
  const [activeMenu, setActiveMenu] = useState('dashboard');
  
  // Thêm state cho dữ liệu dashboard
  const [dashboardStats, setDashboardStats] = useState({
    users: { total: 0, newCount: 0 },
    products: { total: 0, newCount: 0 },
    orders: { total: 0, newCount: 0 },
    revenue: { total: 0, newAmount: 0 }
  });
  
  // Thêm state cho hoạt động gần đây
  const [recentActivities, setRecentActivities] = useState([]);
  
  // Thêm state cho loading
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!auth?.user) {
      // nếu không có user, điều hướng về login
      navigate('/login');
    } else {
      // Chỉ tải dữ liệu khi đã đăng nhập
      fetchDashboardData();
    }

    
    // Cập nhật active menu dựa trên path
    const path = location.pathname;
    if (path.includes('/admin/users')) {
      setActiveMenu('users');
    } else if (path.includes('/admin/products')) {
      setActiveMenu('products');
    } else if (path.includes('/admin/orders')) {
      setActiveMenu('orders');
    } else {
      setActiveMenu('dashboard');
    }
  }, [auth, navigate, location]);
  

  
  useEffect(() => {
    const getSoLuongUsers = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/v1/users/count`);
            setCountUsers(response.data)
        } catch (error) {
            console.log('LỖi không thể lấy số lượng users', error)
        }
    };
    getSoLuongUsers();
}, [])
  
  // Hàm để tải dữ liệu dashboard
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Gọi API để lấy thống kê dashboard
      const response = await adminAPI.getDashboardStats();
      if (response.data) {
        setDashboardStats({
          users: { 
            total: response.data.userStats.total || 0, 
            newCount: response.data.userStats.newThisWeek || 0 
          },
          products: { 
            total: response.data.productStats.total || 0, 
            newCount: response.data.productStats.newThisWeek || 0 
          },
          orders: { 
            total: response.data.orderStats.total || 0, 
            newCount: response.data.orderStats.newThisWeek || 0 
          },
          revenue: { 
            total: response.data.revenueStats.total || 0, 
            newAmount: response.data.revenueStats.thisWeek || 0 
          }
        });
        
        // Cập nhật hoạt động gần đây
        if (response.data.recentActivities) {
          setRecentActivities(response.data.recentActivities);
        }
      }
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu dashboard:", error);
    } finally {
      setLoading(false);
    }
  };
  
  if (!auth?.user) {
    return <p style={{ padding: 20 }}>Vui lòng đăng nhập để truy cập trang admin.</p>;
  }
  
  
  // Hàm định dạng số tiền
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' VND';
  };
  
  return (
        
    <div className="admin-container">
      <div className="main-content">
        <div className="top-bar">
          <div>
            <i className="search-icon">🔍</i>
            <i className="refresh-icon" onClick={fetchDashboardData}>♻️</i>
          </div>
          <div className="user-profile">
            <div className="user-avatar">{auth?.user?.name?.charAt(0) || 'U'}</div>
            <span>{auth?.user?.name || 'User'}</span>
          </div>
        </div>
        
        <div className="title-bar">
          <h2 className="title-text">
            {activeMenu === 'dashboard' && 'Bảng Điều Khiển'}
            {activeMenu === 'users' && 'Quản Lý Người Dùng'}
            {activeMenu === 'products' && 'Quản Lý Sản Phẩm'}
            {activeMenu === 'orders' && 'Quản Lý Đơn Hàng'}
          </h2>
        </div>
        
        <div className="content-area">
          {loading && activeMenu === 'dashboard' ? (
            <div className="loading-indicator">Đang tải dữ liệu...</div>
          ) : (
            <>
              {activeMenu === 'dashboard' && (
                <div className="dashboard-stats">
                  <div className="stat-card">
                    <h3>Người dùng</h3>
                    <p className="stat-number">{dashboardStats.users.total}</p>
                    <p className="stat-info">+({countUsers.User}) tuần này</p>
                    <p className="stat-info">+{dashboardStats.users.newCount} tuần này</p>
                  </div>
                  
                  <div className="stat-card">
                    <h3>Sản phẩm</h3>
                    <p className="stat-number">{dashboardStats.products.total}</p>
                    <p className="stat-info">+{dashboardStats.products.newCount} tuần này</p>
                  </div>
                  
                  <div className="stat-card">
                    <h3>Đơn hàng</h3>
                    <p className="stat-number">{dashboardStats.orders.total}</p>
                    <p className="stat-info">+{dashboardStats.orders.newCount} tuần này</p>
                  </div>
                  
                  <div className="stat-card">
                    <h3>Doanh thu</h3>
                    <p className="stat-number">{formatCurrency(dashboardStats.revenue.total)}</p>
                    <p className="stat-info">+{formatCurrency(dashboardStats.revenue.newAmount)} tuần này</p>
                  </div>
                </div>
              )}
              
              {activeMenu === 'dashboard' && (
                <div className="recent-activity">
                  <h3>Hoạt động gần đây</h3>
                  {recentActivities.length > 0 ? (
                    <ul className="activity-list">
                      {recentActivities.map((activity, index) => (
                        <li key={index}>
                          <span className="activity-time">{activity.time}</span>
                          <span className="activity-text">{activity.description}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="no-activity">Không có hoạt động nào gần đây</p>
                  )}
                </div>
              )}
            </>
          )}
          
          {/* Các phần nội dung cho các menu khác sẽ được render ở đây thông qua React Router */}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;