import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Link, useNavigate } from 'react-router-dom';
import { useFlashcard } from '../contexts/FlashcardContext';
import '../css/components/Flashcards.css';

function FlashcardsPage() {
    const { translateText } = useLanguage();
    const navigate = useNavigate();
    const { getUserFlashcardSets, loading, error } = useFlashcard();
    
    const [flashcardSets, setFlashcardSets] = useState([]);
    const [selectedSet, setSelectedSet] = useState(null);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [showAnswer, setShowAnswer] = useState(false);

    // Fetch flashcard sets on component mount
    useEffect(() => {
        const fetchFlashcardSets = async () => {
            try {
                // In a real app, you would get the user ID from auth context
                const userId = 'current'; // placeholder for the logged-in user
                const result = await getUserFlashcardSets(userId);
                if (result && result.flashcardSets) {
                    setFlashcardSets(result.flashcardSets);
                }
            } catch (err) {
                console.error('Failed to fetch flashcard sets', err);
            }
        };
        
        fetchFlashcardSets();
    }, [getUserFlashcardSets]);

    const handleSetSelect = (set) => {
        // Navigate to the flashcard set details page
        navigate(`/flashcards/${set.flashcardSetId || set.id}`);
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
                            >
                                <i className="fas fa-plus"></i>
                                {translateText('Create New Set')}
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
                                        <span>{set.cardCount || '0'} cards</span>
                                        <span className="set-language">{set.learningLanguage} → {set.nativeLanguage}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="no-sets-message">
                            <p>{translateText('You haven\'t created any flashcard sets yet.')}</p>
                            <button 
                                className="btn btn-primary mt-3" 
                                onClick={handleCreateNew}
                            >
                                <i className="fas fa-plus mr-2"></i>
                                {translateText('Create Your First Set')}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default FlashcardsPage; 