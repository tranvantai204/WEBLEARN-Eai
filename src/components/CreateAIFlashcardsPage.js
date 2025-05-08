import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFlashcard } from '../contexts/FlashcardContext';
import { useAuth } from '../contexts/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../css/components/Flashcards.css';
import ApiKeyForm from './ApiKeyForm';
import LanguageSelector from './LanguageSelector';

// Update LoadingPopup component with more dynamic animations
const LoadingPopup = ({ message }) => {
    // Add states to track the current step
    const [currentStep, setCurrentStep] = React.useState(0);
    const [dots, setDots] = React.useState('.');

    // Add animation effect for the dots
    React.useEffect(() => {
        const dotsInterval = setInterval(() => {
            setDots(prevDots => {
                if (prevDots.length >= 3) return '.';
                return prevDots + '.';
            });
        }, 500);

        return () => clearInterval(dotsInterval);
    }, []);

    // Add animation effect for steps
    React.useEffect(() => {
        const steps = [0, 1, 2];
        let currentIndex = 0;

        const stepInterval = setInterval(() => {
            setCurrentStep(steps[currentIndex]);
            currentIndex = (currentIndex + 1) % steps.length;
        }, 3000);

        return () => clearInterval(stepInterval);
    }, []);

    return (
        <div className="loading-popup-overlay">
            <div className="loading-popup-container">
                <h3>{message}{dots}</h3>
                <div className="loading-progress">
                    <div className="loading-progress-bar"></div>
                </div>
                <p>Vui lòng đợi trong khi AI đang tạo flashcards của bạn...</p>
                <div className="loading-steps">
                    <div className={`loading-step ${currentStep === 0 ? 'active' : currentStep > 0 ? 'completed' : ''}`}>
                        <div className="step-icon">
                            <i className="fas fa-robot"></i>
                        </div>
                        <div className="step-content">
                            <span className="step-label">Kết nối với API</span>
                            {currentStep === 0 && <span className="step-animation"></span>}
                        </div>
                    </div>
                    <div className={`loading-step ${currentStep === 1 ? 'active' : currentStep > 1 ? 'completed' : ''}`}>
                        <div className="step-icon">
                            <i className="fas fa-brain"></i>
                        </div>
                        <div className="step-content">
                            <span className="step-label">Tạo nội dung bằng AI</span>
                            {currentStep === 1 && <span className="step-animation"></span>}
                        </div>
                    </div>
                    <div className={`loading-step ${currentStep === 2 ? 'active' : ''}`}>
                        <div className="step-icon">
                            <i className="fas fa-layer-group"></i>
                        </div>
                        <div className="step-content">
                            <span className="step-label">Tạo bộ flashcard</span>
                            {currentStep === 2 && <span className="step-animation"></span>}
                        </div>
                    </div>
                </div>
                <div className="loading-tips">
                    <i className="fas fa-lightbulb tip-icon"></i>
                    <small>Quá trình này có thể mất từ 10-30 giây tùy thuộc vào số lượng thẻ</small>
                </div>
            </div>
        </div>
    );
};

// Helper function to check for API key in localStorage
const checkApiKeyInLocalStorage = () => {
    // Kiểm tra API key trong localStorage
    const localApiKey = localStorage.getItem('gemini_api_key');
    const timestamp = localStorage.getItem('gemini_api_key_timestamp');
    
    // Nếu có API key trong localStorage và còn hiệu lực
    if (localApiKey && timestamp) {
        const now = Date.now();
        const saved = parseInt(timestamp, 10);
        const twoHoursMs = 2 * 60 * 60 * 1000;
        
        if (now - saved <= twoHoursMs) {
            console.log('Valid API key found in localStorage');
            return true;
        } else {
            // API key đã hết hạn, xóa khỏi localStorage
            console.log('API key in localStorage has expired');
            localStorage.removeItem('gemini_api_key');
            localStorage.removeItem('gemini_api_key_timestamp');
        }
    }
    
    // Không tìm thấy API key hợp lệ trong localStorage
    console.log('No valid API key in localStorage');
    return false;
};

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
    const [nativeLanguageError, setNativeLanguageError] = useState('');
    const [learningLanguageError, setLearningLanguageError] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [showApiKeyForm, setShowApiKeyForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false); // Thêm state để theo dõi việc đang submit form
    const [showLoadingPopup, setShowLoadingPopup] = useState(false); // Add state for loading popup
    
    // Add state for server API key check
    const [serverApiKeyChecked, setServerApiKeyChecked] = useState(false);
    const [hasServerApiKey, setHasServerApiKey] = useState(false);
    
    const { generateFlashcardSetWithAI, updateUserApiKey, getUserApiKey } = useFlashcard();
    const { accessToken, currentUser, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    
    // Kiểm tra API key từ server khi component mount
    useEffect(() => {
        const checkServerApiKey = async () => {
            try {
                if (isAuthenticated && !serverApiKeyChecked) {
                    console.log('Checking API key from server...');
                    // Kiểm tra API key từ server
                    const apiKeyFromServer = await getUserApiKey();
                    
                    if (apiKeyFromServer) {
                        console.log('API key found on server');
                        setHasServerApiKey(true);
                    } else {
                        console.log('No API key found on server');
                        setHasServerApiKey(false);
                    }
                    
                    setServerApiKeyChecked(true);
                }
            } catch (error) {
                console.error('Error checking server API key:', error);
                setHasServerApiKey(false);
                setServerApiKeyChecked(true);
            }
        };
        
        checkServerApiKey();
    }, [isAuthenticated, getUserApiKey, serverApiKeyChecked]);
    
    // Kiểm tra API key tổng hợp (localStorage + server)
    const hasValidApiKey = () => {
        // Nếu có API key trong localStorage, sử dụng nó
        if (checkApiKeyInLocalStorage()) {
            console.log("Using valid API key from localStorage");
            return true;
        }
        
        // Nếu không có trong localStorage, kiểm tra xem server có không
        if (hasServerApiKey) {
            console.log("Using valid API key from server");
            return true;
        }
        
        console.log("No valid API key found in either localStorage or server");
        return false;
    };
    
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
                // Set the server API key flag to true since we just saved it
                setHasServerApiKey(true);
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
        
        // Simplified authentication check - just confirm we have a token
        // Don't try to validate it here as that's causing false rejections
        if (!localStorage.getItem('accessToken')) {
            toast.error('Bạn cần đăng nhập để sử dụng tính năng này');
            navigate('/login');
            return;
        }
        
        setIsSubmitting(true); // Thiết lập trạng thái đang submit
        
        // Kiểm tra API key tổng hợp (localStorage + server)
        if (!hasValidApiKey()) {
            // Nếu không có API key hợp lệ, hiển thị form nhập API key
            console.log('No valid API key found in both localStorage and server, showing form');
            setShowApiKeyForm(true);
            setIsSubmitting(false);
            return;
        }
        
        console.log('Valid API key found, proceeding with flashcard creation');
        
        // Nếu có API key hợp lệ (từ localStorage hoặc server), tiếp tục tạo flashcard set
        try {
            setLoading(true);
            setError('');
            setShowLoadingPopup(true); // Show loading popup when starting generation
            
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
            
            // Add API key directly to generationData if available in localStorage
            const geminiApiKey = localStorage.getItem('gemini_api_key');
            console.log('Gemini API key present in localStorage:', !!geminiApiKey);
            
            if (geminiApiKey) {
                generationData.geminiApiKey = geminiApiKey;
                console.log('Added API key from localStorage to generationData');
            } else if (hasServerApiKey) {
                console.log('Using API key from server');
                // The server will use its stored API key, we don't need to explicitly add it
            }
            
            console.log('Sending flashcard generation request with data:', JSON.stringify({
                ...generationData,
                geminiApiKey: geminiApiKey ? '***HIDDEN***' : 'using server API key'
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
            
            // Kiểm tra xem có lỗi gốc không được chuyển tiếp đúng cách không
            // Trong console log thường có dạng "FlashcardContext.js:129 Error response: [message thực sự]"
            
            // Tìm thông tin lỗi trong console.log hiện tại
            const originalConsoleLogs = [];
            const originalConsoleLog = console.log;
            const originalConsoleError = console.error;
            
            // Ghi lại tất cả log để tìm lỗi gốc
            console.log = function() {
                const args = Array.from(arguments).join(' ');
                originalConsoleLogs.push(args);
                originalConsoleLog.apply(console, arguments);
            };
            
            console.error = function() {
                const args = Array.from(arguments).join(' ');
                originalConsoleLogs.push(args);
                originalConsoleError.apply(console, arguments);
            };
            
            // Log thông tin để debug
            console.log('Checking for original error in console logs');
            
            // Khôi phục console.log và console.error ban đầu
            console.log = originalConsoleLog;
            console.error = originalConsoleError;
            
            // Tìm lỗi trong console logs
            // Ưu tiên tìm lỗi từ "Error response:" vì đó thường là lỗi gốc
            const errorResponseLog = originalConsoleLogs.find(log => 
                log.includes('Error response:')
            );
            
            console.log('Found error response log:', errorResponseLog);
            
            // Lấy message lỗi thực sự từ log
            let originalErrorMessage = '';
            if (errorResponseLog) {
                const match = errorResponseLog.match(/Error response: (.*)/);
                if (match && match[1]) {
                    originalErrorMessage = match[1].trim();
                }
            }
            
            console.log('Extracted original error message:', originalErrorMessage);
            
            // Xử lý dựa trên thông báo lỗi gốc
            if (originalErrorMessage.includes('You have reached the maximum limit of 5 flashcard sets')) {
                console.log('DETECTED: Maximum flashcard limit reached from original error');
                
                // Xử lý lỗi giới hạn tối đa
                setError('Bạn đã đạt đến giới hạn tối đa 5 bộ thẻ ghi nhớ. Vui lòng xóa một số bộ hiện có trước khi tạo mới.');
                
                toast.error(
                    <div>
                        <strong>Đã đạt giới hạn tối đa!</strong> Bạn cần xóa bớt bộ flashcard để tạo mới.
                        <div style={{ marginTop: '8px' }}>
                            <button 
                                onClick={() => navigate('/flashcards')}
                                style={{ 
                                    background: '#6c757d', 
                                    border: 'none', 
                                    color: 'white',
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '12px'
                                }}
                            >
                                Quản lý Flashcards
                            </button>
                        </div>
                    </div>,
                    {
                        position: "top-center",
                        autoClose: 7000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        toastId: "flashcard-limit-error"
                    }
                );
                return;
            } 
            else if (originalErrorMessage.includes('API Key not found for this user')) {
                console.log('DETECTED: API Key not found from original error');
                
                // Hiển thị form để nhập API key - KHÔNG xóa API key đã lưu
                setShowApiKeyForm(true);
                
                toast.error(
                    <div>
                        <strong>API Key chưa được thiết lập.</strong> Vui lòng nhập API key Gemini để sử dụng tính năng AI.
                    </div>,
                    {
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        toastId: "api-key-not-found"
                    }
                );
                return;
            }
            else if (originalErrorMessage.includes('API key is invalid') || originalErrorMessage.includes('expired')) {
                console.log('DETECTED: Invalid API key from original error');
                
                // Xóa API key không hợp lệ
                localStorage.removeItem('gemini_api_key');
                localStorage.removeItem('gemini_api_key_timestamp');
                
                // Hiển thị form để nhập API key mới
                setShowApiKeyForm(true);
                
                toast.error(
                    <div>
                        <strong>API key không hợp lệ hoặc đã hết hạn.</strong> Vui lòng nhập API key Gemini hợp lệ.
                    </div>,
                    {
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        toastId: "invalid-api-key"
                    }
                );
                return;
            }
            
            // Nếu không tìm thấy thông báo lỗi cụ thể từ console logs, thì dùng phương pháp kiểm tra trong stack
            let errorMsg = error.message || 'Failed to create AI flashcard set';
            
            // Kiểm tra response
            if (error.response) {
                if (error.response.data && typeof error.response.data === 'string') {
                    errorMsg = error.response.data;
                } else if (error.response.data && error.response.data.message) {
                    errorMsg = error.response.data.message;
                }
            }
            
            console.log('Fallback error message:', errorMsg);
            
            // Kiểm tra trong toàn bộ logs đã thu thập để tìm API Key not found nếu còn sót
            const hasApiKeyNotFoundInLogs = originalConsoleLogs.some(log => 
                log.includes('API Key not found') || 
                log.includes('API key not found')
            );
            
            if (hasApiKeyNotFoundInLogs) {
                console.log('DETECTED: API Key not found from logs collection');
                
                // Hiển thị form để nhập API key
                setShowApiKeyForm(true);
                
                toast.error(
                    <div>
                        <strong>API Key chưa được thiết lập.</strong> Vui lòng nhập API key Gemini để sử dụng tính năng AI.
                    </div>,
                    {
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        toastId: "api-key-not-found"
                    }
                );
                return;
            }
            
            // Nếu không phát hiện API Key not found nhưng gặp lỗi An error occurred với status 400
            // Chỉ xem là lỗi giới hạn tối đa khi logs KHÔNG có bất kỳ dấu hiệu nào của API Key not found
            if (errorMsg === 'An error occurred' && error.response && error.response.status === 400) {
                console.log('Got status 400 with generic message - checking if this is limit error');
                
                const hasApiKeyIssueInLogs = originalConsoleLogs.some(log => 
                    log.includes('API Key') || 
                    log.includes('api key') ||
                    log.includes('API key')
                );
                
                if (hasApiKeyIssueInLogs) {
                    console.log('Found API key issues in logs, showing API key form');
                    
                    // Hiển thị form để nhập API key
                    setShowApiKeyForm(true);
                    
                    toast.error(
                        <div>
                            <strong>API Key chưa được thiết lập.</strong> Vui lòng nhập API key Gemini để sử dụng tính năng AI.
                        </div>,
                        {
                            position: "top-center",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            toastId: "api-key-not-found"
                        }
                    );
                } else {
                    // Nếu không tìm thấy bất kỳ thông tin nào về API Key, xem là lỗi giới hạn tối đa
                    console.log('No API key issues found in logs, treating as maximum limit error');
                    
                    // Xử lý như lỗi giới hạn tối đa
                    setError('Bạn đã đạt đến giới hạn tối đa 5 bộ thẻ ghi nhớ. Vui lòng xóa một số bộ hiện có trước khi tạo mới.');
                    
                    toast.error(
                        <div>
                            <strong>Đã đạt giới hạn tối đa!</strong> Bạn cần xóa bớt bộ flashcard để tạo mới.
                            <div style={{ marginTop: '8px' }}>
                                <button 
                                    onClick={() => navigate('/flashcards')}
                                    style={{ 
                                        background: '#6c757d', 
                                        border: 'none', 
                                        color: 'white',
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontSize: '12px'
                                    }}
                                >
                                    Quản lý Flashcards
                                </button>
                            </div>
                        </div>,
                        {
                            position: "top-center",
                            autoClose: 7000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            toastId: "flashcard-limit-error"
                        }
                    );
                }
            } else {
                // Các lỗi khác không xác định
                setError(`${errorMsg}`);
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
    
    // Handle language change
    const handleLanguageChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'nativeLanguage') {
            setNativeLanguage(value);
            setNativeLanguageError('');
            
            // Prevent same language for both selections
            if (value && value === learningLanguage) {
                setLearningLanguageError('Native and learning languages must be different');
            } else {
                setLearningLanguageError('');
            }
        } else if (name === 'learningLanguage') {
            setLearningLanguage(value);
            setLearningLanguageError('');
            
            // Prevent same language for both selections
            if (value && value === nativeLanguage) {
                setNativeLanguageError('Native and learning languages must be different');
            } else {
                setNativeLanguageError('');
            }
        }
    };
    
    // Level options
    const levelOptions = [
        { value: 1, label: 'Level 1 - Beginner' },
        { value: 2, label: 'Level 2 - Elementary' },
        { value: 3, label: 'Level 3 - Pre-Intermediate' },
        { value: 4, label: 'Level 4 - Intermediate' },
        { value: 5, label: 'Level 5 - Upper Intermediate' },
        { value: 6, label: 'Level 6 - Advanced' }
    ];
    
    // Handler for API key success from the form
    const handleApiKeySuccess = () => {
        setShowApiKeyForm(false);
        toast.success('API key đã được lưu thành công!');
        
        // Mark the server API key as available
        setHasServerApiKey(true);
        setServerApiKeyChecked(true);
        
        // Automatically continue flashcard creation if that was the original action
        if (isSubmitting && title && topic) {
            setIsSubmitting(false); // Reset state
            setTimeout(() => {
                // Call handleSubmit after a short delay
                handleSubmit({ preventDefault: () => {} });
            }, 500);
        } else {
            setIsSubmitting(false);
        }
    };
    
    // Skip API key for now
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
                <div className="api-key-form-overlay">
                    <div className="api-key-form-container">
                        <ApiKeyForm 
                            onSuccess={handleApiKeySuccess} 
                            onSkip={handleSkipApiKey} 
                        />
                    </div>
                </div>
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
                
                .api-key-form-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: rgba(0, 0, 0, 0.6);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                    animation: fadeIn 0.3s ease;
                }
                
                .api-key-form-container {
                    background: white;
                    border-radius: 16px;
                    padding: 20px;
                    width: 90%;
                    max-width: 500px;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
                    animation: fadeInUp 0.4s ease;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                /* Loading popup styles */
                .loading-popup-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: rgba(0, 0, 0, 0.7);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1100;
                    backdrop-filter: blur(3px);
                }
                
                .loading-popup-container {
                    background: white;
                    border-radius: 16px;
                    padding: 30px;
                    width: 90%;
                    max-width: 500px;
                    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
                    text-align: center;
                    animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                
                @keyframes popIn {
                    0% {
                        opacity: 0;
                        transform: scale(0.8);
                    }
                    80% {
                        transform: scale(1.05);
                    }
                    100% {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                
                .loading-popup-container h3 {
                    color: #4285f4;
                    margin-bottom: 16px;
                    font-size: 24px;
                    font-weight: 600;
                }
                
                .loading-progress {
                    height: 6px;
                    background-color: #e2e8f0;
                    border-radius: 6px;
                    margin: 20px 0;
                    overflow: hidden;
                    position: relative;
                }
                
                .loading-progress-bar {
                    position: absolute;
                    top: 0;
                    left: 0;
                    height: 100%;
                    width: 30%;
                    background: linear-gradient(90deg, #4285f4, #0d47a1);
                    border-radius: 6px;
                    animation: progressAnimate 2s ease-in-out infinite;
                }
                
                @keyframes progressAnimate {
                    0% { left: -30%; width: 30%; }
                    50% { width: 60%; }
                    100% { left: 100%; width: 30%; }
                }
                
                .loading-popup-container p {
                    color: #475569;
                    margin-bottom: 20px;
                    font-size: 16px;
                }
                
                .loading-steps {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                    margin-bottom: 25px;
                    text-align: left;
                }
                
                .loading-step {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    padding: 12px 16px;
                    border-radius: 8px;
                    background-color: #f8fafc;
                    transition: all 0.3s ease;
                }
                
                .loading-step.active {
                    background-color: rgba(66, 133, 244, 0.1);
                    box-shadow: 0 2px 8px rgba(66, 133, 244, 0.2);
                    transform: translateY(-2px) scale(1.01);
                }
                
                .loading-step.completed {
                    background-color: rgba(74, 222, 128, 0.1);
                    color: #166534;
                }
                
                .step-icon {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 40px;
                    height: 40px;
                    border-radius: 20px;
                    background-color: #e2e8f0;
                    color: #64748b;
                    font-size: 16px;
                    transition: all 0.3s ease;
                }
                
                .loading-step.active .step-icon {
                    background-color: #4285f4;
                    color: white;
                    box-shadow: 0 0 0 5px rgba(66, 133, 244, 0.2);
                }
                
                .loading-step.completed .step-icon {
                    background-color: #4ade80;
                    color: white;
                }
                
                .step-content {
                    flex: 1;
                    position: relative;
                }
                
                .step-label {
                    font-weight: 500;
                    color: #1e293b;
                    transition: all 0.3s ease;
                }
                
                .loading-step.active .step-label {
                    color: #1e40af;
                    font-weight: 600;
                }
                
                .loading-step.completed .step-label {
                    color: #166534;
                }
                
                .step-animation {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    height: 2px;
                    width: 40%;
                    background: linear-gradient(90deg, #4285f4, transparent);
                    animation: pulseStep 2s ease-in-out infinite;
                }
                
                @keyframes pulseStep {
                    0% { width: 0; opacity: 1; }
                    50% { width: 80%; opacity: 0.5; }
                    100% { width: 0; opacity: 1; }
                }
                
                .loading-tips {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    background-color: rgba(250, 204, 21, 0.1);
                    padding: 10px 16px;
                    border-radius: 8px;
                    color: #854d0e;
                }
                
                .tip-icon {
                    color: #facc15;
                }
                
                /* Button progress animation */
                .button-progress-bar {
                    position: relative;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    border-left-color: #fff;
                    animation: spin 1s linear infinite;
                }
                
                @keyframes spin {
                    100% { transform: rotate(360deg); }
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
                            <LanguageSelector
                                id="nativeLanguage"
                                name="nativeLanguage"
                                value={nativeLanguage}
                                onChange={handleLanguageChange}
                                label="Native Language"
                                required={true}
                                error={nativeLanguageError}
                            />
                            
                            <LanguageSelector
                                id="learningLanguage"
                                name="learningLanguage"
                                value={learningLanguage}
                                onChange={handleLanguageChange}
                                label="Learning Language"
                                required={true}
                                error={learningLanguageError}
                            />
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
                                        <div className="button-progress-bar"></div> Generating...
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