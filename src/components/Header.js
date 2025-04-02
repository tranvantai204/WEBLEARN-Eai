import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { 
    FaGlobeAmericas,
    FaChevronUp, 
    FaChevronDown,
    FaCheck
} from 'react-icons/fa';
import {
    FlagVNIcon,
    FlagGBIcon,
    FlagJPIcon,
    FlagKRIcon,
    FlagCNIcon,
    FlagFRIcon,
    FlagDEIcon,
    FlagESIcon
} from './icons/FlagIcons';

function Header() {
  const { currentLanguage, languages: contextLanguages, changeLanguage, isTranslating, translateText } = useLanguage();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const languageMenuRef = useRef(null);
  
  const languages = [
    { code: 'en', name: 'English', icon: FlagGBIcon },
    { code: 'vi', name: 'Tiếng Việt', icon: FlagVNIcon },
    { code: 'ja', name: '日本語', icon: FlagJPIcon },
    { code: 'ko', name: '한국어', icon: FlagKRIcon },
    { code: 'zh', name: '中文', icon: FlagCNIcon },
    { code: 'fr', name: 'Français', icon: FlagFRIcon },
    { code: 'de', name: 'Deutsch', icon: FlagDEIcon },
    { code: 'es', name: 'Español', icon: FlagESIcon },
  ];

  const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0]; // Default to English if not found
  
  const [translations, setTranslations] = useState({
    flashcards: 'Flashcards',
    readings: 'Readings',
    writing: 'Writing',
    discover: 'Discover',
    signIn: 'Sign In',
    getStarted: 'Get Started',
    selectLanguage: 'Select Language'
  });
  
  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target)) {
        setShowLanguageMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Update translations when language changes
  useEffect(() => {
    const translateOnlyHome = localStorage.getItem('translateOnlyHome') === 'true';
    
    // Không dịch Header nếu chỉ dịch trang Home
    if (translateOnlyHome) {
      // Reset to English for Header
      setTranslations({
        flashcards: 'Flashcards',
        readings: 'Readings',
        writing: 'Writing',
        discover: 'Discover',
        signIn: 'Sign In',
        getStarted: 'Get Started',
        selectLanguage: 'Select Language'
      });
      return;
    }
    
    const updateTranslations = async () => {
      try {
        const newTranslations = {
          flashcards: await translateText('Flashcards'),
          readings: await translateText('Readings'),
          writing: await translateText('Writing'),
          discover: await translateText('Discover'),
          signIn: await translateText('Sign In'),
          getStarted: await translateText('Get Started'),
          selectLanguage: await translateText('Select Language')
        };
        setTranslations(newTranslations);
      } catch (error) {
        console.error('Translation error in Header:', error);
      }
    };
    
    if (currentLanguage !== 'en') {
      updateTranslations();
    } else {
      // Reset to English
      setTranslations({
        flashcards: 'Flashcards',
        readings: 'Readings',
        writing: 'Writing',
        discover: 'Discover',
        signIn: 'Sign In',
        getStarted: 'Get Started',
        selectLanguage: 'Select Language'
      });
    }
  }, [currentLanguage, translateText]);

  return (
    <header className="main-header">
      <div className="header-container">
        <Link to="/" className="header-logo">
          <img src="/images/wordwise-logo.svg" alt="WordWise" className="logo-image" />
          <span className="logo-text">WordWise</span>
        </Link>
        
        <nav className="main-nav">
          <ul className="nav-list">
            <li className="nav-item">
              <Link to="/flashcards" className="nav-link">
                <i className="fas fa-layer-group"></i>
                <span>{translations.flashcards}</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/readings" className="nav-link">
                <i className="fas fa-book"></i>
                <span>{translations.readings}</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/writing" className="nav-link">
                <i className="fas fa-pen"></i>
                <span>{translations.writing}</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/discover" className="nav-link">
                <i className="fas fa-compass"></i>
                <span>{translations.discover}</span>
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className="header-actions">
          <div className="language-selector" ref={languageMenuRef}>
            <button 
              className="lang-btn-main"
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
            >
              <span className="lang-flag">
                <currentLang.icon />
              </span>
              <span className="lang-name">{currentLang.name}</span>
              {showLanguageMenu ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            
            {showLanguageMenu && (
              <div className="language-menu">
                <div className="language-menu-header">
                  <FaGlobeAmericas className="globe-icon" />
                  <span>{translations.selectLanguage}</span>
                </div>
                <div className="language-menu-list">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      className={`language-option ${currentLanguage === lang.code ? 'active' : ''}`}
                      onClick={() => {
                        changeLanguage(lang.code);
                        setShowLanguageMenu(false);
                      }}
                    >
                      <span className="lang-flag">
                        <lang.icon />
                      </span>
                      <span className="lang-name">{lang.name}</span>
                      {currentLanguage === lang.code && <FaCheck className="check-icon" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <Link to="/login" className="btn btn-outline btn-sm header-login">
            {translations.signIn}
          </Link>
          <Link to="/register" className="btn btn-primary btn-sm header-signup">
            {translations.getStarted}
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header; 