import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
const API_URL = import.meta.env.VITE_API_URL || 'https://ktpm-backend.onrender.com';

import axios from 'axios';

const ProductDetail = () => {
    const { id } = useParams();
    console.log(id);
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { addToCart } = useCart();


    useEffect(() => {
        if (!id) return;
        setLoading(true);

        axios.get(`${API_URL}/api/v2/products/${id}`)
            .then(response => {
                console.log("Dữ liệu sản phẩm:", response.data);
                setProduct(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching product:", error);
                setError("Không thể tải sản phẩm. Vui lòng thử lại!");
                setLoading(false);
            });
    }, [id]);




    const formatPrice = (price) => {
        return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
    };

    if (loading) {
        return (
            <div className="container my-5">
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3">Đang tải thông tin sản phẩm...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container my-5">
                <div className="alert alert-danger text-center" role="alert">
                    <i className="fas fa-exclamation-circle me-2"></i>
                    {error}
                </div>
                <div className="text-center mt-3">
                    <button className="btn btn-primary" onClick={() => navigate('/products')}>
                        Quay lại danh sách sản phẩm
                    </button>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container my-5">
                <div className="alert alert-warning text-center" role="alert">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    Không tìm thấy sản phẩm
                </div>
                <div className="text-center mt-3">
                    <button className="btn btn-primary" onClick={() => navigate('/')}>
                        Quay lại danh sách sản phẩm
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container my-5">
            <Link to="/" className="btn btn-secondary mb-3">⬅ Quay lại</Link>

            <div className="row">
                <div className="col-md-5">
                    <img src={product.image} alt={product.name} className="img-fluid rounded shadow-sm" />
                </div>
                <div className="col-md-7">
                    <h2>{product.name}</h2>
                    <p className="fs-5 text-danger fw-bold">{formatPrice(product.price)}</p>
                    <p className="text-muted text-decoration-line-through">{formatPrice(product.priceGoc)}</p>

                    <p>{product.description}</p>

                    <div className="d-grid gap-2">
                        <button
                            className="btn btn-danger"
                            onClick={() => {
                                addToCart(product); // thêm sản phẩm vào giỏ
                                navigate('/cart');  // chuyển sang trang giỏ hàng
                            }}
                        >
                            🛒 Mua ngay
                        </button>

                        <button className="btn btn-outline-primary">❤️ Thêm vào yêu thích</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;