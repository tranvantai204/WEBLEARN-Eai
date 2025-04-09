import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../css/components/Login.css';

function LoginPage() {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [redirecting, setRedirecting] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();
    
    // Lấy API URL từ biến môi trường
    const API_URL = process.env.REACT_APP_API_URL || 'https://1abd-42-118-114-121.ngrok-free.app/api';
    
    // Log URL API đang sử dụng
    useEffect(() => {
        console.log('Using API URL:', API_URL);
    }, [API_URL]);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    // Hiệu ứng chuyển trang
    useEffect(() => {
        if (redirecting) {
            const timer = setTimeout(() => {
                navigate('/progress');
            }, 1500); // Đợi 1.5 giây trước khi chuyển trang
            return () => clearTimeout(timer);
        }
    }, [redirecting, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        try {
            console.log('Sending login request to:', `${API_URL}/Auth/login`);
            
            const response = await fetch(`${API_URL}/Auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            
            if (!response.ok) {
                throw new Error('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
            }
            
            const data = await response.json();
            console.log('Login successful, received data:', { ...data, token: '[REDACTED]', refreshToken: '[REDACTED]' });
            
            // Tạo đối tượng user từ thông tin trong response
            const userData = {
                email: data.email,
                roles: data.roles || [],
                // Các thông tin khác có thể bổ sung nếu có
            };
            
            // Gọi hàm login từ AuthContext với cấu trúc phù hợp
            const loginSuccess = await login(
                userData,           // user object
                data.token,         // accessToken (đổi từ "token")
                data.refreshToken   // refreshToken
            );
            
            // Hiển thị thông báo thành công và bắt đầu chuyển trang
            if (loginSuccess) {
                setRedirecting(true);
                toast.success('Đăng nhập thành công! Đang chuyển hướng...', {
                    position: "top-right",
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                
                // Thêm class chuyển trang
                document.body.classList.add('page-transition');
                
                // Gọi API để lấy thông tin tiến độ học tập (nếu cần)
                try {
                    const progressResponse = await fetch(`${API_URL}/Learning/progress`, {
                        headers: {
                            'Authorization': `Bearer ${data.token}`
                        }
                    });
                    
                    if (progressResponse.ok) {
                        const progressData = await progressResponse.json();
                        console.log('Retrieved progress data:', progressData);
                        // Có thể lưu thông tin progress vào localStorage hoặc Context nếu cần
                    }
                } catch (progressError) {
                    console.error('Failed to fetch progress data:', progressError);
                    // Không cần xử lý lỗi này, vì ta vẫn muốn điều hướng đến trang tiến độ
                }
            }
        } catch (err) {
            setError(err.message || 'Đã xảy ra lỗi khi đăng nhập');
            console.error('Login error:', err);
            
            // Hiển thị thông báo lỗi
            toast.error(err.message || 'Đã xảy ra lỗi khi đăng nhập', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`login-container ${redirecting ? 'fade-out' : ''}`}>
            {/* Thêm ToastContainer để hiển thị thông báo */}
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            
            <div className="login-background-shapes">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
                <div className="shape shape-4"></div>
            </div>
            
            <div className="login-welcome">
                <Link to="/" className="login-logo">
                    <img src="/images/wordwise-logo.svg" alt="WordWise" className="login-logo-image" />
                    <span className="login-logo-text">WordWise</span>
                </Link>
                
                <div className="login-welcome-content">
                    <h1 className="login-welcome-title">Welcome back to your language journey!</h1>
                    <p className="login-welcome-text">
                        Log in to continue your progress, practice vocabulary, and achieve your language goals.
                    </p>
                    
                    <div className="login-features">
                        <div className="login-feature">
                            <div className="login-feature-icon">
                                <i className="fas fa-bolt"></i>
                            </div>
                            <div className="login-feature-text">
                                <h3>Daily Streak</h3>
                                <p>Keep your learning momentum going</p>
                            </div>
                        </div>
                        
                        <div className="login-feature">
                            <div className="login-feature-icon">
                                <i className="fas fa-trophy"></i>
                            </div>
                            <div className="login-feature-text">
                                <h3>Achievements</h3>
                                <p>Track your progress and earn rewards</p>
                            </div>
                        </div>
                        
                        <div className="login-feature">
                            <div className="login-feature-icon">
                                <i className="fas fa-sync-alt"></i>
                            </div>
                            <div className="login-feature-text">
                                <h3>Resume Learning</h3>
                                <p>Continue right where you left off</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="login-character">
                    <img src="/images/owl-character.svg" alt="WordWise Mascot" />
                </div>
            </div>
            
            <div className="login-form-wrapper">
                <div className={`login-form-card ${redirecting ? 'scale-up' : ''}`}>
                    <div className="login-form-header">
                        <h2 className="login-form-title">Log In</h2>
                        <p className="login-form-subtitle">Welcome back! Please enter your details</p>
                    </div>
                    
                    {error && (
                        <div className="login-error-alert">
                            <i className="fas fa-exclamation-circle"></i> {error}
                        </div>
                    )}
                    
                    <div className="login-form-body">
                        <form className="login-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label" htmlFor="email">
                                    <i className="fas fa-envelope"></i>
                                    Email
                                </label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            
                            <div className="form-group">
                                <label className="form-label" htmlFor="password">
                                    <i className="fas fa-lock"></i>
                                    Password
                                </label>
                                <div className="password-field">
                                    <input
                                        type={passwordVisible ? "text" : "password"}
                                        className="form-control"
                                        id="password"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <button 
                                        type="button" 
                                        className="password-toggle" 
                                        onClick={togglePasswordVisibility}
                                    >
                                        <i className={`fas ${passwordVisible ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                    </button>
                                </div>
                            </div>
                            
                            <div className="login-options">
                                <div className="form-check">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="remember"
                                    />
                                    <label className="form-check-label" htmlFor="remember">
                                        Remember me
                                    </label>
                                </div>
                                
                                <Link to="/reset-password" className="login-forgot-link">
                                    Forgot password?
                                </Link>
                            </div>
                            
                            <button 
                                type="submit" 
                                className={`btn btn-primary btn-lg login-submit-btn ${redirecting ? 'success-btn' : ''}`}
                                disabled={loading || redirecting}
                            >
                                {loading ? (
                                    <>
                                        <i className="fas fa-spinner fa-spin"></i>
                                        Logging in...
                                    </>
                                ) : redirecting ? (
                                    <>
                                        <i className="fas fa-check"></i>
                                        Success!
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-sign-in-alt"></i>
                                        Log in
                                    </>
                                )}
                            </button>
                            
                            <div className="login-divider">
                                <span>OR</span>
                            </div>
                            
                            <div className="login-social">
                                <button type="button" className="btn btn-outline login-social-btn">
                                    <i className="fab fa-google"></i>
                                    Continue with Google
                                </button>
                                
                                <button type="button" className="btn btn-outline login-social-btn">
                                    <i className="fab fa-facebook-f"></i>
                                    Continue with Facebook
                                </button>
                            </div>
                        </form>
                    </div>
                    
                    <div className="login-form-footer">
                        <p>
                            Don't have an account?{' '}
                            <Link to="/register" className="login-register-link">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage; 