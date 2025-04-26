import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import './CartPage.css';

const CartPage = () => {
    const {
        cartItems,
        removeFromCart,
        clearCart,
        increaseQuantity,
        decreaseQuantity
    } = useCart();

    const navigate = useNavigate();  

    // Hàm tính tổng tiền của giỏ hàng
    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    // Hàm xử lý thêm đơn hàng
    const addToOrder = () => {
        if (cartItems.length === 0) {
            alert("Giỏ hàng của bạn đang trống! Vui lòng thêm sản phẩm.");
            return;
        }
        navigate('/orders', { state: { cartItems } });
        clearCart();  // Xóa giỏ hàng sau khi thêm vào đơn hàng
    };

    // Định dạng giá tiền
    const formatPrice = (price) =>
        new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price);

    return (
        <div className="container my-5">
            <h2 className="mb-4">🛒 Giỏ hàng của bạn</h2>
            {cartItems.length === 0 ? (
                <div className="alert alert-info">Chưa có sản phẩm nào trong giỏ hàng.</div>
            ) : (
                <>
                    {cartItems.map((item, index) => (
                        <div
                            key={index}
                            className="cart-item mb-3 p-3 border rounded shadow-sm d-flex align-items-center"
                        >
                            <img
                                src={item.image}
                                alt={item.name}
                                className="cart-item-img me-3"
                                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                            />
                            <div className="flex-grow-1">
                                <h5 className="mb-1">{item.name}</h5>
                                <p className="mb-1 text-danger fw-bold">
                                    {formatPrice(item.price)}
                                </p>
                                <div className="d-flex align-items-center">
                                    <button
                                        className="btn btn-sm btn-outline-secondary me-2"
                                        onClick={() => decreaseQuantity(item._id)}
                                    >−</button>
                                    <span>{item.quantity}</span>
                                    <button
                                        className="btn btn-sm btn-outline-secondary ms-2"
                                        onClick={() => increaseQuantity(item._id)}
                                    >＋</button>
                                </div>
                            </div>
                            <button
                                className="btn btn-sm btn-outline-danger ms-3"
                                onClick={() => removeFromCart(item._id)}
                            >
                                X
                            </button>
                        </div>
                    ))}

                    {/* Tổng tiền */}
                    <div className="cart-total mt-3 p-3 border rounded">
                        <h5 className="text-right">Tổng tiền: {formatPrice(calculateTotal())}</h5>
                    </div>

                    {/* Các nút chức năng */}
                    <div className="d-flex justify-content-between mt-4">
                        <button className="btn btn-danger" onClick={clearCart}>
                            🗑 Xóa tất cả
                        </button>

                        <button className="btn btn-success" onClick={addToOrder}>
                            📦 Thêm vào đơn hàng
                        </button>

                        <Link to="/" className="btn btn-primary">
                            ⬅ Tiếp tục mua hàng
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
};

export default CartPage;
