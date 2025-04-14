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
      toast.error('Vui lòng nhập API key');
      return;
    }

    if (!isAuthenticated) {
      toast.error('Bạn cần đăng nhập để sử dụng tính năng này');
      return;
    }

    setLoading(true);
    
    try {
      const result = await storeApiKey(apiKey);
      
      if (result.success) {
        if (localStorage.getItem('gemini_api_key')) {
          toast.success('API key đã được lưu vào localStorage! Bạn không cần nhập lại trong 2 giờ tới.');
        }
        
        setApiKey('');
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      console.error('Lỗi khi lưu API key:', error);
      toast.error(`Đã xảy ra lỗi: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    } else {
      toast.info('Bạn có thể thêm API key sau trong phần cài đặt.');
    }
  };

  return (
    <div className="api-key-form-container">
      <div className="api-key-form-card">
        <h2><i className="fas fa-key"></i> Thêm Gemini API Key</h2>
        <p>
          Để sử dụng tính năng AI, bạn cần cung cấp API key Gemini.
          Không bắt buộc - bạn vẫn có thể sử dụng những tính năng cơ bản.
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
                placeholder="Nhập Gemini API key của bạn"
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
              Lấy API key tại <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer">Google AI Studio</a> sau đó ấn vào create key để lấy key
            </small>
          </div>
          
          <div className="api-key-info">
            <h3>Thông tin</h3>
            <p>
              API key cho phép ứng dụng sử dụng AI để tạo flashcard tự động và các tính năng nâng cao khác. 
              API key sẽ được lưu trữ trên server và chỉ có hiệu lực trong 2 tiếng sau khi đăng nhập.
              Bạn có thể bỏ qua hoặc thêm API key sau trong trang cá nhân.
            </p>
          </div>
          
          <div className="form-actions">
            <button 
              type="button" 
              onClick={handleSkip}
              className="form-button form-button-secondary"
              disabled={loading}
            >
              <i className="fas fa-times"></i> Bỏ qua
            </button>
            <button 
              type="submit" 
              className="form-button form-button-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Đang lưu...
                </>
              ) : (
                <>
                  <i className="fas fa-save"></i> Lưu API Key
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