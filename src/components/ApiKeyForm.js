import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import '../css/components/ApiKeyForm.css';

function ApiKeyForm({ onSuccess, onSkip }) {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const { storeApiKey, isAuthenticated } = useAuth();
  const { currentUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      toast.error('Please enter an API key');
      return;
    }

    if (!isAuthenticated) {
      toast.error('You need to log in to use this feature');
      return;
    }

    setLoading(true);
    
    try {
      const result = await storeApiKey(apiKey);
      
      if (result.success) {
        if (localStorage.getItem('gemini_api_key')) {
          toast.success('API key has been saved to localStorage! You won\'t need to enter it again for the next 2 hours.');
        }
        
        setApiKey('');
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      console.error('Error saving API key:', error);
      toast.error(`An error occurred: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    } else {
      toast.info('You can add an API key later in the settings.');
    }
  };

  return (
    <div className="api-key-form-container">
      <div className="api-key-form-card">
        <h2><i className="fas fa-key"></i> Add Gemini API Key</h2>
        <p>
          To use the AI features, you need to provide a Gemini API key.
          This is optional - you can still use the basic features without it.
        </p>
        
        <form onSubmit={handleSubmit} className="api-key-form">
          <div className="form-group">
            <label htmlFor="apiKey">Gemini API Key <span style={{ color: '#e11d48' }}>*</span></label>
            <div className="input-with-toggle">
              <input
                type={showKey ? "text" : "password"}
                id="apiKey"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your Gemini API key"
                className="form-input"
                disabled={loading}
              />
              <button 
                type="button" 
                className="toggle-visibility-btn"
                onClick={() => setShowKey(!showKey)}
              >
                <i className={`fas fa-${showKey ? "eye-slash" : "eye"}`}></i>
              </button>
            </div>
            <small className="form-text">
              Get your API key from <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer">Google AI Studio</a> by clicking on "Create key"
            </small>
          </div>
          
          <div className="api-key-info">
            <h3>Information</h3>
            <p>
              The API key allows the application to use AI to automatically create flashcards and other advanced features.
              The API key will be stored on the server and is only valid for 2 hours after login.
              You can skip this or add an API key later in your profile page.
            </p>
          </div>
          
          <div className="form-actions">
            <button 
              type="button" 
              onClick={handleSkip}
              className="form-button form-button-secondary"
              disabled={loading}
            >
              <i className="fas fa-times"></i> Skip
            </button>
            <button 
              type="submit" 
              className="form-button form-button-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Saving...
                </>
              ) : (
                <>
                  <i className="fas fa-save"></i> Save API Key
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ApiKeyForm; 