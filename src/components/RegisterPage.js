import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/components/Register.css';

function RegisterPage() {
    const [formStep, setFormStep] = useState(1);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        gender: '',
        level: ''
    });
    const [passwordError, setPasswordError] = useState('');

    const levels = [
        { value: '1', label: 'Level 1 - Beginner', icon: '🌱' },
        { value: '2', label: 'Level 2 - Elementary', icon: '🌿' },
        { value: '3', label: 'Level 3 - Pre-Intermediate', icon: '🌲' },
        { value: '4', label: 'Level 4 - Intermediate', icon: '🎯' },
        { value: '5', label: 'Level 5 - Upper Intermediate', icon: '🎓' },
        { value: '6', label: 'Level 6 - Advanced', icon: '⭐' }
    ];

    const nextStep = () => {
        if (formStep === 2) {
            // Check password confirmation before proceeding
            if (formData.password !== formData.confirmPassword) {
                setPasswordError('Passwords do not match');
                return;
            }
            if (formData.password.length < 8) {
                setPasswordError('Password must be at least 8 characters long');
                return;
            }
            setPasswordError('');
        }
        setFormStep(Math.min(formStep + 1, 3));
    };

    const prevStep = () => {
        setFormStep(Math.max(formStep - 1, 1));
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
        
        if (id === 'password' || id === 'confirmPassword') {
            setPasswordError('');
        }
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
                                        value={formData.name}
                                        onChange={handleInputChange}
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
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="Enter your email"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Gender</label>
                                    <div className="gender-options">
                                        <div className="gender-option">
                                            <input
                                                type="radio"
                                                id="male"
                                                name="gender"
                                                value="male"
                                                checked={formData.gender === 'male'}
                                                onChange={(e) => handleInputChange({ target: { id: 'gender', value: e.target.value } })}
                                            />
                                            <label htmlFor="male" className="gender-label">
                                                <i className="fas fa-mars"></i>
                                                Male
                                            </label>
                                        </div>
                                        
                                        <div className="gender-option">
                                            <input
                                                type="radio"
                                                id="female"
                                                name="gender"
                                                value="female"
                                                checked={formData.gender === 'female'}
                                                onChange={(e) => handleInputChange({ target: { id: 'gender', value: e.target.value } })}
                                            />
                                            <label htmlFor="female" className="gender-label">
                                                <i className="fas fa-venus"></i>
                                                Female
                                            </label>
                                        </div>
                                        
                                        <div className="gender-option">
                                            <input
                                                type="radio"
                                                id="other"
                                                name="gender"
                                                value="other"
                                                checked={formData.gender === 'other'}
                                                onChange={(e) => handleInputChange({ target: { id: 'gender', value: e.target.value } })}
                                            />
                                            <label htmlFor="other" className="gender-label">
                                                <i className="fas fa-genderless"></i>
                                                Other
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="register-form-buttons">
                                    <button
                                        type="button"
                                        className="btn btn-primary btn-lg register-next-btn"
                                        onClick={nextStep}
                                        disabled={!formData.name || !formData.email || !formData.gender}
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
                                            value={formData.password}
                                            onChange={handleInputChange}
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
                                        id="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        placeholder="Confirm your password"
                                    />
                                    {passwordError && <p className="password-error">{passwordError}</p>}
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
                                    <label className="form-label">Select Your Level</label>
                                    <div className="level-grid">
                                        {levels.map((level) => (
                                            <div className="level-option" key={level.value}>
                                                <input
                                                    type="radio"
                                                    id={`level${level.value}`}
                                                    name="level"
                                                    value={level.value}
                                                    checked={formData.level === level.value}
                                                    onChange={(e) => handleInputChange({ target: { id: 'level', value: e.target.value } })}
                                                />
                                                <label htmlFor={`level${level.value}`} className="level-option-label">
                                                    <span className="level-icon">{level.icon}</span>
                                                    <span className="level-name">{level.label}</span>
                                                </label>
                                            </div>
                                        ))}
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
                                    
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary btn-lg register-submit-btn"
                                        disabled={!formData.level}
                                    >
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