import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { productAPI } from "../services/api";
const API_URL = import.meta.env.VITE_API_URL || 'https://ktpm-backend.onrender.com';

const Products = () => {
    // State để lưu danh sách sản phẩm và trạng thái tải dữ liệu
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("Tất cả");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleBuyNow = (id) => {
        if (!id) {
            console.error("Lỗi: ID sản phẩm không hợp lệ!");
            return;
        }
        navigate(`/products/${id}`);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Categories lấy từ danh sách sản phẩm
    const categories = ["Tất cả", ...new Set(products.map((product) => product.category))];

    // Lấy dữ liệu từ API khi component được mount
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await productAPI.getAll();
                setProducts(response.data);
            } catch (error) {
                setError(error.response?.data?.message || "Có lỗi xảy ra khi lấy dữ liệu");
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Lọc các sản phẩm theo danh mục
    const filteredProducts = selectedCategory === "Tất cả"
        ? products
        : products.filter((product) => product.category === selectedCategory);

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
                    <p className="mt-3">Đang tải dữ liệu sản phẩm...</p>
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
            </div>
        );
    }

    return (
        <section className="section">
            <div className="container">
                <div className="section-title">
                    <h2>Sản Phẩm Nổi Bật</h2>
                    <p>Khám phá các sản phẩm công nghệ mới nhất với giá cả hợp lý</p>
                </div>

                <div className="mb-4 text-center">
                    <div className="btn-group" role="group">
                        {categories.map((category) => (
                            <button
                                key={category}
                                type="button"
                                className={`btn ${selectedCategory === category ? 'btn-primary' : 'btn-outline-primary'}`}
                                onClick={() => setSelectedCategory(category)}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Danh sách sản phẩm */}
                <div className="product-grid">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((product, index) => (
                            <div key={product._id || product._id || `${product.name}-${product.category}-${index}`} className="product-card">
                                {product.discount && (
                                    <div className="discount position-absolute top-0 end-0 m-2">
                                        -{product.discount}
                                    </div>
                                )}

                                <Link to={`/products/${product._id || product._id}`} className="text-decoration-none">
                                    <img
                                        src={product.image}
                                        className="w-100"
                                        alt={product.name}
                                    />
                                </Link>

                                <div className="card-body">
                                    <h5 className="card-title">
                                        <Link to={`/products/${product._id || product._id}`} className="text-dark text-decoration-none">
                                            {product.name}
                                        </Link>
                                    </h5>

                                    <div className="d-flex align-items-center mb-2">
                                        <span className="price">{formatPrice(product.price)}</span>
                                        {product.oldPrice && (
                                            <span className="old-price">{formatPrice(product.priceGoc)}</span>
                                        )}
                                    </div>

                                    <div className="d-grid gap-2">
                                        <button className="btn btn-primary" onClick={() => handleBuyNow(product._id || product._id)}>
                                            <i className="fas fa-shopping-cart me-2"></i>
                                            Mua ngay
                                        </button>
                                        <Link to={`/products/${product._id || product._id}`} className="text-decoration-none">
                                            <i className="fas fa-info-circle me-2"></i>
                                            Xem chi tiết
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-5">
                            <i className="fas fa-box-open fa-3x text-muted mb-3"></i>
                            <p className="text-muted">Không có sản phẩm nào trong danh mục này.</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Products;
