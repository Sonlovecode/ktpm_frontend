import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer>
            <div className="container">
                <div className="row">
                    {/* Thông tin công ty */}
                    <div className="col-lg-3 col-md-6 mb-4 mb-md-0">
                        <h5 className="footer-title">Về chúng tôi</h5>
                        <p className="mb-3">Chúng tôi cung cấp các sản phẩm công nghệ chính hãng với giá cả hợp lý và dịch vụ chăm sóc khách hàng tốt nhất.</p>
                        <div className="d-flex gap-3">
                            <a href="#" className="text-white"><i className="fab fa-facebook-f"></i></a>
                            <a href="#" className="text-white"><i className="fab fa-twitter"></i></a>
                            <a href="#" className="text-white"><i className="fab fa-instagram"></i></a>
                            <a href="#" className="text-white"><i className="fab fa-youtube"></i></a>
                        </div>
                    </div>

                    {/* Liên kết nhanh */}
                    <div className="col-lg-3 col-md-6 mb-4 mb-md-0">
                        <h5 className="footer-title">Liên kết nhanh</h5>
                        <ul className="footer-links">
                            <li><Link to="/">Trang chủ</Link></li>
                            <li><Link to="/products">Sản phẩm</Link></li>
                            <li><Link to="/about">Giới thiệu</Link></li>
                            <li><Link to="/contact">Liên hệ</Link></li>
                            <li><Link to="/blog">Tin tức</Link></li>
                        </ul>
                    </div>

                    {/* Danh mục sản phẩm */}
                    <div className="col-lg-3 col-md-6 mb-4 mb-md-0">
                        <h5 className="footer-title">Danh mục</h5>
                        <ul className="footer-links">
                            <li><Link to="/category/dien-thoai">Điện thoại</Link></li>
                            <li><Link to="/category/laptop">Laptop</Link></li>
                            <li><Link to="/category/may-tinh-bang">Máy tính bảng</Link></li>
                            <li><Link to="/category/phu-kien">Phụ kiện</Link></li>
                            <li><Link to="/category/dong-ho-thong-minh">Đồng hồ thông minh</Link></li>
                        </ul>
                    </div>

                    {/* Liên hệ */}
                    <div className="col-lg-3 col-md-6">
                        <h5 className="footer-title">Liên hệ</h5>
                        <ul className="footer-links">
                            <li>
                                <i className="fas fa-map-marker-alt me-2"></i>
                                20 Tiên Sơn 18, Đà Nẵng
                            </li>
                            <li>
                                <i className="fas fa-phone me-2"></i>
                                <a href="tel:0972188166">0972.xxxx</a>
                            </li>
                            <li>
                                <i className="fas fa-envelope me-2"></i>
                                <a href="mailto:kimchon.net@gmail.com">kimchon.net@gmail.com</a>
                            </li>
                            <li>
                                <i className="fas fa-clock me-2"></i>
                                Thứ 2 - Chủ nhật: 8:00 - 22:00
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Footer bottom */}
                <div className="footer-bottom">
                    <div className="row align-items-center">
                        <div className="col-md-6 text-center text-md-start">
                            <p>&copy; {new Date().getFullYear()} TechStore. Tất cả quyền được bảo lưu.</p>
                        </div>
                        <div className="col-md-6 text-center text-md-end">
                            <img src="/payment-methods.png" alt="Phương thức thanh toán" height="30" />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer; 