import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import { useFlashcard } from '../contexts/FlashcardContext';
import { useWritingExercise } from '../contexts/WritingExerciseContext';
import ApiKeyForm from './ApiKeyForm';
import LanguageSelector from './LanguageSelector';
import Spinner from './common/Spinner';
import '../css/components/WritingExercises.css';

// Thêm hiệu ứng animation hiện đại
const LoadingPopup = ({ message, onCancel }) => {
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
    <div className="minimal-loading-overlay">
      <div className="minimal-loading-container">
        <div className="minimal-loading-header">
          <button className="minimal-cancel-btn" onClick={onCancel}>
            Cancel
          </button>
          <div className="minimal-loading-status">
            <div className="minimal-loading-text">Loading...</div>
            <div className="minimal-generating-text">Generating{dots}</div>
          </div>
        </div>

        <div className="minimal-loading-content">
          <h2>AI đang tạo bài tập viết...</h2>
          <p>Vui lòng đợi trong khi AI đang tạo bài tập viết của bạn...</p>
          
          <div className="minimal-steps">
            <div className="minimal-step">
              <div className="minimal-step-icon">
                <i className="fas fa-robot"></i>
              </div>
              <div className="minimal-step-text">Kết nối với API</div>
            </div>
            
            <div className="minimal-step">
              <div className="minimal-step-icon">
                <i className="fas fa-pen-fancy"></i>
              </div>
              <div className="minimal-step-text">Tạo chủ đề viết</div>
            </div>
            
            <div className="minimal-step">
              <div className="minimal-step-icon">
                <i className="fas fa-file-alt"></i>
              </div>
              <div className="minimal-step-text">Tạo hướng dẫn và mẫu</div>
            </div>
          </div>
          
          <div className="minimal-note">
            <i className="fas fa-lightbulb"></i>
            <span>Quá trình này có thể mất từ 10-20 giây để tạo bài tập viết hoàn chỉnh</span>
          </div>
        </div>
      </div>
    </div>
  );
};

function AIWritingTopicForm({ onSuccess, onCancel, messages = {} }) {
  const [learningLanguage, setLearningLanguage] = useState('ENG');
  const [nativeLanguage, setNativeLanguage] = useState('VIE');
  const [title, setTitle] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showApiKeyForm, setShowApiKeyForm] = useState(false);
  const [learningLanguageError, setLearningLanguageError] = useState('');
  const [nativeLanguageError, setNativeLanguageError] = useState('');
  const [titleError, setTitleError] = useState('');
  const [showLoadingPopup, setShowLoadingPopup] = useState(false);
  const [maxLimitError, setMaxLimitError] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [limitModalMessage, setLimitModalMessage] = useState('');
  
  const { getUserApiKey } = useFlashcard();
  const { autoGenerateWritingExercise } = useWritingExercise();
  const { isAuthenticated } = useAuth();
  
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
    } else {
      // Fallback to alert for other critical errors
      setTimeout(() => {
        alert(message);
      }, 300);
    }
    
    console.log('DIRECT ERROR DISPLAYED:', message);
  };
  
  // Handle form validation
  const validateForm = () => {
    let isValid = true;
    
    // Reset errors
    setLearningLanguageError('');
    setNativeLanguageError('');
    setTitleError('');
    
    // Validate title
    if (!title.trim()) {
      setTitleError('Please enter a title for your writing topic');
      isValid = false;
    }
    
    // Validate learning language
    if (!learningLanguage) {
      setLearningLanguageError('Please select a learning language');
      isValid = false;
    }
    
    // Validate native language
    if (!nativeLanguage) {
      setNativeLanguageError('Please select a native language');
      isValid = false;
    }
    
    // Validate languages are different
    if (learningLanguage && nativeLanguage && learningLanguage === nativeLanguage) {
      setLearningLanguageError('Learning language and native language cannot be the same');
      setNativeLanguageError('Learning language and native language cannot be the same');
      isValid = false;
    }
    
    return isValid;
  };
  
  // Handle API key form success
  const handleApiKeySuccess = () => {
    setShowApiKeyForm(false);
    toast.success('API key saved successfully!');
    // Continue with AI generation
    generateTopicWithAI();
  };
  
  // Skip API key for now
  const handleSkipApiKey = () => {
    setShowApiKeyForm(false);
    toast.info('You can add API key later in the settings. The AI features will not work without an API key.');
  };
  
  // Cancel loading popup
  const handleCancelLoading = () => {
    setShowLoadingPopup(false);
    setIsGenerating(false);
    toast.info('Generation process cancelled');
  };
  
  // Generate topic with AI
  const generateTopicWithAI = async () => {
    // Add additional validation if needed
    if (!validateForm()) return;
    
    setIsGenerating(true);
    setShowLoadingPopup(true);
    setMaxLimitError(false);
    toast.info(messages.generatingTopic || '🤖 Generating writing topic...');
    
    try {
      const result = await autoGenerateWritingExercise(learningLanguage, nativeLanguage, title);
      
      toast.success(messages.topicGenerated || '✨ Generated writing topic successfully!');
      console.log('Generated writing exercise:', result);
      
      // Call the onSuccess callback with the result
      if (onSuccess && typeof onSuccess === 'function') {
        onSuccess(result);
      }
    } catch (error) {
      console.error('Error generating writing topic:', error);
      
      // Extract response status and message for better error handling
      const errorStatus = error.response?.status || (error.status) || 0;
      const errorMessage = error.message || 'Unknown error occurred';
      
      console.log('Error status:', errorStatus);
      console.log('Error message:', errorMessage);
      
      // Check for API key not found errors
      if (errorStatus === 404 || errorMessage.includes('API Key not found')) {
        const errorMsg = messages.apiKeyMissing || 'API Key not found. Please add your Gemini API key to use this feature.';
        showDirectError(errorMsg);
        setShowApiKeyForm(true);
        return;
      }
      
      // Check for API key invalid/expired errors
      if (errorStatus === 401 || errorMessage.includes('API key is invalid') || errorMessage.includes('expired')) {
        const errorMsg = messages.apiKeyInvalid || 'Your API key is invalid or expired. Please update your Gemini API key.';
        showDirectError(errorMsg);
        setShowApiKeyForm(true);
        return;
      }
      
      // Check for maximum limit errors - This is the most important part for your request
      if (errorStatus === 403 || 
          errorStatus === 400 || 
          errorMessage.includes('maximum limit') || 
          errorMessage.includes('5 Multiple Choice Exercise') || 
          errorMessage.includes('5 Writing Exercise') ||
          errorMessage.includes('reached the maximum')) {
        const errorMsg = messages.maxExercisesLimit || 'Bạn đã đạt đến giới hạn tối đa 5 bài tập viết. Vui lòng xóa một số bài tập trước khi tạo mới.';
        
        // Show direct error for maximum visibility
        showDirectError(errorMsg);
        
        setMaxLimitError(true);
        // Force re-render to ensure error is displayed
        setTimeout(() => {
          if (document.querySelector('.max-limit-error') === null) {
            console.log('Error banner not found, forcing update');
            setMaxLimitError(false);
            setTimeout(() => setMaxLimitError(true), 10);
          }
        }, 100);
        return;
      }
      
      // Rate limiting errors
      if (errorStatus === 429) {
        toast.error(messages.rateLimitExceeded || 'Rate limit exceeded. Please try again later.');
        return;
      }
      
      // General error fallback
      toast.error(messages.aiTopicError || `Error: ${errorMessage || 'Failed to generate writing topic'}`);
    } finally {
      setIsGenerating(false);
      setShowLoadingPopup(false);
    }
  };
  
  // Check for API key and generate topic
  const handleGenerateTopic = async () => {
    if (!isAuthenticated) {
      toast.error('You need to log in to use this feature.');
      return;
    }
    
    if (!validateForm()) return;
    
    try {
      // Check for API key in localStorage first
      const localApiKey = localStorage.getItem('gemini_api_key');
      const timestamp = localStorage.getItem('gemini_api_key_timestamp');
      
      if (localApiKey && timestamp) {
        // Check if API key is still valid (2 hours)
        const now = Date.now();
        const saved = parseInt(timestamp, 10);
        const twoHoursMs = 2 * 60 * 60 * 1000;
        
        if (now - saved <= twoHoursMs) {
          // Use existing API key
          generateTopicWithAI();
          return;
        } else {
          // API key expired, remove from localStorage
          localStorage.removeItem('gemini_api_key');
          localStorage.removeItem('gemini_api_key_timestamp');
        }
      }
      
      // Check if API key is set on the server
      const key = await getUserApiKey();
      if (!key) {
        const errorMsg = messages.apiKeyRequired || 'AI feature requires Gemini API key.';
        setShowApiKeyForm(true);
        showDirectError(errorMsg);
        return;
      }
      
      // API key exists, proceed with generation
      generateTopicWithAI();
    } catch (error) {
      console.error('Error checking API key:', error);
      
      // Display API key error for any caught errors
      const errorMsg = 'Error checking API key. Please try again or add your API key manually.';
      showDirectError(errorMsg);
      
      // Show API key form as fallback
      setShowApiKeyForm(true);
    }
  };
  
  // Get language name based on code
  const getLanguageName = (code) => {
    switch (code) {
      case 'ENG':
        return 'English';
      case 'VIE':
        return 'Vietnamese';
      case 'JPN':
        return 'Japanese';
      case 'KOR':
        return 'Korean';
      case 'CHI':
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
  
  return (
    <div className="card ai-writing-topic-form mb-4">
      <div className="card-header">
        <h5 className="card-title">
          <i className="fas fa-robot me-2"></i>
          Generate Writing Topic with AI
        </h5>
      </div>
      
      {/* Show max limit error message if needed */}
      {maxLimitError && (
        <div className="max-limit-error" style={{
          backgroundColor: '#f8d7da',
          color: '#721c24',
          padding: '15px 20px',
          margin: '15px',
          borderRadius: '6px',
          fontSize: '16px',
          border: '1px solid #f5c6cb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div>
            <i className="fas fa-exclamation-circle" style={{ fontSize: '18px', marginRight: '10px' }}></i>
            <strong>Reached limit:</strong> {messages.maxExercisesLimit || 'You have reached the maximum limit of 5 writing exercises. Please delete some existing exercises before creating new ones.'}
          </div>
          <button 
            onClick={() => window.location.href = '/writing'}
            style={{ 
              background: '#dc3545', 
              border: 'none', 
              color: 'white',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              marginLeft: '15px',
              whiteSpace: 'nowrap'
            }}
          >
            <i className="fas fa-tasks me-2"></i>
            Manage Exercises
          </button>
        </div>
      )}
      
      <div className="card-body">
        <div className="info-card mb-3" style={{ 
          background: 'rgba(66, 133, 244, 0.08)',
          padding: '16px',
          borderRadius: '8px',
          borderLeft: '4px solid #4285f4'
        }}>
          <h6 style={{ 
            color: '#1e293b', 
            fontSize: '16px', 
            marginBottom: '6px',
            fontWeight: '600'
          }}>
            <i className="fas fa-info-circle me-2"></i> 
            How it works
          </h6>
          <p style={{ color: '#475569', fontSize: '14px', margin: 0 }}>
            AI will automatically generate a writing topic based on your learning language and native language.
            This feature requires that you have saved your Gemini API key.
          </p>
        </div>
        
        <form>
          <div className="mb-3">
            <label htmlFor="topicTitle" className="form-label fw-bold">Topic Title</label>
            <input 
              type="text"
              id="topicTitle"
              className={`form-control ${titleError ? 'is-invalid' : ''}`}
              placeholder="Enter a title for your writing topic"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ fontSize: '16px', padding: '10px 12px', height: 'auto' }}
            />
            {titleError && (
              <div className="invalid-feedback">{titleError}</div>
            )}
            <small className="form-text text-muted">
              For example: "Daily Routine", "Travel Experience", "My Favorite Food", etc.
            </small>
          </div>

          <div className="mb-3">
            <label htmlFor="learningLanguage" className="form-label fw-bold">Learning Language</label>
            <LanguageSelector
              id="learningLanguage"
              value={learningLanguage}
              onChange={(e) => setLearningLanguage(e.target.value)}
              className={`form-select ${learningLanguageError ? 'is-invalid' : ''}`}
              style={{ fontSize: '16px', padding: '10px 12px', height: 'auto' }}
            />
            {learningLanguageError && (
              <div className="invalid-feedback">{learningLanguageError}</div>
            )}
          </div>
          
          <div className="mb-3">
            <label htmlFor="nativeLanguage" className="form-label fw-bold">Native Language</label>
            <LanguageSelector
              id="nativeLanguage"
              value={nativeLanguage}
              onChange={(e) => setNativeLanguage(e.target.value)}
              className={`form-select ${nativeLanguageError ? 'is-invalid' : ''}`}
              style={{ fontSize: '16px', padding: '10px 12px', height: 'auto' }}
            />
            {nativeLanguageError && (
              <div className="invalid-feedback">{nativeLanguageError}</div>
            )}
          </div>
          
          <div className="d-flex justify-content-end mt-4">
            <button 
              type="button" 
              className="btn btn-outline-secondary me-2"
              onClick={onCancel}
              disabled={isGenerating}
              style={{ padding: '10px 20px', fontSize: '15px' }}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary ai-generate-button"
              onClick={handleGenerateTopic}
              disabled={isGenerating}
              style={{ 
                padding: '10px 20px', 
                fontSize: '15px',
                fontWeight: '600',
                boxShadow: '0 2px 8px rgba(11, 94, 215, 0.3)'
              }}
            >
              {isGenerating ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  Generating...
                </>
              ) : (
                <>
                  <i className="fas fa-magic me-2"></i>
                  Generate Topic
                </>
              )}
            </button>
          </div>
        </form>
        
        {/* API Key Form Modal */}
        {showApiKeyForm && (
          <div className="api-key-modal">
            <div className="api-key-overlay" onClick={() => setShowApiKeyForm(false)}></div>
            <div className="api-key-modal-content">
              <ApiKeyForm 
                onSuccess={handleApiKeySuccess} 
                onSkip={handleSkipApiKey} 
              />
            </div>
          </div>
        )}
        
        {/* Hiệu ứng loading popup theo thiết kế mới */}
        {showLoadingPopup && (
          <LoadingPopup 
            message="AI đang tạo bài tập viết" 
            onCancel={handleCancelLoading}
          />
        )}
        
        {/* Custom Limit Reached Modal */}
        {showLimitModal && (
          <div className="modern-modal-overlay">
            <div className="modern-modal-container">
              <div className="server-header">localhost:3000 cho biết</div>
              <div className="modern-modal-content">
                <p>{limitModalMessage}</p>
                <button 
                  className="modern-modal-button ok-button" 
                  onClick={() => setShowLimitModal(false)}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Thêm CSS cho hiệu ứng loading mới */}
      <style jsx="true">{`
        /* Minimal Loading Styles */
        .minimal-loading-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: white;
          z-index: 1100;
          display: flex;
          flex-direction: column;
          padding-top: 16px;
        }
        
        .minimal-loading-container {
          width: 100%;
          max-width: 100%;
          padding: 0 20px;
          margin: 0 auto;
        }
        
        .minimal-loading-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
        }
        
        .minimal-cancel-btn {
          background: none;
          border: 1px solid #e2e8f0;
          color: #64748b;
          padding: 12px 30px;
          border-radius: 100px;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .minimal-cancel-btn:hover {
          background: #f8fafc;
        }
        
        .minimal-loading-status {
          background-color: #ffb37c;
          border-radius: 100px;
          padding: 15px 40px;
          color: white;
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 180px;
        }
        
        .minimal-loading-text {
          font-size: 15px;
          color: rgba(255, 255, 255, 0.85);
          margin-bottom: 5px;
        }
        
        .minimal-generating-text {
          font-size: 16px;
          font-weight: 600;
          color: white;
        }
        
        .minimal-loading-content {
          padding: 0 10px;
        }
        
        .minimal-loading-content h2 {
          font-size: 28px;
          font-weight: 600;
          color: #0f172a;
          margin-bottom: 10px;
        }
        
        .minimal-loading-content p {
          font-size: 16px;
          color: #64748b;
          margin-bottom: 30px;
        }
        
        .minimal-steps {
          margin-bottom: 30px;
        }
        
        .minimal-step {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
        }
        
        .minimal-step-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 15px;
          color: #64748b;
          font-size: 16px;
        }
        
        .minimal-step:first-child .minimal-step-icon {
          background-color: #e0f2fe;
          color: #0284c7;
        }
        
        .minimal-step-text {
          font-size: 16px;
          color: #334155;
          font-weight: 500;
        }
        
        .minimal-step:first-child .minimal-step-text {
          color: #0284c7;
          font-weight: 600;
        }
        
        .minimal-note {
          background-color: #f8fafc;
          border-radius: 8px;
          padding: 15px;
          display: flex;
          align-items: flex-start;
          color: #64748b;
          font-size: 14px;
        }
        
        .minimal-note i {
          margin-right: 10px;
          color: #fbbf24;
          font-size: 16px;
        }
        
        /* Existing API key modal styles */
        .api-key-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 1000;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        .api-key-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
        }
        
        .api-key-modal-content {
          position: relative;
          z-index: 1;
          background-color: white;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
          width: 90%;
          max-width: 500px;
        }
        
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

export default AIWritingTopicForm; 