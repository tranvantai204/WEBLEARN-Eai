import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { FlagGBIcon } from './icons/FlagIcons';

/**
 * A simple button that switches the application language to English
 */
const EnglishLanguageButton = () => {
  const { changeLanguage } = useLanguage();
  
  const handleClick = () => {
    changeLanguage('en');
    // Reload the page to ensure all components update
    window.location.reload();
  };
  
  return (
    <button 
      className="english-language-button"
      onClick={handleClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 16px',
        backgroundColor: '#f8f9fa',
        border: '1px solid #ddd',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px'
      }}
    >
      <span style={{ width: '24px', height: '18px' }}>
        <FlagGBIcon />
      </span>
      <span>English</span>
    </button>
  );
};

export default EnglishLanguageButton; 