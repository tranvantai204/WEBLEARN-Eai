import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../css/components/Register.css';
import axios from 'axios';

function ResetPasswordPage() {
    const [formData, setFormData] = useState({
        email: '',
        token: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    
    // API URL from environment variable or default
    const baseUrl = process.env.REACT_APP_API_URL || 'https://api.example.com';
    const API_URL = baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;

    // Extract email and token from URL on component mount
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const email = queryParams.get('email');
        const token = queryParams.get('token');
        
        if (!email || !token) {
            toast.error('Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.');
            navigate('/forgot-password');
            return;
        }
        
        setFormData(prev => ({
            ...prev,
            email,
            token
        }));
    }, [location.search, navigate]);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
        
        // Clear password error when user types
        if (id === 'password' || id === 'confirmPassword') {
            setPasswordError('');
        }
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(prev => !prev);
    };

    const validatePassword = () => {
        if (formData.password.length < 8) {
            setPasswordError('Mật khẩu phải có ít nhất 8 ký tự.');
            return false;
        }
        
        if (!/[A-Z]/.test(formData.password)) {
            setPasswordError('Mật khẩu phải chứa ít nhất một chữ cái viết hoa.');
            return false;
        }
        
        if (!/\d/.test(formData.password)) {
            setPasswordError('Mật khẩu phải chứa ít nhất một chữ số.');
            return false;
        }
        
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
            setPasswordError('Mật khẩu phải chứa ít nhất một ký tự đặc biệt.');
            return false;
        }
        
        if (formData.password !== formData.confirmPassword) {
            setPasswordError('Mật khẩu xác nhận không khớp.');
            return false;
        }
        
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validatePassword()) {
            return;
        }
        
        setLoading(true);
        
        try {
            const response = await axios.post(`${API_URL}/Auth/resetPassword`, formData);
            
            setSuccess(true);
            toast.success('Mật khẩu của bạn đã được đặt lại thành công!');
            
            // Add transition effect
            document.body.classList.add('page-transition');
            
            // Redirect to login page after 2 seconds
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error) {
            console.error('Reset password error:', error);
            setLoading(false);
            
            if (error.response && error.response.data) {
                if (error.response.data.errors) {
                    // Handle validation errors
                    const errorMessages = Object.values(error.response.data.errors).flat();
                    errorMessages.forEach(msg => toast.error(msg));
                } else if (error.response.data.message) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error('Có lỗi xảy ra khi đặt lại mật khẩu. Vui lòng thử lại.');
                }
            } else {
                toast.error('Không thể kết nối tới máy chủ. Vui lòng kiểm tra kết nối của bạn và thử lại.');
            }
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
                    <h1 className="register-welcome-title">Đặt lại mật khẩu</h1>
                    <p className="register-welcome-text">
                        Tạo mật khẩu mới cho tài khoản của bạn. 
                        Mật khẩu mới phải khác với mật khẩu trước đây và đảm bảo các yêu cầu bảo mật.
                    </p>
                    
                    <div className="register-features">
                        <div className="register-feature">
                            <div className="register-feature-icon">
                                <i className="fas fa-shield-alt"></i>
                            </div>
                            <div className="register-feature-text">
                                <h3>Mật khẩu mạnh</h3>
                                <p>Sử dụng kết hợp chữ cái thường, chữ cái viết hoa, số và ký tự đặc biệt để tăng độ bảo mật.</p>
                            </div>
                        </div>
                        
                        <div className="register-feature">
                            <div className="register-feature-icon">
                                <i className="fas fa-key"></i>
                            </div>
                            <div className="register-feature-text">
                                <h3>Độ dài</h3>
                                <p>Mật khẩu phải có ít nhất 8 ký tự để đảm bảo an toàn.</p>
                            </div>
                        </div>
                        
                        <div className="register-feature">
                            <div className="register-feature-icon">
                                <i className="fas fa-lock"></i>
                            </div>
                            <div className="register-feature-text">
                                <h3>Không dùng lại</h3>
                                <p>Tránh sử dụng mật khẩu đã dùng cho các tài khoản khác.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Right side - Reset Password Form */}
            <div className="register-form-wrapper">
                <div className={`register-form-card ${success ? 'scale-up' : ''}`}>
                    <div className="register-form-header">
                        <h2 className="register-form-title">Đặt Lại Mật Khẩu</h2>
                        <p className="register-form-subtitle">Tạo mật khẩu mới an toàn</p>
                    </div>
                    
                    <div className="register-form-body">
                        <form onSubmit={handleSubmit} className="register-form-step animate-pop">
                            <div className="form-group">
                                <label className="form-label" htmlFor="password">
                                    <i className="fas fa-lock"></i>
                                    Mật khẩu mới
                                </label>
                                <div className="password-field">
                                    <input
                                        type={passwordVisible ? "text" : "password"}
                                        className="form-control"
                                        id="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        placeholder="Nhập mật khẩu mới"
                                        disabled={loading || success}
                                        required
                                    />
                                    <button 
                                        type="button" 
                                        className="password-toggle" 
                                        onClick={togglePasswordVisibility}
                                        disabled={loading || success}
                                    >
                                        <i className={`fas ${passwordVisible ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                    </button>
                                </div>
                                <p className="password-hint">Mật khẩu phải có ít nhất 8 ký tự, có một chữ cái viết hoa, một chữ số và một ký tự đặc biệt</p>
                            </div>
                            
                            <div className="form-group">
                                <label className="form-label" htmlFor="confirmPassword">
                                    <i className="fas fa-lock"></i>
                                    Xác nhận mật khẩu
                                </label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    placeholder="Xác nhận mật khẩu mới"
                                    disabled={loading || success}
                                    required
                                />
                                {passwordError && <p className="password-error">{passwordError}</p>}
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
                                            Thành công!
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-key"></i>
                                            Đặt lại mật khẩu
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                    
                    <div className="register-form-footer">
                        <p>
                            Quay lại trang {' '}
                            <Link to="/login" className="register-login-link">
                                Đăng nhập
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ResetPasswordPage; 