import React, { useState } from 'react';
import ApiKeyForm from './ApiKeyForm';
import '../css/components/ApiKeyModal.css';

function ApiKeyModal({ isOpen, onClose }) {
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
        />
      </div>
    </div>
  );
}

export default ApiKeyModal; 