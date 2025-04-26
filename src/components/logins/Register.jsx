import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import './Register.css';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',  // Thay username thành name
        email: '',
        phone: '',
        address: '',
        gender: '',
        password: '',
        answer: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Mật khẩu xác nhận không khớp');
            return;
        }

        setLoading(true);

        try {
            console.log("Dữ liệu nhập vào:", formData);

            // eslint-disable-next-line no-unused-vars
            const { confirmPassword, ...registerData } = formData;

            console.log("Dữ liệu gửi đi:", registerData);  // ✅ Kiểm tra lần nữa

            await authService.register(registerData);
            navigate('/login');
        } catch (err) {
            setError(err.message || 'Đăng ký thất bại');
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className="register-container">
            <div className="register-box">
                <h2 className="text-center mb-4">Đăng Ký</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group mb-3">
                        <label htmlFor="username">Tên người dùng</label>
                        <div className="input-group">
                            <span className="input-group-text">
                                <i className="fas fa-user"></i>
                            </span>
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                name="name"  // Đổi name="username" thành name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Nhập họ và tên"
                                required
                            />

                        </div>
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="email">Email</label>
                        <div className="input-group">
                            <span className="input-group-text">
                                <i className="fas fa-envelope"></i>
                            </span>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Nhập email của bạn"
                                required
                            />
                        </div>
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="phone">Số điện thoại</label>
                        <div className="input-group">
                            <span className="input-group-text">
                                <i className="fas fa-phone"></i>
                            </span>
                            <input
                                type="text"
                                className="form-control"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Nhập số điện thoại"
                                required
                            />
                        </div>
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="phone">Địa chỉ</label>
                        <div className="input-group">
                            <span className="input-group-text">
                                <i className="fas fa-address"></i>
                            </span>
                            <input
                                type="text"
                                className="form-control"
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Nhập địa chỉ"
                                required
                            />
                        </div>
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="phone">Answer</label>
                        <div className="input-group">
                            <span className="input-group-text">
                                <i className="fas fa-phone"></i>
                            </span>
                            <input
                                type="text"
                                className="form-control"
                                id="answer"
                                name="answer"
                                value={formData.answer}
                                onChange={handleChange}
                                placeholder="Nhập câu hỏi"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group mb-3">
                        <label htmlFor="password">Mật khẩu</label>
                        <div className="input-group">
                            <span className="input-group-text">
                                <i className="fas fa-lock"></i>
                            </span>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Nhập mật khẩu"
                                required
                            />
                        </div>
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
                        <div className="input-group">
                            <span className="input-group-text">
                                <i className="fas fa-lock"></i>
                            </span>
                            <input
                                type="password"
                                className="form-control"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Nhập lại mật khẩu"
                                required
                            />
                        </div>
                    </div>
                    <div className="form-group mb-3">
                        <div className="form-check">
                            <input type="checkbox" className="form-check-input" id="terms" required />
                            <label className="form-check-label" htmlFor="terms">
                                Tôi đồng ý với <Link to="/terms" className="text-decoration-none">điều khoản sử dụng</Link>
                            </label>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary w-100 mb-3"
                        disabled={loading}
                    >
                        {loading ? 'Đang đăng ký...' : 'Đăng Ký'}
                    </button>
                    <div className="social-login">
                        <p className="text-center mb-3">Hoặc đăng ký với</p>
                        <div className="d-flex justify-content-center gap-3">
                            <button type="button" className="btn btn-outline-danger">
                                <i className="fab fa-google"></i> Google
                            </button>
                            <button type="button" className="btn btn-outline-primary">
                                <i className="fab fa-facebook"></i> Facebook
                            </button>
                        </div>
                    </div>
                </form>
                <div className="text-center mt-4">
                    <p>Đã có tài khoản? <Link to="/login" className="text-decoration-none">Đăng nhập</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register; 