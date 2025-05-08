import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, Bounce } from 'react-toastify';
import { useLanguage } from '../contexts/LanguageContext';
import { useFlashcard } from '../contexts/FlashcardContext';
import { useAuth } from '../contexts/AuthContext';
import { useWritingExercise } from '../contexts/WritingExerciseContext';
import ApiKeyForm from './ApiKeyForm';
import Spinner from './common/Spinner';
import AIWritingTopicForm from './AIWritingTopicForm';
import 'react-toastify/dist/ReactToastify.css';
import '../css/components/Writing.css';
import '../css/components/WritingExercises.css';
import LanguageSelector from './LanguageSelector';

function WritingPage() {
    const navigate = useNavigate();
    const [isGenerating, setIsGenerating] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [generationType, setGenerationType] = useState(null);
    const [topic, setTopic] = useState('');
    const [showApiKeyForm, setShowApiKeyForm] = useState(false);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showAITopicForm, setShowAITopicForm] = useState(false);
    const [exerciseTopic, setExerciseTopic] = useState('');
    const [learningLanguage, setLearningLanguage] = useState('ENG');
    const [nativeLanguage, setNativeLanguage] = useState('VIE');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [learningLanguageError, setLearningLanguageError] = useState('');
    const [nativeLanguageError, setNativeLanguageError] = useState('');
    const [showLimitModal, setShowLimitModal] = useState(false);
    const [limitModalMessage, setLimitModalMessage] = useState('');
    
    // Auth and writing exercises
    const { isAuthenticated, currentUser } = useAuth();
    
    // Try to use WritingExerciseContext, but provide fallback
    const { 
        writingExercises, 
        loading, 
        error,
        totalPages,
        currentPage,
        itemsPerPage,
        getAllWritingExercises 
    } = useWritingExercise();
    
    // Get API key functions from FlashcardContext
    const { getUserApiKey } = useFlashcard();
    
    // Translation support
    const { translateText, currentLanguage } = useLanguage();
    const [translations, setTranslations] = useState({
        pageTitle: 'Writing Exercises',
        introduction: 'Improve your writing skills through specially designed writing exercises.',
        createExercise: 'Create New Exercise',
        createTopicWithAI: 'Create Topic with AI',
        learningLanguage: 'Learning Language',
        nativeLanguage: 'Native Language',
        topic: 'Topic',
        createButton: 'Create Exercise',
        cancelButton: 'Cancel',
        noExercises: 'You have not created any writing exercises yet.',
        allExercises: 'All Writing Exercises',
        createNew: 'Create New Exercise',
        searchPlaceholder: 'Tìm kiếm bài tập...',
        generating: 'Generating...',
        generateTopic: 'Generate Topic',
        aiTopicCancel: 'Cancel',
        apiKeyMissing: 'You need to provide a Gemini API key to use AI features.',
        confirmLeave: 'Are you sure you want to cancel? Your changes will not be saved.',
        loginRequired: 'Please log in to view your writing exercises.',
        creatingExercise: 'Creating writing exercise...',
        generatingTopic: '🤖 Generating writing topic...',
        analyzingWriting: '🤖 Analyzing your writing...',
        topicGenerated: '✨ Writing topic generated successfully!',
        feedbackProvided: '✨ Writing feedback is now ready!',
        loadingError: 'Error loading writing exercises. Please try again later.',
        createSuccess: 'New writing exercise created successfully!',
        createError: 'Unable to create writing exercise. Please try again later.',
        topicRequired: 'Please enter a topic for the writing exercise.',
        languagesMustBeDifferent: 'Learning language and native language must be different.',
        aiTopicSuccess: 'AI-generated writing topic created successfully!',
        aiTopicError: 'Error generating writing topic with AI. Please try again later.',
    });
    
    // Messages that need to be pre-translated for toast notifications
    const [messages, setMessages] = useState({
        confirmLeave: 'Bạn có chắc muốn hủy? Các thay đổi sẽ không được lưu.',
        savingSuccess: 'Writing saved successfully!',
        enterTopicFirst: 'Please enter a topic first!',
        generatingTopic: '🤖 Đang tạo chủ đề bài viết...',
        analyzingWriting: '🤖 Đang phân tích bài viết của bạn...',
        topicGenerated: '✨ Chủ đề bài viết đã được tạo thành công!',
        feedbackProvided: '✨ Phản hồi bài viết đã sẵn sàng!',
        loadingError: 'Lỗi tải bài tập viết. Vui lòng thử lại sau.',
        createSuccess: 'Đã tạo bài tập viết mới thành công!',
        createError: 'Không thể tạo bài tập viết. Vui lòng thử lại sau.',
        topicRequired: 'Vui lòng nhập chủ đề cho bài tập viết.',
        languagesMustBeDifferent: 'Ngôn ngữ học và ngôn ngữ mẹ đẻ không được giống nhau.',
        aiTopicSuccess: 'Đã tạo chủ đề bài viết bằng AI thành công!',
        aiTopicError: 'Lỗi khi tạo chủ đề bài viết bằng AI. Vui lòng thử lại sau.',
        apiKeyRequired: 'Tính năng AI yêu cầu API key Gemini. Vui lòng thêm API key của bạn.',
        apiKeyMissing: 'API key không tìm thấy. Vui lòng thêm API key Gemini của bạn.',
        apiKeyInvalid: 'API key không hợp lệ hoặc đã hết hạn. Vui lòng cập nhật API key của bạn.',
        maxExercisesLimit: 'Bạn đã đạt đến giới hạn tối đa 5 bài tập viết. Vui lòng xóa một số bài tập trước khi tạo mới.',
        rateLimitExceeded: 'Đã vượt quá giới hạn tốc độ. Vui lòng thử lại sau.',
    });
    
    // Update translations when language changes
    useEffect(() => {
        const updateTranslations = async () => {
            try {
                // Update UI translations
                const newTranslations = {};
                for (const [key, value] of Object.entries(translations)) {
                    newTranslations[key] = await translateText(value);
                }
                setTranslations(newTranslations);
                
                // Update message translations separately
                const newMessages = {};
                for (const [key, value] of Object.entries(messages)) {
                    newMessages[key] = await translateText(value);
                }
                setMessages(newMessages);
            } catch (error) {
                console.error("Translation error in WritingPage:", error);
            }
        };
        
        updateTranslations();
    }, [currentLanguage, translateText]);
    
    // Load writing exercises when page loads
    useEffect(() => {
        if (isAuthenticated && getAllWritingExercises) {
            const loadExercises = async () => {
                try {
                    await getAllWritingExercises(currentUser?.userId);
                } catch (err) {
                    console.error("Error loading writing exercises:", err);
                    toast.error(messages.loadingError || "Error loading writing exercises");
                }
            };
            
            loadExercises();
        }
    }, [isAuthenticated, getAllWritingExercises, currentUser, messages.loadingError]);

    const handleCancel = () => {
        const confirmLeave = window.confirm(messages.confirmLeave);
        if (confirmLeave) {
            setShowCreateForm(false);
            setExerciseTopic('');
        }
    };

    // Handle API key form success
    const handleApiKeySuccess = () => {
        setShowApiKeyForm(false);
        toast.success('API key saved successfully!');
        
        // Continue with AI generation if that was the original action
        if (generationType === 'topic' && topic) {
            generateWithAI();
        } else if (generationType === 'feedback') {
            generateWithAI();
        }
    };
    
    // Skip API key for now
    const handleSkipApiKey = () => {
        setShowApiKeyForm(false);
        toast.info('You can add your API key later in settings. AI features will not work without an API key.');
    };
    
    // Actual AI generation function - called after API key check
    const generateWithAI = () => {
        setIsGenerating(true);
        const message = generationType === 'topic' 
            ? messages.generatingTopic
            : messages.analyzingWriting;
            
        toast(message, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
        });
        
        // Simulate AI generation
        setTimeout(() => {
            setIsGenerating(false);
            setShowOptions(false);
            setTopic('');
            setGenerationType(null);
            const successMessage = generationType === 'topic' 
                ? messages.topicGenerated
                : messages.feedbackProvided;
            toast(successMessage, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
        }, 2000);
    };

    const handleAIGenerate = async () => {
        if (generationType === 'topic' && !topic) {
            toast.error(messages.enterTopicFirst);
            return;
        }
        
        // Kiểm tra API key trong localStorage trước
        const localApiKey = localStorage.getItem('gemini_api_key');
        const timestamp = localStorage.getItem('gemini_api_key_timestamp');
        
        if (localApiKey && timestamp) {
            // Kiểm tra xem API key có còn hiệu lực không (2 giờ)
            const now = Date.now();
            const saved = parseInt(timestamp, 10);
            const twoHoursMs = 2 * 60 * 60 * 1000;
            
            if (now - saved <= twoHoursMs) {
                console.log('Sử dụng API key từ localStorage');
                // Bỏ qua hiển thị form API key
                generateWithAI();
                return;
            } else {
                // API key đã hết hạn, xóa khỏi localStorage
                console.log('API key trong localStorage đã hết hạn');
                localStorage.removeItem('gemini_api_key');
                localStorage.removeItem('gemini_api_key_timestamp');
            }
        }
        
        // Check if API key is set from server
        try {
            const key = await getUserApiKey();
            if (!key) {
                setShowApiKeyForm(true);
                toast.warn('AI features require an API key');
                return;
            }
            
            // If we have an API key, proceed with generation
            generateWithAI();
        } catch (error) {
            console.error('Error checking API key:', error);
            // In case of error checking API key, try to generate anyway
            generateWithAI();
        }
    };
    
    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };
    
    // Get status badge component
    const getStatusBadge = (status) => {
        switch (status) {
            case 'Not Started':
                return <span className="badge status-badge badge-not-started">Chưa bắt đầu</span>;
            case 'In Progress':
                return <span className="badge status-badge badge-in-progress">Đang thực hiện</span>;
            case 'Completed':
                return <span className="badge status-badge badge-completed">Đã hoàn thành</span>;
            default:
                return <span className="badge status-badge">{status}</span>;
        }
    };
    
    // Helper function for language names
    const getLanguageName = (code) => {
        switch (code) {
            case 'ENG':
                return 'English';
            case 'VIE': 
                return 'Vietnamese';
            case 'KOR':
                return 'Korean';
            case 'JPN':
                return 'Japanese';
            case 'CHN':
                return 'Chinese';
            case 'FRA':
                return 'French';
            case 'GER':
                return 'German';
            case 'SPA':
                return 'Spanish';
            default:
                return code;
        }
    };
    
    // Helper function for language flags
    const getLanguageFlag = (code) => {
        switch (code) {
            case 'ENG': return <span className="flag-icon">🇬🇧</span>;
            case 'VIE': return <span className="flag-icon">🇻🇳</span>;
            case 'KOR': return <span className="flag-icon">🇰🇷</span>;
            case 'JPN': return <span className="flag-icon">🇯🇵</span>;
            case 'CHN': return <span className="flag-icon">🇨🇳</span>;
            case 'FRA': return <span className="flag-icon">🇫🇷</span>;
            case 'GER': return <span className="flag-icon">🇩🇪</span>;
            case 'SPA': return <span className="flag-icon">🇪🇸</span>;
            default: return <span className="flag-icon">🌐</span>;
        }
    };
    
    // Handle change in language selectors
    const handleLanguageChange = (event) => {
        const { name, value } = event.target;
        
        if (name === 'learningLanguage') {
            setLearningLanguage(value);
            setLearningLanguageError('');
            
            // Check if languages are the same
            if (value === nativeLanguage) {
                setLearningLanguageError(messages.languagesMustBeDifferent);
            }
        } else if (name === 'nativeLanguage') {
            setNativeLanguage(value);
            setNativeLanguageError('');
            
            // Check if languages are the same
            if (value === learningLanguage) {
                setNativeLanguageError(messages.languagesMustBeDifferent);
            }
        }
    };
    
    const handleCreateExercise = async (e) => {
        e.preventDefault();
        
        // Validate form
        let isValid = true;
        
        if (!exerciseTopic.trim()) {
            toast.error(messages.topicRequired);
            isValid = false;
        }
        
        if (learningLanguage === nativeLanguage) {
            setLearningLanguageError(messages.languagesMustBeDifferent);
            setNativeLanguageError(messages.languagesMustBeDifferent);
            isValid = false;
        }
        
        if (!isValid) return;
        
        setIsSubmitting(true);
        
        try {
            const baseUrl = process.env.REACT_APP_API_URL || 'https://6d2c-115-76-51-131.ngrok-free.app';
            const API_URL = baseUrl.endsWith('/api') ? baseUrl.slice(0, -4) : baseUrl;
            
            const token = localStorage.getItem('accessToken');
            
            if (!token) {
                toast.error('Bạn cần đăng nhập để tạo bài tập viết');
                setIsSubmitting(false);
                return;
            }
            
            const response = await fetch(`${API_URL}/api/WritingExercise/Create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'ngrok-skip-browser-warning': 'true'
                },
                body: JSON.stringify({
                    topic: exerciseTopic,
                    learningLanguage: learningLanguage,
                    nativeLanguage: nativeLanguage
                })
            });
            
            // Xử lý các trường hợp phản hồi lỗi
            if (!response.ok) {
                if (response.status === 401) {
                    toast.error('Bạn cần đăng nhập lại để tạo bài tập viết');
                    throw new Error('User is not authenticated.');
                } else if (response.status === 400) {
                    try {
                        // Đọc nội dung phản hồi dưới dạng text trước
                        const errorText = await response.text();
                        console.log("Error response text:", errorText);
                        
                        // Cố gắng parse JSON
                        let errorData;
                        try {
                            errorData = JSON.parse(errorText);
                        } catch (jsonError) {
                            console.error("Failed to parse error response as JSON:", jsonError);
                            
                            // Nếu không phải JSON hợp lệ nhưng có thông tin về giới hạn
                            if (errorText.includes('maximum limit') || errorText.includes('5 bài tập')) {
                                const errorMsg = 'Bạn đã đạt đến giới hạn tối đa 5 bài tập viết. Vui lòng xóa một số bài tập trước khi tạo mới.';
                                showDirectError(errorMsg);
                                throw new Error(`Bad request: ${response.status}`);
                            }
                            
                            // Nếu không xác định được lỗi cụ thể
                            toast.error('Không thể xử lý phản hồi từ máy chủ. Vui lòng thử lại sau.');
                            throw new Error(`Invalid JSON in error response: ${errorText.substring(0, 100)}`);
                        }
                        
                        // Xử lý errorData như thông thường
                        if (errorData.message && errorData.message.includes('maximum limit')) {
                            const errorMsg = 'Bạn đã đạt đến giới hạn tối đa 5 bài tập viết. Vui lòng xóa một số bài tập trước khi tạo mới.';
                            showDirectError(errorMsg);
                        } else if (errorData.title && errorData.errors) {
                            const errorMessages = Object.values(errorData.errors).flat();
                            toast.error(errorMessages[0] || 'Dữ liệu không hợp lệ');
                        } else {
                            toast.error(errorData.message || 'Dữ liệu không hợp lệ');
                        }
                    } catch (error) {
                        console.error("Error processing response:", error);
                        toast.error('Đã xảy ra lỗi khi xử lý phản hồi. Vui lòng thử lại sau.');
                    }
                    
                    throw new Error(`Bad request: ${response.status}`);
                } else if (response.status === 500) {
                    toast.error('Đã xảy ra lỗi ở máy chủ khi tạo bài tập viết. Vui lòng thử lại sau.');
                    throw new Error('Internal server error');
                } else {
                    toast.error(`Đã xảy ra lỗi: ${response.status}`);
                    throw new Error(`Error: ${response.status}`);
                }
            }
            
            const result = await response.json();
            console.log("Created writing exercise:", result);
            
            toast.success(messages.createSuccess);
            
            // Reset form
            setExerciseTopic('');
            setShowCreateForm(false);
            
            // Reload exercises
            if (getAllWritingExercises && currentUser?.userId) {
                await getAllWritingExercises(currentUser.userId);
            }
            
            // Tùy chọn: Điều hướng đến bài tập mới tạo
            if (result && result.writingExerciseId) {
                navigate(`/writing/exercise-simple/${result.writingExerciseId}`);
            }
            
        } catch (error) {
            console.error("Error creating writing exercise:", error);
            // Lỗi đã được xử lý cụ thể ở trên, đây chỉ là xử lý lỗi chung
            if (!error.message.includes('Bad request') && 
                !error.message.includes('User is not authenticated') &&
                !error.message.includes('Internal server error')) {
                toast.error(messages.createError);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle page change for pagination
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages && currentUser?.userId) {
            getAllWritingExercises(currentUser.userId, newPage, itemsPerPage);
        }
    };
    
    // Navigate to writing exercise detail
    const handleNavigateToExercise = (exerciseId) => {
        navigate(`/writing/exercise-simple/${exerciseId}`);
    };
    
    // Handle AI topic generation success
    const handleAITopicSuccess = (result) => {
        setShowAITopicForm(false);
        if (result) {
            toast.success(messages.aiTopicSuccess || 'AI-generated writing topic created successfully!');
            // Refresh the exercises list
            if (getAllWritingExercises && currentUser?.userId) {
                getAllWritingExercises(currentUser?.userId);
            }
            
            // Navigate to the new exercise if ID is available
            if (result.writingExerciseId) {
                navigate(`/writing/exercise-simple/${result.writingExerciseId}`);
            } else if (result.exerciseId) {
                navigate(`/writing/exercise-simple/${result.exerciseId}`);
            }
        } else {
            toast.error(messages.aiTopicError || 'Error generating writing topic with AI');
        }
    };
    
    // Helper function to show direct error alerts for critical errors
    const showDirectError = (message) => {
        // Show as toast
        toast.error(message);
        
        // Show custom modal for maximum limit errors
        if (message.includes('maximum limit') || message.includes('5 writing exercises') || 
            message.includes('giới hạn') || message.includes('bài tập viết')) {
            // Use the formatted message or fallback to a default
            const formattedMsg = 'Bạn đã đạt đến giới hạn tối đa 5 bài tập viết. Vui lòng xóa một số bài tập trước khi tạo mới.';
            setLimitModalMessage(formattedMsg);
            setShowLimitModal(true);
        }
        
        console.log('DIRECT ERROR DISPLAYED:', message);
    };
    
    if (!isAuthenticated) {
        return (
            <div className="main-content">
                <div className="container my-5">
                    <div className="alert alert-warning">
                        Vui lòng đăng nhập để sử dụng tính năng bài tập viết.
                    </div>
                </div>
            </div>
        );
    }
    
    return (
        <div className="main-content">
            <div className="writing-page-container container my-5">
                <div className="page-header mb-4">
                    <h1 className="page-title">{translations.pageTitle}</h1>
                    <p className="page-subtitle">{translations.introduction}</p>
                </div>
                
                <div className="writing-actions mb-4">
                    <button 
                        className="btn btn-primary me-2"
                        onClick={() => {
                            setShowCreateForm(!showCreateForm);
                            setShowAITopicForm(false);
                        }}
                    >
                        <i className="fas fa-plus-circle me-2"></i>
                        {translations.createExercise}
                    </button>
                    
                    <button 
                        className="btn btn-outline-primary ai-topic-button"
                        onClick={() => {
                            setShowAITopicForm(!showAITopicForm);
                            setShowCreateForm(false);
                        }}
                    >
                        <i className="fas fa-robot me-2"></i>
                        {translations.createTopicWithAI}
                    </button>
                </div>
                
                {/* AI Writing Topic Form */}
                {showAITopicForm && (
                    <AIWritingTopicForm 
                        onSuccess={handleAITopicSuccess}
                        onCancel={() => setShowAITopicForm(false)}
                        messages={messages}
                    />
                )}
                
                {showCreateForm && (
                    <div className="card create-exercise-card mb-4">
                        <div className="card-header">
                            <h5 className="card-title mb-0">{translations.createExercise}</h5>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleCreateExercise}>
                                <div className="row mb-3">
                                    <div className="col-md-6 mb-3 mb-md-0">
                                        <LanguageSelector
                                            id="learningLanguage"
                                            name="learningLanguage"
                                            value={learningLanguage}
                                            onChange={handleLanguageChange}
                                            label={translations.learningLanguage}
                                            required
                                            error={learningLanguageError}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <LanguageSelector
                                            id="nativeLanguage"
                                            name="nativeLanguage"
                                            value={nativeLanguage}
                                            onChange={handleLanguageChange}
                                            label={translations.nativeLanguage}
                                            required
                                            error={nativeLanguageError}
                                        />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="exerciseTopic" className="form-label fw-bold">{translations.topic}</label>
                                    <textarea
                                        id="exerciseTopic"
                                        className="form-control"
                                        rows="3"
                                        value={exerciseTopic}
                                        onChange={(e) => setExerciseTopic(e.target.value)}
                                        placeholder="Nhập chủ đề bài viết của bạn tại đây..."
                                        required
                                        style={{ fontSize: '16px', padding: '12px' }}
                                    ></textarea>
                                </div>
                                <div className="d-flex justify-content-end gap-2">
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={handleCancel}
                                    >
                                        {translations.cancelButton}
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={isSubmitting || learningLanguage === nativeLanguage}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Đang tạo...
                                            </>
                                        ) : (
                                            translations.createButton
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
                
                <div className="writing-exercises-section">
                    <div className="section-header d-flex justify-content-between align-items-center mb-3">
                        <h2>{translations.allExercises}</h2>
                    </div>
                    
                    {loading ? (
                        <div className="custom-loading-spinner">
                            <div className="spinner-circle"></div>
                            <div className="spinner-text">Loading exercises...</div>
                        </div>
                    ) : writingExercises.length === 0 ? (
                        <div className="no-exercises text-center py-5">
                            <i className="fas fa-pencil-alt fa-3x mb-3 text-muted"></i>
                            <p className="lead">{translations.noExercises}</p>
                            <button
                                className="btn btn-primary mt-3"
                                onClick={() => setShowCreateForm(true)}
                            >
                                <i className="fas fa-plus-circle me-2"></i>
                                {translations.createNew}
                            </button>
                        </div>
                    ) : (
                        <div className="row">
                            {writingExercises.map(exercise => (
                                <div className="col-md-6 col-lg-4 mb-4" key={exercise.writingExerciseId || exercise.id}>
                                    <div className="card exercise-card">
                                        <div className="card-body">
                                            <div className="d-flex justify-content-between align-items-start">
                                                <div className="language-badge">
                                                    {getLanguageFlag(exercise.learningLanguage)}
                                                    {getLanguageName(exercise.learningLanguage)}
                                                </div>
                                                {getStatusBadge(exercise.status)}
                                            </div>
                                            
                                            <h5 className="card-title">
                                                {exercise.topic.length > 100 
                                                    ? exercise.topic.substring(0, 100) + '...' 
                                                    : exercise.topic}
                                            </h5>
                                            
                                            <div className="created-date">
                                                <i className="far fa-calendar-alt me-2"></i>
                                                {formatDate(exercise.createAt)}
                                            </div>
                                            
                                            <div className="languages-info mt-2">
                                                <div>
                                                    <small><strong>Học:</strong> {getLanguageName(exercise.learningLanguage)}</small>
                                                </div>
                                                <div>
                                                    <small><strong>Mẹ đẻ:</strong> {getLanguageName(exercise.nativeLanguage)}</small>
                                                </div>
                                            </div>
                                            
                                            <div className="mt-3 d-flex justify-content-end">
                                                {exercise.status === 'Not Started' ? (
                                                    <button
                                                        className="btn btn-sm btn-primary"
                                                        onClick={() => handleNavigateToExercise(exercise.writingExerciseId)}
                                                    >
                                                        <i className="fas fa-pencil-alt me-1"></i>
                                                        Bắt đầu viết
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="btn btn-sm btn-outline-primary"
                                                        onClick={() => handleNavigateToExercise(exercise.writingExerciseId)}
                                                    >
                                                        <i className="far fa-eye me-1"></i>
                                                        Xem chi tiết
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    
                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="pagination-container d-flex justify-content-center mt-4">
                            <ul className="pagination">
                                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                    <button 
                                        className="page-link" 
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        &laquo;
                                    </button>
                                </li>
                                {[...Array(totalPages).keys()].map(page => (
                                    <li 
                                        className={`page-item ${currentPage === page + 1 ? 'active' : ''}`}
                                        key={page}
                                    >
                                        <button 
                                            className="page-link" 
                                            onClick={() => handlePageChange(page + 1)}
                                        >
                                            {page + 1}
                                        </button>
                                    </li>
                                ))}
                                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                    <button 
                                        className="page-link" 
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                    >
                                        &raquo;
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
            
            {/* AI Options Modal */}
            {showOptions && (
                <div className="modal-overlay">
                    <div className="ai-options-modal">
                        <div className="modal-header">
                            <h4>AI Writing Assistant</h4>
                            <button className="close-btn" onClick={() => setShowOptions(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            {generationType === 'topic' ? (
                                <div className="topic-input-group">
                                    <label>Enter a topic area:</label>
                                    <input
                                        type="text"
                                        placeholder={translations.enterTopic}
                                        value={topic}
                                        onChange={(e) => setTopic(e.target.value)}
                                        className="form-control mb-3"
                                    />
                                    <button 
                                        className="btn btn-primary w-100"
                                        onClick={handleAIGenerate}
                                        disabled={isGenerating || !topic}
                                    >
                                        <i className={`fas ${isGenerating ? 'fa-spinner fa-spin' : 'fa-robot'} me-2`}></i>
                                        {isGenerating ? translations.generating : translations.generateTopic}
                                    </button>
                                </div>
                            ) : (
                                <div className="ai-options-buttons">
                                    <button 
                                        className="btn btn-outline-primary w-100 mb-3"
                                        onClick={() => setGenerationType('topic')}
                                    >
                                        <i className="fas fa-lightbulb me-2"></i>
                                        {translations.generateTopic}
                                    </button>
                                    <button 
                                        className="btn btn-outline-primary w-100"
                                        onClick={() => setGenerationType('feedback')}
                                    >
                                        <i className="fas fa-comment-dots me-2"></i>
                                        {translations.aiFeedback}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            
            {/* API Key form modal */}
            {showApiKeyForm && (
                <div className="modal-overlay">
                    <div className="gemini-api-form">
                        <ApiKeyForm onSuccess={handleApiKeySuccess} onSkip={handleSkipApiKey} />
                    </div>
                </div>
            )}
            
            {/* Custom Limit Reached Modal */}
            {showLimitModal && (
                <div className="modern-modal-overlay">
                    <div className="modern-modal-container">
                        <div className="server-header">localhost:3000 cho biết</div>
                        <div className="modern-modal-content">
                            <p>{limitModalMessage || 'Bạn đã đạt đến giới hạn tối đa 5 bài tập viết. Vui lòng xóa một số bài tập trước khi tạo mới.'}</p>
                            <button 
                                className="modern-modal-button ok-button" 
                                onClick={() => {
                                    setShowLimitModal(false);
                                    setShowCreateForm(false);
                                }}
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            <style jsx="true">{`
                /* Modern Modal Styles */
                .modern-modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: rgba(0, 0, 0, 0.7);
                    z-index: 1200;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 20px;
                }
                
                .modern-modal-container {
                    background-color: #1e1e1e;
                    border-radius: 15px;
                    max-width: 450px;
                    width: 92%;
                    animation: modalFadeIn 0.3s ease-out;
                    overflow: hidden;
                }
                
                .server-header {
                    color: white;
                    opacity: 0.7;
                    font-size: 14px;
                    padding: 16px 25px 0;
                }
                
                .modern-modal-content {
                    padding: 10px 25px 22px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                
                .modern-modal-content p {
                    margin: 0 0 20px 0;
                    font-size: 15px;
                    line-height: 1.5;
                    color: white;
                    text-align: center;
                }
                
                .modern-modal-button.ok-button {
                    padding: 8px 45px;
                    border-radius: 100px;
                    font-size: 15px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s;
                    border: none;
                    background-color: #8c52ff;
                    color: white;
                }
                
                .modern-modal-button.ok-button:hover {
                    background-color: #7540e0;
                }
                
                @keyframes modalFadeIn {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}

export default WritingPage; 