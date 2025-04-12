import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFlashcard } from '../contexts/FlashcardContext';
import { useAuth } from '../contexts/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../css/components/Flashcards.css';
import ApiKeyForm from './ApiKeyForm';

// Add LoadingPopup component
const LoadingPopup = ({ message }) => (
    <div className="loading-popup-overlay">
        <div className="loading-popup-container">
            <div className="loading-spinner">
                <i className="fas fa-spinner fa-spin"></i>
            </div>
            <h3>{message}</h3>
            <p>Vui lòng đợi trong khi AI đang tạo flashcards của bạn...</p>
            <div className="loading-steps">
                <div className="loading-step">
                    <i className="fas fa-robot"></i> Kết nối với API
                </div>
                <div className="loading-step">
                    <i className="fas fa-brain"></i> Tạo nội dung bằng AI
                </div>
                <div className="loading-step">
                    <i className="fas fa-layer-group"></i> Tạo bộ flashcard
                </div>
            </div>
            <div className="loading-tips">
                <small>Quá trình này có thể mất từ 10-30 giây tùy thuộc vào số lượng thẻ</small>
            </div>
        </div>
    </div>
);

function CreateAIFlashcardsPage() {
    const [title, setTitle] = useState('');
    const [topic, setTopic] = useState('');
    const [nativeLanguage, setNativeLanguage] = useState('VIE');
    const [learningLanguage, setLearningLanguage] = useState('ENG');
    const [level, setLevel] = useState(3);
    const [cardCount, setCardCount] = useState(10); // Keep this but hide from UI
    const [isPublic, setIsPublic] = useState(true); // Keep this but hide from UI
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [titleError, setTitleError] = useState('');
    const [topicError, setTopicError] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [showApiKeyForm, setShowApiKeyForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false); // Thêm state để theo dõi việc đang submit form
    const [showLoadingPopup, setShowLoadingPopup] = useState(false); // Add state for loading popup
    
    const { generateFlashcardSetWithAI, updateUserApiKey, getUserApiKey } = useFlashcard();
    const { accessToken, currentUser, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    
    // Kiểm tra và hiển thị form API key khi cần thiết
    useEffect(() => {
        const checkApiKey = async () => {
            try {
                // Nếu đang tạo flashcard AI và đã đăng nhập nhưng chưa có API key
                if (isSubmitting && currentUser) {
                    console.log('Hiển thị form API key cho tạo flashcard AI');
                    setShowApiKeyForm(true);
                }
            } catch (error) {
                console.error('Lỗi khi kiểm tra API key:', error);
            }
        };

        checkApiKey();
    }, [isSubmitting, currentUser]);
    
    // Validate title on change
    const handleTitleChange = (e) => {
        const value = e.target.value;
        setTitle(value);
        
        if (!value.trim()) {
            setTitleError('Title is required');
        } else if (value.length > 100) {
            setTitleError('Title must be less than 100 characters');
        } else {
            setTitleError('');
        }
    };
    
    // Validate topic on change
    const handleTopicChange = (e) => {
        const value = e.target.value;
        setTopic(value);
        
        if (!value.trim()) {
            setTopicError('Topic is required');
        } else {
            setTopicError('');
        }
    };
    
    // Handle API key submission
    const handleApiKeySubmit = async (e) => {
        e.preventDefault();
        
        if (!apiKey.trim()) {
            toast.error('API key is required');
            return;
        }
        
        setLoading(true);
        
        try {
            const success = await updateUserApiKey(apiKey);
            
            if (success) {
                toast.success('API key saved successfully!');
                setShowApiKeyForm(false);
                // Clear input field
                setApiKey('');
            } else {
                toast.error('Failed to save API key. Please try again.');
            }
        } catch (error) {
            console.error('Error saving API key:', error);
            toast.error(error.message || 'Failed to save API key. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Client-side validation
        if (!title.trim()) {
            setTitleError('Title is required');
            return;
        }
        
        if (!topic.trim()) {
            setTopicError('Topic is required');
            return;
        }
        
        setIsSubmitting(true); // Thiết lập trạng thái đang submit
        
        // Check if API key is set
        try {
            // Kiểm tra API key trong localStorage
            const localApiKey = localStorage.getItem('gemini_api_key');
            const timestamp = localStorage.getItem('gemini_api_key_timestamp');
            
            if (localApiKey && timestamp) {
                // Kiểm tra xem API key có còn hiệu lực không (2 giờ)
                const now = Date.now();
                const saved = parseInt(timestamp, 10);
                const twoHoursMs = 2 * 60 * 60 * 1000;
                
                if (now - saved <= twoHoursMs) {
                    console.log('Sử dụng API key từ localStorage');
                    // Bỏ qua kiểm tra API key server, tiếp tục tạo flashcard
                } else {
                    // API key đã hết hạn, xóa khỏi localStorage
                    console.log('API key trong localStorage đã hết hạn');
                    localStorage.removeItem('gemini_api_key');
                    localStorage.removeItem('gemini_api_key_timestamp');
                    
                    // Kiểm tra API key từ server
                    const key = await getUserApiKey();
                    if (!key) {
                        setShowApiKeyForm(true);
                        toast.error('AI features require a valid API key');
                        setIsSubmitting(false);
                        return;
                    }
                }
            } else {
                // Nếu không có trong localStorage, kiểm tra từ server
                const key = await getUserApiKey();
                if (!key) {
                    setShowApiKeyForm(true);
                    toast.error('AI features require a valid API key');
                    setIsSubmitting(false);
                    return;
                }
            }
        } catch (error) {
            console.error('Error checking API key:', error);
            setIsSubmitting(false);
        }
        
        setLoading(true);
        setError('');
        setShowLoadingPopup(true); // Show loading popup when starting generation
        
        try {
            // Create the flashcard set with the AI-generated data
            const generationData = {
                title: title + (topic ? ` - ${topic}` : ''),
                description: `AI-generated flashcard set about: ${topic}`,
                nativeLanguage,
                learningLanguage,
                isPublic,
                level,
                topic,
                cardCount: Math.min(Math.max(1, cardCount), 20) // Limit between 1-20
            };
            
            // Add API key directly to generationData
            const geminiApiKey = localStorage.getItem('gemini_api_key');
            console.log('Gemini API key present before request:', !!geminiApiKey);
            
            if (geminiApiKey) {
                generationData.geminiApiKey = geminiApiKey;
                console.log('Added API key to generationData');
            }
            
            console.log('Sending flashcard generation request with data:', JSON.stringify({
                ...generationData,
                geminiApiKey: geminiApiKey ? '***HIDDEN***' : 'not found'
            }, null, 2));
            
            // Call the direct function to generate and create the set
            const result = await generateFlashcardSetWithAI(generationData);
            
            // Show success toast
            toast.success('AI Flashcard set created successfully!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            
            // Navigate to the newly created set
            setTimeout(() => {
                navigate(`/flashcard-set/${result.flashcardSetId}`);
            }, 1500);
            
        } catch (error) {
            console.error('Error creating AI flashcard set:', error);
            console.error('Error stack:', error.stack);
            
            // Check for specific errors
            const errorMsg = error.message || 'Failed to create AI flashcard set';
            
            // Common error patterns for API key issues
            const apiKeyErrors = [
                'API key is invalid', 
                'API key is expired',
                'API key',
                'apiKey',
                'missing API key'
            ];
            
            const has400Error = errorMsg.includes('400') || errorMsg.includes('Error 400');
            const hasApiKeyError = apiKeyErrors.some(err => errorMsg.toLowerCase().includes(err.toLowerCase()));
            
            if (hasApiKeyError || has400Error) {
                console.log('API key error detected');
                
                // Clear any saved invalid API key
                localStorage.removeItem('gemini_api_key');
                localStorage.removeItem('gemini_api_key_timestamp');
                
                setShowApiKeyForm(true);
                
                // Show custom toast with clear message
                toast.error(
                    <div>
                        A valid Gemini API key is required. Please add your API key.
                        <button 
                            onClick={() => setShowApiKeyForm(true)} 
                            style={{
                                display: 'block',
                                marginTop: '10px',
                                padding: '5px 10px',
                                background: '#0284c7',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Add API Key Now
                        </button>
                    </div>
                );
            } else if (errorMsg.includes('maximum limit of 5 flashcard sets')) {
                setError('You have reached the maximum limit of 5 flashcard sets.');
                toast.error('You have reached the maximum limit of 5 flashcard sets.');
            } else {
                setError(`${errorMsg} (${error.stack ? error.stack.split('\n')[1] : 'Unknown location'})`);
                toast.error(errorMsg);
            }
        } finally {
            setLoading(false);
            setIsSubmitting(false); // Đặt lại trạng thái sau khi xử lý xong
            setShowLoadingPopup(false); // Hide loading popup when done
        }
    };
    
    const handleCancel = () => {
        setIsSubmitting(false); // Đặt lại trạng thái khi người dùng hủy
        navigate('/flashcards');
    };
    
    // Language options
    const nativeLanguageOptions = [
        { value: 'VIE', label: 'Vietnamese' },
        { value: 'ENG', label: 'English' },
        { value: 'JP', label: 'Japanese' },
        { value: 'KR', label: 'Korean' },
        { value: 'FR', label: 'French' },
        { value: 'CN', label: 'Chinese' },
        { value: 'DE', label: 'German' },
        { value: 'ES', label: 'Spanish' }
    ];
    
    const learningLanguageOptions = [
        { value: 'ENG', label: 'English' },
        { value: 'VIE', label: 'Vietnamese' },
        { value: 'JP', label: 'Japanese' },
        { value: 'KR', label: 'Korean' },
        { value: 'FR', label: 'French' },
        { value: 'CN', label: 'Chinese' },
        { value: 'DE', label: 'German' },
        { value: 'ES', label: 'Spanish' }
    ];

    // Level options
    const levelOptions = [
        { value: 1, label: 'Level 1 - Beginner' },
        { value: 2, label: 'Level 2 - Elementary' },
        { value: 3, label: 'Level 3 - Pre-Intermediate' },
        { value: 4, label: 'Level 4 - Intermediate' },
        { value: 5, label: 'Level 5 - Upper Intermediate' },
        { value: 6, label: 'Level 6 - Advanced' }
    ];

    // ApiKeyForm is now imported, so we don't need to define it here
    // Instead we'll use a handler to communicate with the imported component
    const handleApiKeySuccess = () => {
        setShowApiKeyForm(false);
        toast.success('API key đã được lưu thành công!');
        
        // Tự động tiếp tục tạo flashcard nếu đó là hành động ban đầu
        if (isSubmitting && title && topic) {
            setIsSubmitting(false); // Đặt lại trạng thái
            setTimeout(() => {
                // Gọi lại handleSubmit sau một khoảng thời gian ngắn
                handleSubmit({ preventDefault: () => {} });
            }, 500);
        } else {
            setIsSubmitting(false);
        }
    };
    
    // Skip API key for now - don't automatically submit the form
    const handleSkipApiKey = () => {
        setShowApiKeyForm(false);
        toast.info('Bạn có thể thêm API key sau trong phần cài đặt. Lưu ý rằng các tính năng AI sẽ không hoạt động nếu không có API key.');
    };

    return (
        <div className="container" style={{ padding: '30px 15px', maxWidth: '100%' }}>
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
            
            {/* Hiển thị form nhập API key khi cần */}
            {showApiKeyForm && (
                <ApiKeyForm 
                    onSuccess={handleApiKeySuccess} 
                    onSkip={handleSkipApiKey} 
                />
            )}
            
            {/* Loading Popup */}
            {showLoadingPopup && (
                <LoadingPopup message="AI đang tạo flashcards" />
            )}
            
            <style jsx="true">{`
                @keyframes fadeInDown {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
            
            <div className="card" style={{ maxWidth: '700px', margin: '0 auto', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)' }}>
                <div className="card-header" style={{ 
                    background: 'linear-gradient(135deg, #4285f4, #0d47a1)', 
                    color: 'white', 
                    padding: '30px', 
                    borderTopLeftRadius: '16px', 
                    borderTopRightRadius: '16px',
                    textAlign: 'center'
                }}>
                    <h1 style={{ fontSize: '28px', marginBottom: '10px', fontWeight: '600' }}>
                        <i className="fas fa-magic mr-2"></i> Create AI-Generated Flashcard Set
                    </h1>
                    <p style={{ opacity: '0.9', fontSize: '16px', maxWidth: '500px', margin: '0 auto' }}>
                        Enter a topic and our AI will generate a complete set of flashcards for you
                    </p>
                </div>
                
                <div className="card-body" style={{ padding: '30px' }}>
                    {error && (
                        <div className="alert alert-danger" style={{ 
                            padding: '12px', 
                            borderRadius: '8px', 
                            background: '#fee2e2', 
                            color: '#b91c1c',
                            marginBottom: '20px'
                        }}>
                            <i className="fas fa-exclamation-circle mr-2"></i> {error}
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit}>
                        <div className="form-group" style={{ marginBottom: '24px' }}>
                            <label htmlFor="setTitle" style={{ 
                                fontWeight: '600', 
                                marginBottom: '8px', 
                                display: 'block', 
                                color: '#1e293b' 
                            }}>
                                Set Title <span style={{ color: '#e11d48' }}>*</span>
                            </label>
                            <input
                                type="text"
                                className={`form-control ${titleError ? 'is-invalid' : ''}`}
                                id="setTitle"
                                placeholder="Enter set title"
                                value={title}
                                onChange={handleTitleChange}
                                required
                                maxLength={100}
                                style={{ 
                                    padding: '12px 16px', 
                                    borderRadius: '8px', 
                                    border: '1px solid #e2e8f0',
                                    fontSize: '16px',
                                    width: '100%',
                                    transition: 'all 0.2s ease'
                                }}
                            />
                            {titleError && (
                                <div className="invalid-feedback" style={{ color: '#e11d48', fontSize: '14px', marginTop: '6px' }}>
                                    {titleError}
                                </div>
                            )}
                        </div>
                        
                        <div className="form-group" style={{ marginBottom: '24px' }}>
                            <label htmlFor="topic" style={{ 
                                fontWeight: '600', 
                                marginBottom: '8px', 
                                display: 'block', 
                                color: '#1e293b' 
                            }}>
                                Topic <span style={{ color: '#e11d48' }}>*</span>
                            </label>
                            <input
                                type="text"
                                className={`form-control ${topicError ? 'is-invalid' : ''}`}
                                id="topic"
                                placeholder="E.g., 'Common Travel Phrases', 'Basic Verbs', 'Food and Drinks'"
                                value={topic}
                                onChange={handleTopicChange}
                                required
                                style={{ 
                                    padding: '12px 16px', 
                                    borderRadius: '8px', 
                                    border: '1px solid #e2e8f0',
                                    fontSize: '16px',
                                    width: '100%',
                                    transition: 'all 0.2s ease'
                                }}
                            />
                            {topicError && (
                                <div className="invalid-feedback" style={{ color: '#e11d48', fontSize: '14px', marginTop: '6px' }}>
                                    {topicError}
                                </div>
                            )}
                        </div>
                        
                        <div className="language-section" style={{ 
                            display: 'grid', 
                            gridTemplateColumns: '1fr 1fr', 
                            gap: '20px',
                            marginBottom: '24px'
                        }}>
                            <div className="form-group">
                                <label htmlFor="nativeLanguage" style={{ 
                                    fontWeight: '600', 
                                    marginBottom: '8px', 
                                    display: 'block', 
                                    color: '#1e293b' 
                                }}>
                                    Native Language <span style={{ color: '#e11d48' }}>*</span>
                                </label>
                                <select 
                                    className="form-control" 
                                    id="nativeLanguage"
                                    value={nativeLanguage}
                                    onChange={(e) => setNativeLanguage(e.target.value)}
                                    required
                                    style={{ 
                                        padding: '12px 16px', 
                                        borderRadius: '8px', 
                                        border: '1px solid #e2e8f0',
                                        fontSize: '16px',
                                        width: '100%',
                                        appearance: 'none',
                                        backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'%23a0aec0\'%3E%3Cpath d=\'M7 10l5 5 5-5z\'/%3E%3C/svg%3E")',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPosition: 'right 12px center',
                                        backgroundSize: '20px'
                                    }}
                                >
                                    {nativeLanguageOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="learningLanguage" style={{ 
                                    fontWeight: '600', 
                                    marginBottom: '8px', 
                                    display: 'block', 
                                    color: '#1e293b' 
                                }}>
                                    Learning Language <span style={{ color: '#e11d48' }}>*</span>
                                </label>
                                <select 
                                    className="form-control" 
                                    id="learningLanguage"
                                    value={learningLanguage}
                                    onChange={(e) => setLearningLanguage(e.target.value)}
                                    required
                                    style={{ 
                                        padding: '12px 16px', 
                                        borderRadius: '8px', 
                                        border: '1px solid #e2e8f0',
                                        fontSize: '16px',
                                        width: '100%',
                                        appearance: 'none',
                                        backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'%23a0aec0\'%3E%3Cpath d=\'M7 10l5 5 5-5z\'/%3E%3C/svg%3E")',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPosition: 'right 12px center',
                                        backgroundSize: '20px'
                                    }}
                                >
                                    {learningLanguageOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        
                        <div className="form-group" style={{ marginBottom: '30px' }}>
                            <label htmlFor="level" style={{ 
                                fontWeight: '600', 
                                marginBottom: '8px', 
                                display: 'block', 
                                color: '#1e293b' 
                            }}>
                                Difficulty Level <span style={{ color: '#e11d48' }}>*</span>
                            </label>
                            <select 
                                className="form-control" 
                                id="level"
                                value={level}
                                onChange={(e) => setLevel(Number(e.target.value))}
                                required
                                style={{ 
                                    padding: '12px 16px', 
                                    borderRadius: '8px', 
                                    border: '1px solid #e2e8f0',
                                    fontSize: '16px',
                                    width: '100%',
                                    appearance: 'none',
                                    backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'%23a0aec0\'%3E%3Cpath d=\'M7 10l5 5 5-5z\'/%3E%3C/svg%3E")',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'right 12px center',
                                    backgroundSize: '20px'
                                }}
                            >
                                {levelOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="info-card" style={{ 
                            background: 'rgba(66, 133, 244, 0.08)',
                            padding: '16px',
                            borderRadius: '8px',
                            marginBottom: '24px',
                            borderLeft: '4px solid #4285f4'
                        }}>
                            <h5 style={{ 
                                color: '#1e293b', 
                                fontSize: '16px', 
                                marginBottom: '6px',
                                fontWeight: '600'
                            }}>
                                <i className="fas fa-info-circle mr-2"></i> How this works
                            </h5>
                            <p style={{ color: '#475569', fontSize: '14px', margin: 0 }}>
                                Our AI will generate a complete flashcard set based on your topic.
                                Each flashcard will include a term, definition, and example sentence.
                                This feature requires a Gemini API key to be set in your profile.
                            </p>
                        </div>
                        
                        <div className="form-actions" style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            marginTop: '30px'
                        }}>
                            <button 
                                type="button"
                                className="btn-cancel"
                                onClick={handleCancel}
                                disabled={loading}
                                style={{ 
                                    padding: '12px 24px',
                                    borderRadius: '8px',
                                    border: '1px solid #e2e8f0',
                                    background: 'white',
                                    color: '#64748b',
                                    fontSize: '16px',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <i className="fas fa-times mr-2"></i> Cancel
                            </button>
                            <button 
                                type="submit"
                                className="btn-generate"
                                disabled={loading || titleError || !title.trim() || topicError || !topic.trim()}
                                style={{ 
                                    padding: '12px 30px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    background: loading ? '#64748b' : 'linear-gradient(135deg, #4285f4, #0d47a1)',
                                    color: 'white',
                                    fontSize: '16px',
                                    fontWeight: '500',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.2s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                            >
                                {loading ? (
                                    <>
                                        <i className="fas fa-spinner fa-spin"></i> Generating...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-magic"></i> Generate Set
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CreateAIFlashcardsPage;