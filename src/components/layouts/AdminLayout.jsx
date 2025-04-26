
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from "../../context/auth";




// import './styles/AdminDashboard.css'; // dùng lại CSS có sẵn luôn

const AdminLayout = () => {
  const [auth] = useAuth();
  const location = useLocation();

  
  const activeMenu = () => {
    const path = location.pathname;
    if (path.includes('/admin/users')) return 'users';
    if (path.includes('/admin/products')) return 'products';
    if (path.includes('/admin/orders')) return 'orders';
    return 'dashboard';
  };

  const handleMenuClick = () => {
    // không cần setActive, location tự cập nhật
  };

 

  return (
    <div className="admin-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <span>Quản Trị Hệ Thống</span>
        </div>
        
        <Link to="/admin" className="menu-link">
          <div className={`menu-item ${activeMenu() === 'dashboard' ? 'active' : ''}`} onClick={handleMenuClick}>
            <i>📊</i> Dashboard
          </div>
        </Link>

        <Link to="/admin/users" className="menu-link">
          <div className={`menu-item ${activeMenu() === 'users' ? 'active' : ''}`} onClick={handleMenuClick}>
            <i>👥</i> Quản lý người dùng
          </div>
        </Link>

        <Link to="/admin/products" className="menu-link">
          <div className={`menu-item ${activeMenu() === 'products' ? 'active' : ''}`} onClick={handleMenuClick}>
            <i>🛒</i> Quản lý sản phẩm
          </div>
        </Link>

        <Link to="/admin/orders" className="menu-link">
          <div className={`menu-item ${activeMenu() === 'orders' ? 'active' : ''}`} onClick={handleMenuClick}>
            <i>📦</i> Quản lý đơn hàng
          </div>
        </Link>
      </div>

      <div className="main-content">
        <div className="top-bar">
          <div>
            <i className="search-icon">🔍</i>
            {/* Nút refresh tạm tắt trong layout */}
          </div>
          <div className="user-profile">
            <div className="user-avatar">{auth?.user?.name?.charAt(0) || 'U'}</div>
            <span>{auth?.user?.name || 'User'}</span>
          </div>
        </div>

        {/* Phần nội dung sẽ render ra đây */}
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
