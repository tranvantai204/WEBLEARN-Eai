import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import '../css/components/Discover.css';

function DiscoverPage() {
    // Translation support
    const { translateText, currentLanguage } = useLanguage();
    const [translations, setTranslations] = useState({
        pageTitle: 'Discover',
        searchPlaceholder: 'Search content...',
        filter: 'Filter',
        sort: 'Sort',
        lesson: 'Lessons',
        students: 'Students',
        cardTitles: [
            'Basic Grammar',
            'Business Vocabulary',
            'Conversation Practice'
        ],
        cardDescriptions: [
            'Learn fundamental grammar rules and structures for better communication.',
            'Master essential business terms and professional language.',
            'Improve your speaking skills with real-world scenarios.'
        ],
        difficultyLevels: [
            'Beginner',
            'Intermediate',
            'Advanced'
        ]
    });
    
    // Update translations when language changes
    useEffect(() => {
        const updateTranslations = async () => {
            try {
                // Translate simple strings
                const simpleTranslations = { ...translations };
                
                for (const key of Object.keys(simpleTranslations)) {
                    if (typeof simpleTranslations[key] === 'string') {
                        simpleTranslations[key] = await translateText(simpleTranslations[key]);
                    }
                }
                
                // Translate arrays
                simpleTranslations.cardTitles = await Promise.all(
                    translations.cardTitles.map(title => translateText(title))
                );
                
                simpleTranslations.cardDescriptions = await Promise.all(
                    translations.cardDescriptions.map(desc => translateText(desc))
                );
                
                simpleTranslations.difficultyLevels = await Promise.all(
                    translations.difficultyLevels.map(level => translateText(level))
                );
                
                setTranslations(simpleTranslations);
            } catch (error) {
                console.error("Translation error in DiscoverPage:", error);
            }
        };
        
        updateTranslations();
    }, [currentLanguage, translateText]);

    return (
        <div className="main-content">
            <div className="discover-container">
                <div className="discover-header">
                    <h1 className="discover-title">{translations.pageTitle}</h1>
                    <div className="search-section">
                        <div className="search-form">
                            <div className="search-bar">
                                <i className="fas fa-search search-icon"></i>
                                <input
                                    type="text"
                                    className="search-input"
                                    placeholder={translations.searchPlaceholder}
                                />
                            </div>
                            <div className="filter-section">
                                <button className="filter-button">
                                    <i className="fas fa-filter"></i>
                                    {translations.filter}
                                </button>
                                <button className="filter-button">
                                    <i className="fas fa-sort"></i>
                                    {translations.sort}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="content-grid">
                    <div className="content-card">
                        <img
                            src="/images/content1.jpg"
                            alt={translations.cardTitles[0]}
                            className="card-image"
                        />
                        <div className="card-content">
                            <h3 className="card-title">{translations.cardTitles[0]}</h3>
                            <p className="card-description">{translations.cardDescriptions[0]}</p>
                            <div className="card-meta">
                                <span className="difficulty-badge">{translations.difficultyLevels[0]}</span>
                                <div className="card-stats">
                                    <span className="stat-item">
                                        <i className="fas fa-book"></i>
                                        12 {translations.lesson}
                                    </span>
                                    <span className="stat-item">
                                        <i className="fas fa-users"></i>
                                        1.2k {translations.students}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="content-card">
                        <img
                            src="/images/content2.jpg"
                            alt={translations.cardTitles[1]}
                            className="card-image"
                        />
                        <div className="card-content">
                            <h3 className="card-title">{translations.cardTitles[1]}</h3>
                            <p className="card-description">{translations.cardDescriptions[1]}</p>
                            <div className="card-meta">
                                <span className="difficulty-badge">{translations.difficultyLevels[1]}</span>
                                <div className="card-stats">
                                    <span className="stat-item">
                                        <i className="fas fa-book"></i>
                                        15 {translations.lesson}
                                    </span>
                                    <span className="stat-item">
                                        <i className="fas fa-users"></i>
                                        850 {translations.students}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="content-card">
                        <img
                            src="/images/content3.jpg"
                            alt={translations.cardTitles[2]}
                            className="card-image"
                        />
                        <div className="card-content">
                            <h3 className="card-title">{translations.cardTitles[2]}</h3>
                            <p className="card-description">{translations.cardDescriptions[2]}</p>
                            <div className="card-meta">
                                <span className="difficulty-badge">{translations.difficultyLevels[2]}</span>
                                <div className="card-stats">
                                    <span className="stat-item">
                                        <i className="fas fa-book"></i>
                                        20 {translations.lesson}
                                    </span>
                                    <span className="stat-item">
                                        <i className="fas fa-users"></i>
                                        2k {translations.students}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pagination">
                    <button className="page-button">
                        <i className="fas fa-chevron-left"></i>
                    </button>
                    <button className="page-button active">1</button>
                    <button className="page-button">2</button>
                    <button className="page-button">3</button>
                    <button className="page-button">
                        <i className="fas fa-chevron-right"></i>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DiscoverPage;