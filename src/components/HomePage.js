import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useFlashcard } from '../contexts/FlashcardContext';
import '../css/components/Home.css';
import '../css/components/EnhancedFlashcards.css';
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
        discover: 'Discover More',
        // Additional translations for non-authenticated home page
        aiPowered: 'AI-Powered',
        learnSmartly: 'Learn smartly with AI technology',
        aiDescription: 'Our AI system analyzes how you learn and automatically adjusts to optimize your learning process, helping you memorize vocabulary more effectively and progress quickly.',
        autocreateFlashcards: 'Automatically create smart flashcards',
        adjustDifficulty: 'Adjust difficulty level to match your proficiency',
        suggestLessons: 'Suggest lessons based on your progress',
        testimonials: 'What users say about WordWise?',
        partners: 'Our Partners',
        companyA: 'Company A',
        universityB: 'University B',
        organizationC: 'Organization C',
        schoolD: 'School D',
        researchInstituteE: 'Research Institute E',
        registeredThisMonth: '+2,500 people registered this month',
        effectiveLearning: 'Effective Learning',
        safeSecure: 'Safe & Secure',
        accelerateLearning: 'Accelerate Learning',
        lessons: 'Lessons',
        students: 'Students',
        satisfaction: 'Satisfaction',
        support: 'Support',
        // Testimonials
        testimonial1: {
            text: "WordWise has completely changed the way I learn foreign languages. The smart flashcard system helps me memorize vocabulary much more effectively.",
            author: "John Smith",
            role: "Student"
        },
        testimonial2: {
            text: "The reading and writing exercises with instant AI feedback have helped me progress quickly. The interface is easy to use and I can learn anytime, anywhere.",
            author: "Mary Johnson",
            role: "Teacher"
        },
        testimonial3: {
            text: "The progress tracking system helps me maintain motivation. I've achieved my English learning goals faster than expected.",
            author: "Robert Lee",
            role: "Student"
        },
        // Master Languages section
        masterLanguages: 'Master Languages with',
        smartFlashcards: 'Smart Flashcards',
        transformJourney: 'Transform your language learning journey with AI-powered flashcards, personalized study plans, and interactive exercises. Start learning smarter, not harder.',
        startFreeTrial: 'Start Free Trial',
        exploreFeatures: 'Explore Features',
        activeUsers: 'Active Users',
        flashcardsCreated: 'Flashcards Created',
        successRate: 'Success Rate'
    },
    vi: {
        selectLanguage: 'Chọn Ngôn Ngữ',
        heroBadge: 'Học Ngôn Ngữ Thông Minh',
        heroTitle: 'Học Ngôn Ngữ Hiệu Quả với Công Nghệ AI',
        heroSubtitle: 'Tối ưu hóa việc học của bạn với công nghệ AI tiên tiến. Tạo thẻ ghi nhớ thông minh, luyện tập hiệu quả và theo dõi tiến độ dễ dàng.',
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
                title: 'Theo Dõi Tiến Độ',
                description: 'Phân tích chi tiết về tiến trình học và đề xuất cải thiện'
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
        continueProgress: 'Tiếp tục hành trình học tập của bạn',
        recentActivity: 'Hoạt Động Gần Đây Của Bạn',
        noActivity: 'Không tìm thấy hoạt động gần đây. Bắt đầu học ngay!',
        flashcardsSummary: 'Thẻ Ghi Nhớ',
        flashcardsDescription: 'Xem lại bộ thẻ ghi nhớ và tiếp tục học từ vựng',
        readingSummary: 'Đọc Hiểu',
        readingsDescription: 'Nâng cao khả năng đọc hiểu với các bài tập',
        writingSummary: 'Viết',
        writingsDescription: 'Nâng cao khả năng diễn đạt bằng văn bản thông qua thực hành',
        viewAll: 'Xem Tất Cả',
        continueLearning: 'Tiếp Tục Học',
        discover: 'Khám Phá Thêm',
        // Additional translations for non-authenticated home page
        aiPowered: 'Công Nghệ AI',
        learnSmartly: 'Học thông minh với công nghệ AI',
        aiDescription: 'Hệ thống AI của chúng tôi phân tích cách bạn học và tự động điều chỉnh để tối ưu hóa quá trình học tập, giúp bạn ghi nhớ từ vựng hiệu quả hơn và tiến bộ nhanh chóng.',
        autocreateFlashcards: 'Tự động tạo thẻ ghi nhớ thông minh',
        adjustDifficulty: 'Điều chỉnh mức độ khó phù hợp với khả năng của bạn',
        suggestLessons: 'Đề xuất bài học dựa trên tiến độ của bạn',
        testimonials: 'Người dùng nói gì về WordWise?',
        partners: 'Đối Tác Của Chúng Tôi',
        companyA: 'Công ty A',
        universityB: 'Đại học B',
        organizationC: 'Tổ chức C',
        schoolD: 'Trường học D',
        researchInstituteE: 'Viện Nghiên cứu E',
        registeredThisMonth: '+2,500 người đã đăng ký tháng này',
        effectiveLearning: 'Học Tập Hiệu Quả',
        safeSecure: 'An Toàn & Bảo Mật',
        accelerateLearning: 'Đẩy Nhanh Việc Học',
        lessons: 'Bài học',
        students: 'Học viên',
        satisfaction: 'Độ hài lòng',
        support: 'Hỗ trợ',
        // Testimonials
        testimonial1: {
            text: "WordWise đã hoàn toàn thay đổi cách tôi học ngoại ngữ. Hệ thống thẻ ghi nhớ thông minh giúp tôi ghi nhớ từ vựng hiệu quả hơn nhiều.",
            author: "John Smith",
            role: "Học sinh"
        },
        testimonial2: {
            text: "Các bài tập đọc và viết với phản hồi tức thì từ AI đã giúp tôi tiến bộ nhanh chóng. Giao diện dễ sử dụng và tôi có thể học bất cứ lúc nào, bất cứ nơi đâu.",
            author: "Mary Johnson",
            role: "Giáo viên"
        },
        testimonial3: {
            text: "Hệ thống theo dõi tiến độ giúp tôi duy trì động lực. Tôi đã đạt được mục tiêu học tiếng Anh nhanh hơn dự kiến.",
            author: "Robert Lee",
            role: "Học sinh"
        },
        // Master Languages section
        masterLanguages: 'Làm Chủ Ngôn Ngữ với',
        smartFlashcards: 'Thẻ Ghi Nhớ Thông Minh',
        transformJourney: 'Biến đổi hành trình học ngôn ngữ của bạn với thẻ ghi nhớ được hỗ trợ bởi AI, kế hoạch học tập cá nhân hóa và bài tập tương tác. Bắt đầu học thông minh hơn, không phải khó khăn hơn.',
        startFreeTrial: 'Dùng Thử Miễn Phí',
        exploreFeatures: 'Khám Phá Tính Năng',
        activeUsers: 'Người Dùng Đang Hoạt Động',
        flashcardsCreated: 'Thẻ Ghi Nhớ Đã Tạo',
        successRate: 'Tỷ Lệ Thành Công'
    }
    // Other languages can be added here as needed
};

function    scrollToSection() {
    const section = document.getElementById('visualFeatures');
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

function HomePage() {
    const { currentLanguage } = useLanguage();
    const { isAuthenticated } = useAuth();
    const { exploreFlashcardSets } = useFlashcard();
    
    const [featuredSets, setFeaturedSets] = useState([]);
    const [loading, setLoading] = useState(true);
    const { translateText } = useLanguage();
    
    // Get translations for current language or fallback to English
    const translations = allTranslations[currentLanguage] || allTranslations.en;

    // Fetch featured flashcard sets on component mount
    useEffect(() => {
        const fetchFeaturedSets = async () => {
            try {
                setLoading(true);
                // Using the existing explore function to get popular sets 
                const result = await exploreFlashcardSets({
                    page: 1,
                    itemPerPage: 4,
                    // You can add filters here if needed
                });
                
                if (result && result.flashcardSets) {
                    setFeaturedSets(result.flashcardSets);
                } else {
                    // Fallback to default sets if API call fails
                    setFeaturedSets([
                        {
                            flashcardSetId: '99d0dfac-3a96-4eaf-99cd-08dd7b155952',
                            title: 'English - Basic Vocabulary',
                            description: 'Essential vocabulary for beginner English learners focusing on everyday language.',
                            totalVocabulary: 50,
                            learningLanguage: 'ENG',
                            nativeLanguage: 'VIE',
                            level: 1,
                            learnerCount: 238,
                            badge: 'Popular'
                        },
                        {
                            flashcardSetId: '85c4e174-2f2d-4073-99ce-08dd7b155952',
                            title: 'Mobile Games Vocabulary',
                            description: 'Learn common terms used in mobile gaming and technology in Vietnamese.',
                            totalVocabulary: 46,
                            learningLanguage: 'VN',
                            nativeLanguage: 'AO',
                            level: 3,
                            learnerCount: 140,
                            badge: 'Trending'
                        },
                        {
                            flashcardSetId: '73a6f7bc-d4f9-4ce7-99cf-08dd7b155952',
                            title: 'Kitchen & Household',
                            description: 'Learn vocabulary related to household items and kitchen utensils.',
                            totalVocabulary: 50,
                            learningLanguage: 'ENG',
                            nativeLanguage: 'VIE',
                            level: 3,
                            learnerCount: 30,
                            badge: 'New'
                        },
                        {
                            flashcardSetId: '67d4c822-0c5d-4fa3-99d0-08dd7b155952',
                            title: 'Family Members',
                            description: 'Learn vocabulary related to family relationships and kinship terms.',
                            totalVocabulary: 50,
                            learningLanguage: 'ENG',
                            nativeLanguage: 'VIE',
                            level: 2,
                            learnerCount: 125,
                            badge: 'Popular'
                        }
                    ]);
                }
            } catch (error) {
                console.error('Failed to fetch featured flashcard sets', error);
                // Use fallback data if fetch fails
                setFeaturedSets([
                    {
                        flashcardSetId: '99d0dfac-3a96-4eaf-99cd-08dd7b155952',
                        title: 'English - Basic Vocabulary',
                        description: 'Essential vocabulary for beginner English learners focusing on everyday language.',
                        totalVocabulary: 50,
                        learningLanguage: 'ENG',
                        nativeLanguage: 'VIE',
                        level: 1,
                        learnerCount: 238,
                        badge: 'Popular'
                    },
                    {
                        flashcardSetId: '85c4e174-2f2d-4073-99ce-08dd7b155952',
                        title: 'Mobile Games Vocabulary',
                        description: 'Learn common terms used in mobile gaming and technology in Vietnamese.',
                        totalVocabulary: 46,
                        learningLanguage: 'VN',
                        nativeLanguage: 'AO',
                        level: 3,
                        learnerCount: 140,
                        badge: 'Trending'
                    },
                    {
                        flashcardSetId: '73a6f7bc-d4f9-4ce7-99cf-08dd7b155952',
                        title: 'Kitchen & Household',
                        description: 'Learn vocabulary related to household items and kitchen utensils.',
                        totalVocabulary: 50,
                        learningLanguage: 'ENG',
                        nativeLanguage: 'VIE',
                        level: 3,
                        learnerCount: 30,
                        badge: 'New'
                    },
                    {
                        flashcardSetId: '67d4c822-0c5d-4fa3-99d0-08dd7b155952',
                        title: 'Family Members',
                        description: 'Learn vocabulary related to family relationships and kinship terms.',
                        totalVocabulary: 50,
                        learningLanguage: 'ENG',
                        nativeLanguage: 'VIE',
                        level: 2,
                        learnerCount: 125,
                        badge: 'Popular'
                    }
                ]);
            } finally {
                setLoading(false);
            }
        };
        
        fetchFeaturedSets();
    }, [exploreFlashcardSets]);

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

                {/* Featured Flashcards Section - Dynamic */}
                <section className="featured-flashcards">
                    <div className="featured-flashcards-header">
                        <h2>Featured Flashcards</h2>
                        <Link to="/flashcards" className="btn-primary">
                            {translations.viewAll}
                        </Link>
                    </div>
                    <div className="featured-cards-grid">
                        {loading ? (
                            <div className="loading-indicator">Loading flashcard sets...</div>
                        ) : (
                            featuredSets.map((set, index) => (
                                <div className="featured-card" key={set.flashcardSetId || index}>
                                    <div className="featured-badge">{set.badge || 'Featured'}</div>
                                    <h3 className="set-title">{set.title}</h3>
                                    <p className="set-description">{set.description}</p>
                                    <div className="set-stats">
                                        <span>{set.totalVocabulary || 0} cards</span>
                                        <span className="set-language">{set.learningLanguage} → {set.nativeLanguage}</span>
                                        <span className="set-level">Level: {set.level || 'N/A'}</span>
                                        <span className="set-learner-count">Learners: {set.learnerCount || 0}</span>
                                    </div>
                                    <Link to={`/flashcard-set/${set.flashcardSetId}`} className="study-now-btn">
                                        <i className="fas fa-graduation-cap"></i> Study Now
                                    </Link>
                                </div>
                            ))
                        )}
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
                    <Link to="/progress" className="bottom-button">
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
                <section className="hero-wrapper pb-3">
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
                <section className="stats-section d-flex" id="visualFeatures">
                    <div className="stats-banner">
                        <div className="stat-item">
                            <div className="stat-number-large">200+</div>
                            <div className="stat-label">{translations.lessons}</div>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-item">
                            <div className="stat-number-large">10k+</div>
                            <div className="stat-label">{translations.students}</div>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-item">
                            <div className="stat-number-large">98%</div>
                            <div className="stat-label">{translations.satisfaction}</div>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-item">
                            <div className="stat-number-large">24/7</div>
                            <div className="stat-label">{translations.support}</div>
                        </div>
                    </div>
                </section>
                
                {/* Visual Feature Showcase - Moved up for better visual flow */}
                <section className="visual-features">
                    <div className="visual-feature-container">
                        <div className="visual-feature-content">
                            <div className="visual-feature-badge">
                                <i className="fas fa-bolt"></i>
                                <span>{translations.aiPowered}</span>
                            </div>
                            <h2 className="visual-feature-title">{translations.learnSmartly}</h2>
                            <p className="visual-feature-description">
                                {translations.aiDescription}
                            </p>
                            <ul className="visual-feature-list">
                                <li><i className="fas fa-check"></i> {translations.autocreateFlashcards}</li>
                                <li><i className="fas fa-check"></i> {translations.adjustDifficulty}</li>
                                <li><i className="fas fa-check"></i> {translations.suggestLessons}</li>
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
                
                {/* Featured Flashcards Section for public users - Dynamic */}
                <section className="featured-flashcards">
                    <div className="featured-flashcards-header">
                        <h2>{translateText('Popular Flashcard Sets')}</h2>
                        <Link to="/explore" className="btn-primary">
                            {translateText('Explore All')}
                        </Link>
                    </div>
                    <div className="featured-cards-grid">
                        {loading ? (
                            <div className="loading-indicator">Loading flashcard sets...</div>
                        ) : (
                            featuredSets.map((set, index) => (
                                <div className="featured-card" key={set.flashcardSetId || index}>
                                    <div className="featured-badge">{set.badge || translateText('Featured')}</div>
                                    <h3 className="set-title">{set.title}</h3>
                                    <p className="set-description">{set.description}</p>
                                    <div className="set-stats">
                                        <span>{set.totalVocabulary || 0} cards</span>
                                        <span className="set-language">{set.learningLanguage} → {set.nativeLanguage}</span>
                                        <span className="set-level">Level: {set.level || 'N/A'}</span>
                                        <span className="set-learner-count">Learners: {set.learnerCount || 0}</span>
                                    </div>
                                    <Link to={`/register?redirect=/flashcard-set/${set.flashcardSetId}`} className="study-now-btn">
                                        <i className="fas fa-user-plus"></i> {translateText('Sign Up to Study')}
                                    </Link>
                                </div>
                            ))
                        )}
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
                    <h2 className="testimonials-title">{translations.testimonials}</h2>
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
                                {translations.testimonial1.text}
                            </p>
                            <div className="testimonial-author">
                                <div className="testimonial-avatar">
                                    <i className="fas fa-user-circle"></i>
                                </div>
                                <div className="testimonial-info">
                                    <h4 className="testimonial-name">{translations.testimonial1.author}</h4>
                                    <p className="testimonial-role">{translations.testimonial1.role}</p>
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
                                {translations.testimonial2.text}
                            </p>
                            <div className="testimonial-author">
                                <div className="testimonial-avatar">
                                    <i className="fas fa-user-circle"></i>
                                </div>
                                <div className="testimonial-info">
                                    <h4 className="testimonial-name">{translations.testimonial2.author}</h4>
                                    <p className="testimonial-role">{translations.testimonial2.role}</p>
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
                                {translations.testimonial3.text}
                            </p>
                            <div className="testimonial-author">
                                <div className="testimonial-avatar">
                                    <i className="fas fa-user-circle"></i>
                                </div>
                                <div className="testimonial-info">
                                    <h4 className="testimonial-name">{translations.testimonial3.author}</h4>
                                    <p className="testimonial-role">{translations.testimonial3.role}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                
                {/* Partners Section - Moved up before CTA for better flow */}
                <section className="partners-section">
                    <h3 className="partners-title">{translations.partners}</h3>
                    <div className="partners-container">
                        <div className="partner-logo"><i className="fas fa-building"></i> {translations.companyA}</div>
                        <div className="partner-logo"><i className="fas fa-university"></i> {translations.universityB}</div>
                        <div className="partner-logo"><i className="fas fa-globe"></i> {translations.organizationC}</div>
                        <div className="partner-logo"><i className="fas fa-school"></i> {translations.schoolD}</div>
                        <div className="partner-logo"><i className="fas fa-landmark"></i> {translations.researchInstituteE}</div>
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
                            <span className="cta-users-count">{translations.registeredThisMonth}</span>
                        </div>
                        <i className="fas fa-book cta-decoration bottom-right"></i>
                    </div>
                    
                    <div className="cta-badges">
                        <div className="cta-badge-item">
                            <i className="fas fa-star"></i>
                            <span className="cta-badge-text">{translations.effectiveLearning}</span>
                        </div>
                        <div className="cta-badge-item">
                            <i className="fas fa-shield-alt"></i>
                            <span className="cta-badge-text">{translations.safeSecure}</span>
                        </div>
                        <div className="cta-badge-item">
                            <i className="fas fa-bolt"></i>
                            <span className="cta-badge-text">{translations.accelerateLearning}</span>
                        </div>
                    </div>
                </section>
            </div>
        );
    };

    return isAuthenticated ? renderAuthenticatedContent() : renderNonAuthenticatedContent();
}

export default HomePage; 