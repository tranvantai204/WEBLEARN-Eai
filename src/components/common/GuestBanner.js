import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';

/**
 * GuestBanner component - Shows a banner for non-authenticated users
 * @param {Object} props
 * @param {string} props.title - The title of the banner
 * @param {string} props.message - The message to display
 * @param {string} props.type - The type of content (flashcards, test, writing, etc.)
 */
const GuestBanner = ({ title, message, type = 'content' }) => {
  const { translateText } = useLanguage();
  
  // Default values that can be overridden by props
  const bannerTitle = title || translateText(`Using as Guest`);
  const bannerMessage = message || translateText(`You can use this ${type} without an account, but your progress will not be saved.`);

  return (
    <div className="guest-user-banner">
      <div className="banner-content">
        <i className="fas fa-info-circle"></i>
        <div>
          <p className="banner-title">{bannerTitle}</p>
          <p>{bannerMessage}</p>
          <Link to="/login" className="login-link">
            {translateText('Sign in')}
          </Link>
          {translateText(' or ')}
          <Link to="/register" className="login-link">
            {translateText('create an account')}
          </Link>
          {translateText(' to track your progress.')}
        </div>
      </div>
    </div>
  );
};

export default GuestBanner; 