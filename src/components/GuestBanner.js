import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { useLanguageContext } from '../contexts/LanguageContext';
import '../css/components/GuestBanner.css';

const GuestBanner = ({ type }) => {
  const { isAuthenticated } = useAuthContext();
  const { t } = useLanguageContext();
  
  // Don't show banner for authenticated users
  if (isAuthenticated) {
    return null;
  }
  
  let title = '';
  let message = '';
  let exploreLink = '';
  
  switch (type) {
    case 'flashcards':
      title = t('guestBanner.flashcards.title');
      message = t('guestBanner.flashcards.message');
      exploreLink = '/explore/flashcards';
      break;
    case 'readings':
      title = t('guestBanner.readings.title');
      message = t('guestBanner.readings.message');
      exploreLink = '/explore/readings';
      break;
    case 'writing':
      title = t('guestBanner.writing.title');
      message = t('guestBanner.writing.message');
      exploreLink = '/explore/writing';
      break;
    default:
      title = t('guestBanner.default.title');
      message = t('guestBanner.default.message');
      exploreLink = '/explore';
  }
  
  return (
    <div className="guest-banner">
      <div className="guest-banner-content">
        <h2>{title}</h2>
        <p>{message}</p>
        <div className="guest-banner-actions">
          <Link to="/signin" className="banner-button primary">
            {t('guestBanner.signIn')}
          </Link>
          <Link to={exploreLink} className="banner-button secondary">
            {t('guestBanner.explore')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GuestBanner; 