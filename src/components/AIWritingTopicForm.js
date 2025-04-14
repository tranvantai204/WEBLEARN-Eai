import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import { useFlashcard } from '../contexts/FlashcardContext';
import { useWritingExercise } from '../contexts/WritingExerciseContext';
import ApiKeyForm from './ApiKeyForm';
import LanguageSelector from './LanguageSelector';
import Spinner from './common/Spinner';
import '../css/components/WritingExercises.css';

function AIWritingTopicForm({ onSuccess, onCancel }) {
  const [learningLanguage, setLearningLanguage] = useState('ENG');
  const [nativeLanguage, setNativeLanguage] = useState('VIE');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showApiKeyForm, setShowApiKeyForm] = useState(false);
  const [learningLanguageError, setLearningLanguageError] = useState('');
  const [nativeLanguageError, setNativeLanguageError] = useState('');
  
  const { getUserApiKey } = useFlashcard();
  const { autoGenerateWritingExercise } = useWritingExercise();
  const { isAuthenticated } = useAuth();
  
  // Handle form validation
  const validateForm = () => {
    let isValid = true;
    
    // Reset errors
    setLearningLanguageError('');
    setNativeLanguageError('');
    
    // Validate learning language
    if (!learningLanguage) {
      setLearningLanguageError('Vui lòng chọn ngôn ngữ học');
      isValid = false;
    }
    
    // Validate native language
    if (!nativeLanguage) {
      setNativeLanguageError('Vui lòng chọn ngôn ngữ mẹ đẻ');
      isValid = false;
    }
    
    // Validate languages are different
    if (learningLanguage && nativeLanguage && learningLanguage === nativeLanguage) {
      setLearningLanguageError('Ngôn ngữ học và ngôn ngữ mẹ đẻ không được giống nhau');
      setNativeLanguageError('Ngôn ngữ học và ngôn ngữ mẹ đẻ không được giống nhau');
      isValid = false;
    }
    
    return isValid;
  };
  
  // Handle API key form success
  const handleApiKeySuccess = () => {
    setShowApiKeyForm(false);
    toast.success('API key đã được lưu thành công!');
    // Continue with AI generation
    generateTopicWithAI();
  };
  
  // Skip API key for now
  const handleSkipApiKey = () => {
    setShowApiKeyForm(false);
    toast.info('Bạn có thể thêm API key sau trong phần cài đặt. Các tính năng AI sẽ không hoạt động nếu không có API key.');
  };
  
  // Generate topic with AI
  const generateTopicWithAI = async () => {
    // Add additional validation if needed
    if (!validateForm()) return;
    
    setIsGenerating(true);
    toast.info('🤖 Đang tạo chủ đề bài viết...');
    
    try {
      const result = await autoGenerateWritingExercise(learningLanguage, nativeLanguage);
      
      toast.success('✨ Đã tạo chủ đề bài viết thành công!');
      console.log('Generated writing exercise:', result);
      
      // Call the onSuccess callback with the result
      if (onSuccess && typeof onSuccess === 'function') {
        onSuccess(result);
      }
    } catch (error) {
      console.error('Error generating writing topic:', error);
      // Most error handling is done in the context
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Check for API key and generate topic
  const handleGenerateTopic = async () => {
    if (!isAuthenticated) {
      toast.error('Bạn cần đăng nhập để sử dụng tính năng này.');
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
        setShowApiKeyForm(true);
        toast.warn('Tính năng AI yêu cầu API key Gemini.');
        return;
      }
      
      // API key exists, proceed with generation
      generateTopicWithAI();
    } catch (error) {
      console.error('Error checking API key:', error);
      // In case of error checking API key, try to generate anyway
      generateTopicWithAI();
    }
  };
  
  // Get language name based on code
  const getLanguageName = (code) => {
    switch (code) {
      case 'ENG':
        return 'Tiếng Anh';
      case 'VIE':
        return 'Tiếng Việt';
      case 'JPN':
        return 'Tiếng Nhật';
      case 'KOR':
        return 'Tiếng Hàn';
      case 'CHI':
        return 'Tiếng Trung';
      case 'FRA':
        return 'Tiếng Pháp';
      case 'GER':
        return 'Tiếng Đức';
      case 'SPA':
        return 'Tiếng Tây Ban Nha';
      default:
        return code;
    }
  };
  
  return (
    <div className="card ai-writing-topic-form mb-4">
      <div className="card-header">
        <h5 className="card-title">
          <i className="fas fa-robot me-2"></i>
          Tạo đề bài viết bằng AI
        </h5>
      </div>
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
            Cách thức hoạt động
          </h6>
          <p style={{ color: '#475569', fontSize: '14px', margin: 0 }}>
            AI sẽ tự động tạo ra một chủ đề bài tập viết dựa trên ngôn ngữ bạn đang học và ngôn ngữ mẹ đẻ của bạn.
            Tính năng này yêu cầu bạn đã lưu trữ khóa API Gemini.
          </p>
        </div>
        
        <form>
          <div className="mb-3">
            <label htmlFor="learningLanguage" className="form-label">Ngôn ngữ học</label>
            <LanguageSelector
              id="learningLanguage"
              value={learningLanguage}
              onChange={(e) => setLearningLanguage(e.target.value)}
              className={`form-select ${learningLanguageError ? 'is-invalid' : ''}`}
            />
            {learningLanguageError && (
              <div className="invalid-feedback">{learningLanguageError}</div>
            )}
          </div>
          
          <div className="mb-3">
            <label htmlFor="nativeLanguage" className="form-label">Ngôn ngữ mẹ đẻ</label>
            <LanguageSelector
              id="nativeLanguage"
              value={nativeLanguage}
              onChange={(e) => setNativeLanguage(e.target.value)}
              className={`form-select ${nativeLanguageError ? 'is-invalid' : ''}`}
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
            >
              Hủy
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleGenerateTopic}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  Đang tạo...
                </>
              ) : (
                <>
                  <i className="fas fa-magic me-2"></i>
                  Tạo đề bài
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      
      {/* API Key form modal */}
      {showApiKeyForm && (
        <div className="modal-overlay">
          <div className="gemini-key-form-container">
            <ApiKeyForm 
              onSuccess={handleApiKeySuccess} 
              onSkip={handleSkipApiKey}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default AIWritingTopicForm; 