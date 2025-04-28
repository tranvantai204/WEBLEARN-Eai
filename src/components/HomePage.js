import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import '../css/components/Home.css';
import Features from './Features';
import Hero from './Hero';

// Translations for each language
const allTranslations = {
    en: {
        selectLanguage: 'Select Language',
        heroBadge: 'Smart Language Learning',
        heroTitle: 'Learn Languages Effectively with AI Technology',
        heroSubtitle: 'Optimize your learning with advanced AI technology. Create smart flashcards, practice effectively, and track your progress easily.',
        startFree: 'Start Free',
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
                description: 'Detailed analysis of your learning progress and suggested improvements'
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
        continueProgress: 'Continue your learning journey',
        recentActivity: 'Your Recent Activity',
        noActivity: 'No recent activity found. Start learning now!',
        flashcardsSummary: 'Flashcards',
        flashcardsDescription: 'Review flashcard sets and continue learning vocabulary',
        readingSummary: 'Reading',
        readingsDescription: 'Enhance your reading comprehension with exercises',
        writingSummary: 'Writing',
        writingsDescription: 'Enhance your written expression through practice',
        viewAll: 'View All',
        continueLearning: 'Continue Learning'
    },
    vi: {
        selectLanguage: 'Select Language',
        heroBadge: 'Smart Language Learning',
        heroTitle: 'Learn Languages Effectively with AI Technology',
        heroSubtitle: 'Optimize your learning with advanced AI technology. Create smart flashcards, practice effectively, and track your progress easily.',
        startFree: 'Start Free',
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
                description: 'Detailed analysis of your learning progress and suggested improvements'
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
        continueProgress: 'Continue your learning journey',
        recentActivity: 'Your Recent Activity',
        noActivity: 'No recent activity found. Start learning now!',
        flashcardsSummary: 'Flashcards',
        flashcardsDescription: 'Review flashcard sets and continue learning vocabulary',
        readingSummary: 'Reading',
        readingsDescription: 'Enhance your reading comprehension with exercises',
        writingSummary: 'Writing',
        writingsDescription: 'Enhance your written expression through practice',
        viewAll: 'View All',
        continueLearning: 'Continue Learning'
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
                        
                        <div className="hero-dashboard-preview">
                            <div className="dashboard-content">
                                <div className="dashboard-header">
                                    <img src="/images/wordwise-logo.svg" alt="WordWise Logo" className="dashboard-logo" />
                                    <h3>WordWise Dashboard</h3>
                                </div>
                                <div className="dashboard-body">
                                    <div className="dashboard-stats">
                                        <div className="stat-box">
                                            <h4>Flashcards</h4>
                                            <div className="stat-number">120</div>
                                        </div>
                                        <div className="stat-box">
                                            <h4>Readings</h4>
                                            <div className="stat-number">24</div>
                                        </div>
                                        <div className="stat-box">
                                            <h4>Writing</h4>
                                            <div className="stat-number">18</div>
                                        </div>
                                    </div>
                                    <div className="dashboard-mascot">
                                        <svg width="120" height="120" viewBox="0 0 120 120" className="mascot-image">
                                            <g transform="translate(10,10)">
                                                {/* Head */}
                                                <circle cx="50" cy="50" r="40" fill="#FF7518" />
                                                
                                                {/* Face */}
                                                <circle cx="50" cy="55" r="32" fill="#ffffff" />
                                                
                                                {/* Eyes */}
                                                <circle cx="38" cy="45" r="8" fill="#333333" />
                                                <circle cx="62" cy="45" r="8" fill="#333333" />
                                                
                                                {/* Eye shine */}
                                                <circle cx="40" cy="42" r="3" fill="#ffffff" />
                                                <circle cx="64" cy="42" r="3" fill="#ffffff" />
                                                
                                                {/* Mouth */}
                                                <path d="M35,65 Q50,80 65,65" stroke="#333333" strokeWidth="3" fill="none" />
                                                
                                                {/* Graduation cap */}
                                                <rect x="25" y="20" width="50" height="8" fill="#333333" />
                                                <rect x="45" y="10" width="10" height="10" fill="#333333" />
                                                <rect x="47" y="5" width="6" height="5" fill="#333333" />
                                                
                                                {/* Tassel */}
                                                <path d="M70,24 Q75,35 68,40" stroke="#4A6CF7" strokeWidth="2" fill="none" />
                                                <circle cx="68" cy="40" r="3" fill="#4A6CF7" />
                                            </g>
                                        </svg>
                                    </div>
                                </div>
                            </div>
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