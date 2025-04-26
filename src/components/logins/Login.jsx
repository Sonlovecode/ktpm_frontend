import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import './Login.css';
import { useAuth } from '../../context/auth';

const Login = () => {
    const navigate = useNavigate();
    const [auth, setAuth] = useAuth()
    const [formData, setFormData] = useState({
        email: '',
        password: ''
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
        setLoading(true);

        try {
            const { user, token } = await authService.login(formData);
            console.log("auth profile:", auth);


            //  Cập nhật auth context
            setAuth({ user, token });


            localStorage.setItem("auth", JSON.stringify({ user, token }));

            //  Điều hướng
            navigate("/profile");
        } catch (err) {
            setError(err.message || 'Đăng nhập thất bại');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="login-container">
            <div className="login-box">
                <h2 className="text-center mb-4">Đăng Nhập</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
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
                        <div className="form-check">
                            <input type="checkbox" className="form-check-input" id="remember" />
                            <label className="form-check-label" htmlFor="remember">
                                Ghi nhớ đăng nhập
                            </label>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary w-100 mb-3"
                        disabled={loading}
                    >
                        {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
                    </button>
                    <div className="text-center mb-3">
                        <Link to="/forgot-password" className="text-decoration-none">
                            Quên mật khẩu?
                        </Link>
                    </div>
                    <div className="social-login">
                        <p className="text-center mb-3">Hoặc đăng nhập với</p>
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
                    <p>Chưa có tài khoản? <Link to="/register" className="text-decoration-none">Đăng ký ngay</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Login; 