import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { 
    FaGlobeAmericas,
    FaChevronDown,
    FaCheck,
    FaBars,
    FaTimes
} from 'react-icons/fa';
import {
    FlagVNIcon,
    FlagGBIcon,
    FlagJPIcon,
    FlagKRIcon,
    FlagCNIcon,
    FlagFRIcon,
    FlagDEIcon,
    FlagESIcon,
    FlagITIcon,
    FlagRUIcon,
    FlagPTIcon,
    FlagNLIcon,
    FlagARIcon,
    FlagHIIcon,
    FlagTHIcon,
    FlagIDIcon
} from './icons/FlagIcons';

function Header() {
  const { currentLanguage, changeLanguage, translateText } = useLanguage();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showLanguageOptions, setShowLanguageOptions] = useState(false);
  const mobileMenuRef = useRef(null);
  const langOptionsRef = useRef(null);
  
  const languages = [
    { code: 'en', name: 'English', icon: FlagGBIcon },
    { code: 'vi', name: 'Tiếng Việt', icon: FlagVNIcon },
    { code: 'ja', name: '日本語', icon: FlagJPIcon },
    { code: 'ko', name: '한국어', icon: FlagKRIcon },
    { code: 'zh', name: '中文', icon: FlagCNIcon },
    { code: 'fr', name: 'Français', icon: FlagFRIcon },
    { code: 'de', name: 'Deutsch', icon: FlagDEIcon },
    { code: 'es', name: 'Español', icon: FlagESIcon },
    { code: 'it', name: 'Italiano', icon: FlagITIcon },
    { code: 'ru', name: 'Русский', icon: FlagRUIcon },
    { code: 'pt', name: 'Português', icon: FlagPTIcon },
    { code: 'nl', name: 'Nederlands', icon: FlagNLIcon },
    { code: 'ar', name: 'العربية', icon: FlagARIcon },
    { code: 'hi', name: 'हिन्दी', icon: FlagHIIcon },
    { code: 'th', name: 'ไทย', icon: FlagTHIcon },
    { code: 'id', name: 'Bahasa Indonesia', icon: FlagIDIcon }
  ];

  const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0];
  
  const [translations, setTranslations] = useState({
    flashcards: 'Flashcards',
    readings: 'Readings',
    writing: 'Writing',
    discover: 'Discover',
    signIn: 'Sign In',
    getStarted: 'Get Started'
  });

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && 
          !event.target.closest('.mobile-menu-btn')) {
        setShowMobileMenu(false);
      }
      
      if (showLanguageOptions && 
          langOptionsRef.current && 
          !langOptionsRef.current.contains(event.target) && 
          !event.target.closest('.mobile-lang-btn')) {
        setShowLanguageOptions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLanguageOptions]);

  // Update translations when language changes
  useEffect(() => {
    const updateTranslations = async () => {
      try {
        const newTranslations = {
          flashcards: await translateText('Flashcards'),
          readings: await translateText('Readings'),
          writing: await translateText('Writing'),
          discover: await translateText('Discover'),
          signIn: await translateText('Sign In'),
          getStarted: await translateText('Get Started')
        };
        setTranslations(newTranslations);
      } catch (error) {
        console.error('Translation error in Header:', error);
      }
    };
    
    if (currentLanguage !== 'en') {
      updateTranslations();
    } else {
      setTranslations({
        flashcards: 'Flashcards',
        readings: 'Readings',
        writing: 'Writing',
        discover: 'Discover',
        signIn: 'Sign In',
        getStarted: 'Get Started'
      });
    }
  }, [currentLanguage, translateText]);

  const handleLanguageChange = (langCode) => {
    changeLanguage(langCode);
    setShowLanguageOptions(false);
  };

  return (
    <header className="main-header">
      <div className="header-container">
        <Link to="/" className="header-logo">
          <img src="/images/wordwise-logo.svg" alt="WordWise" className="logo-image" />
          <span className="logo-text">WordWise</span>
        </Link>
        
        <button 
          className="mobile-menu-btn"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          aria-label="Toggle menu"
        >
          {showMobileMenu ? <FaTimes /> : <FaBars />}
        </button>
        
        {/* Menu */}
        <div className={`mobile-menu ${showMobileMenu ? 'active' : ''}`} ref={mobileMenuRef}>
          <ul className="mobile-nav-list">
            <li className="mobile-nav-item">
              <Link to="/flashcards" className="mobile-nav-link" onClick={() => setShowMobileMenu(false)}>
                <i className="fas fa-layer-group"></i>
                <span>{translations.flashcards}</span>
              </Link>
            </li>
            <li className="mobile-nav-item">
              <Link to="/readings" className="mobile-nav-link" onClick={() => setShowMobileMenu(false)}>
                <i className="fas fa-book"></i>
                <span>{translations.readings}</span>
              </Link>
            </li>
            <li className="mobile-nav-item">
              <Link to="/writing" className="mobile-nav-link" onClick={() => setShowMobileMenu(false)}>
                <i className="fas fa-pen"></i>
                <span>{translations.writing}</span>
              </Link>
            </li>
            <li className="mobile-nav-item">
              <Link to="/discover" className="mobile-nav-link" onClick={() => setShowMobileMenu(false)}>
                <i className="fas fa-compass"></i>
                <span>{translations.discover}</span>
              </Link>
            </li>
          </ul>
          
          {/* Language Selector in Menu */}
          <div className="mobile-lang-section">
            <div className="mobile-lang-selector">
              <button 
                className="mobile-lang-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowLanguageOptions(!showLanguageOptions);
                }}
              >
                <div className="lang-content">
                  <FaGlobeAmericas className="globe-icon" />
                  <span className="lang-flag">
                    <currentLang.icon />
                  </span>
                  <span className="lang-name">{currentLang.name}</span>
                </div>
                <FaChevronDown />
              </button>
              
              <div 
                className={`language-options ${showLanguageOptions ? 'active' : ''}`} 
                ref={langOptionsRef}
              >
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    className={`language-option ${currentLanguage === lang.code ? 'active' : ''}`}
                    onClick={() => handleLanguageChange(lang.code)}
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
          </div>
          
          <div className="mobile-header-actions">
            <Link to="/login" className="header-login" onClick={() => setShowMobileMenu(false)}>
              {translations.signIn}
            </Link>
            <Link to="/register" className="header-signup" onClick={() => setShowMobileMenu(false)}>
              {translations.getStarted}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header; 