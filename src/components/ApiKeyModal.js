import React, { useEffect } from 'react';
import ApiKeyForm from './ApiKeyForm';
import '../css/components/ApiKeyModal.css';

function ApiKeyModal({ isOpen, onClose }) {
  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  // Handle Escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Don't render anything if modal is not open
  if (!isOpen) return null;

  return (
    <div className="api-key-modal-overlay" onClick={onClose}>
      <div 
        className="api-key-modal-content" 
        onClick={e => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
        
        <ApiKeyForm 
          onSuccess={() => {
            onClose();
          }}
          onSkip={() => {
            onClose();
          }}
        />
      </div>
    </div>
  );
}

export default ApiKeyModal; 