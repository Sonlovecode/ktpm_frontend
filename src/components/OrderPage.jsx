// src/pages/OrderPage.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth';

const OrderPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { cartItems = [] } = location.state || {};  // Lấy giỏ hàng từ state hoặc mặc định []
    const [auth] = useAuth();

    // Nếu chưa đăng nhập, chuyển hướng về trang đăng nhập
    if (!auth?.user) {
        navigate("/login");
        return null;  // Nếu không đăng nhập, không hiển thị trang
    }

    // Định dạng giá tiền
    const formatPrice = (price) =>
        new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price);

    // Tính tổng tiền của giỏ hàng
    const totalPrice = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    // Lấy thông tin người dùng từ context
    const { name, email, phone, address } = auth?.user || {};

    // Xử lý xác nhận đơn hàng
    const handleConfirmOrder = () => {
        const newOrder = {
            id: Date.now(),
            user: auth.user,
            items: cartItems,
            total: totalPrice,
            createdAt: new Date().toISOString(),
        };

        // Lấy đơn hàng đã lưu trong localStorage hoặc tạo mới nếu chưa có
        const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];
        existingOrders.push(newOrder);

        // Lưu đơn hàng vào localStorage
        localStorage.setItem("orders", JSON.stringify(existingOrders));

        // Thông báo và chuyển hướng đến trang lịch sử đơn hàng
        alert("✅ Đặt hàng thành công!");
        navigate("/order-history"); // Chuyển đến trang lịch sử đơn hàng sau khi đặt hàng thành công
    };

    return (
        <div className="container my-5">
            <h2 className="mb-4">📦 Thông tin đơn hàng</h2>

            {/* Thông tin khách hàng */}
            <div className="mb-4 p-3 border rounded bg-light">
                <h5>👤 Thông tin khách hàng</h5>
                <p><strong>Họ tên:</strong> {name || "Chưa cung cấp"}</p>
                <p><strong>Email:</strong> {email || "Chưa cung cấp"}</p>
                <p><strong>Điện thoại:</strong> {phone || "Chưa cung cấp"}</p>
                <p><strong>Địa chỉ:</strong> {address || "Chưa cung cấp"}</p>
            </div>

            {/* Danh sách sản phẩm */}
            {cartItems.length === 0 ? (
                <div className="alert alert-warning">Không có sản phẩm nào trong đơn hàng.</div>
            ) : (
                <>
                    {cartItems.map((item, index) => (
                        <div
                            key={index}
                            className="d-flex align-items-center border rounded p-3 mb-3 shadow-sm"
                        >
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
                            <div className="flex-grow-1">
                                <h5 className="mb-1">{item.name}</h5>
                                <p className="mb-1">Số lượng: {item.quantity}</p>
                                <p className="mb-0 text-danger fw-bold">
                                    Đơn giá: {formatPrice(item.price)}
                                </p>
                                <p className="mb-0">
                                    Thành tiền: {formatPrice(item.price * item.quantity)}
                                </p>
                            </div>
                        </div>
                    ))}

                    {/* Tổng tiền + nút xác nhận */}
                    <div className="text-end mt-4 p-3 border-top">
                        <h5 className="text-primary">Tổng tiền: {formatPrice(totalPrice)}</h5>
                        <button className="btn btn-success mt-3" onClick={handleConfirmOrder}>
                            ✅ Xác nhận đặt hàng
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default OrderPage;
