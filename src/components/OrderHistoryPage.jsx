// src/pages/OrderHistoryPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth';

const OrderHistoryPage = () => {
    const [orders, setOrders] = useState([]);
    const [auth] = useAuth();
    const navigate = useNavigate();

    // Kiểm tra nếu chưa đăng nhập thì chuyển hướng về trang login
    useEffect(() => {
        if (!auth?.user) {
            navigate("/login");
        } else {
            // Lấy thông tin đơn hàng từ localStorage
            const storedOrders = JSON.parse(localStorage.getItem("orders")) || [];
            setOrders(storedOrders);
        }
    }, [auth, navigate]);

    const formatPrice = (price) =>
        new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price);

    return (
        <div className="container my-5">
            <h2 className="mb-4">📝 Lịch sử đơn hàng</h2>

            {orders.length === 0 ? (
                <div className="alert alert-warning">Bạn chưa có đơn hàng nào.</div>
            ) : (
                orders.map((order) => (
                    <div key={order.id} className="mb-4 p-3 border rounded shadow-sm bg-light">
                        <h5 className="mb-3">Đơn hàng # {order.id}</h5>
                        <p><strong>Ngày đặt:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                        <p><strong>Tổng tiền:</strong> {formatPrice(order.total)}</p>

                        {/* Thông tin khách hàng */}
                        <div className="mb-3">
                            <h6 className="mt-3">👤 Thông tin khách hàng:</h6>
                            <p><strong>Họ tên:</strong> {order.user?.name || "Chưa có"}</p>
                            <p><strong>Email:</strong> {order.user?.email || "Chưa có"}</p>
                            <p><strong>Điện thoại:</strong> {order.user?.phone || "Chưa có"}</p>
                            <p><strong>Địa chỉ:</strong> {order.user?.address || "Chưa có"}</p>
                        </div>

                        {/* Danh sách sản phẩm */}
                        <div>
                            <h6 className="mt-3">📦 Sản phẩm:</h6>
                            {order.items.map((item, index) => (
                                <div key={index} className="d-flex align-items-center mb-3">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        style={{
                                            width: '100px',
                                            height: '100px',
                                            objectFit: 'cover',
                                            marginRight: '20px',
                                        }}
                                    />
                                    <div>
                                        <h6>{item.name}</h6>
                                        <p>Số lượng: {item.quantity}</p>
                                        <p className="text-danger">Đơn giá: {formatPrice(item.price)}</p>
                                        <p className="fw-bold">Thành tiền: {formatPrice(item.price * item.quantity)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <hr />
                    </div>
                ))
            )}
        </div>
    );
};

export default OrderHistoryPage;
