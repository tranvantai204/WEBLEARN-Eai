import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
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
        register: 'Register for Free',
        // Logged in user translations
        welcomeBack: 'Welcome Back!',
        continueProgress: 'Continue your learning progress',
        recentActivity: 'Your Recent Activity',
        noActivity: 'No recent activity found. Start learning now!',
        flashcardsSummary: 'Flashcards',
        flashcardsDescription: 'Review your flashcard sets and continue learning vocabulary',
        readingSummary: 'Readings',
        readingsDescription: 'Improve your comprehension with reading exercises',
        writingSummary: 'Writing',
        writingsDescription: 'Enhance your written expression through practice',
        viewAll: 'View All',
        continueLearning: 'Continue Learning'
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
        register: 'Đăng Ký Miễn Phí',
        // Logged in user translations
        welcomeBack: 'Chào Mừng Trở Lại!',
        continueProgress: 'Tiếp tục quá trình học tập của bạn',
        recentActivity: 'Hoạt Động Gần Đây Của Bạn',
        noActivity: 'Không tìm thấy hoạt động gần đây. Bắt đầu học ngay!',
        flashcardsSummary: 'Thẻ Ghi Nhớ',
        flashcardsDescription: 'Xem lại bộ thẻ ghi nhớ và tiếp tục học từ vựng',
        readingSummary: 'Bài Đọc',
        readingsDescription: 'Cải thiện khả năng đọc hiểu với các bài tập đọc',
        writingSummary: 'Viết',
        writingsDescription: 'Nâng cao kỹ năng viết thông qua luyện tập',
        viewAll: 'Xem Tất Cả',
        continueLearning: 'Tiếp Tục Học'
    }
    // Other languages can be added here as needed
};

function HomePage() {
    const { currentLanguage } = useLanguage();
    const { isAuthenticated } = useAuth();
    
    // Get translations for current language or fallback to English
    const translations = allTranslations[currentLanguage] || allTranslations.en;

    // Render different content based on authentication status
    const renderAuthenticatedContent = () => {
        return (
            <div className="home-container authenticated">
                <section className="welcome-section">
                    <div className="welcome-content">
                        <div className="welcome-badge">
                            <i className="fas fa-star"></i>
                            <span>{translations.welcomeBack}</span>
                        </div>
                        
                        <h1 className="welcome-title">
                            {translations.continueProgress}
                        </h1>
                        
                        <div className="learning-paths">
                            {/* Flashcards Summary */}
                            <div className="learning-path-card">
                                <div className="path-icon">
                                    <i className="fas fa-layer-group"></i>
                                </div>
                                <div className="path-content">
                                    <h3 className="path-title">{translations.flashcardsSummary}</h3>
                                    <p className="path-description">{translations.flashcardsDescription}</p>
                                    <div className="path-actions">
                                        <Link to="/flashcards" className="btn-primary">
                                            {translations.viewAll}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Readings Summary */}
                            <div className="learning-path-card">
                                <div className="path-icon">
                                    <i className="fas fa-book"></i>
                                </div>
                                <div className="path-content">
                                    <h3 className="path-title">{translations.readingSummary}</h3>
                                    <p className="path-description">{translations.readingsDescription}</p>
                                    <div className="path-actions">
                                        <Link to="/readings" className="btn-primary">
                                            {translations.viewAll}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Writings Summary */}
                            <div className="learning-path-card">
                                <div className="path-icon">
                                    <i className="fas fa-pen"></i>
                                </div>
                                <div className="path-content">
                                    <h3 className="path-title">{translations.writingSummary}</h3>
                                    <p className="path-description">{translations.writingsDescription}</p>
                                    <div className="path-actions">
                                        <Link to="/writing" className="btn-primary">
                                            {translations.viewAll}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="features-section">
                    <div className="section-header">
                        <h2 className="section-title">{translations.recentActivity}</h2>
                        <p className="section-subtitle">
                            {translations.noActivity}
                        </p>
                    </div>

                    <div className="feature-cards-container">
                        <div className="feature-card">
                            <div className="feature-icon-wrapper">
                                <div className="feature-icon">
                                    <i className="fas fa-brain"></i>
                                </div>
                            </div>
                            <h3 className="feature-title">{translations.features[0].title}</h3>
                            <p className="feature-description">{translations.features[0].description}</p>
                        </div>
                        
                        <div className="feature-card">
                            <div className="feature-icon-wrapper">
                                <div className="feature-icon">
                                    <i className="fas fa-chart-line"></i>
                                </div>
                            </div>
                            <h3 className="feature-title">{translations.features[1].title}</h3>
                            <p className="feature-description">{translations.features[1].description}</p>
                        </div>
                        
                        <div className="feature-card">
                            <div className="feature-icon-wrapper">
                                <div className="feature-icon">
                                    <i className="fas fa-sync"></i>
                                </div>
                            </div>
                            <h3 className="feature-title">{translations.features[2].title}</h3>
                            <p className="feature-description">{translations.features[2].description}</p>
                        </div>
                    </div>
                </section>

                <section className="cta-section">
                    <h2 className="cta-title">{translations.continueProgress}</h2>
                    <Link to="/progress" className="btn-primary">
                        {translations.continueLearning}
                    </Link>
                </section>
            </div>
        );
    };

    // Render content for non-authenticated users
    const renderNonAuthenticatedContent = () => {
        return (
            <div className="home-container">
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
                                {translations.register}
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

                    <div className="feature-cards-container">
                        <div className="feature-card">
                            <div className="feature-icon-wrapper">
                                <div className="feature-icon">
                                    <i className="fas fa-brain"></i>
                                </div>
                            </div>
                            <h3 className="feature-title">{translations.features[0].title}</h3>
                            <p className="feature-description">{translations.features[0].description}</p>
                        </div>
                        
                        <div className="feature-card">
                            <div className="feature-icon-wrapper">
                                <div className="feature-icon">
                                    <i className="fas fa-chart-line"></i>
                                </div>
                            </div>
                            <h3 className="feature-title">{translations.features[1].title}</h3>
                            <p className="feature-description">{translations.features[1].description}</p>
                        </div>
                        
                        <div className="feature-card">
                            <div className="feature-icon-wrapper">
                                <div className="feature-icon">
                                    <i className="fas fa-sync"></i>
                                </div>
                            </div>
                            <h3 className="feature-title">{translations.features[2].title}</h3>
                            <p className="feature-description">{translations.features[2].description}</p>
                        </div>
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
    };

    return isAuthenticated ? renderAuthenticatedContent() : renderNonAuthenticatedContent();
}

export default HomePage; 