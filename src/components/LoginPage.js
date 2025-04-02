import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function LoginPage() {
    const [passwordVisible, setPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    return (
        <div className="login-container">
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
                <div className="login-form-card">
                    <div className="login-form-header">
                        <h2 className="login-form-title">Log In</h2>
                        <p className="login-form-subtitle">Welcome back! Please enter your details</p>
                    </div>
                    
                    <div className="login-form-body">
                        <form className="login-form">
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
                            
                            <button type="submit" className="btn btn-primary btn-lg login-submit-btn">
                                <i className="fas fa-sign-in-alt"></i>
                                Log in
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