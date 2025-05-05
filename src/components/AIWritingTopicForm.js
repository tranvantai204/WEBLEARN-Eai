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
  const [title, setTitle] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showApiKeyForm, setShowApiKeyForm] = useState(false);
  const [learningLanguageError, setLearningLanguageError] = useState('');
  const [nativeLanguageError, setNativeLanguageError] = useState('');
  const [titleError, setTitleError] = useState('');
  
  const { getUserApiKey } = useFlashcard();
  const { autoGenerateWritingExercise } = useWritingExercise();
  const { isAuthenticated } = useAuth();
  
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
  
  // Generate topic with AI
  const generateTopicWithAI = async () => {
    // Add additional validation if needed
    if (!validateForm()) return;
    
    setIsGenerating(true);
    toast.info('🤖 Generating writing topic...');
    
    try {
      const result = await autoGenerateWritingExercise(learningLanguage, nativeLanguage, title);
      
      toast.success('✨ Generated writing topic successfully!');
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
        setShowApiKeyForm(true);
        toast.warn('AI feature requires Gemini API key.');
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
      </div>
    </div>
  );
}

export default AIWritingTopicForm; 