import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import { forceEnglishLanguage } from '../utils/forceEnglishLanguage';
import ApiKeyModal from './ApiKeyModal';
import { 
    FaGlobeAmericas,
    FaChevronDown,
    FaCheck,
    FaBars,
    FaTimes,
    FaKey
} from 'react-icons/fa';
import {
    FlagVNIcon,
    FlagGBIcon
} from './icons/FlagIcons';

function Header() {
  const { currentLanguage, changeLanguage, translateText } = useLanguage();
  const { isAuthenticated, logout, checkTokenExpiration, checkLocalApiKey } = useAuth();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileLanguageOptions, setShowMobileLanguageOptions] = useState(false);
  const [showDesktopLanguageOptions, setShowDesktopLanguageOptions] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const mobileMenuRef = useRef(null);
  const mobileLangOptionsRef = useRef(null);
  const desktopLangOptionsRef = useRef(null);
  const navigate = useNavigate();
  
  const languages = [
    { code: 'en', name: 'English', icon: FlagGBIcon },
    { code: 'vi', name: 'Vietnamese', icon: FlagVNIcon }
  ];

  const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0];
  
  const [translations, setTranslations] = useState({
    home: 'Home',
    flashcards: 'Flashcards',
    yourFlashcards: 'Your Flashcards',
    exploreFlashcards: 'Explore Flashcards',
    readings: 'Readings',
    yourReadings: 'Your Readings',
    exploreTests: 'Explore Tests',
    writing: 'Writing',
    yourWriting: 'Your Writing',
    exploreWriting: 'Explore Writing',
    writingExercises: 'Writing Exercises',
    discover: 'Discover',
    signIn: 'Sign In',
    getStarted: 'Get Started',
    profile: 'Progress',
    logout: 'Logout',
    explore: 'Explore',
    multipleChoice: 'Multiple Choice Tests',
    enterApiKey: 'Enter API Key'
  });

  // Check token expiration on component mount and when isAuthenticated changes
  useEffect(() => {
    if (isAuthenticated) {
      // Check token validity
      checkTokenExpiration().catch(err => {
        console.error('Token validation error:', err);
        // Token is invalid, will be handled by AuthContext
      });
    }
  }, [isAuthenticated, checkTokenExpiration]);

  // Check for API key in localStorage
  useEffect(() => {
    const checkApiKey = () => {
      const apiKey = checkLocalApiKey();
      setHasApiKey(!!apiKey);
    };
    
    checkApiKey();
    
    // Recheck when localStorage changes
    const handleStorageChange = () => {
      checkApiKey();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [checkLocalApiKey]);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && 
          !event.target.closest('.mobile-menu-btn')) {
        setShowMobileMenu(false);
      }
      
      if (showMobileLanguageOptions && 
          mobileLangOptionsRef.current && 
          !mobileLangOptionsRef.current.contains(event.target) && 
          !event.target.closest('.mobile-lang-btn')) {
        setShowMobileLanguageOptions(false);
      }

      if (showDesktopLanguageOptions && 
          desktopLangOptionsRef.current && 
          !desktopLangOptionsRef.current.contains(event.target) && 
          !event.target.closest('.desktop-lang-btn')) {
        setShowDesktopLanguageOptions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMobileLanguageOptions, showDesktopLanguageOptions]);

  // Update translations when language changes
  const updateTranslations = async () => {
    try {
      const newTranslations = {
        home: await translateText('Home'),
        flashcards: await translateText('Flashcards'),
        yourFlashcards: await translateText('Your Flashcards'),
        exploreFlashcards: await translateText('Explore Flashcards'),
        readings: await translateText('Readings'),
        yourReadings: await translateText('Your Readings'),
        exploreTests: await translateText('Explore Tests'),
        writing: await translateText('Writing'),
        yourWriting: await translateText('Your Writing'),
        exploreWriting: await translateText('Explore Writing'),
        writingExercises: await translateText('Writing Exercises'),
        discover: await translateText('Discover'),
        signIn: await translateText('Sign In'),
        getStarted: await translateText('Get Started'),
        profile: await translateText('Progress'),
        logout: await translateText('Logout'),
        explore: await translateText('Explore'),
        multipleChoice: await translateText('Multiple Choice Tests'),
        enterApiKey: await translateText('Enter API Key')
      };
      setTranslations(newTranslations);
    } catch (error) {
      console.error('Translation error in Header:', error);
    }
  };

  useEffect(() => {
    // Update translations when language changes
    updateTranslations();
  }, [currentLanguage, translateText]);

  const handleLanguageChange = (langCode) => {
    changeLanguage(langCode);
    setShowMobileLanguageOptions(false);
    setShowDesktopLanguageOptions(false);
  };

  const handleLogout = async () => {
    try {
      const success = await logout();
      if (success) {
        setShowMobileMenu(false);
        toast.info('Successfully logged out.', {
          position: "top-right",
          autoClose: 3000
        });
        navigate('/');
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('An error occurred during logout. Please try again later.', {
        position: "top-right",
        autoClose: 5000
      });
    }
  };

  // Get the appropriate routes based on authentication status
  const getFlashcardsRoute = () => isAuthenticated ? "/flashcards" : "/flashcards/explore";
  const getReadingsRoute = () => isAuthenticated ? "/readings" : "/readings/tests/explore";
  const getWritingRoute = () => isAuthenticated ? "/writing" : "/writing/explore";

  // Get the appropriate menu labels based on authentication status
  const getFlashcardsLabel = () => translations.flashcards;
  const getReadingsLabel = () => translations.readings;
  const getWritingLabel = () => translations.writing;

  // Header actions
  const handleOpenApiKeyModal = () => {
    if (!isAuthenticated) {
      toast.error('You need to log in to set an API key');
      return;
    }
    // Hiển thị modal
    console.log('Opening API key modal');
    setShowApiKeyModal(true);
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
        
        {/* Mobile Menu */}
        <div className={`mobile-menu ${showMobileMenu ? 'active' : ''}`} ref={mobileMenuRef}>
          <div className="mobile-menu-header">
            <Link to="/" className="header-logo" onClick={() => setShowMobileMenu(false)}>
              <img src="/images/wordwise-logo.svg" alt="WordWise" className="logo-image" />
              <span className="logo-text">WordWise</span>
            </Link>
            <button 
              className="mobile-menu-close-btn"
              onClick={() => setShowMobileMenu(false)}
              aria-label="Close menu"
            >
              <FaTimes />
            </button>
          </div>
          <ul className="mobile-nav-list">
            <li className="mobile-nav-item">
              <Link to="/" className="mobile-nav-link" onClick={() => setShowMobileMenu(false)}>
                <i className="fas fa-home"></i>
                <span>{translations.home}</span>
              </Link>
            </li>
            <li className="mobile-nav-item">
              <Link to={getFlashcardsRoute()} className="mobile-nav-link" onClick={() => setShowMobileMenu(false)}>
                <i className="fas fa-layer-group"></i>
                <span>{getFlashcardsLabel()}</span>
              </Link>
            </li>
            <li className="mobile-nav-item">
              <Link to={getReadingsRoute()} className="mobile-nav-link" onClick={() => setShowMobileMenu(false)}>
                <i className="fas fa-book"></i>
                <span>{getReadingsLabel()}</span>
              </Link>
            </li>
            <li className="mobile-nav-item">
              <Link to={getWritingRoute()} className="mobile-nav-link" onClick={() => setShowMobileMenu(false)}>
                <i className="fas fa-pen"></i>
                <span>{getWritingLabel()}</span>
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
                  setShowMobileLanguageOptions(!showMobileLanguageOptions);
                }}
              >
                <div className="lang-content">
                  <FaGlobeAmericas className="globe-icon" />
                  <span className="lang-flag">
                    <currentLang.icon />
                  </span>
                  <span className="lang-name">{currentLang.name}</span>
                </div>
                <FaChevronDown className={`arrow-icon ${showMobileLanguageOptions ? 'active' : ''}`} />
              </button>
              
              <div 
                className={`language-options ${showMobileLanguageOptions ? 'active' : ''}`} 
                ref={mobileLangOptionsRef}
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
            {!isAuthenticated ? (
              <>
                <button className="header-api-key" onClick={handleOpenApiKeyModal} title={translations.enterApiKey}>
                  <FaKey />
                </button>
                <Link to="/login" className="header-login" onClick={() => setShowMobileMenu(false)}>
                  {translations.signIn}
                </Link>
                <Link to="/register" className="header-signup" onClick={() => setShowMobileMenu(false)}>
                  {translations.getStarted}
                </Link>
              </>
            ) : (
              <>
                <button className="header-api-key" onClick={handleOpenApiKeyModal} title={translations.enterApiKey}>
                  <FaKey />{hasApiKey ? ' ✓' : ''}
                </button>
                <Link to="/progress" className="header-login" onClick={() => setShowMobileMenu(false)}>
                  {translations.profile}
                </Link>
                <button className="header-signup" onClick={handleLogout}>
                  {translations.logout}
                </button>
              </>
            )}
          </div>
        </div>
        
        {/* Overlay for mobile menu */}
        {showMobileMenu && (
          <div className="mobile-menu-overlay" onClick={() => setShowMobileMenu(false)}></div>
        )}
        
        {/* Desktop Navigation */}
        <div className="desktop-menu">
          <nav className="main-nav">
            <ul className="nav-list">
              <li className="nav-item">
                <Link to="/" className="nav-link">
                  <i className="fas fa-home"></i>
                  <span>{translations.home}</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link to={getFlashcardsRoute()} className="nav-link">
                  <i className="fas fa-layer-group"></i>
                  <span>{getFlashcardsLabel()}</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link to={getReadingsRoute()} className="nav-link">
                  <i className="fas fa-book"></i>
                  <span>{getReadingsLabel()}</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link to={getWritingRoute()} className="nav-link">
                  <i className="fas fa-pen"></i>
                  <span>{getWritingLabel()}</span>
                </Link>
              </li>
              <li className="nav-item language-nav-item">
                <div className="desktop-lang-selector">
                  <button 
                    className="desktop-lang-btn nav-link"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDesktopLanguageOptions(!showDesktopLanguageOptions);
                    }}
                  >
                    <FaGlobeAmericas className="nav-icon" />
                    <span className="current-lang">
                      <currentLang.icon className="current-lang-icon" />
                      <span className="lang-name">{currentLang.name}</span>
                    </span>
                  </button>
                  
                  <div 
                    className={`language-options desktop-language-options ${showDesktopLanguageOptions ? 'active' : ''}`} 
                    ref={desktopLangOptionsRef}
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
              </li>
            </ul>
          </nav>
          
          <div className="header-actions">
            {!isAuthenticated ? (
              <>
                <button className="header-api-key" onClick={handleOpenApiKeyModal} title={translations.enterApiKey}>
                  <FaKey />
                </button>
                <Link to="/login" className="header-login">
                  {translations.signIn}
                </Link>
                <Link to="/register" className="header-signup">
                  {translations.getStarted}
                </Link>
              </>
            ) : (
              <>
                <button className="header-api-key" onClick={handleOpenApiKeyModal} title={translations.enterApiKey}>
                  <FaKey />{hasApiKey ? ' ✓' : ''}
                </button>
                <Link to="/progress" className="header-login">
                  {translations.profile}
                </Link>
                <button className="header-signup" onClick={handleLogout}>
                  {translations.logout}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* API Key Modal */}
      {showApiKeyModal && (
        <ApiKeyModal 
          isOpen={showApiKeyModal} 
          onClose={() => {
            console.log('Closing API key modal');
            setShowApiKeyModal(false);
            // Check if API key was added
            const apiKey = checkLocalApiKey();
            setHasApiKey(!!apiKey);
          }} 
        />
      )}
    </header>
  );
}

export default Header; 