// src/components/Navbar.jsx

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { productAPI } from '../services/api';
import SearchResults from './SearchResults';
import './Navbar.css';
import { useAuth } from '../context/auth';

const Navbar = () => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const searchRef = useRef(null);
    const [auth, setAuth] = useAuth();
    const navigate = useNavigate();

    const categories = [
        { name: 'Điện thoại', icon: 'fas fa-mobile-alt' },
        { name: 'Laptop', icon: 'fas fa-laptop' },
        { name: 'Máy tính bảng', icon: 'fas fa-tablet-alt' },
        { name: 'Phụ kiện', icon: 'fas fa-headphones' },
        { name: 'Đồng hồ thông minh', icon: 'fas fa-watch' },
        { name: 'Máy ảnh', icon: 'fas fa-camera' },
        { name: 'Tivi', icon: 'fas fa-tv' },
        { name: 'Thiết bị điện tử', icon: 'fas fa-microchip' }
    ];

    // Đọc đơn hàng từ localStorage
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartCount = cart.length;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsSearchOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const searchProducts = async () => {
            if (searchQuery.trim().length < 2) {
                setSearchResults([]);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                const response = await productAPI.search(searchQuery);
                setSearchResults(response.data);
            } catch (error) {
                setError(error.response?.data?.message || "Có lỗi xảy ra khi tìm kiếm");
                console.error("Search error:", error);
            } finally {
                setLoading(false);
            }
        };

        const debounceTimer = setTimeout(searchProducts, 300);
        return () => clearTimeout(debounceTimer);
    }, [searchQuery]);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        setIsSearchOpen(true);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
        }
    };

    const handleLogout = () => {
        setAuth({
            user: null,
            token: "",
        });
        localStorage.removeItem("auth");
        navigate("/login");
    };

    return (
        <nav className="navbar navbar-expand-lg bg-white sticky-top shadow-sm">
            <div className="container">
                {/* Logo */}
                <Link className="navbar-brand" to="/">
                    <h2>STORE</h2>
                </Link>

                {/* Search Bar */}
                <div className={`search-bar ${isSearchOpen ? 'active' : ''}`} ref={searchRef}>
                    <form onSubmit={handleSearchSubmit} className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Tìm kiếm sản phẩm..."
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                        <button type="submit" className="btn btn-primary">
                            <i className="fas fa-search"></i>
                        </button>
                    </form>
                    {isSearchOpen && (
                        <SearchResults
                            results={searchResults}
                            loading={loading}
                            error={error}
                            onClose={() => setIsSearchOpen(false)}
                        />
                    )}
                </div>

                {/* Right Navigation */}
                <div className="d-flex align-items-center gap-3">
                    {/* Mobile Search Toggle */}
                    <button
                        className="btn btn-link d-lg-none"
                        onClick={() => setIsSearchOpen(!isSearchOpen)}
                    >
                        <i className="fas fa-search"></i>
                    </button>

                    {/* Giỏ hàng */}
                    <Link to="/cart" className="btn btn-link position-relative" title="Giỏ hàng">
                        <i className="fas fa-shopping-cart fs-5"></i>
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                            {cartCount}
                        </span>
                    </Link>

                    {/* Đơn hàng */}
                   

                    {/* User Menu */}
                    <div className="dropdown">
                        <button
                            className="btn btn-link dropdown-toggle"
                            type="button"
                            id="userMenu"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            <i className="fas fa-user fs-5"></i>
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userMenu">
                            {!auth?.user ? (
                                <>
                                    <li><Link className="dropdown-item" to="/login">Đăng nhập</Link></li>
                                    <li><Link className="dropdown-item" to="/register">Đăng ký</Link></li>
                                </>
                            ) : (
                                <>
                                    <li><span className="dropdown-item-text">👋 Xin chào, {auth.user.name}</span></li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li><Link className="dropdown-item" to="/profile">Tài khoản của tôi</Link></li>
                                    <li><Link className="dropdown-item" to="/admin">Trang Admin</Link></li>
                                    <li><Link className="dropdown-item" to="/order-history">Đơn hàng</Link></li>
                                    <li><button className="dropdown-item" onClick={handleLogout}>Đăng xuất</button></li>
                                </>
                            )}
                        </ul>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="navbar-toggler"
                        type="button"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                </div>
            </div>

            {/* Categories Menu */}
            <div className={`categories-menu ${isMenuOpen ? 'show' : ''}`}>
                <div className="container">
                    <ul className="nav">
                        {categories.map((category, index) => (
                            <li className="nav-item" key={index}>
                                <Link className="nav-link" to={`/category/${category.name.toLowerCase()}`}>
                                    <i className={category.icon}></i>
                                    {category.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
