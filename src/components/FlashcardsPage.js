import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Link, useNavigate } from 'react-router-dom';
import { useFlashcard } from '../contexts/FlashcardContext';
import '../css/components/Flashcards.css';
import { jwtDecode } from 'jwt-decode';

function FlashcardsPage() {
    const { translateText } = useLanguage();
    const navigate = useNavigate();
    const { getUserFlashcardSets, loading, error } = useFlashcard();
    
    const [flashcardSets, setFlashcardSets] = useState([]);
    const [selectedSet, setSelectedSet] = useState(null);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [showAnswer, setShowAnswer] = useState(false);
    const [userId, setUserId] = useState("");

    // Fetch flashcard sets on component mount
    useEffect(() => {
        const fetchFlashcardSets = async () => {
            try {
                // Get token from localStorage
                const token = localStorage.getItem("accessToken");
                
                if (!token) {
                    console.error('No access token found in localStorage');
                    return;
                }
                
                console.log('Token exists:', !!token);
                
                try {
                    const decodedToken = jwtDecode(token);
                    console.log('Decoded token:', decodedToken);
                    
                    const userId = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
                    console.log('Using userId:', userId);
                    
                    if (!userId) {
                        console.error('No userId found in decoded token');
                        return;
                    }
                    
                    try {
                        // Log API URL from environment to verify it's correct
                        console.log('API URL from env:', process.env.REACT_APP_API_URL);
                        
                        const result = await getUserFlashcardSets(userId);
                        console.log('API response:', result);
                        
                        if (result && result.flashcardSets) {
                            setFlashcardSets(result.flashcardSets);
                        } else {
                            console.log('No flashcards found or response format unexpected');
                        }
                    } catch (apiError) {
                        console.error('API request failed:', apiError);
                    }
                } catch (tokenError) {
                    console.error('Error decoding token:', tokenError);
                }
            } catch (err) {
                console.error('Failed to fetch flashcard sets', err);
            }
        };
        
        fetchFlashcardSets();
    }, [getUserFlashcardSets]);

    const handleSetSelect = (set) => {
        // Navigate to the flashcard set details page
        navigate(`/flashcard-set/${set.flashcardSetId || set.id}`);
    };

    const handleNextCard = () => {
        if (currentCardIndex < selectedSet.cards.length - 1) {
            setCurrentCardIndex(currentCardIndex + 1);
            setIsFlipped(false);
            setShowAnswer(false);
        }
    };

    const handlePrevCard = () => {
        if (currentCardIndex > 0) {
            setCurrentCardIndex(currentCardIndex - 1);
            setIsFlipped(false);
            setShowAnswer(false);
        }
    };

    const handleFlipCard = () => {
        setIsFlipped(!isFlipped);
    };

    const handleShowAnswer = () => {
        setShowAnswer(true);
    };

    const handleCreateNew = () => {
        navigate('/flashcards/create');
    };

    const handleCreateAI = () => {
        navigate('/flashcards/create-ai');
    };

    return (
        <div className="flashcards-page">
            <div className="flashcards-container">
                <div className="sets-grid">
                    <div className="flashcards-header">
                        <h1 className="page-title">{translateText('Flashcards')}</h1>
                        <div className="flashcards-actions">
                            <button 
                                className="create-set-btn" 
                                onClick={handleCreateNew}
                                style={{ marginRight: '10px' }}
                            >
                                <i className="fas fa-plus"></i>
                                {translateText('Create Manual Set')}
                            </button>
                            <button 
                                className="create-set-btn create-ai-btn" 
                                onClick={handleCreateAI}
                                style={{ 
                                    background: 'linear-gradient(135deg, #4285f4, #0d47a1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem'
                                }}
                            >
                                <i className="fas fa-magic"></i>
                                {translateText('Create AI Set')}
                            </button>
                        </div>
                    </div>
                    
                    {loading ? (
                        <div className="loading-spinner">
                            <i className="fas fa-spinner fa-spin"></i> Loading...
                        </div>
                    ) : error ? (
                        <div className="error-message">
                            <i className="fas fa-exclamation-circle"></i> {error}
                        </div>
                    ) : flashcardSets.length > 0 ? (
                        <div className="sets-list">
                            {flashcardSets.map((set) => (
                                <div 
                                    key={set.flashcardSetId || set.id} 
                                    className="set-card"
                                    onClick={() => handleSetSelect(set)}
                                >
                                    <h3 className="set-title">{set.title}</h3>
                                    <p className="set-description">{set.description}</p>
                                    <div className="set-stats">
                                        <span>{set.totalVocabulary || '0'} cards</span>
                                        <span className="set-language">{set.learningLanguage} → {set.nativeLanguage}</span>
                                        {/* Hiển thị thông tin level */}
                                        <span className="set-level">Level: {set.level || 'N/A'}</span>
                                        {/* Hiển thị thông tin learnerCount */}
                                        <span className="set-learner-count">Learners: {set.learnerCount || '0'}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="no-sets-message">
                            <p>{translateText('You haven\'t created any flashcard sets yet.')}</p>
                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '1rem' }}>
                                <button 
                                    className="btn btn-primary" 
                                    onClick={handleCreateNew}
                                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                                >
                                    <i className="fas fa-plus"></i>
                                    {translateText('Create Manual Set')}
                                </button>
                                <button 
                                    className="btn btn-primary" 
                                    onClick={handleCreateAI}
                                    style={{ 
                                        background: 'linear-gradient(135deg, #4285f4, #0d47a1)',
                                        border: 'none',
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: '8px'
                                    }}
                                >
                                    <i className="fas fa-magic"></i>
                                    {translateText('Create AI Set')}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default FlashcardsPage; 