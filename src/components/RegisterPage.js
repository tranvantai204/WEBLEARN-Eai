import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/components/Register.css';

function RegisterPage() {
    const [formStep, setFormStep] = useState(1);
    const [passwordVisible, setPasswordVisible] = useState(false);

    const nextStep = () => {
        setFormStep(Math.min(formStep + 1, 3));
    };

    const prevStep = () => {
        setFormStep(Math.max(formStep - 1, 1));
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    return (
        <div className="register-container">
            <div className="register-background-shapes">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
                <div className="shape shape-4"></div>
            </div>
            
            <div className="register-welcome">
                <Link to="/" className="register-logo">
                    <img src="/images/wordwise-logo.svg" alt="WordWise" className="register-logo-image" />
                    <span className="register-logo-text">WordWise</span>
                </Link>
                
                <div className="register-welcome-content">
                    <h1 className="register-welcome-title">Start your language journey today!</h1>
                    <p className="register-welcome-text">
                        Join thousands of successful language learners. Create your account to access personalized learning features.
                    </p>
                    
                    <div className="register-features">
                        <div className="register-feature">
                            <div className="register-feature-icon">
                                <i className="fas fa-brain"></i>
                            </div>
                            <div className="register-feature-text">
                                <h3>AI-Powered Learning</h3>
                                <p>Personalized to match your learning style</p>
                            </div>
                        </div>
                        
                        <div className="register-feature">
                            <div className="register-feature-icon">
                                <i className="fas fa-layer-group"></i>
                            </div>
                            <div className="register-feature-text">
                                <h3>Smart Flashcards</h3>
                                <p>Enhanced with spaced repetition technology</p>
                            </div>
                        </div>
                        
                        <div className="register-feature">
                            <div className="register-feature-icon">
                                <i className="fas fa-chart-line"></i>
                            </div>
                            <div className="register-feature-text">
                                <h3>Track Your Progress</h3>
                                <p>Visual statistics to keep you motivated</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="register-character">
                    <img src="/images/owl-character.svg" alt="WordWise Mascot" />
                </div>
            </div>
            
            <div className="register-form-wrapper">
                <div className="register-form-card">
                    <div className="register-form-header">
                        <h2 className="register-form-title">Create Your Account</h2>
                        <p className="register-form-subtitle">It's quick and easy!</p>
                        
                        <div className="register-progress">
                            <div className="register-progress-bar" style={{ width: `${(formStep - 1) * 50}%` }}></div>
                            <div className={`register-progress-step ${formStep >= 1 ? 'active' : ''}`}>1</div>
                            <div className={`register-progress-step ${formStep >= 2 ? 'active' : ''}`}>2</div>
                            <div className={`register-progress-step ${formStep >= 3 ? 'active' : ''}`}>3</div>
                        </div>
                    </div>
                    
                    <div className="register-form-body">
                        {formStep === 1 && (
                            <div className="register-form-step animate-pop">
                                <div className="form-group">
                                    <label className="form-label" htmlFor="name">
                                        <i className="fas fa-user"></i>
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="name"
                                        placeholder="Enter your full name"
                                    />
                                </div>
                                
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
                                
                                <div className="register-form-buttons">
                                    <button
                                        type="button"
                                        className="btn btn-primary btn-lg register-next-btn"
                                        onClick={nextStep}
                                    >
                                        Continue
                                        <i className="fas fa-arrow-right"></i>
                                    </button>
                                </div>
                            </div>
                        )}
                        
                        {formStep === 2 && (
                            <div className="register-form-step animate-pop">
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
                                            placeholder="Create a password"
                                        />
                                        <button 
                                            type="button" 
                                            className="password-toggle" 
                                            onClick={togglePasswordVisibility}
                                        >
                                            <i className={`fas ${passwordVisible ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                        </button>
                                    </div>
                                    <p className="password-hint">Must be at least 8 characters with a number and special character</p>
                                </div>
                                
                                <div className="form-group">
                                    <label className="form-label" htmlFor="confirm-password">
                                        <i className="fas fa-lock"></i>
                                        Confirm Password
                                    </label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="confirm-password"
                                        placeholder="Confirm your password"
                                    />
                                </div>
                                
                                <div className="register-form-buttons">
                                    <button
                                        type="button"
                                        className="btn btn-outline register-back-btn"
                                        onClick={prevStep}
                                    >
                                        <i className="fas fa-arrow-left"></i>
                                        Back
                                    </button>
                                    
                                    <button
                                        type="button"
                                        className="btn btn-primary register-next-btn"
                                        onClick={nextStep}
                                    >
                                        Continue
                                        <i className="fas fa-arrow-right"></i>
                                    </button>
                                </div>
                            </div>
                        )}
                        
                        {formStep === 3 && (
                            <div className="register-form-step animate-pop">
                                <div className="form-group">
                                    <label className="form-label">Learning Preferences</label>
                                    <div className="language-preferences">
                                        <div className="language-option">
                                            <input type="radio" id="beginnerLevel" name="level" value="beginner" />
                                            <label htmlFor="beginnerLevel" className="language-option-label">
                                                <span className="language-icon">🌱</span>
                                                <span className="language-name">Beginner</span>
                                            </label>
                                        </div>
                                        
                                        <div className="language-option">
                                            <input type="radio" id="intermediateLevel" name="level" value="intermediate" />
                                            <label htmlFor="intermediateLevel" className="language-option-label">
                                                <span className="language-icon">🌿</span>
                                                <span className="language-name">Intermediate</span>
                                            </label>
                                        </div>
                                        
                                        <div className="language-option">
                                            <input type="radio" id="advancedLevel" name="level" value="advanced" />
                                            <label htmlFor="advancedLevel" className="language-option-label">
                                                <span className="language-icon">🌳</span>
                                                <span className="language-name">Advanced</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="form-group">
                                    <div className="form-check">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="terms"
                                        />
                                        <label className="form-check-label" htmlFor="terms">
                                            I agree to the{' '}
                                            <Link to="/terms" className="form-link">
                                                Terms of Service
                                            </Link>{' '}
                                            and{' '}
                                            <Link to="/privacy" className="form-link">
                                                Privacy Policy
                                            </Link>
                                        </label>
                                    </div>
                                </div>
                                
                                <div className="register-form-buttons">
                                    <button
                                        type="button"
                                        className="btn btn-outline register-back-btn"
                                        onClick={prevStep}
                                    >
                                        <i className="fas fa-arrow-left"></i>
                                        Back
                                    </button>
                                    
                                    <button type="submit" className="btn btn-primary btn-lg register-submit-btn">
                                        <i className="fas fa-rocket"></i>
                                        Create Account
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    <div className="register-form-footer">
                        <p>
                            Already have an account?{' '}
                            <Link to="/login" className="register-login-link">
                                Log in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage; 