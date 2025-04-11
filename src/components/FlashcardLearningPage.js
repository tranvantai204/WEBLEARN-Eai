import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFlashcard } from '../contexts/FlashcardContext';
import { useAuth } from '../contexts/AuthContext';
import '../css/components/FlashcardLearning.css';

function FlashcardLearningPage() {
    const { flashcardSetId } = useParams();
    const navigate = useNavigate();
    const { getFlashcardSet, getFlashcardsForSet, loading } = useFlashcard();
    const { isAuthenticated } = useAuth();
    
    // State for flashcard set and cards
    const [flashcardSet, setFlashcardSet] = useState(null);
    const [flashcards, setFlashcards] = useState([]);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [learningMode, setLearningMode] = useState('sequential'); // 'sequential' or 'shuffle'
    const [studyStarted, setStudyStarted] = useState(false);
    const [learnedCards, setLearnedCards] = useState([]);
    
    // State for statistics
    const [stats, setStats] = useState({
        timeStarted: null,
        timeSpent: 0,
        correctCount: 0,
        totalViewed: 0,
    });
    
    // API URL
    const baseUrl = process.env.REACT_APP_API_URL || 'https://6d2c-115-76-51-131.ngrok-free.app';
    // Remove trailing /api if it exists to avoid duplicate /api in endpoints
    const API_URL = baseUrl.endsWith('/api') ? baseUrl.slice(0, -4) : baseUrl;
    
    // Timer reference to clear on unmount
    const timerRef = useRef(null);
    
    // Function to start learning session
    const startLearning = async () => {
        try {
            // Call API to start learning session
            const response = await fetch(`${API_URL}/api/UserLearningStats/StartLearn`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'ngrok-skip-browser-warning': 'true',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            
            if (!response.ok) {
                throw new Error(`Failed to start learning session: ${response.status}`);
            }
            
            // Update state
            setStudyStarted(true);
            setStats(prev => ({
                ...prev,
                timeStarted: new Date()
            }));
            
            // Start timer
            startTimer();
            
            console.log('Learning session started successfully');
        } catch (err) {
            console.error('Failed to start learning session:', err);
            toast.error('Failed to start learning session. You can still continue learning.');
            
            // Still set the study started true so user can use the feature
            setStudyStarted(true);
            setStats(prev => ({
                ...prev,
                timeStarted: new Date()
            }));
            startTimer();
        }
    };
    
    // Function to end learning session
    const endLearning = async () => {
        try {
            // Call API to end learning session
            const response = await fetch(`${API_URL}/api/UserLearningStats/EndLearn`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'ngrok-skip-browser-warning': 'true', 
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            
            if (!response.ok) {
                throw new Error(`Failed to end learning session: ${response.status}`);
            }
            
            // Clear timer
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
            
            console.log('Learning session ended successfully');
        } catch (err) {
            console.error('Failed to end learning session:', err);
            toast.error('Failed to record your learning time. Your progress may not be saved.');
        }
    };
    
    // Start timer for tracking study time
    const startTimer = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        
        timerRef.current = setInterval(() => {
            setStats(prev => ({
                ...prev,
                timeSpent: Math.floor((new Date() - new Date(prev.timeStarted)) / 1000)
            }));
        }, 1000);
    };
    
    // Format seconds to MM:SS
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };
    
    // Fetch flashcard set and cards
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch flashcard set
                const setData = await getFlashcardSet(flashcardSetId);
                setFlashcardSet(setData);
                
                // Fetch flashcards
                const cardsData = await getFlashcardsForSet(flashcardSetId);
                
                if (cardsData.flashcards && cardsData.flashcards.length > 0) {
                    setFlashcards(cardsData.flashcards);
                } else {
                    toast.info('This set has no flashcards yet.');
                }
                
            } catch (err) {
                console.error('Error fetching flashcard data:', err);
                toast.error('Failed to load flashcards. Please try again.');
            }
        };
        
        fetchData();
        
        // Cleanup function to ensure we end the learning session
        return () => {
            if (studyStarted) {
                endLearning();
            }
            
            // Clear timer
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [flashcardSetId, getFlashcardSet, getFlashcardsForSet]);
    
    // Shuffle cards when mode changes to shuffle
    useEffect(() => {
        if (learningMode === 'shuffle' && flashcards.length > 0) {
            // Create a copy before shuffling
            const shuffledCards = [...flashcards];
            
            // Fisher-Yates shuffle algorithm
            for (let i = shuffledCards.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffledCards[i], shuffledCards[j]] = [shuffledCards[j], shuffledCards[i]];
            }
            
            setFlashcards(shuffledCards);
            setCurrentCardIndex(0);
            setIsFlipped(false);
        } else if (learningMode === 'sequential' && flashcards.length > 0) {
            // Reset to the original order by fetching again
            getFlashcardsForSet(flashcardSetId)
                .then(cardsData => {
                    if (cardsData.flashcards && cardsData.flashcards.length > 0) {
                        setFlashcards(cardsData.flashcards);
                        setCurrentCardIndex(0);
                        setIsFlipped(false);
                    }
                })
                .catch(err => {
                    console.error('Error resetting cards to sequential order:', err);
                });
        }
    }, [learningMode, flashcardSetId, getFlashcardsForSet]);
    
    // Handle visibility change (tab change, minimize) to end session
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden && studyStarted) {
                // If page is hidden/minimized, end the learning session
                endLearning();
            }
        };
        
        document.addEventListener('visibilitychange', handleVisibilityChange);
        
        // Cleanup
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [studyStarted]);
    
    // Handle beforeunload event to end learning session
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (studyStarted) {
                endLearning();
                // Show confirmation dialog
                e.preventDefault();
                e.returnValue = ''; // Required for Chrome
            }
        };
        
        window.addEventListener('beforeunload', handleBeforeUnload);
        
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [studyStarted]);
    
    // Toggle card flip
    const flipCard = () => {
        console.log("Flipping card - current state:", isFlipped);
        
        // Nếu đang lật từ mặt trước sang mặt sau và đây là lần đầu xem thẻ này
        if (!isFlipped && !learnedCards.includes(currentCardIndex)) {
            console.log("First time viewing card:", currentCardIndex);
            setLearnedCards(prev => [...prev, currentCardIndex]);
            setStats(prev => ({
                ...prev,
                totalViewed: prev.totalViewed + 1
            }));
        }
        
        // Lật thẻ
        setIsFlipped(!isFlipped);
    };
    
    // Go to next card
    const nextCard = () => {
        if (currentCardIndex < flashcards.length - 1) {
            setCurrentCardIndex(currentCardIndex + 1);
            setIsFlipped(false);
        } else {
            // End of deck, show completion
            toast.success('You completed all flashcards!');
        }
    };
    
    // Go to previous card
    const prevCard = () => {
        if (currentCardIndex > 0) {
            setCurrentCardIndex(currentCardIndex - 1);
            setIsFlipped(false);
        }
    };
    
    // Mark current card as known
    const markAsKnown = () => {
        setStats(prev => ({
            ...prev,
            correctCount: prev.correctCount + 1
        }));
        nextCard();
    };
    
    // Mark current card as unknown
    const markAsUnknown = () => {
        nextCard();
    };
    
    // Handle learning mode change
    const toggleLearningMode = () => {
        setLearningMode(prev => prev === 'sequential' ? 'shuffle' : 'sequential');
    };
    
    // Start the session or end it
    const toggleSession = () => {
        if (!studyStarted) {
            startLearning();
        } else {
            // End the session and navigate back
            endLearning();
            navigate(`/flashcard-set/${flashcardSetId}`);
        }
    };
    
    // Get progress percentage
    const getProgressPercentage = () => {
        if (flashcards.length === 0) return 0;
        return (learnedCards.length / flashcards.length) * 100;
    };

    return (
        <div className="flashcard-learning-page">
            <ToastContainer position="top-right" autoClose={3000} />
            
            <div className="learning-header">
                <div className="header-left">
                    <button 
                        className="back-btn"
                        onClick={() => {
                            if (studyStarted) {
                                endLearning();
                            }
                            navigate(`/flashcard-set/${flashcardSetId}`);
                        }}
                    >
                        <i className="fas fa-arrow-left"></i>
                        Back to Set
                    </button>
                    
                    {flashcardSet && (
                        <h1 className="set-title">{flashcardSet.title}</h1>
                    )}
                </div>
                
                <div className="header-actions">
                    <div className="mode-toggle">
                        <span>Mode: </span>
                        <button 
                            className={`mode-btn ${learningMode === 'sequential' ? 'active' : ''}`}
                            onClick={() => setLearningMode('sequential')}
                        >
                            <i className="fas fa-sort-numeric-down"></i> Sequential
                        </button>
                        <button 
                            className={`mode-btn ${learningMode === 'shuffle' ? 'active' : ''}`}
                            onClick={() => setLearningMode('shuffle')}
                        >
                            <i className="fas fa-random"></i> Shuffle
                        </button>
                    </div>
                    
                    <button 
                        className={`session-btn ${studyStarted ? 'end' : 'start'}`}
                        onClick={toggleSession}
                    >
                        {studyStarted ? (
                            <>
                                <i className="fas fa-stop"></i> End Session
                            </>
                        ) : (
                            <>
                                <i className="fas fa-play"></i> Start Learning
                            </>
                        )}
                    </button>
                </div>
            </div>
            
            {loading ? (
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Loading flashcards...</p>
                </div>
            ) : (
                <>
                    <div className="learning-progress">
                        <div className="progress-bar">
                            <div 
                                className="progress-fill"
                                style={{ width: `${getProgressPercentage()}%` }}
                            ></div>
                        </div>
                        <span className="progress-text">
                            {learnedCards.length} / {flashcards.length} cards
                        </span>
                    </div>
                    
                    {flashcards.length > 0 ? (
                        <div className="learning-content">
                            <div className="flashcard-container">
                                <div className={`flashcard ${isFlipped ? 'flipped' : ''}`}>
                                    <div 
                                        className="flashcard-front" 
                                        onClick={() => {
                                            if (!isFlipped) flipCard();
                                        }}
                                    >
                                        <div className="card-content">
                                            <h2 className="term">{flashcards[currentCardIndex]?.term}</h2>
                                            <p className="card-hint">Click to reveal definition</p>
                                        </div>
                                    </div>
                                    <div 
                                        className="flashcard-back"
                                        onClick={() => {
                                            if (isFlipped) flipCard();
                                        }}
                                    >
                                        <div className="card-content">
                                            <h3 className="definition">{flashcards[currentCardIndex]?.definition}</h3>
                                            
                                            {flashcards[currentCardIndex]?.example && (
                                                <div className="example">
                                                    <strong>Example:</strong>
                                                    <p>{flashcards[currentCardIndex]?.example}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="card-navigation">
                                    <button 
                                        className="nav-btn prev-btn"
                                        onClick={(e) => {
                                            e.stopPropagation(); // Ngăn chặn sự kiện lan truyền
                                            prevCard();
                                        }}
                                        disabled={currentCardIndex === 0}
                                    >
                                        <i className="fas fa-chevron-left"></i> Previous
                                    </button>
                                    <span className="card-counter">
                                        {currentCardIndex + 1} / {flashcards.length}
                                    </span>
                                    <button 
                                        className="nav-btn next-btn"
                                        onClick={(e) => {
                                            e.stopPropagation(); // Ngăn chặn sự kiện lan truyền
                                            nextCard();
                                        }}
                                        disabled={currentCardIndex === flashcards.length - 1}
                                    >
                                        Next <i className="fas fa-chevron-right"></i>
                                    </button>
                                </div>
                                
                                {isFlipped && (
                                    <div className="feedback-buttons">
                                        <button 
                                            className="feedback-btn unknown"
                                            onClick={(e) => {
                                                e.stopPropagation(); // Ngăn click lan truyền lên thẻ card
                                                markAsUnknown();
                                            }}
                                        >
                                            <i className="fas fa-times"></i> I don't know
                                        </button>
                                        <button 
                                            className="feedback-btn known"
                                            onClick={(e) => {
                                                e.stopPropagation(); // Ngăn click lan truyền lên thẻ card
                                                markAsKnown();
                                            }}
                                        >
                                            <i className="fas fa-check"></i> I know
                                        </button>
                                    </div>
                                )}
                            </div>
                            
                            <div className="learning-stats">
                                <div className="stat-item">
                                    <i className="fas fa-clock"></i>
                                    <div className="stat-content">
                                        <span className="stat-label">Study Time</span>
                                        <span className="stat-value">{formatTime(stats.timeSpent)}</span>
                                    </div>
                                </div>
                                <div className="stat-item">
                                    <i className="fas fa-check-circle"></i>
                                    <div className="stat-content">
                                        <span className="stat-label">Known Cards</span>
                                        <span className="stat-value">{stats.correctCount}</span>
                                    </div>
                                </div>
                                <div className="stat-item">
                                    <i className="fas fa-eye"></i>
                                    <div className="stat-content">
                                        <span className="stat-label">Cards Viewed</span>
                                        <span className="stat-value">{stats.totalViewed}</span>
                                    </div>
                                </div>
                                <div className="stat-item">
                                    <i className="fas fa-percentage"></i>
                                    <div className="stat-content">
                                        <span className="stat-label">Accuracy</span>
                                        <span className="stat-value">
                                            {stats.totalViewed === 0 ? '0%' : `${Math.min(100, Math.round((stats.correctCount / stats.totalViewed) * 100))}%`}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="no-cards-message">
                            <i className="fas fa-exclamation-circle"></i>
                            <h2>No flashcards found</h2>
                            <p>This set doesn't have any flashcards yet.</p>
                            <button 
                                className="back-to-set-btn"
                                onClick={() => navigate(`/flashcard-set/${flashcardSetId}`)}
                            >
                                Back to Set
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default FlashcardLearningPage; 