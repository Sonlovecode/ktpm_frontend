import React from 'react';
import { Link } from 'react-router-dom';

const SearchResults = ({ results, onClose, loading, error }) => {
    const formatPrice = (price) => {
        if (!price) return "Liên hệ";
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    if (loading) {
        return (
            <div className="search-results shadow p-3">
                <div className="text-center">
                    <div className="spinner-border spinner-border-sm text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="search-results shadow p-3">
                <div className="text-center text-danger">
                    <i className="fas fa-exclamation-circle me-2"></i>
                    {error}
                </div>
            </div>
        );
    }

    if (!results || results.length === 0) {
        return (
            <div className="search-results shadow p-3">
                <div className="text-center text-muted">
                    <i className="fas fa-search me-2"></i>
                    Không tìm thấy sản phẩm
                </div>
            </div>
        );
    }

    return (
        <div className="search-results shadow">
            {results.map((product) => (
                <Link
                    key={product._id}
                    to={`/products/${product._id}`}
                    className="search-item d-flex align-items-center p-2 text-decoration-none text-dark border-bottom"
                    onClick={onClose}
                >
                    <img
                        src={product.image || "/no-image.png"}
                        alt={product.name}
                        style={{ width: '50px', height: '50px', objectFit: 'contain' }}
                        onError={(e) => { e.target.src = "/no-image.png"; }}
                    />
                    <div className="ms-3">
                        <div className="fw-bold text-truncate" style={{ maxWidth: "200px" }}>{product.name}</div>
                        <div className="text-danger">{formatPrice(product.price)}</div>
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default SearchResults;
