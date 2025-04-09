import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../contexts/AuthContext';
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
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [redirecting, setRedirecting] = useState(false);
    
    const navigate = useNavigate();
    const { login } = useAuth();

    // Lấy API URL từ biến môi trường
    const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://1abd-42-118-114-121.ngrok-free.app';
    
    // Log URL API đang sử dụng
    useEffect(() => {
        console.log('Using API BASE URL in RegisterPage:', API_BASE_URL);
    }, [API_BASE_URL]);

    // Hiệu ứng chuyển trang
    useEffect(() => {
        if (redirecting) {
            const timer = setTimeout(() => {
                navigate('/progress');
            }, 1500); // Đợi 1.5 giây trước khi chuyển trang
            return () => clearTimeout(timer);
        }
    }, [redirecting, navigate]);

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
    
    const handleTermsChange = (e) => {
        setTermsAccepted(e.target.checked);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!termsAccepted) {
            toast.warning('Please accept the Terms of Service and Privacy Policy.', {
                position: "top-right",
                autoClose: 3000,
            });
            return;
        }
        
        setLoading(true);
        
        try {
            // Đường dẫn API đầy đủ
            const REGISTER_API_URL = `${API_BASE_URL}/api/Auth/register`;
            console.log('Sending registration request to:', REGISTER_API_URL);
            
            // Convert gender to boolean as expected by the API
            let genderValue = null;
            if (formData.gender === 'male') genderValue = true;
            else if (formData.gender === 'female') genderValue = false;
            // For 'other', we can leave it as null
            
            // Chuẩn bị dữ liệu gửi đi
            const registerData = {
                userName: formData.name,
                email: formData.email,
                password: formData.password,
                gender: genderValue,
                level: parseInt(formData.level)
            };
            
            console.log('Sending registration data:', { ...registerData, password: '[REDACTED]' });
            
            // Gửi request đăng ký với đường dẫn đầy đủ
            const response = await fetch(REGISTER_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registerData),
            });
            
            console.log('Response status:', response.status);
            console.log('Response headers:', Object.fromEntries([...response.headers.entries()]));
            
            // Check if the response is successful (status 200-299)
            if (response.ok) {
                // If the response is successful and has no content or is not JSON
                // Some APIs return 204 No Content for successful operations
                if (response.status === 204 || response.headers.get('content-length') === '0') {
                    console.log('Registration successful, received empty response.');
                    
                    // Create basic user data since we don't have a response body
                    const userData = {
                        email: formData.email,
                        name: formData.name,
                        roles: ['User'],
                        level: formData.level
                    };
                    
                    // Instead of trying to auto-login, redirect to login page
                    setRedirecting(true);
                    toast.success('Account created successfully! Please login with your credentials.', {
                        position: "top-right",
                        autoClose: 1500,
                    });
                    
                    // Add transition class
                    document.body.classList.add('page-transition');
                    
                    // Redirect to login page instead of dashboard
                    setTimeout(() => navigate('/login'), 1500);
                    return;
                }
                
                // Only try to parse JSON if we expect JSON content
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    try {
                        const data = await response.json();
                        
                        console.log('Registration successful, received data:', { ...data, token: data.token ? '[REDACTED]' : undefined });
                        
                        // Create user data from response
                        const userData = {
                            email: formData.email,
                            name: formData.name,
                            roles: data.roles || ['User'],
                            level: formData.level
                        };
                        
                        // If we have tokens, try auto-login
                        if (data.token && data.refreshToken) {
                            const loginSuccess = await login(
                                userData,
                                data.token,
                                data.refreshToken
                            );
                            
                            if (loginSuccess) {
                                setRedirecting(true);
                                toast.success('Account created successfully! Redirecting to progress page...', {
                                    position: "top-right",
                                    autoClose: 1500,
                                });
                                
                                document.body.classList.add('page-transition');
                                setTimeout(() => navigate('/progress'), 1500);
                                
                                // Gọi API để khởi tạo dữ liệu tiến độ học tập (nếu cần)
                                try {
                                    const progressResponse = await fetch(`${API_BASE_URL}/api/Learning/progress/init`, {
                                        method: 'POST',
                                        headers: {
                                            'Authorization': `Bearer ${data.token}`,
                                            'Content-Type': 'application/json',
                                        }
                                    });
                                    
                                    if (progressResponse.ok) {
                                        console.log('Progress data initialized successfully');
                                    }
                                } catch (progressError) {
                                    console.error('Failed to initialize progress data:', progressError);
                                    // Không cần xử lý lỗi này, vì ta vẫn muốn điều hướng đến trang tiến độ
                                }
                            }
                        } else {
                            // No tokens, redirect to login
                            setRedirecting(true);
                            toast.success('Account created successfully! Please login with your credentials.', {
                                position: "top-right",
                                autoClose: 1500,
                            });
                            
                            document.body.classList.add('page-transition');
                            setTimeout(() => navigate('/login'), 1500);
                        }
                    } catch (jsonError) {
                        console.error('Failed to parse response as JSON:', jsonError);
                        
                        // Fallback to success message and redirect to login
                        setRedirecting(true);
                        toast.success('Account created successfully! Please login with your credentials.', {
                            position: "top-right",
                            autoClose: 1500,
                        });
                        
                        document.body.classList.add('page-transition');
                        setTimeout(() => navigate('/login'), 1500);
                    }
                } else {
                    // Response is not JSON
                    console.log('Registration successful, but response is not JSON.');
                    
                    // Redirect to login page
                    setRedirecting(true);
                    toast.success('Account created successfully! Please login with your credentials.', {
                        position: "top-right",
                        autoClose: 1500,
                    });
                    
                    document.body.classList.add('page-transition');
                    setTimeout(() => navigate('/login'), 1500);
                }
            } else {
                // Error response
                let errorMessage = `Registration failed with status: ${response.status}`;
                
                try {
                    // Try to get the response text first
                    const responseText = await response.text();
                    console.log('Raw error response:', responseText);
                    
                    // If we have some content and it looks like JSON, try to parse it
                    if (responseText && responseText.trim().length > 0 && 
                        (responseText.trim().startsWith('{') || responseText.trim().startsWith('['))) {
                        try {
                            const errorData = JSON.parse(responseText);
                            
                            // Format validation errors if present
                            if (errorData.errors) {
                                const errorMessages = [];
                                for (const key in errorData.errors) {
                                    if (Array.isArray(errorData.errors[key])) {
                                        errorData.errors[key].forEach(error => errorMessages.push(error));
                                    } else {
                                        errorMessages.push(errorData.errors[key]);
                                    }
                                }
                                
                                errorMessage = errorMessages.join('\n');
                            } else if (errorData.message) {
                                errorMessage = errorData.message;
                            } else if (errorData.title) {
                                errorMessage = errorData.title;
                            }
                        } catch (jsonError) {
                            console.error('Failed to parse error response as JSON:', jsonError);
                            // If the response text is not too long, use it as the error message
                            if (responseText.length < 200) {
                                errorMessage = responseText;
                            }
                        }
                    }
                } catch (textError) {
                    console.error('Failed to read error response text:', textError);
                    // Use default error message
                }
                
                throw new Error(errorMessage);
            }
        } catch (err) {
            console.error('Registration error:', err);
            
            // Display error toast
            toast.error(err.message || 'Registration failed. Please try again.', {
                position: "top-right",
                autoClose: 5000,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`register-container ${redirecting ? 'fade-out' : ''}`}>
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
                <div className={`register-form-card ${redirecting ? 'scale-up' : ''}`}>
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
                                            checked={termsAccepted}
                                            onChange={handleTermsChange}
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
                                        type="button" 
                                        className={`btn btn-primary btn-lg register-submit-btn ${redirecting ? 'success-btn' : ''}`}
                                        onClick={handleSubmit}
                                        disabled={!formData.level || loading || redirecting}
                                    >
                                        {loading ? (
                                            <>
                                                <i className="fas fa-spinner fa-spin"></i>
                                                Creating Account...
                                            </>
                                        ) : redirecting ? (
                                            <>
                                                <i className="fas fa-check"></i>
                                                Success!
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-rocket"></i>
                                                Create Account
                                            </>
                                        )}
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