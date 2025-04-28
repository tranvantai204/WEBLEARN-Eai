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
            toast.error('Please enter your email address.');
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
            toast.success('Please check your email to reset your password.');
            
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
                toast.error(error.response.data.message || 'An error occurred. Please try again later.');
            } else {
                toast.error('Could not connect to the server. Please check your connection and try again.');
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
                    <h1 className="register-welcome-title">Forgot Password?</h1>
                    <p className="register-welcome-text">
                        Don't worry! We'll help you regain access to your account.
                        Enter your registered email address and we'll send you a link to reset your password.
                    </p>
                    
                    <div className="register-features">
                        <div className="register-feature">
                            <div className="register-feature-icon">
                                <i className="fas fa-shield-alt"></i>
                            </div>
                            <div className="register-feature-text">
                                <h3>Security</h3>
                                <p>The password reset link is only valid for 24 hours.</p>
                            </div>
                        </div>
                        
                        <div className="register-feature">
                            <div className="register-feature-icon">
                                <i className="fas fa-envelope"></i>
                            </div>
                            <div className="register-feature-text">
                                <h3>Check Email</h3>
                                <p>Please check your spam folder if you don't see our email.</p>
                            </div>
                        </div>
                        
                        <div className="register-feature">
                            <div className="register-feature-icon">
                                <i className="fas fa-lock"></i>
                            </div>
                            <div className="register-feature-text">
                                <h3>New Password</h3>
                                <p>Create a strong password with at least 8 characters, including numbers and special characters.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Right side - Forgot Password Form */}
            <div className="register-form-wrapper">
                <div className={`register-form-card ${success ? 'scale-up' : ''}`}>
                    <div className="register-form-header">
                        <h2 className="register-form-title">Forgot Password</h2>
                        <p className="register-form-subtitle">Enter your registered email</p>
                    </div>
                    
                    <div className="register-form-body">
                        <form onSubmit={handleSubmit} className="register-form-step animate-pop">
                            <div className="form-group">
                                <label className="form-label" htmlFor="email">
                                    <i className="fas fa-envelope"></i>
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email address"
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
                                            Processing...
                                        </>
                                    ) : success ? (
                                        <>
                                            <i className="fas fa-check"></i>
                                            Email sent!
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-paper-plane"></i>
                                            Send Reset Link
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                    
                    <div className="register-form-footer">
                        <p>
                            Remembered your password?{' '}
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

export default ForgotPasswordPage; 