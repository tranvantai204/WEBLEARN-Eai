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
        continueLearning: 'Continue Learning',
        discover: 'Discover More'
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
        continueLearning: 'Continue Learning',
        discover: 'Discover More'
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

                <Features 
                    title={translations.recentActivity}
                    subtitle={translations.noActivity}
                    features={[
                        {
                            icon: "fas fa-brain",
                            title: translations.features[0].title,
                            description: translations.features[0].description
                        },
                        {
                            icon: "fas fa-chart-line",
                            title: translations.features[1].title,
                            description: translations.features[1].description
                        },
                        {
                            icon: "fas fa-sync",
                            title: translations.features[2].title,
                            description: translations.features[2].description
                        }
                    ]}
                />
                
                <section className="bottom-section">
                    <h2 className="bottom-title">{translations.continueLearning}</h2>
                    <p className="bottom-description">
                        {translations.noActivity}
                    </p>
                    <Link to="/discover" className="bottom-button">
                        {translations.discover}
                    </Link>
                </section>
            </div>
        );
    };

    // Render content for non-authenticated users
    const renderNonAuthenticatedContent = () => {
        return (
            <div className="home-container">
                {/* Hero Section */}
                <section className="hero-wrapper">
                    <Hero 
                        badgeText={translations.heroBadge}
                        title={translations.heroTitle}
                        subtitle={translations.heroSubtitle}
                        primaryButtonText={translations.startFree}
                        primaryButtonLink="/register"
                        secondaryButtonText={translations.learnMore}
                        secondaryButtonLink="/how-it-works"
                    />
                </section>
                
                {/* Animated Stats Banner - Moved to its own section for better spacing */}
                <section className="stats-section">
                    <div className="stats-banner">
                        <div className="stat-item">
                            <div className="stat-number-large">200+</div>
                            <div className="stat-label">Lessons</div>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-item">
                            <div className="stat-number-large">10k+</div>
                            <div className="stat-label">Students</div>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-item">
                            <div className="stat-number-large">98%</div>
                            <div className="stat-label">Satisfaction</div>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-item">
                            <div className="stat-number-large">24/7</div>
                            <div className="stat-label">Support</div>
                        </div>
                    </div>
                </section>
                
                {/* Visual Feature Showcase - Moved up for better visual flow */}
                <section className="visual-features">
                    <div className="visual-feature-container">
                        <div className="visual-feature-content">
                            <div className="visual-feature-badge">
                                <i className="fas fa-bolt"></i>
                                <span>AI-Powered</span>
                            </div>
                            <h2 className="visual-feature-title">Learn <span className="highlight">smartly</span> with AI technology</h2>
                            <p className="visual-feature-description">
                                Our AI system analyzes how you learn and automatically adjusts to optimize your learning process, helping you memorize vocabulary more effectively and progress quickly.
                            </p>
                            <ul className="visual-feature-list">
                                <li><i className="fas fa-check"></i> Automatically create smart flashcards</li>
                                <li><i className="fas fa-check"></i> Adjust difficulty level to match your proficiency</li>
                                <li><i className="fas fa-check"></i> Suggest lessons based on your progress</li>
                            </ul>
                        </div>
                        <div className="visual-feature-image">
                            <div className="feature-image-container">
                                <div className="feature-image-decoration"></div>
                                <div className="feature-image-placeholder">
                                    <div className="ai-illustration">
                                        <div className="brain-icon">
                                            <i className="fas fa-brain"></i>
                                        </div>
                                        <div className="graph-lines">
                                            <div className="graph-line"></div>
                                            <div className="graph-line"></div>
                                            <div className="graph-line"></div>
                                        </div>
                                        <div className="card-stack">
                                            <div className="card-item"></div>
                                            <div className="card-item"></div>
                                            <div className="card-item"></div>
                                        </div>
                                        <div className="person-learning">
                                            <i className="fas fa-user-graduate"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                
                {/* Features Section */}
                <Features 
                    title={translations.featuresTitle}
                    subtitle={translations.featuresSubtitle}
                    features={[
                        {
                            icon: "fas fa-brain",
                            title: translations.features[0].title,
                            description: translations.features[0].description
                        },
                        {
                            icon: "fas fa-chart-line",
                            title: translations.features[1].title,
                            description: translations.features[1].description
                        },
                        {
                            icon: "fas fa-sync",
                            title: translations.features[2].title,
                            description: translations.features[2].description
                        }
                    ]}
                />
                
                {/* Testimonials Section */}
                <section className="testimonials-section">
                    <h2 className="testimonials-title">What users say about WordWise?</h2>
                    <div className="testimonials-container">
                        <div className="testimonial-card">
                            <div className="testimonial-rating">
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                            </div>
                            <p className="testimonial-text">
                                "WordWise has completely changed the way I learn foreign languages. The smart flashcard system helps me memorize vocabulary much more effectively."
                            </p>
                            <div className="testimonial-author">
                                <div className="testimonial-avatar">
                                    <i className="fas fa-user-circle"></i>
                                </div>
                                <div className="testimonial-info">
                                    <h4 className="testimonial-name">John Smith</h4>
                                    <p className="testimonial-role">Student</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="testimonial-card">
                            <div className="testimonial-rating">
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                            </div>
                            <p className="testimonial-text">
                                "The reading and writing exercises with instant AI feedback have helped me progress quickly. The interface is easy to use and I can learn anytime, anywhere."
                            </p>
                            <div className="testimonial-author">
                                <div className="testimonial-avatar">
                                    <i className="fas fa-user-circle"></i>
                                </div>
                                <div className="testimonial-info">
                                    <h4 className="testimonial-name">Mary Johnson</h4>
                                    <p className="testimonial-role">Teacher</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="testimonial-card">
                            <div className="testimonial-rating">
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star-half-alt"></i>
                            </div>
                            <p className="testimonial-text">
                                "The progress tracking system helps me maintain motivation. I've achieved my English learning goals faster than expected."
                            </p>
                            <div className="testimonial-author">
                                <div className="testimonial-avatar">
                                    <i className="fas fa-user-circle"></i>
                                </div>
                                <div className="testimonial-info">
                                    <h4 className="testimonial-name">Robert Lee</h4>
                                    <p className="testimonial-role">Student</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                
                {/* Partners Section - Moved up before CTA for better flow */}
                <section className="partners-section">
                    <h3 className="partners-title">Our Partners</h3>
                    <div className="partners-container">
                        <div className="partner-logo"><i className="fas fa-building"></i> Company A</div>
                        <div className="partner-logo"><i className="fas fa-university"></i> University B</div>
                        <div className="partner-logo"><i className="fas fa-globe"></i> Organization C</div>
                        <div className="partner-logo"><i className="fas fa-school"></i> School D</div>
                        <div className="partner-logo"><i className="fas fa-landmark"></i> Research Institute E</div>
                    </div>
                </section>
                
                {/* CTA Section - Moved to end as final call to action */}
                <section className="cta-section mobile-container">
                    <div className="cta-content">
                        <i className="fas fa-graduation-cap cta-decoration top-left"></i>
                        <h2 className="cta-title">{translations.ctaTitle}</h2>
                        <p className="cta-subtitle">{translations.ctaSubtitle}</p>
                        <Link 
                            to="/register" 
                            className="cta-button mobile-touch-target"
                            aria-label="Register for free"
                        >
                            {translations.register}
                        </Link>
                        
                        <div className="cta-users">
                            <div className="cta-users-avatars">
                                <div className="cta-user-avatar">
                                    <i className="fas fa-user"></i>
                                </div>
                                <div className="cta-user-avatar">
                                    <i className="fas fa-user"></i>
                                </div>
                                <div className="cta-user-avatar">
                                    <i className="fas fa-user"></i>
                                </div>
                                <div className="cta-user-avatar">
                                    <i className="fas fa-user"></i>
                                </div>
                                <div className="cta-user-avatar">
                                    <i className="fas fa-user-plus"></i>
                                </div>
                            </div>
                            <span className="cta-users-count">+2,500 people registered this month</span>
                        </div>
                        <i className="fas fa-book cta-decoration bottom-right"></i>
                    </div>
                    
                    <div className="cta-badges">
                        <div className="cta-badge-item">
                            <i className="fas fa-star"></i>
                            <span className="cta-badge-text">Effective Learning</span>
                        </div>
                        <div className="cta-badge-item">
                            <i className="fas fa-shield-alt"></i>
                            <span className="cta-badge-text">Safe & Secure</span>
                        </div>
                        <div className="cta-badge-item">
                            <i className="fas fa-bolt"></i>
                            <span className="cta-badge-text">Accelerate Learning</span>
                        </div>
                    </div>
                </section>
            </div>
        );
    };

    return isAuthenticated ? renderAuthenticatedContent() : renderNonAuthenticatedContent();
}

export default HomePage; 