import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useMultipleChoiceTest } from '../contexts/MultipleChoiceTestContext';
import '../css/components/MultipleChoiceTests.css';

function ExploreMultipleChoiceTestsPage() {
    const { translateText } = useLanguage();
    const { exploreMultipleChoiceTests, loading, error, multipleChoiceTests, totalPages, currentPage } = useMultipleChoiceTest();
    const navigate = useNavigate();
    
    const [filters, setFilters] = useState({
        learningLanguage: '',
        nativeLanguage: '',
        page: 1,
        itemPerPage: 20
    });
    
    const [itemPerPage, setItemPerPage] = useState(20);
    
    const getFlagIcon = (langCode) => {
        switch(langCode) {
            case 'ENG':
                return <span className="flag-icon">🇬🇧</span>;
            case 'VIE':
                return <span className="flag-icon">🇻🇳</span>;
            case 'FRA':
                return <span className="flag-icon">🇫🇷</span>;
            case 'DEU':
                return <span className="flag-icon">🇩🇪</span>;
            case 'ESP':
                return <span className="flag-icon">🇪🇸</span>;
            case 'JPN':
                return <span className="flag-icon">🇯🇵</span>;
            case 'KOR':
                return <span className="flag-icon">🇰🇷</span>;
            case 'CHN':
                return <span className="flag-icon">🇨🇳</span>;
            case 'AR':
                return <span className="flag-icon">🇸🇦</span>;
            case 'RUS':
                return <span className="flag-icon">🇷🇺</span>;
            case 'POR':
                return <span className="flag-icon">🇵🇹</span>;
            case 'THA':
                return <span className="flag-icon">🇹🇭</span>;
            default:
                return <span className="flag-icon">🌐</span>;
        }
    };
    
    const languageOptions = [
        { value: '', label: translateText('All Languages') },
        { value: 'ENG', label: 'English' },
        { value: 'VIE', label: 'Vietnamese' },
        { value: 'JPN', label: 'Japanese' },
        { value: 'KOR', label: 'Korean' },
        { value: 'CHN', label: 'Chinese' },
        { value: 'FRA', label: 'French' },
        { value: 'DEU', label: 'German' },
        { value: 'ESP', label: 'Spanish' },
    ];
    
    useEffect(() => {
        fetchTests();
    }, [filters.page, filters.learningLanguage, filters.nativeLanguage, itemPerPage]);
    
    const fetchTests = async () => {
        await exploreMultipleChoiceTests({
            ...filters,
            itemPerPage
        });
    };
    
    const handleTestSelect = (test) => {
        navigate(`/public-test/${test.multipleChoiceTestId}`);
    };
    
    const handleStudyTest = (e, test) => {
        e.stopPropagation();
        navigate(`/public-test/${test.multipleChoiceTestId}`);
    };
    
    const handleFilterChange = (name, value) => {
        setFilters(prev => ({
            ...prev,
            [name]: value,
            page: 1 // Reset to page 1 when changing filters
        }));
    };
    
    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > totalPages) return;
        
        setFilters(prev => ({
            ...prev,
            page: newPage
        }));
    };

    return (
        <div className="tests-page">
            <div className="tests-container">
                    <div className="tests-header">
                        <h1 className="page-title">{translateText('Explore Multiple Choice Tests')}</h1>
                        
                        {/* Info banner */}
                        <div className="public-access-banner">
                            <i className="fas fa-info-circle"></i>
                            <div>
                                <p className="banner-headline">{translateText('Study Without an Account')}</p>
                                <p>{translateText('All multiple choice tests shown here are public and can be taken without signing in, but your scores and progress will not be saved.')}</p>
                            </div>
                        </div>
                        
                        {/* Filters */}
                        <div className="flashcards-filters">
                            <div className="filter-group">
                                <label>{translateText('Learning Language')}</label>
                                <select 
                                    value={filters.learningLanguage}
                                    onChange={(e) => handleFilterChange('learningLanguage', e.target.value)}
                                >
                                    {languageOptions.map(option => (
                                        <option key={`learning-${option.value}`} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="filter-group">
                                <label>{translateText('Native Language')}</label>
                                <select 
                                    value={filters.nativeLanguage}
                                    onChange={(e) => handleFilterChange('nativeLanguage', e.target.value)}
                                >
                                    {languageOptions.map(option => (
                                        <option key={`native-${option.value}`} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="filter-group">
                                <label>{translateText('Items Per Page')}</label>
                                <select
                                    value={itemPerPage}
                                    onChange={(e) => setItemPerPage(Number(e.target.value))}
                                >
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                </select>
                            </div>
                        </div>
                    </div>
                <div id='explore-tests-page' className="tests-grid" style={{display: 'flex'}}>
                    
                    {loading ? (
                        <div className="custom-loading-spinner">
                            <div className="spinner-circle"></div>
                            <div className="spinner-text">{translateText('Loading...')}</div>
                        </div>
                    ) : error ? (
                        <div className="error-message">
                            <i className="fas fa-exclamation-circle"></i> {error}
                        </div>
                    ) : multipleChoiceTests.length > 0 ? (
                        <>
                            <div className="sets-list">
                                {multipleChoiceTests.map((test) => (
                                    <div 
                                        key={test.multipleChoiceTestId} 
                                        className="set-card"
                                        onClick={() => handleTestSelect(test)}
                                    >
                                        <div className="set-actions top-actions" onClick={e => e.stopPropagation()}>
                                            <button 
                                                className="set-btn study-btn"
                                                onClick={(e) => handleStudyTest(e, test)}
                                            >
                                                <i className="fas fa-graduation-cap"></i> {translateText('Take Test')}
                                            </button>
                                        </div>
                                        <h3 className="set-title">{test.title}</h3>
                                        <div className="set-stats">
                                            <span className="test-language">
                                                {getFlagIcon(test.learningLanguage)} {test.learningLanguage} → {getFlagIcon(test.nativeLanguage)} {test.nativeLanguage}
                                            </span>
                                            <span className="test-level"><i className="fas fa-layer-group"></i> {translateText('Level')}: {
                                                test.level === 0 ? 'Beginner' : 
                                                test.level === 1 ? 'Elementary' :
                                                test.level === 2 ? 'Pre-Intermediate' :
                                                test.level === 3 ? 'Intermediate' :
                                                test.level === 4 ? 'Upper Intermediate' :
                                                test.level === 5 ? 'Advanced' : 'Proficient'
                                            }</span>
                                            <span className="test-learner-count"><i className="fas fa-users"></i> {translateText('Learners')}: {test.learnerCount || '0'}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            {/* Pagination controls */}
                            {totalPages > 1 && (
                                <div className="pagination">
                                    <button 
                                        className="page-btn prev-btn" 
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        <i className="fas fa-chevron-left"></i>
                                    </button>
                                    
                                    <span className="page-info">
                                        {translateText('Page')} {currentPage} {translateText('of')} {totalPages}
                                    </span>
                                    
                                    <button 
                                        className="page-btn next-btn" 
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                    >
                                        <i className="fas fa-chevron-right"></i>
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="no-tests-message">
                            <p>{translateText('No public multiple choice tests found with the selected filters.')}</p>
                            <p>{translateText('Try changing your filters or check back later.')}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ExploreMultipleChoiceTestsPage; 