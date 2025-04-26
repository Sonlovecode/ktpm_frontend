import React from 'react';

const Header = () => {
    const announcements = [
        "🔥 Giảm thêm 500K khi thanh toán qua VNPay",
        "🎁 Tặng PMH 500K cho đơn hàng từ 10 triệu",
        "🚚 Miễn phí vận chuyển toàn quốc"
    ];

    return (
        <header>
            {/* Top Bar - Thông báo khuyến mãi */}
            <div className="bg-danger text-white py-2">
                <div className="container">
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="d-none d-md-flex gap-4">
                            {announcements.map((text, index) => (
                                <small key={index}>{text}</small>
                            ))}
                        </div>
                        {/* Mobile: Chỉ hiện 1 thông báo và có thể scroll */}
                        <div className="d-md-none">
                            <div className="announcement-scroll">
                                {announcements[0]}
                            </div>
                        </div>
                        {/* Hotline */}
                        <div className="d-none d-md-block">
                            <small>
                                Hotline: <a href="tel:1900xxxx" className="text-white text-decoration-none">1900.xxxx</a>
                            </small>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Links - Dưới navbar */}
            <div className="bg-light border-bottom py-2 d-none d-lg-block">
                <div className="container">
                    <div className="row">
                        {/* Trả góp */}
                        <div className="col-3">
                            <div className="d-flex align-items-center gap-2">
                                <i className="fas fa-credit-card"></i>
                                <div>
                                    <small className="d-block">Trả góp 0%</small>
                                    <small className="text-muted">Duyệt nhanh qua điện thoại</small>
                                </div>
                            </div>
                        </div>

                        {/* Đổi trả */}
                        <div className="col-3">
                            <div className="d-flex align-items-center gap-2">
                                <i className="fas fa-sync"></i>
                                <div>
                                    <small className="d-block">Đổi trả miễn phí</small>
                                    <small className="text-muted">Trong 30 ngày</small>
                                </div>
                            </div>
                        </div>

                        {/* Bảo hành */}
                        <div className="col-3">
                            <div className="d-flex align-items-center gap-2">
                                <i className="fas fa-shield-alt"></i>
                                <div>
                                    <small className="d-block">Bảo hành chính hãng</small>
                                    <small className="text-muted">12 tháng tại trung tâm bảo hành</small>
                                </div>
                            </div>
                        </div>

                        {/* Chính hãng */}
                        <div className="col-3">
                            <div className="d-flex align-items-center gap-2">
                                <i className="fas fa-check-circle"></i>
                                <div>
                                    <small className="d-block">Sản phẩm chính hãng</small>
                                    <small className="text-muted">Nhập khẩu trực tiếp</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header; 