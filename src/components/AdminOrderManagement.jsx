import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import '../styles/AdminOrderManagement.css';
const API_URL = import.meta.env.VITE_API_URL || 'https://ktpm-backend.onrender.com';

const AdminOrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Fetch orders from localStorage (where OrderHistoryPage gets its data)
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Get orders from localStorage
        const storedOrders = JSON.parse(localStorage.getItem("orders")) || [];
        
        // If no orders found in localStorage, use sample data as fallback
        if (storedOrders.length === 0) {
          // Sample data for testing when localStorage is empty
          // const sampleOrders = [
          //   {
          //     id: 37,
          //     user: {
          //       name: 'Ngô Sỹ Nguyên',
          //       phone: '0973999949',
          //       email: 'minacode68@gmail.com',
          //       address: 'Xã Nghĩa Thành, Huyện Nghĩa Đàn, Tỉnh Nghệ An'
          //     },
          //     shippingInfo: {
          //       name: 'Ngô Sỹ Nguyên',
          //       phone: '0973999949',
          //       email: 'minacode68@gmail.com',
          //       address: 'Xã Nghĩa Thành, Huyện Nghĩa Đàn, Tỉnh Nghệ An'
          //     },
          //     note: 'Giao nhanh',
          //     createdAt: '2023-12-21T07:59:27',
          //     status: 'Đã xác nhận',
          //     total: 1250000,
          //     paymentMethod: 'COD',
          //     items: [
          //       { id: 1, name: 'Sản phẩm A', price: 450000, quantity: 1, image: '/img/product-placeholder.jpg' },
          //       { id: 2, name: 'Sản phẩm B', price: 800000, quantity: 1, image: '/img/product-placeholder.jpg' }
          //     ]
          //   },
          //   {
          //     id: 38,
          //     user: {
          //       name: 'Lê Văn Hoàng',
          //       phone: '0912345678',
          //       email: 'hoang@example.com',
          //       address: 'Phường Bến Nghé, Quận 1, TP HCM'
          //     },
          //     shippingInfo: {
          //       name: 'Lê Văn Hoàng',
          //       phone: '0912345678',
          //       email: 'hoang@example.com',
          //       address: 'Phường Bến Nghé, Quận 1, TP HCM'
          //     },
          //     note: 'Gọi trước khi giao',
          //     createdAt: '2023-12-22T14:30:00',
          //     status: 'Chờ xác nhận',
          //     total: 2100000,
          //     paymentMethod: 'Banking',
          //     items: [
          //       { id: 3, name: 'Sản phẩm C', price: 700000, quantity: 3, image: '/img/product-placeholder.jpg' }
          //     ]
          //   }
          // ];
          // setOrders(sampleOrders);
        } else {
          setOrders(storedOrders);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu đơn hàng:", error);
        toast.error("Không thể tải dữ liệu đơn hàng");
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Lọc đơn hàng theo trạng thái và từ khóa tìm kiếm
  const filteredOrders = orders.filter(order => {
    const customerName = order.shippingInfo?.name || order.user?.name || '';
    const customerPhone = order.shippingInfo?.phone || order.user?.phone || '';
    const customerEmail = order.shippingInfo?.email || order.user?.email || '';
    
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesSearch = 
      customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      customerPhone.includes(searchTerm) ||
      customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toString().includes(searchTerm);
    
    return matchesStatus && matchesSearch;
  });

  // Phân trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  // Xử lý chuyển trang
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Xem chi tiết đơn hàng
  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  // Cập nhật trạng thái đơn hàng và lưu vào localStorage
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      // Cập nhật dữ liệu local
      const updatedOrders = orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      );
      setOrders(updatedOrders);
      
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
      
      // Cập nhật vào localStorage
      localStorage.setItem("orders", JSON.stringify(updatedOrders));
      
      toast.success("Cập nhật trạng thái thành công");
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
      toast.error("Không thể cập nhật trạng thái đơn hàng");
    }
  };
  

  // Xóa đơn hàng
  const deleteOrder = async (orderId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa đơn hàng này?")) {
      try {
        // Cập nhật dữ liệu local
        const updatedOrders = orders.filter(order => order.id !== orderId);
        setOrders(updatedOrders);
        
        // Cập nhật vào localStorage
        localStorage.setItem("orders", JSON.stringify(updatedOrders));
        
        toast.success("Xóa đơn hàng thành công");
        
        if (selectedOrder && selectedOrder.id === orderId) {
          setShowDetailModal(false);
        }
      } catch (error) {
        console.error("Lỗi khi xóa đơn hàng:", error);
        toast.error("Không thể xóa đơn hàng");
      }
    }
  };

  // Format số tiền thành chuỗi VND
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
      .format(amount)
      .replace('₫', 'VND');
  };

  // Lấy thông tin khách hàng từ đơn hàng
  const getCustomerInfo = (order) => {
    return {
      name: order.shippingInfo?.name || order.user?.name || 'Không có tên',
      phone: order.shippingInfo?.phone || order.user?.phone || 'Không có SĐT',
      email: order.shippingInfo?.email || order.user?.email || 'Không có email',
      address: order.shippingInfo?.address || order.user?.address || 'Không có địa chỉ'
    };
  };

  // Format ngày tháng
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch  {
      return dateString;
    }
  };

  return (
    <div className="order-management">
      <div className="order-header">
        <h2>Danh Sách Đơn Hàng</h2>
        <div className="order-tools">
          <div className="search-box">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, email, SĐT..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="search-button">🔍</button>
          </div>
          <div className="filter-box">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="Chờ xác nhận">Chờ xác nhận</option>
              <option value="Đã xác nhận">Đã xác nhận</option>
              <option value="Đang giao">Đang giao</option>
              <option value="Đã giao">Đã giao</option>
              <option value="Đã hủy">Đã hủy</option>
            </select>
          </div>
          <button className="refresh-button" onClick={() => window.location.reload()}>♻️ Làm mới</button>
        </div>
      </div>

      {loading ? (
        <div className="loading">Đang tải dữ liệu...</div>
      ) : (
        <>
          <div className="order-table-container">
            <table className="order-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Địa chỉ</th>
                  <th>Ghi Chú</th>
                  <th>Chi Tiết</th>
                  <th>Ngày</th>
                  <th>Trạng Thái</th>
                  <th>Tùy Biến</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.length > 0 ? (
                  currentOrders.map((order) => {
                    const customer = getCustomerInfo(order);
                    return (
                      <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{customer.name}</td>
                        <td>{customer.phone}</td>
                        <td>{customer.email}</td>
                        <td className="address-cell">{customer.address}</td>
                        <td>{order.note || 'Không có'}</td>
                        <td>
                          <button
                            className="action-button view-button"
                            onClick={() => viewOrderDetails(order)}
                          >
                            Xem
                          </button>
                        </td>
                        <td>{formatDate(order.createdAt)}</td>
                        <td>
                          <span className={`status-badge status-${(order.status || 'Chờ xác nhận').replace(/\s+/g, '-').toLowerCase()}`}>
                            {order.status || 'Chờ xác nhận'}
                          </span>
                        </td>
                        <td>
                          <button
                            className="action-button delete-button"
                            onClick={() => deleteOrder(order.id)}
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="10" className="no-data">
                      Không tìm thấy đơn hàng nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Phân trang */}
          {filteredOrders.length > itemsPerPage && (
            <div className="pagination">
              <button
                disabled={currentPage === 1}
                onClick={() => paginate(currentPage - 1)}
              >
                &laquo; Trước
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                <button
                  key={number}
                  className={currentPage === number ? 'active' : ''}
                  onClick={() => paginate(number)}
                >
                  {number}
                </button>
              ))}
              
              <button
                disabled={currentPage === totalPages}
                onClick={() => paginate(currentPage + 1)}
              >
                Sau &raquo;
              </button>
            </div>
          )}
        </>
      )}

      {/* Modal Chi tiết đơn hàng */}
      {showDetailModal && selectedOrder && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Chi tiết đơn hàng #{selectedOrder.id}</h3>
              <button className="close-button" onClick={() => setShowDetailModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="order-detail-section">
                <h4>Thông tin khách hàng</h4>
                {(() => {
                  const customer = getCustomerInfo(selectedOrder);
                  return (
                    <>
                      <div className="detail-row">
                        <span className="detail-label">Tên khách hàng:</span>
                        <span className="detail-value">{customer.name}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Số điện thoại:</span>
                        <span className="detail-value">{customer.phone}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Email:</span>
                        <span className="detail-value">{customer.email}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Địa chỉ:</span>
                        <span className="detail-value">{customer.address}</span>
                      </div>
                    </>
                  );
                })()}
              </div>

              <div className="order-detail-section">
                <h4>Thông tin đơn hàng</h4>
                <div className="detail-row">
                  <span className="detail-label">Ngày đặt hàng:</span>
                  <span className="detail-value">{formatDate(selectedOrder.createdAt)}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Phương thức thanh toán:</span>
                  <span className="detail-value">{selectedOrder.paymentMethod || 'COD'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Ghi chú:</span>
                  <span className="detail-value">{selectedOrder.note || 'Không có'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Trạng thái:</span>
                  <span className="detail-value">
                    <span className={`status-badge status-${(selectedOrder.status || 'Chờ xác nhận').replace(/\s+/g, '-').toLowerCase()}`}>
                      {selectedOrder.status || 'Chờ xác nhận'}
                    </span>
                  </span>
                </div>
              </div>

              <div className="order-detail-section">
                <h4>Sản phẩm</h4>
                <table className="order-items-table">
                  <thead>
                    <tr>
                      <th>Ảnh</th>
                      <th>Tên sản phẩm</th>
                      <th>Đơn giá</th>
                      <th>Số lượng</th>
                      <th>Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map((item, index) => (
                      <tr key={item.id || index}>
                        <td>
                          {item.image && (
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              style={{ width: '50px', height: '50px', objectFit: 'cover' }} 
                            />
                          )}
                        </td>
                        <td>{item.name}</td>
                        <td>{formatCurrency(item.price)}</td>
                        <td>{item.quantity}</td>
                        <td>{formatCurrency(item.price * item.quantity)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="4" className="total-label">Tổng cộng:</td>
                      <td className="total-value">{formatCurrency(selectedOrder.total)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
            <div className="modal-footer">
              <div className="status-update">
                <span>Cập nhật trạng thái:</span>
                <select
                  value={selectedOrder.status || 'Chờ xác nhận'}
                  onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value)}
                >
                  <option value="Chờ xác nhận">Chờ xác nhận</option>
                  <option value="Đã xác nhận">Đã xác nhận</option>
                  <option value="Đang giao">Đang giao</option>
                  <option value="Đã giao">Đã giao</option>
                  <option value="Đã hủy">Đã hủy</option>
                </select>
              </div>
              <div className="action-buttons">
                <button className="cancel-button" onClick={() => setShowDetailModal(false)}>Đóng</button>
                <button 
                  className="delete-button" 
                  onClick={() => {
                    deleteOrder(selectedOrder.id);
                    setShowDetailModal(false);
                  }}
                >
                  Xóa đơn hàng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrderManagement;