import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../css/components/Register.css';
import axios from 'axios';

function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
    
    // API URL from environment variable or default
    const baseUrl = process.env.REACT_APP_API_URL || 'https://api.example.com';
    const API_URL = baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!email) {
            toast.error('Vui lòng nhập địa chỉ email của bạn.');
            return;
        }
        
        setLoading(true);
        
        // Determine client URL for reset password page (where user will be directed from email)
        const clientUrl = `${window.location.origin}/reset-password`;
        
        try {
            const response = await axios.post(`${API_URL}/Auth/forgotpassword`, {
                email,
                clientUrl
            });
            
            setSuccess(true);
            toast.success('Vui lòng kiểm tra email của bạn để đặt lại mật khẩu.');
            
            // Add transition effect
            document.body.classList.add('page-transition');
            
            // Redirect to login page after 3 seconds
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (error) {
            console.error('Forgot password error:', error);
            
            if (error.response && error.response.data) {
                // Show specific error message if available
                toast.error(error.response.data.message || 'Có lỗi xảy ra. Vui lòng thử lại sau.');
            } else {
                toast.error('Không thể kết nối tới máy chủ. Vui lòng kiểm tra kết nối của bạn và thử lại.');
            }
            
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            {/* Background shapes for visual appeal */}
            <div className="register-background-shapes">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
                <div className="shape shape-4"></div>
            </div>
            
            {/* Left side - Welcome message and features */}
            <div className="register-welcome">
                <Link to="/" className="register-logo">
                    <img src="/images/wordwise-logo.svg" alt="WordWise" className="register-logo-image" />
                    <span className="register-logo-text">WordWise</span>
                </Link>
                
                <div className="register-welcome-content">
                    <h1 className="register-welcome-title">Quên mật khẩu?</h1>
                    <p className="register-welcome-text">
                        Đừng lo lắng! Chúng tôi sẽ giúp bạn lấy lại quyền truy cập vào tài khoản.
                        Nhập địa chỉ email đã đăng ký và chúng tôi sẽ gửi cho bạn liên kết để đặt lại mật khẩu.
                    </p>
                    
                    <div className="register-features">
                        <div className="register-feature">
                            <div className="register-feature-icon">
                                <i className="fas fa-shield-alt"></i>
                            </div>
                            <div className="register-feature-text">
                                <h3>Bảo mật</h3>
                                <p>Liên kết đặt lại mật khẩu chỉ có hiệu lực trong 24 giờ.</p>
                            </div>
                        </div>
                        
                        <div className="register-feature">
                            <div className="register-feature-icon">
                                <i className="fas fa-envelope"></i>
                            </div>
                            <div className="register-feature-text">
                                <h3>Kiểm tra Email</h3>
                                <p>Hãy kiểm tra cả thư mục spam nếu bạn không thấy email của chúng tôi.</p>
                            </div>
                        </div>
                        
                        <div className="register-feature">
                            <div className="register-feature-icon">
                                <i className="fas fa-lock"></i>
                            </div>
                            <div className="register-feature-text">
                                <h3>Mật khẩu mới</h3>
                                <p>Tạo mật khẩu mạnh với ít nhất 8 ký tự, bao gồm chữ số và ký tự đặc biệt.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Right side - Forgot Password Form */}
            <div className="register-form-wrapper">
                <div className={`register-form-card ${success ? 'scale-up' : ''}`}>
                    <div className="register-form-header">
                        <h2 className="register-form-title">Quên Mật Khẩu</h2>
                        <p className="register-form-subtitle">Nhập email đã đăng ký của bạn</p>
                    </div>
                    
                    <div className="register-form-body">
                        <form onSubmit={handleSubmit} className="register-form-step animate-pop">
                            <div className="form-group">
                                <label className="form-label" htmlFor="email">
                                    <i className="fas fa-envelope"></i>
                                    Địa chỉ Email
                                </label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Nhập địa chỉ email của bạn"
                                    disabled={loading || success}
                                    required
                                />
                            </div>
                            
                            <div className="register-form-buttons">
                                <button 
                                    type="submit" 
                                    className={`btn btn-primary btn-lg register-submit-btn ${success ? 'success-btn' : ''}`}
                                    disabled={loading || success}
                                >
                                    {loading ? (
                                        <>
                                            <i className="fas fa-spinner fa-spin"></i>
                                            Đang xử lý...
                                        </>
                                    ) : success ? (
                                        <>
                                            <i className="fas fa-check"></i>
                                            Đã gửi email!
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-paper-plane"></i>
                                            Gửi liên kết đặt lại
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                    
                    <div className="register-form-footer">
                        <p>
                            Bạn đã nhớ lại mật khẩu?{' '}
                            <Link to="/login" className="register-login-link">
                                Đăng nhập ngay
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ForgotPasswordPage; 