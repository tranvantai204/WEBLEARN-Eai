import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useFlashcard } from '../contexts/FlashcardContext';
import '../css/components/Flashcards.css';
import '../css/components/EnhancedFlashcards.css';

function ExploreFlashcardsPage() {
    const { translateText } = useLanguage();
    const navigate = useNavigate();
    const { exploreFlashcardSets, loading, error } = useFlashcard();
    
    const [flashcardSets, setFlashcardSets] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [itemPerPage, setItemPerPage] = useState(20);
    const [filters, setFilters] = useState({
        learningLanguage: '',
        nativeLanguage: ''
    });
    
    // Language options
    const languageOptions = [
        { value: '', label: translateText('All Languages') },
        { value: 'ENG', label: translateText('English') },
        { value: 'VIE', label: translateText('Vietnamese') },
        { value: 'ESP', label: translateText('Spanish') },
        { value: 'FRA', label: translateText('French') },
        { value: 'DEU', label: translateText('German') },
        { value: 'JPN', label: translateText('Japanese') },
        { value: 'KOR', label: translateText('Korean') },
        { value: 'ZHO', label: translateText('Chinese') }
    ];

    // Fetch flashcard sets on component mount and when filters change
    useEffect(() => {
        const fetchFlashcardSets = async () => {
            try {
                const result = await exploreFlashcardSets({
                    learningLanguage: filters.learningLanguage,
                    nativeLanguage: filters.nativeLanguage,
                    page: currentPage,
                    itemPerPage
                });
                
                if (result) {
                    setFlashcardSets(result.flashcardSets || []);
                    setTotalPages(result.totalPage || 1);
                    setCurrentPage(result.curentPage || 1);
                }
            } catch (err) {
                console.error('Failed to fetch public flashcard sets', err);
            }
        };
        
        fetchFlashcardSets();
    }, [exploreFlashcardSets, filters, currentPage, itemPerPage]);

    const handleSetSelect = (set) => {
        // Navigate to the flashcard set details page
        navigate(`/flashcard-set/${set.flashcardSetId}`);
    };

    const handleStudySet = (e, set) => {
        e.stopPropagation(); // Prevent triggering the card click
        navigate(`/public-learn/${set.flashcardSetId}`);
    };

    const handleFilterChange = (name, value) => {
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
        // Reset to first page when filters change
        setCurrentPage(1);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div className="flashcards-page">
            <div className="flashcards-container">
                <div className="sets-grid">
                    <div className="flashcards-header">
                        <h1 className="page-title">{translateText('Explore Flashcards')}</h1>
                        
                        {/* Info banner */}
                        <div className="public-access-banner">
                            <i className="fas fa-info-circle"></i>
                            <div>
                                <p className="banner-headline">{translateText('Study Without an Account')}</p>
                                <p>{translateText('All flashcard sets shown here are public and can be studied without signing in, but your learning time, progress and streaks will not be saved.')}</p>
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
                    
                    {loading ? (
                        <div className="custom-loading-spinner">
                            <div className="spinner-circle"></div>
                            <div className="spinner-text">{translateText('Loading...')}</div>
                        </div>
                    ) : error ? (
                        <div className="error-message">
                            <i className="fas fa-exclamation-circle"></i> {error}
                        </div>
                    ) : flashcardSets.length > 0 ? (
                        <>
                            <div className="sets-list">
                                {flashcardSets.map((set) => (
                                    <div 
                                        key={set.flashcardSetId} 
                                        className="set-card"
                                        onClick={() => handleSetSelect(set)}
                                    >
                                        <div className="set-actions top-actions" onClick={e => e.stopPropagation()}>
                                            <button 
                                                className="set-btn study-btn"
                                                onClick={(e) => handleStudySet(e, set)}
                                            >
                                                <i className="fas fa-graduation-cap"></i> {translateText('Study')}
                                            </button>
                                        </div>
                                        <h3 className="set-title">{set.title}</h3>
                                        <p className="set-description">{set.description}</p>
                                        <div className="set-stats">
                                            <span>{set.totalVocabulary || '0'} {translateText('cards')}</span>
                                            <span className="set-language">{set.learningLanguage} → {set.nativeLanguage}</span>
                                            <span className="set-level">{translateText('Level')}: {set.level || 'N/A'}</span>
                                            <span className="set-learner-count">{translateText('Learners')}: {set.learnerCount || '0'}</span>
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
                        <div className="no-sets-message">
                            <p>{translateText('No public flashcard sets found with the selected filters.')}</p>
                            <p>{translateText('Try changing your filters or check back later.')}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ExploreFlashcardsPage; 