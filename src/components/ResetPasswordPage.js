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
            toast.error('The password reset link is invalid or has expired.');
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
            setPasswordError('Password must be at least 8 characters long.');
            return false;
        }
        
        if (!/[A-Z]/.test(formData.password)) {
            setPasswordError('Password must contain at least one uppercase letter.');
            return false;
        }
        
        if (!/\d/.test(formData.password)) {
            setPasswordError('Password must contain at least one digit.');
            return false;
        }
        
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
            setPasswordError('Password must contain at least one special character.');
            return false;
        }
        
        if (formData.password !== formData.confirmPassword) {
            setPasswordError('Passwords do not match.');
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
            toast.success('Your password has been reset successfully!');
            
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
                    toast.error('An error occurred while resetting your password. Please try again.');
                }
            } else {
                toast.error('Unable to connect to the server. Please check your connection and try again.');
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
                    <h1 className="register-welcome-title">Reset Password</h1>
                    <p className="register-welcome-text">
                        Create a new password for your account. 
                        The new password must be different from your previous one and meet security requirements.
                    </p>
                    
                    <div className="register-features">
                        <div className="register-feature">
                            <div className="register-feature-icon">
                                <i className="fas fa-shield-alt"></i>
                            </div>
                            <div className="register-feature-text">
                                <h3>Strong Password</h3>
                                <p>Use a combination of lowercase letters, uppercase letters, numbers, and special characters to enhance security.</p>
                            </div>
                        </div>
                        
                        <div className="register-feature">
                            <div className="register-feature-icon">
                                <i className="fas fa-key"></i>
                            </div>
                            <div className="register-feature-text">
                                <h3>Length</h3>
                                <p>Password must be at least 8 characters to ensure security.</p>
                            </div>
                        </div>
                        
                        <div className="register-feature">
                            <div className="register-feature-icon">
                                <i className="fas fa-lock"></i>
                            </div>
                            <div className="register-feature-text">
                                <h3>Don't Reuse</h3>
                                <p>Avoid using passwords that you've used for other accounts.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Right side - Reset Password Form */}
            <div className="register-form-wrapper">
                <div className={`register-form-card ${success ? 'scale-up' : ''}`}>
                    <div className="register-form-header">
                        <h2 className="register-form-title">Reset Password</h2>
                        <p className="register-form-subtitle">Create a secure new password</p>
                    </div>
                    
                    <div className="register-form-body">
                        <form onSubmit={handleSubmit} className="register-form-step animate-pop">
                            <div className="form-group">
                                <label className="form-label" htmlFor="password">
                                    <i className="fas fa-lock"></i>
                                    New Password
                                </label>
                                <div className="password-field">
                                    <input
                                        type={passwordVisible ? "text" : "password"}
                                        className="form-control"
                                        id="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        placeholder="Enter new password"
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
                                <p className="password-hint">Password must be at least 8 characters, have one uppercase letter, one number, and one special character</p>
                            </div>
                            
                            <div className="form-group">
                                <label className="form-label" htmlFor="confirmPassword">
                                    <i className="fas fa-lock"></i>
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    placeholder="Confirm new password"
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
                                            Processing...
                                        </>
                                    ) : success ? (
                                        <>
                                            <i className="fas fa-check"></i>
                                            Password Reset!
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-key"></i>
                                            Reset Password
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                    
                    <div className="register-form-footer">
                        <p>
                            Remember your password?{' '}
                            <Link to="/login" className="register-login-link">
                                Login Now
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ResetPasswordPage; 