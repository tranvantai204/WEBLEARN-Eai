import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useLanguage } from '../contexts/LanguageContext';
import { useMultipleChoiceTest } from '../contexts/MultipleChoiceTestContext';
import { useFlashcard } from '../contexts/FlashcardContext';
import { ExploreSection } from './common';
import 'react-toastify/dist/ReactToastify.css';
import '../css/components/Reading.css';
import ApiKeyForm from './ApiKeyForm';
import { jwtDecode } from 'jwt-decode';
import { makeAuthenticatedRequest } from '../utils/apiUtils';
import { useAuth } from '../contexts/AuthContext';
const bookIcon = '/images/book-icon.svg';

// Thêm hiệu ứng animation hiện đại
const ReadingLoadingPopup = ({ message, onCancel }) => {
  const [dots, setDots] = useState('.');

  // Animation cho dấu chấm
  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDots(prevDots => {
        if (prevDots.length >= 3) return '.';
        return prevDots + '.';
      });
    }, 500);

    return () => clearInterval(dotsInterval);
  }, []);

  return (
    <div className="app-wrapper" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: '#ebf5ff',
      zIndex: 9999,
    }}>
      <div className="loading-screen" style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
      }}>
        <div className="progress-container" style={{
          textAlign: 'center',
          maxWidth: '500px',
          width: '100%',
          padding: '20px',
        }}>
          <div className="loading-header" style={{
            marginBottom: '30px',
          }}>
            <div className="loading-title" style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#333',
              marginBottom: '10px',
            }}>
              AI đang tạo bài đọc...
            </div>
            <div className="loading-subtitle" style={{
              fontSize: '16px',
              color: '#666',
            }}>
              Vui lòng đợi trong khi AI đang tạo bài đọc của bạn
            </div>
          </div>
          
          <div className="loading-body" style={{
            marginBottom: '30px',
          }}>
            <div className="loading-steps" style={{
              textAlign: 'left',
              margin: '0 auto',
              maxWidth: '400px',
            }}>
              <div className="loading-step active" style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '15px',
              }}>
                <div className="step-icon" style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#ff8c42',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '15px',
                }}>
                  <i className="fas fa-robot"></i>
                </div>
                <div className="step-text" style={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: '#333',
                }}>
                  Kết nối với API
                </div>
              </div>
              
              <div className="loading-step" style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '15px',
                opacity: '0.6',
              }}>
                <div className="step-icon" style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#e0e0e0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '15px',
                }}>
                  <i className="fas fa-book"></i>
                </div>
                <div className="step-text" style={{
                  fontSize: '16px',
                  color: '#666',
                }}>
                  Tạo nội dung bài đọc
                </div>
              </div>
              
              <div className="loading-step" style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '15px',
                opacity: '0.6',
              }}>
                <div className="step-icon" style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#e0e0e0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '15px',
                }}>
                  <i className="fas fa-question-circle"></i>
                </div>
                <div className="step-text" style={{
                  fontSize: '16px',
                  color: '#666',
                }}>
                  Tạo câu hỏi kiểm tra
                </div>
              </div>
            </div>
            
            <div className="loading-note" style={{
              backgroundColor: '#f5f5f5',
              padding: '10px 15px',
              borderRadius: '5px',
              margin: '20px auto 0',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              maxWidth: '400px',
            }}>
              <i className="fas fa-lightbulb" style={{ 
                color: '#ff8c42',
                marginRight: '10px',
              }}></i>
              <span style={{ 
                fontSize: '14px',
                color: '#666',
              }}>
                Quá trình này có thể mất từ 15-30 giây để tạo bài đọc hoàn chỉnh
              </span>
            </div>
          </div>
          
          <div className="loading-footer" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
            <button className="cancel-button" 
              onClick={onCancel}
              style={{
                background: 'none',
                border: '1px solid #ccc',
                padding: '8px 20px',
                borderRadius: '4px',
                cursor: 'pointer',
                marginBottom: '20px',
                transition: 'all 0.2s',
              }}
            >
              Hủy
            </button>
            
            <div className="loading-status" style={{
              backgroundColor: '#ff8c42',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '30px',
              display: 'inline-block',
            }}>
              <div style={{ fontSize: '14px', opacity: '0.8' }}>Loading...</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold' }}>Generating{dots}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add this helper function right after ReadingLoadingPopup component
// Helper function to check for API key in localStorage
const checkApiKeyInLocalStorage = () => {
    // Check API key in localStorage
    const localApiKey = localStorage.getItem('gemini_api_key');
    const timestamp = localStorage.getItem('gemini_api_key_timestamp');
    
    // If API key exists in localStorage and is still valid
    if (localApiKey && timestamp) {
        const now = Date.now();
        const saved = parseInt(timestamp, 10);
        const twoHoursMs = 2 * 60 * 60 * 1000;
        
        if (now - saved <= twoHoursMs) {
            console.log('Valid API key found in localStorage');
            return true;
        } else {
            // API key has expired, remove from localStorage
            console.log('API key in localStorage has expired');
            localStorage.removeItem('gemini_api_key');
            localStorage.removeItem('gemini_api_key_timestamp');
        }
    }
    
    // No valid API key found in localStorage
    console.log('No valid API key in localStorage');
    return false;
};

function ReadingsPage() {
    const navigate = useNavigate();
    const [isGenerating, setIsGenerating] = useState(false);
    const [showApiKeyForm, setShowApiKeyForm] = useState(false);
    const [showLoadingPopup, setShowLoadingPopup] = useState(false);
    const [aiParams, setAiParams] = useState({
        title: '',
        learningLanguage: 'ENG',
        nativeLanguage: 'VIE',
        level: 3
    });
    const { translateText, currentLanguage } = useLanguage();
    const { getUserApiKey } = useFlashcard();
    const { isAuthenticated } = useAuth();
    const { 
        multipleChoiceTests, 
        loading, 
        error,
        getAllMultipleChoiceTests,
        generateMultipleChoiceTestWithAI,
        totalPages,
        currentPage
    } = useMultipleChoiceTest();
    const [selectedLanguage, setSelectedLanguage] = useState('all');
    const [serverApiKeyChecked, setServerApiKeyChecked] = useState(false);
    const [hasServerApiKey, setHasServerApiKey] = useState(false);
    
    // State for translated content
    const [translations, setTranslations] = useState({
        pageTitle: 'My Reading Tests',
        createButton: 'Create New Test',
        generateButton: 'Generate with AI',
        filterByLanguage: 'Filter by Language:',
        allLanguages: 'All languages',
        noTestsFound: 'No reading tests found.',
        createFirstTest: 'Create your first test',
        generatingText: 'Generating...',
        topicPlaceholder: 'Enter a topic (optional) or leave blank for AI to choose a topic...',
        errorEmptyTopic: 'Please enter a topic for AI generation!',
        generatingMsg: '🤖 AI is generating your test content...',
        successMsg: '✨ Test content generated successfully!',
        takeTest: 'Take Test',
        edit: 'Edit',
        generateTestsWithAI: 'Generate Tests with AI',
        beginner: 'Beginner',
        intermediate: 'Intermediate',
        advanced: 'Advanced',
        lessons: 'Lessons',
        students: 'Students',
        aiDescription: 'Enter a topic (optional) or leave blank for AI to choose one. Select options below to customize your reading test. AI will automatically generate a reading passage and multiple-choice questions. Example topics: "Climate Change", "Space Exploration", "Vietnamese Culture"...',
        aiHelperText: 'AI test generation requires a Google Gemini API key. If you don\'t have one yet, the system will guide you to add it.',
        learningLanguage: 'Learning Language',
        nativeLanguage: 'Native Language',
        levelDifficulty: 'Difficulty Level'
    });

    // Update translations when language changes
    useEffect(() => {
        if (currentLanguage === 'vi') {
            setTranslations({
                pageTitle: 'Bài Kiểm Tra Đọc Của Tôi',
                createButton: 'Tạo Bài Kiểm Tra Mới',
                generateButton: 'Tạo Bằng AI',
                filterByLanguage: 'Lọc Theo Ngôn Ngữ:',
                allLanguages: 'Tất cả ngôn ngữ',
                noTestsFound: 'Không tìm thấy bài kiểm tra đọc nào.',
                createFirstTest: 'Tạo bài kiểm tra đầu tiên của bạn',
                generatingText: 'Đang tạo...',
                topicPlaceholder: 'Nhập chủ đề (tùy chọn) hoặc để trống để AI chọn chủ đề...',
                errorEmptyTopic: 'Vui lòng nhập chủ đề để AI tạo!',
                generatingMsg: '🤖 AI đang tạo nội dung bài kiểm tra của bạn...',
                successMsg: '✨ Nội dung bài kiểm tra đã được tạo thành công!',
                takeTest: 'Làm Bài Kiểm Tra',
                edit: 'Chỉnh Sửa',
                generateTestsWithAI: 'Tạo Bài Kiểm Tra với AI',
                beginner: 'Sơ Cấp',
                intermediate: 'Trung Cấp',
                advanced: 'Cao Cấp',
                lessons: 'Bài Học',
                students: 'Học Viên',
                aiDescription: 'Nhập chủ đề (tùy chọn) hoặc để trống để AI chọn một chủ đề. Chọn các tùy chọn bên dưới để tùy chỉnh bài kiểm tra đọc của bạn. AI sẽ tự động tạo đoạn văn và câu hỏi trắc nghiệm. Ví dụ chủ đề: "Biến Đổi Khí Hậu", "Khám Phá Không Gian", "Văn Hóa Việt Nam"...',
                aiHelperText: 'Tạo bài kiểm tra bằng AI yêu cầu khóa API Google Gemini. Nếu bạn chưa có, hệ thống sẽ hướng dẫn bạn thêm vào.',
                learningLanguage: 'Ngôn Ngữ Học',
                nativeLanguage: 'Ngôn Ngữ Bản Địa',
                levelDifficulty: 'Cấp Độ Khó'
            });
        } else {
            setTranslations({
                pageTitle: 'My Reading Tests',
                createButton: 'Create New Test',
                generateButton: 'Generate with AI',
                filterByLanguage: 'Filter by Language:',
                allLanguages: 'All languages',
                noTestsFound: 'No reading tests found.',
                createFirstTest: 'Create your first test',
                generatingText: 'Generating...',
                topicPlaceholder: 'Enter a topic (optional) or leave blank for AI to choose a topic...',
                errorEmptyTopic: 'Please enter a topic for AI generation!',
                generatingMsg: '🤖 AI is generating your test content...',
                successMsg: '✨ Test content generated successfully!',
                takeTest: 'Take Test',
                edit: 'Edit',
                generateTestsWithAI: 'Generate Tests with AI',
                beginner: 'Beginner',
                intermediate: 'Intermediate',
                advanced: 'Advanced',
                lessons: 'Lessons',
                students: 'Students',
                aiDescription: 'Enter a topic (optional) or leave blank for AI to choose one. Select options below to customize your reading test. AI will automatically generate a reading passage and multiple-choice questions. Example topics: "Climate Change", "Space Exploration", "Vietnamese Culture"...',
                aiHelperText: 'AI test generation requires a Google Gemini API key. If you don\'t have one yet, the system will guide you to add it.',
                learningLanguage: 'Learning Language',
                nativeLanguage: 'Native Language',
                levelDifficulty: 'Difficulty Level'
            });
        }
    }, [currentLanguage]);

    const levelOptions = [
        { value: 1, label: 'Level 1 - Beginner' },
        { value: 2, label: 'Level 2 - Elementary' },
        { value: 3, label: 'Level 3 - Pre-Intermediate' },
        { value: 4, label: 'Level 4 - Intermediate' },
        { value: 5, label: 'Level 5 - Upper Intermediate' },
        { value: 6, label: 'Level 6 - Advanced' }
    ];

    const getLevelLabel = (levelValue) => {
        const option = levelOptions.find(opt => opt.value === levelValue);
        return option ? option.label : null; // Trả về null hoặc một giá trị mặc định nếu không tìm thấy
    };

    // Translate error/success messages up front to avoid async issues in callbacks
    const [translatedMessages, setTranslatedMessages] = useState({
        errorEmptyTopic: translations.errorEmptyTopic,
        generatingMsg: translations.generatingMsg,
        successMsg: translations.successMsg
    });

    // Fetch tests when component mounts using context
    useEffect(() => {
        console.log('ReadingsPage: Fetching tests from context');
        const fetchTests = async () => {
            try {
                // Get userId from localStorage
                let userId = null;
                try {
                    // First try to get directly from userId key
                    const accessToken = localStorage.getItem('accessToken');

                    const decodedToken = jwtDecode(accessToken);
                    const nameIdentifierClaim = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";

                    userId = decodedToken[nameIdentifierClaim];
                    
                    const directUserId = localStorage.getItem('userId');
                    if (directUserId) {
                        userId = directUserId;
                        console.log('Using userId directly from localStorage:', userId);
                    }
                    // If not found, try from userData object
                    else {
                        const userDataString = localStorage.getItem('userData');
                        if (userDataString) {
                            const userData = JSON.parse(userDataString);
                            userId = userData.userId;
                            console.log('Using userId from userData in localStorage:', userId);
                        }
                    }
                } catch (parseError) {
                    console.error('Error accessing/parsing userData from localStorage:', parseError);
                }
                
                if (!userId) {
                    console.warn('No userId available in localStorage, cannot fetch multiple choice tests');
                    return;
                }

                // Use context function to get tests, with pagination
                await getAllMultipleChoiceTests(userId, 1, 10);
                console.log('Tests fetched successfully via context:', multipleChoiceTests?.length || 0);
            } catch (err) {
                console.error('Error fetching tests:', err);
            }
        };

        fetchTests();
    }, [getAllMultipleChoiceTests]);

    // Update translations when language changes
    useEffect(() => {
        console.log("Language changed to:", currentLanguage);
        const updateTranslations = async () => {
            try {
                const newTranslations = {};
                for (const [key, value] of Object.entries(translations)) {
                    newTranslations[key] = await translateText(value);
                }
                setTranslations(newTranslations);

                setTranslatedMessages({
                    errorEmptyTopic: await translateText(translations.errorEmptyTopic),
                    generatingMsg: await translateText(translations.generatingMsg),
                    successMsg: await translateText(translations.successMsg)
                });
            } catch (error) {
                console.error("Translation error:", error);
            }
        };

        if (currentLanguage !== 'en') {
            updateTranslations();
        }
    }, [currentLanguage, translateText]);

    // Theo dõi state showLoadingPopup khi nó thay đổi
    useEffect(() => {
        console.log('Loading popup state changed:', { showLoadingPopup, isGenerating });
    }, [showLoadingPopup, isGenerating]);

    // Add useEffect to check server API key when component mounts
    useEffect(() => {
        const checkServerApiKey = async () => {
            try {
                if (isAuthenticated && !serverApiKeyChecked) {
                    console.log('Checking API key from server...');
                    // Check API key from server
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
    }, [getUserApiKey, serverApiKeyChecked]);

    // Check for valid API key (localStorage + server)
    const hasValidApiKey = () => {
        // If API key exists in localStorage, use it
        if (checkApiKeyInLocalStorage()) {
            console.log("Using valid API key from localStorage");
            return true;
        }
        
        // If not found in localStorage, check if it exists on server
        if (hasServerApiKey) {
            console.log("Using valid API key from server");
            return true;
        }
        
        console.log("No valid API key found in either localStorage or server");
        return false;
    };

    const handleApiKeySuccess = () => {
        setShowApiKeyForm(false);
        toast.success('API key saved successfully!');
        
        // Mark the server API key as available
        setHasServerApiKey(true);
        setServerApiKeyChecked(true);
        
        // Continue with test generation
        generateWithAI();
    };
    
    const handleSkipApiKey = () => {
        setShowApiKeyForm(false);
        toast.info('You can add your API key later in settings.');
    };
    
    // Cancel loading popup
    const handleCancelLoading = () => {
        setShowLoadingPopup(false);
        setIsGenerating(false);
        toast.info('Generation process cancelled');
    };
    
    const generateWithAI = async () => {
        // Setting loading states
        setIsGenerating(true);
        setShowLoadingPopup(true);
        toast.info(translatedMessages.generatingMsg);

        try {
            // Ensure popup displays for at least 2 seconds
            const minDisplayTime = 2000; // 2 seconds
            const startTime = Date.now();
            
            // Create generation data object
            const generationData = {
                title: aiParams.title,
                learningLanguage: aiParams.learningLanguage,
                nativeLanguage: aiParams.nativeLanguage,
                level: aiParams.level
            };
            
            // Add API key directly to generationData if available in localStorage
            const geminiApiKey = localStorage.getItem('gemini_api_key');
            console.log('Gemini API key present in localStorage:', !!geminiApiKey);
            
            if (geminiApiKey) {
                generationData.geminiApiKey = geminiApiKey;
                console.log('Added API key from localStorage to generationData');
            } else if (hasServerApiKey) {
                console.log('Using API key from server');
                // The server will use its stored API key
            }
            
            // Use the MultipleChoiceTestContext function
            const result = await generateMultipleChoiceTestWithAI(generationData);
            
            // Calculate elapsed time
            const elapsedTime = Date.now() - startTime;
            
            // If less than minimum display time, wait a bit longer
            if (elapsedTime < minDisplayTime) {
                await new Promise(resolve => setTimeout(resolve, minDisplayTime - elapsedTime));
            }
            
            if (result) {
                toast.success(translatedMessages.successMsg);
                // Hide loading before navigation
                setIsGenerating(false);
                setShowLoadingPopup(false);
                // Navigate to the new test
                navigate(`/readings/multiple-choice/edit/${result.multipleChoiceTestId}`);
            }
        } catch (error) {
            console.error('Error generating test with AI:', error);
            
            // Ensure popup displays for at least 2 seconds before showing error
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Log all console messages to help with debugging
            const originalConsoleLogs = [];
            const originalConsoleLog = console.log;
            const originalConsoleError = console.error;
            
            // Record all logs to find root error
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
            
            // Log for debugging
            console.log('Checking for original error in console logs');
            
            // Restore original console methods
            console.log = originalConsoleLog;
            console.error = originalConsoleError;
            
            // Check error response from server
            let errorMsg = error.message || 'Failed to generate test content';
            
            // Special handling for "Authentication error" which may actually be a 403 Forbidden (limit reached)
            if (errorMsg === 'Authentication error') {
                // This is likely the "maximum limit reached" error
                toast.error(
                    <div>
                        <strong>Đã đạt giới hạn tối đa!</strong> Bạn cần xóa bớt bài kiểm tra để tạo mới.
                        <div style={{ marginTop: '8px' }}>
                            <button 
                                onClick={() => window.location.href = window.location.href}
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
                                Quản lý Bài Kiểm Tra
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
                        toastId: "test-limit-error"
                    }
                );
                return;
            }
            
            // Check HTTP status code for specific error types
            if (error.response) {
                if (error.response.status === 403 || error.response.data?.includes('maximum limit') || error.response.data?.includes('5 Multiple Choice Exercise')) {
                    // Maximum limit reached error
                    toast.error(
                        <div>
                            <strong>Đã đạt giới hạn tối đa!</strong> Bạn cần xóa bớt bài kiểm tra để tạo mới.
                            <div style={{ marginTop: '8px' }}>
                                <button 
                                    onClick={() => navigate('/readings')}
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
                                    Quản lý Bài Kiểm Tra
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
                            toastId: "test-limit-error"
                        }
                    );
                } else if (error.response.status === 404 || error.response.data?.includes('API Key not found')) {
                    // API key not found error
                setShowLoadingPopup(false);
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
                } else if (error.response.status === 401 || error.response.data?.includes('API key is invalid') || error.response.data?.includes('expired')) {
                    // Invalid API key error
                    localStorage.removeItem('gemini_api_key');
                    localStorage.removeItem('gemini_api_key_timestamp');
                    
                    setShowLoadingPopup(false);
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
            } else {
                    // Other errors
                    toast.error(errorMsg);
                }
            } else {
                // Check error message text if HTTP status isn't available
                if (errorMsg.includes('maximum limit') || errorMsg.includes('5 Multiple Choice Exercise')) {
                    // Maximum limit reached error
                    toast.error(
                        <div>
                            <strong>Đã đạt giới hạn tối đa!</strong> Bạn cần xóa bớt bài kiểm tra để tạo mới.
                            <div style={{ marginTop: '8px' }}>
                                <button 
                                    onClick={() => navigate('/readings')}
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
                                    Quản lý Bài Kiểm Tra
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
                            toastId: "test-limit-error"
                        }
                    );
                } else if (errorMsg.includes('API Key not found') || errorMsg.includes('API key not found')) {
                    // API key not found error
                    setShowLoadingPopup(false);
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
                } else if (errorMsg.includes('API key is invalid') || errorMsg.includes('expired')) {
                    // Invalid API key error
                    localStorage.removeItem('gemini_api_key');
                    localStorage.removeItem('gemini_api_key_timestamp');
                    
                    setShowLoadingPopup(false);
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
                } else {
                    // Other errors
                    toast.error(errorMsg);
                }
            }
        } finally {
            // Reset states
            setIsGenerating(false);
            setShowLoadingPopup(false);
        }
    };

    const handleAIGenerate = async () => {
        console.log('🔄 handleAIGenerate triggered');

        // Check if we have a valid API key before proceeding
        if (hasValidApiKey()) {
            console.log('🔄 Setting loading states to true - valid API key found');
                setIsGenerating(true);
                setShowLoadingPopup(true);
                generateWithAI();
                return;
        }

        try {
            // Try to get API key from server if not found in localStorage
            const key = await getUserApiKey();
            if (!key) {
                setShowApiKeyForm(true);
                toast.warn('AI features require an API key');
                return;
            }
            
            // If we have a key from the server, set the flag and proceed
            setHasServerApiKey(true);
            console.log('🔄 Setting loading states to true - server API key found');
            setIsGenerating(true);
            setShowLoadingPopup(true);
            generateWithAI();
        } catch (error) {
            console.error('Error checking API key:', error);
            setShowApiKeyForm(true);
        }
    };

    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString();
        } catch (error) {
            return 'Invalid date';
        }
    };

    // Helper to get random counts for demo purposes
    const getRandomCount = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    // Get level badge class based on test level
    const getLevelBadgeClass = (level) => {
        if (!level) return '';
        if (typeof level !== 'string') return '';
        level = level.toLowerCase();
        if (level.includes('inter')) return 'intermediate-badge';
        if (level.includes('adv')) return 'advanced-badge';
        return ''; // beginner is default
    };

    // Filter tests by language if a language is selected
    const filteredTests = selectedLanguage === 'all' 
        ? multipleChoiceTests 
        : multipleChoiceTests?.filter(test => test.learningLanguage === selectedLanguage);
    
    // Get unique languages for the dropdown
    const languages = [...new Set((multipleChoiceTests || []).map(test => test.learningLanguage))].filter(Boolean);

    // Add at the top of the component function where the other variables are defined
    const getFlagIcon = (langCode) => {
        switch(langCode) {
            case 'ENG':
                return <span className="flag-icon">🇬🇧</span>;
            case 'VIE':
                return <span className="flag-icon">🇻🇳</span>;
            case 'FRA':
                return <span className="flag-icon">🇫🇷</span>;
            case 'DEU':
                return <span className="flag-icon">🇩🇪</span>;
            case 'ESP':
                return <span className="flag-icon">🇪🇸</span>;
            case 'JPN':
                return <span className="flag-icon">🇯🇵</span>;
            case 'KOR':
                return <span className="flag-icon">🇰🇷</span>;
            case 'CHN':
                return <span className="flag-icon">🇨🇳</span>;
            case 'AR':
                return <span className="flag-icon">🇸🇦</span>;
            case 'RUS':
                return <span className="flag-icon">🇷🇺</span>;
            case 'POR':
                return <span className="flag-icon">🇵🇹</span>;
            case 'THA':
                return <span className="flag-icon">🇹🇭</span>;
            default:
                return <span className="flag-icon">🌐</span>;
        }
    };

    if (loading) {
        return (
            <div className="app-wrapper">
                <div className="loading-screen">
                    <div className="progress-container">
                        <div className="progress-bar">
                            <div className="progress-indicator"></div>
                        </div>
                        <div className="loading-text">Loading...</div>
                    </div>
                </div>

                <style jsx="true">{`
                    .app-wrapper {
                        position: fixed;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background-color: #ebf5ff;
                        z-index: 9999;
                    }
                    
                    .loading-screen {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100%;
                        width: 100%;
                    }
                    
                    .progress-container {
                        text-align: center;
                    }
                    
                    .progress-bar {
                        width: 200px;
                        height: 4px;
                        background-color: #cde0ff;
                        border-radius: 4px;
                        margin-bottom: 16px;
                        overflow: hidden;
                    }
                    
                    .progress-indicator {
                        height: 100%;
                        width: 30%;
                        background-color: #ff8c42;
                        border-radius: 4px;
                        animation: progressAnim 1.5s infinite ease-in-out;
                    }
                    
                    .loading-text {
                        font-size: 16px;
                        color: #666;
                    }
                    
                    @keyframes progressAnim {
                        0% {
                            transform: translateX(-100%);
                        }
                        100% {
                            transform: translateX(350%);
                        }
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div className="main-content">
            <div className="readings-wrapper">
                <div className="ai-section">
                    <h2 className="ai-section-title">{translateText('Create AI Reading Test')}</h2>
                    <p className="ai-description">
                        {translateText('Enter a topic (optional) or leave blank for AI to choose one. Select options below to customize your reading test. AI will automatically generate a reading passage and multiple-choice questions. Example topics: "Climate Change", "Space Exploration", "Vietnamese Culture"...')}
                    </p>
                    <div className="ai-input-container">
                        <input
                            type="text"
                            placeholder={translateText('Enter a topic (optional) or leave blank for AI to choose a topic...')}
                            value={aiParams.title}
                            onChange={(e) => setAiParams({ ...aiParams, title: e.target.value })}
                            className="ai-input"
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') handleAIGenerate();
                            }}
                        />
                        <button 
                            className={`ai-btn ${isGenerating ? 'generating' : ''}`}
                            onClick={handleAIGenerate}
                            disabled={isGenerating}
                        >
                            {isGenerating ? (
                                <>
                                    <div className="button-progress-bar"></div> {translateText('Generating...')}
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-robot"></i> {translateText('Generate with AI')}
                                </>
                            )}
                        </button>
                    </div>
                    
                    <div className="ai-options-container">
                        <div className="ai-option-row">
                            <div className="ai-option-group">
                                <label htmlFor="learningLanguage">{translateText('Learning Language')}:</label>
                                <select
                                    id="learningLanguage"
                                    value={aiParams.learningLanguage}
                                    onChange={(e) => setAiParams({ ...aiParams, learningLanguage: e.target.value })}
                                    className="ai-select"
                                >
                                    <option value="ENG">{translateText('English')}</option>
                                    <option value="ESP">{translateText('Spanish')}</option>
                                    <option value="FRA">{translateText('French')}</option>
                                    <option value="DEU">{translateText('German')}</option>
                                    <option value="JPN">{translateText('Japanese')}</option>
                                    <option value="KOR">{translateText('Korean')}</option>
                                    <option value="CHN">{translateText('Chinese')}</option>
                                    <option value="VIE">{translateText('Vietnamese')}</option>
                                </select>
                            </div>
                            
                            <div className="ai-option-group">
                                <label htmlFor="nativeLanguage">{translateText('Native Language')}:</label>
                                <select
                                    id="nativeLanguage"
                                    value={aiParams.nativeLanguage}
                                    onChange={(e) => setAiParams({ ...aiParams, nativeLanguage: e.target.value })}
                                    className="ai-select"
                                >
                                    <option value="VIE">{translateText('Vietnamese')}</option>
                                    <option value="ENG">{translateText('English')}</option>
                                    <option value="ESP">{translateText('Spanish')}</option>
                                    <option value="FRA">{translateText('French')}</option>
                                    <option value="DEU">{translateText('German')}</option>
                                    <option value="JPN">{translateText('Japanese')}</option>
                                    <option value="KOR">{translateText('Korean')}</option>
                                    <option value="CHN">{translateText('Chinese')}</option>
                                </select>
                            </div>
                            
                            <div className="ai-option-group">
                                <label htmlFor="level">{translateText('Difficulty Level')}:</label>
                                <select
                                    id="level"
                                    value={aiParams.level}
                                    onChange={(e) => setAiParams({ ...aiParams, level: parseInt(e.target.value) })}
                                    className="ai-select"
                                >
                                    <option value={1}>{translateText('Level 1 - Beginner')}</option>
                                    <option value={2}>{translateText('Level 2 - Elementary')}</option>
                                    <option value={3}>{translateText('Level 3 - Intermediate')}</option>
                                    <option value={4}>{translateText('Level 4 - Upper Intermediate')}</option>
                                    <option value={5}>{translateText('Level 5 - Advanced')}</option>
                                    <option value={6}>{translateText('Level 6 - Proficient')}</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <div className="ai-helper-text">
                        <i className="fas fa-info-circle"></i> {translateText('AI test generation requires a Google Gemini API key. If you don\'t have one yet, the system will guide you to add it.')}
                    </div>
                </div>

                <div className="tests-section">
                    <div className="tests-header">
                        <h1 className="tests-title">{translations.pageTitle}</h1>
                        <div className="tests-actions">
                            <Link to="/readings/multiple-choice/tests" className="view-tests-btn">
                                <i className="fas fa-list"></i> {translateText('My Multiple Choice Tests')}
                            </Link>
                            <Link to="/readings/multiple-choice/create" className="create-new-test-btn">
                                <i className="fas fa-plus"></i> {translations.createButton}
                            </Link>
                        </div>
                    </div>

                    <div className="language-filter">
                        <span>{translations.filterByLanguage}</span>
                        <select 
                            value={selectedLanguage} 
                            onChange={(e) => setSelectedLanguage(e.target.value)}
                            className="language-select"
                        >
                            <option value="all">{translations.allLanguages}</option>
                            {languages.map(lang => (
                                <option key={lang} value={lang}>{lang}</option>
                            ))}
                        </select>
                    </div>

                    {error && error !== 'Authentication error' && <div className="api-error-message">{error}</div>}

                    {error === 'Authentication error' && (
                        <div className="alert alert-danger" style={{ 
                            padding: '12px 15px',
                            borderRadius: '8px',
                            marginBottom: '20px',
                            backgroundColor: '#fee2e2',
                            color: '#b91c1c',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <div>
                                <strong>Đã đạt giới hạn tối đa!</strong> Bạn cần xóa bớt bài kiểm tra để tạo mới.
                            </div>
                            <button 
                                onClick={() => navigate('/readings')}
                                style={{ 
                                    background: '#6c757d', 
                                    border: 'none', 
                                    color: 'white',
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                    marginLeft: '10px'
                                }}
                            >
                                Quản lý Bài Kiểm Tra
                            </button>
                        </div>
                    )}

                    {!error && filteredTests && filteredTests.length > 0 ? (
                        <div className="tests-grid">
                            {filteredTests.map(test => (
                                <div key={test.multipleChoiceTestId} className="test-item">
                                    <div className="test-image">
                                        <img src={bookIcon} alt="Reading test" />
                                    </div>
                                    <div className="test-item-content">
                                        <h3 className="test-item-title">{test.title}</h3>
                                        <p className="test-item-description">
                                            {test.description || `Practice your ${test.learningLanguage || 'language'} skills with this multiple choice test.`}
                                        </p>
                                        
                                        <div className="test-info">
                                            <span className={`level-badge ${getLevelBadgeClass(test.level)}`}>
                                            {getLevelLabel(test.level) || test.level || translations.beginner}
                                            </span>
                                            <div className="language-info">
                                                {getFlagIcon(test.learningLanguage)} {test.learningLanguage || 'ENG'}
                                            </div>
                                            <div className="students-count">
                                                <i className="fas fa-user-graduate"></i> {test.learnerCount} {translations.students}
                                            </div>
                                            
                                            <div className="lessons-count">
                                                <i className="fas fa-book"></i> {getRandomCount(5, 15)} {translations.lessons}
                                            </div>
                                            
                                        </div>
                                    </div>
                                    <div className="test-item-actions">
                                        <Link 
                                            to={`/readings/test/${test.multipleChoiceTestId}`}
                                            className="test-action-btn take-btn"
                                        >
                                            <i className="fas fa-book-open"></i> {translations.takeTest}
                                        </Link>
                                        <Link 
                                            to={`/readings/multiple-choice/edit/${test.multipleChoiceTestId}`}
                                            className="test-action-btn edit-btn"
                                        >
                                            {translations.edit}
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        !error && (
                            <div className="empty-tests-container">
                                <p className="empty-tests-message">{translations.noTestsFound}</p>
                                <Link to="/readings/multiple-choice/create" className="create-first-test-btn">
                                    {translations.createFirstTest}
                                </Link>
                            </div>
                        )
                    )}
                </div>

                <ExploreSection type="readings" />
            </div>
            
            {showApiKeyForm && (
                <div className="api-key-modal" style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 1000,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <div className="api-key-overlay" 
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        }}
                        onClick={() => setShowApiKeyForm(false)}
                    ></div>
                    <div className="api-key-modal-content" style={{
                        position: 'relative',
                        zIndex: 1,
                        backgroundColor: 'white',
                        padding: '20px',
                        borderRadius: '10px',
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                        width: '90%',
                        maxWidth: '500px',
                    }}>
                        <ApiKeyForm onSuccess={handleApiKeySuccess} onSkip={handleSkipApiKey} />
                    </div>
                </div>
            )}
            
            {/* Hiệu ứng loading popup */}
            {showLoadingPopup && (
                <ReadingLoadingPopup 
                    message="AI đang tạo bài đọc" 
                    onCancel={handleCancelLoading}
                />
            )}
        </div>
    );
}

export default ReadingsPage; 