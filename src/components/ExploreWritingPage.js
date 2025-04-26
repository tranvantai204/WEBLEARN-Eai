import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useWritingExercise } from '../contexts/WritingExerciseContext';
import '../css/components/WritingExercises.css';
import { GuestBanner } from './common/index';

function ExploreWritingPage() {
    const { translateText } = useLanguage();
    const { explorePublicWritingExercises, loading, error } = useWritingExercise();
    const navigate = useNavigate();
    
    const [writingExercises, setWritingExercises] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState({
        learningLanguage: '',
        nativeLanguage: '',
        page: 1,
        itemPerPage: 20
    });
    
    const [itemPerPage, setItemPerPage] = useState(20);
    
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
        fetchWritingExercises();
    }, [filters.page, filters.learningLanguage, filters.nativeLanguage, itemPerPage]);
    
    const fetchWritingExercises = async () => {
        try {
            const result = await explorePublicWritingExercises({
                ...filters,
                itemPerPage
            });
            
            if (result && result.exercises) {
                setWritingExercises(result.exercises);
                setTotalPages(result.totalPages || 1);
                setCurrentPage(result.currentPage || 1);
            }
        } catch (error) {
            console.error("Error fetching public writing exercises:", error);
        }
    };
    
    const handleExerciseSelect = (exercise) => {
        navigate(`/public-writing/${exercise.exerciseId}`);
    };
    
    const handlePracticeExercise = (e, exercise) => {
        e.stopPropagation();
        navigate(`/public-writing/${exercise.exerciseId}`);
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

    const getLanguageName = (code) => {
        switch (code) {
            case 'ENG': return 'English';
            case 'VIE': return 'Vietnamese';
            case 'JPN': return 'Japanese';
            case 'KOR': return 'Korean';
            case 'CHN': return 'Chinese';
            case 'FRA': return 'French';
            case 'DEU': return 'German';
            case 'ESP': return 'Spanish';
            default: return code;
        }
    };

    return (
        <div className="writing-page">
            <div className="writing-container">
                <div className="writing-grid">
                    <div className="writing-header">
                        <h1 className="page-title">{translateText('Explore Writing Exercises')}</h1>
                        
                        {/* Info banner */}
                        <GuestBanner 
                            title={translateText('Study Without an Account')}
                            message={translateText('All writing exercises shown here are public and can be practiced without signing in, but your progress will not be saved.')}
                            type="writing exercises"
                        />
                        
                        {/* Filters */}
                        <div className="writing-filters">
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
                        <div className="loading-spinner">
                            <i className="fas fa-spinner fa-spin"></i> {translateText('Loading...')}
                        </div>
                    ) : error ? (
                        <div className="error-message">
                            <i className="fas fa-exclamation-circle"></i> {error}
                        </div>
                    ) : writingExercises.length > 0 ? (
                        <>
                            <div className="exercises-list">
                                {writingExercises.map((exercise) => (
                                    <div 
                                        key={exercise.exerciseId} 
                                        className="exercise-card"
                                        onClick={() => handleExerciseSelect(exercise)}
                                    >
                                        <div className="exercise-actions top-actions" onClick={e => e.stopPropagation()}>
                                            <button 
                                                className="exercise-btn practice-btn"
                                                onClick={(e) => handlePracticeExercise(e, exercise)}
                                            >
                                                <i className="fas fa-pen-alt"></i> {translateText('Practice')}
                                            </button>
                                        </div>
                                        <h3 className="exercise-title">{exercise.topic}</h3>
                                        <div className="exercise-stats">
                                            <span className="exercise-language">
                                                {getLanguageName(exercise.learningLanguage)} → {getLanguageName(exercise.nativeLanguage)}
                                            </span>
                                            <span className="exercise-date">
                                                <i className="far fa-calendar"></i> {new Date(exercise.createdAt).toLocaleDateString()}
                                            </span>
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
                        <div className="no-exercises-message">
                            <p>{translateText('No public writing exercises found with the selected filters.')}</p>
                            <p>{translateText('Try changing your filters or check back later.')}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ExploreWritingPage; 