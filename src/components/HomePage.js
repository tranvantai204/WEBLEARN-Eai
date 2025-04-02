import React, { useState, useRef, useEffect } from 'react';
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
} from '../components/icons/FlagIcons';
import '../css/components/Home.css';

// Predefined translations instead of dynamic translation to improve performance
const allTranslations = {
    en: {
        selectLanguage: 'Select Language',
        heroBadge: 'Smart Language Learning',
        heroTitle: 'Learn Languages Effectively with AI Technology',
        heroSubtitle: 'Optimize your learning with advanced AI technology. Create smart flashcards, practice effectively, and track progress easily.',
        startFree: 'Start for Free',
        learnMore: 'Learn More',
        featuresTitle: 'Key Features',
        featuresSubtitle: 'Discover powerful tools that make language learning easier and more effective',
        features: [
            {
                title: 'Smart AI',
                description: 'Automatically generate flashcards and exercises tailored to your level'
            },
            {
                title: 'Progress Tracking',
                description: 'Detailed analysis of your learning progress and improvement suggestions'
            },
            {
                title: 'Smart Review',
                description: 'Spaced repetition system helps you remember vocabulary longer'
            }
        ],
        ctaTitle: 'Ready to Start?',
        ctaSubtitle: 'Join millions of learners using WordWise',
        register: 'Register for Free'
    },
    vi: {
        selectLanguage: 'Chọn Ngôn Ngữ',
        heroBadge: 'Học Ngôn Ngữ Thông Minh',
        heroTitle: 'Học Ngôn Ngữ Hiệu Quả với Công Nghệ AI',
        heroSubtitle: 'Tối ưu hóa việc học của bạn với công nghệ AI tiên tiến. Tạo thẻ ghi nhớ thông minh, luyện tập hiệu quả và theo dõi tiến trình dễ dàng.',
        startFree: 'Bắt Đầu Miễn Phí',
        learnMore: 'Tìm Hiểu Thêm',
        featuresTitle: 'Tính Năng Chính',
        featuresSubtitle: 'Khám phá các công cụ mạnh mẽ giúp việc học ngôn ngữ dễ dàng và hiệu quả hơn',
        features: [
            {
                title: 'AI Thông Minh',
                description: 'Tự động tạo thẻ ghi nhớ và bài tập phù hợp với trình độ của bạn'
            },
            {
                title: 'Theo Dõi Tiến Trình',
                description: 'Phân tích chi tiết tiến trình học tập và đề xuất cải thiện'
            },
            {
                title: 'Ôn Tập Thông Minh',
                description: 'Hệ thống lặp lại ngắt quãng giúp bạn nhớ từ vựng lâu hơn'
            }
        ],
        ctaTitle: 'Sẵn Sàng Bắt Đầu?',
        ctaSubtitle: 'Tham gia cùng hàng triệu người học đang sử dụng WordWise',
        register: 'Đăng Ký Miễn Phí'
    }
    // Other languages can be added here as needed
};

function HomePage() {
    const { currentLanguage, changeLanguage } = useLanguage();
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

    const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0];
    
    // Get translations for current language or fallback to English
    const translations = allTranslations[currentLanguage] || allTranslations.en;

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

    return (
        <div className="home-container">
            <div className="language-selector" ref={languageMenuRef}>
                <button 
                    className="lang-btn-main"
                    onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                >
                    <span className="lang-flag">
                        {currentLang ? <currentLang.icon /> : <FlagGBIcon />}
                    </span>
                    <span className="lang-name">{currentLang ? currentLang.name : 'English'}</span>
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
            
            <section className="hero-section">
                <div className="hero-content">
                    <div className="hero-badge">
                        <i className="fas fa-star"></i>
                        <span>{translations.heroBadge}</span>
                    </div>
                    
                    <h1 className="hero-title">
                        {translations.heroTitle}
                    </h1>
                    
                    <p className="hero-subtitle">
                        {translations.heroSubtitle}
                    </p>
                    
                    <div className="hero-cta">
                        <Link to="/register" className="btn-primary">
                            {translations.startFree}
                        </Link>
                        <Link to="/how-it-works" className="btn-secondary">
                            {translations.learnMore}
                        </Link>
                    </div>
                    
                    <div className="hero-image">
                        <img 
                            src="/images/dashboard-preview.png" 
                            alt="WordWise Dashboard" 
                            loading="lazy" 
                            width="600" 
                            height="400" 
                        />
                    </div>
                </div>
            </section>

            <section className="features-section">
                <div className="section-header">
                    <h2 className="section-title">{translations.featuresTitle}</h2>
                    <p className="section-subtitle">
                        {translations.featuresSubtitle}
                    </p>
                </div>

                <div className="features-grid">
                    {translations.features.map((feature, index) => (
                        <div className="feature-card" key={index}>
                            <div className="feature-icon">
                                <i className={`fas ${index === 0 ? 'fa-brain' : index === 1 ? 'fa-chart-line' : 'fa-sync'}`}></i>
                            </div>
                            <h3 className="feature-title">{feature.title}</h3>
                            <p className="feature-description">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="cta-section">
                <h2 className="cta-title">{translations.ctaTitle}</h2>
                <p className="cta-subtitle">
                    {translations.ctaSubtitle}
                </p>
                <Link to="/register" className="btn-primary">
                    {translations.register}
                </Link>
            </section>
        </div>
    );
}

export default HomePage; 