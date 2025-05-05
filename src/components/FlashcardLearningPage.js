import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFlashcard } from '../contexts/FlashcardContext';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import '../css/components/FlashcardLearning.css';

function FlashcardLearningPage() {
    const { flashcardSetId } = useParams();
    const navigate = useNavigate();
    const { getFlashcardSet, getFlashcardsForSet, loading } = useFlashcard();
    const { isAuthenticated } = useAuth();
    const { translateText } = useLanguage();
    
    // State for flashcard set and cards
    const [flashcardSet, setFlashcardSet] = useState(null);
    const [flashcards, setFlashcards] = useState([]);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [learningMode, setLearningMode] = useState('sequential'); // 'sequential' or 'shuffle'
    const [studyStarted, setStudyStarted] = useState(false);
    const [learnedCards, setLearnedCards] = useState([]);
    const [isFullscreen, setIsFullscreen] = useState(false);
    
    // Check if this is accessed via public route
    const isPublicRoute = window.location.pathname.includes('/public-learn/');
    
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
        // Update local state regardless of authentication
        setStudyStarted(true);
        setStats(prev => ({
            ...prev,
            timeStarted: new Date()
        }));
        
        // Start timer
        startTimer();
        
        // Only call the API if authenticated
        if (isAuthenticated) {
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
                
                console.log('Learning session started successfully');
            } catch (err) {
                console.error('Failed to start learning session:', err);
                toast.error('Failed to start learning session. You can still continue learning.');
            }
        } else if (!isPublicRoute) {
            // If not authenticated and not on the public route, show login prompt
            toast.info('Sign in to track your learning progress');
        }
    };
    
    // Function to end learning session
    const endLearning = async () => {
        // Clear timer regardless of authentication
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
        
        // Only call the API if authenticated
        if (isAuthenticated) {
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
                
                console.log('Learning session ended successfully');
            } catch (err) {
                console.error('Failed to end learning session:', err);
                toast.error('Failed to record your learning time. Your progress may not be saved.');
            }
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
    
    // Function to toggle fullscreen mode
    const toggleFullscreen = () => {
        setIsFullscreen(prevState => !prevState);
        
        // If entering fullscreen, automatically start the learning session
        if (!isFullscreen && !studyStarted) {
            startLearning();
        }
    };
    
    // Format seconds to minutes
    const formatTime = (seconds) => {
        const minutes = (seconds / 60).toFixed(1);
        return `${minutes} phút`;
    };
    
    // Fetch flashcard set and cards
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch flashcard set
                const setData = await getFlashcardSet(flashcardSetId);
                setFlashcardSet(setData);
                
                // Check if this is a public route and the set is private
                if (isPublicRoute && setData && !setData.isPublic && !isAuthenticated) {
                    // Redirect to explore page with error message
                    toast.error('This flashcard set is private. Please log in to access it.');
                    navigate('/flashcards/explore');
                    return;
                }
                
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
                
                // If there's an error due to private set, redirect to explore
                if (err.message?.includes('private')) {
                    navigate('/flashcards/explore');
                }
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
    }, [flashcardSetId, getFlashcardSet, getFlashcardsForSet, isPublicRoute, isAuthenticated, navigate]);
    
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
            const accuracy = stats.totalViewed === 0 ? 0 : Math.round((stats.correctCount / stats.totalViewed) * 100);
            let completionMessage;
            
            if (accuracy === 100) {
                completionMessage = "Hay dữ dị bà thơ! Bạn thuộc hết rồi! 🏆";
            } else if (accuracy >= 80) {
                completionMessage = "Quá xịn luôn! Học tốt đấy! 🌟";
            } else if (accuracy >= 50) {
                completionMessage = "Cố lên nè! Sắp hoàn hảo rồi! 💪";
            } else {
                completionMessage = "Cố gắng nhiều hơn nha! Não cần tập luyện thêm! 🧠";
            }
            
            toast.success(`Bạn đã hoàn thành bộ flashcards! ${completionMessage}`);
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
    
    // Hàm trả về thông báo hài hước dựa vào độ chính xác
    const getFunnyMessage = () => {
        const accuracy = stats.totalViewed === 0 ? 0 : Math.round((stats.correctCount / stats.totalViewed) * 100);
        
        if (accuracy === 100 && stats.totalViewed === flashcards.length) {
            return "Hay dữ dị bà thơ! Chấm 10 điểm cho não của bạn! 🧠✨";
        } else if (accuracy >= 90) {
            return "Quá xịn luôn! Não bạn đang on-fire kìa! 🔥🧠";
        } else if (accuracy >= 80) {
            return "Ủa trời! Giỏi quá trời quá đất! 😎👏";
        } else if (accuracy >= 70) {
            return "Có não hay lắm nè! Tiếp tục phát huy nhé! 💪😊";
        } else if (accuracy >= 50) {
            return "Cũng được lắm đó! Não vẫn còn tỉnh táo chán! 👌😄";
        } else if (accuracy > 0) {
            return "Chưa hít đủ oxy cho não hay sao đó? Thử lại nè! 😜";
        } else {
            return "Não đang offline à? Bấm nút reset não cái! 🤪🔄";
        }
    };
    
    // Hàm trả về class CSS dựa vào độ chính xác
    const getMessageClass = () => {
        const accuracy = stats.totalViewed === 0 ? 0 : Math.round((stats.correctCount / stats.totalViewed) * 100);
        
        if (accuracy >= 80) {
            return "perfect"; // Độ chính xác cao
        } else if (accuracy < 50) {
            return "bad"; // Độ chính xác thấp
        }
        return ""; // Class mặc định
    };

    // Function to detect if text contains Asian language (Chinese, Japanese, Korean)
    const isAsianLanguage = (text) => {
        if (!text) return false;
        
        // Regex patterns for Chinese, Japanese, and Korean characters
        const chinesePattern = /[\u4e00-\u9fff]/; // Chinese characters
        const japanesePattern = /[\u3040-\u309f\u30a0-\u30ff]/; // Japanese Hiragana and Katakana
        const koreanPattern = /[\uac00-\ud7af\u1100-\u11ff]/; // Korean Hangul
        
        return chinesePattern.test(text) || japanesePattern.test(text) || koreanPattern.test(text);
    };

    return (
        <div className="learning-page">
            {!isAuthenticated && isPublicRoute && (
                <div className="guest-user-banner">
                    <div className="banner-content">
                        <i className="fas fa-info-circle"></i>
                        <div>
                            <p className="banner-title">{translateText('Learning as Guest')}</p>
                            <p>{translateText('You can study this flashcard set without an account, but your learning time, progress, and streaks will not be saved.')}</p>
                            <Link to="/login" className="login-link">
                                {translateText('Sign in')}
                            </Link>
                            {translateText(' or ')}
                            <Link to="/register" className="login-link">
                                {translateText('create an account')}
                            </Link>
                            {translateText(' to track your progress.')}
                        </div>
                    </div>
                </div>
            )}
            
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
                        {translateText('Back to Set')}
                    </button>
                    
                    {flashcardSet && (
                        <h1 className="set-title">{flashcardSet.title}</h1>
                    )}
                </div>
                
                <div className="header-actions">
                    <div className="mode-toggle">
                        <span>{translateText('Mode')}: </span>
                        <button 
                            className={`mode-btn ${learningMode === 'sequential' ? 'active' : ''}`}
                            onClick={() => setLearningMode('sequential')}
                        >
                            <i className="fas fa-sort-numeric-down"></i> {translateText('Sequential')}
                        </button>
                        <button 
                            className={`mode-btn ${learningMode === 'shuffle' ? 'active' : ''}`}
                            onClick={() => setLearningMode('shuffle')}
                        >
                            <i className="fas fa-random"></i> {translateText('Shuffle')}
                        </button>
                    </div>
                    
                    <button 
                        className="session-btn start"
                        onClick={toggleFullscreen}
                        style={{
                            backgroundColor: '#3498db',
                            marginRight: '10px'
                        }}
                    >
                        <i className="fas fa-expand"></i> {translateText('Fullscreen Study')}
                    </button>
                    
                    <button 
                        className={`session-btn ${studyStarted ? 'end' : 'start'}`}
                        onClick={toggleSession}
                    >
                        {studyStarted ? (
                            <>
                                <i className="fas fa-stop"></i> {translateText('End Session')}
                            </>
                        ) : (
                            <>
                                <i className="fas fa-play"></i> {translateText('Start Learning')}
                            </>
                        )}
                    </button>
                </div>
            </div>
            
            {loading ? (
                <div className="custom-loading-spinner">
                    <div className="spinner-circle"></div>
                    <div className="spinner-text">{translateText('Loading...')}</div>
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
                            {learnedCards.length} / {flashcards.length} {translateText('cards')}
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
                                        style={{
                                            background: 'linear-gradient(135deg, #3498db, #2980b9)'
                                        }}
                                    >
                                        <div className="card-content">
                                            <h2 className="term" style={{
                                                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                                                padding: '10px 20px',
                                                borderRadius: '8px',
                                                color: '#ffffff',
                                                textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)',
                                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                                                wordBreak: 'break-word',
                                                display: 'inline-block',
                                                maxWidth: '100%',
                                                width: 'auto',
                                                overflow: 'hidden'
                                            }}>{flashcards[currentCardIndex]?.term}</h2>
                                            <p className="card-hint" style={{
                                                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                                                padding: '5px 10px',
                                                borderRadius: '5px',
                                                color: '#ffffff',
                                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                                fontWeight: '500',
                                                marginTop: '20px',
                                                display: 'inline-block'
                                            }}>{translateText('Click to reveal definition')}</p>
                                        </div>
                                    </div>
                                    
                                    <div 
                                        className="flashcard-back"
                                        onClick={() => {
                                            if (isFlipped) flipCard();
                                        }}
                                    >
                                        <div className="card-content">
                                            <h3 className="definition" style={{
                                                backgroundColor: 'rgba(46, 204, 113, 0.15)',
                                                padding: '10px 20px',
                                                borderRadius: '8px',
                                                color: '#333',
                                                display: 'inline-block',
                                                fontWeight: '600',
                                                border: '1px solid rgba(46, 204, 113, 0.4)',
                                                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
                                                wordBreak: 'break-word',
                                                maxWidth: '100%',
                                                width: 'auto',
                                                overflow: 'hidden'
                                            }}>{flashcards[currentCardIndex]?.definition}</h3>
                                            
                                            {/* Example */}
                                            {flashcards[currentCardIndex]?.example && (
                                                <div className={`enhanced-card-example ${isAsianLanguage(flashcards[currentCardIndex].example) ? 'asian-lang' : ''}`}>
                                                    <span className="enhanced-card-example-title">{translateText('Example')}:</span>
                                                    <p className="enhanced-card-example-content">{flashcards[currentCardIndex].example}</p>
                                                </div>
                                            )}
                                            <p className="card-hint card-hint-back" style={{
                                                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                                                padding: '5px 10px',
                                                borderRadius: '5px',
                                                color: '#333',
                                                marginTop: '15px',
                                                border: '1px solid rgba(0, 0, 0, 0.15)',
                                                fontWeight: '500',
                                                display: 'inline-block'
                                            }}>{translateText('Click to flip back')}</p>
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
                                        <i className="fas fa-chevron-left"></i> {translateText('Previous')}
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
                                        {translateText('Next')} <i className="fas fa-chevron-right"></i>
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
                                            <i className="fas fa-times"></i> {translateText('I don\'t know')}
                                        </button>
                                        <button 
                                            className="feedback-btn known"
                                            onClick={(e) => {
                                                e.stopPropagation(); // Ngăn click lan truyền lên thẻ card
                                                markAsKnown();
                                            }}
                                        >
                                            <i className="fas fa-check"></i> {translateText('I know this')}
                                        </button>
                                    </div>
                                )}
                            </div>
                            
                            <div className="learning-stats">
                                <div className="stat-item">
                                    <i className="fas fa-clock"></i>
                                    <div className="stat-content">
                                        <span className="stat-label">Study Time</span>
                                        <span className="stat-value" style={{ fontSize: '28px', fontWeight: '900', color: '#000000' }}>{formatTime(stats.timeSpent)}</span>
                                        {!isAuthenticated && <span className="stat-note">Not saved</span>}
                                    </div>
                                </div>
                                <div className="stat-item">
                                    <i className="fas fa-check-circle"></i>
                                    <div className="stat-content">
                                        <span className="stat-label">Known Cards</span>
                                        <span className="stat-value" style={{ fontSize: '28px', fontWeight: '900', color: '#000000' }}>{stats.correctCount}</span>
                                        {!isAuthenticated && <span className="stat-note">Not saved</span>}
                                    </div>
                                </div>
                                <div className="stat-item">
                                    <i className="fas fa-eye"></i>
                                    <div className="stat-content">
                                        <span className="stat-label">Cards Viewed</span>
                                        <span className="stat-value" style={{ fontSize: '28px', fontWeight: '900', color: '#000000' }}>{stats.totalViewed}</span>
                                        {!isAuthenticated && <span className="stat-note">Not saved</span>}
                                    </div>
                                </div>
                                <div className="stat-item">
                                    <i className="fas fa-percentage"></i>
                                    <div className="stat-content">
                                        <span className="stat-label">Accuracy</span>
                                        <span className="stat-value" style={{ fontSize: '28px', fontWeight: '900', color: '#000000' }}>
                                            {stats.totalViewed === 0 ? '0%' : `${Math.min(100, Math.round((stats.correctCount / stats.totalViewed) * 100))}%`}
                                        </span>
                                        {!isAuthenticated && <span className="stat-note">Not saved</span>}
                                    </div>
                                </div>
                            </div>
                            
                            {/* Hiển thị thông báo hài hước dựa trên kết quả */}
                            {stats.totalViewed > 0 && (
                                <div className={`funny-message ${getMessageClass()}`}>
                                    <i className="fas fa-laugh-beam"></i>
                                    {getFunnyMessage()}
                                </div>
                            )}
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
            
            {/* Fullscreen Mode */}
            {isFullscreen && (
                <div className="fullscreen-mode">
                    <div className="fullscreen-header">
                        <div className="fullscreen-title">
                            <i className="fas fa-graduation-cap"></i>
                            {flashcardSet?.title || 'Flashcard Study'}
                        </div>
                        <div className="fullscreen-controls">
                            <span style={{ color: 'white', fontWeight: '500' }}>
                                Time: {formatTime(stats.timeSpent)}
                            </span>
                            <button className="exit-fullscreen" onClick={toggleFullscreen}>
                                <i className="fas fa-compress"></i> Exit Fullscreen
                            </button>
                        </div>
                    </div>
                    
                    <div className="fullscreen-progress">
                        <div 
                            className="fullscreen-progress-bar" 
                            style={{ width: `${getProgressPercentage()}%` }}
                        ></div>
                    </div>
                    
                    <div className="fullscreen-container">
                        {flashcards.length > 0 ? (
                            <div className="learning-content" style={{ width: '100%', maxWidth: '900px' }}>
                                <div className="flashcard-container">
                                    <div className={`flashcard ${isFlipped ? 'flipped' : ''}`}>
                                        <div 
                                            className="flashcard-front" 
                                            onClick={() => {
                                                if (!isFlipped) flipCard();
                                            }}
                                            style={{
                                                background: 'linear-gradient(135deg, #3498db, #2980b9)',
                                                height: '500px'
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
                                            style={{
                                                height: '500px'
                                            }}
                                        >
                                            <div className="card-content">
                                                <h3 className="definition">{flashcards[currentCardIndex]?.definition}</h3>
                                                
                                                {/* Example */}
                                                {flashcards[currentCardIndex]?.example && (
                                                    <div className={`enhanced-card-example ${isAsianLanguage(flashcards[currentCardIndex].example) ? 'asian-lang' : ''}`}>
                                                        <span className="enhanced-card-example-title">{translateText('Example')}:</span>
                                                        <p className="enhanced-card-example-content">{flashcards[currentCardIndex].example}</p>
                                                    </div>
                                                )}
                                                <p className="card-hint card-hint-back">Click to flip back</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="card-navigation">
                                        <button 
                                            className="nav-btn prev-btn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                prevCard();
                                            }}
                                            disabled={currentCardIndex === 0}
                                            style={{ 
                                                backgroundColor: 'rgba(255,255,255,0.25)', 
                                                color: 'white', 
                                                border: 'none',
                                                padding: '12px 25px',
                                                fontSize: '18px',
                                                borderRadius: '30px'
                                            }}
                                        >
                                            <i className="fas fa-chevron-left"></i> {translateText('Previous')}
                                        </button>
                                        <span className="card-counter" style={{ 
                                            color: 'white',
                                            backgroundColor: 'rgba(255,255,255,0.2)',
                                            padding: '10px 20px',
                                            borderRadius: '20px',
                                            fontSize: '18px'
                                        }}>
                                            {currentCardIndex + 1} / {flashcards.length}
                                        </span>
                                        <button 
                                            className="nav-btn next-btn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                nextCard();
                                            }}
                                            disabled={currentCardIndex === flashcards.length - 1}
                                            style={{ 
                                                backgroundColor: 'rgba(255,255,255,0.25)', 
                                                color: 'white', 
                                                border: 'none',
                                                padding: '12px 25px',
                                                fontSize: '18px',
                                                borderRadius: '30px'
                                            }}
                                        >
                                            {translateText('Next')} <i className="fas fa-chevron-right"></i>
                                        </button>
                                    </div>
                                    
                                    {isFlipped && (
                                        <div className="feedback-buttons" style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            gap: '20px',
                                            marginTop: '30px'
                                        }}>
                                            <button 
                                                className="feedback-btn unknown"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    markAsUnknown();
                                                }}
                                                style={{
                                                    fontSize: '18px',
                                                    padding: '15px 30px',
                                                    borderRadius: '30px'
                                                }}
                                            >
                                                <i className="fas fa-times"></i> {translateText('I don\'t know')}
                                            </button>
                                            <button 
                                                className="feedback-btn known"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    markAsKnown();
                                                }}
                                                style={{
                                                    fontSize: '18px',
                                                    padding: '15px 30px',
                                                    borderRadius: '30px'
                                                }}
                                            >
                                                <i className="fas fa-check"></i> {translateText('I know this')}
                                            </button>
                                        </div>
                                    )}
                                </div>
                                
                                {/* Fullscreen Stats */}
                                <div className="learning-stats" style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                    borderRadius: '15px',
                                    maxWidth: '800px',
                                    padding: '15px 20px',
                                    marginTop: '30px',
                                    display: 'flex',
                                    justifyContent: 'space-around',
                                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
                                }}>
                                    <div className="stat-item" style={{ textAlign: 'center' }}>
                                        <i className="fas fa-clock" style={{ color: '#3498db', fontSize: '24px' }}></i>
                                        <div className="stat-content" style={{ textAlign: 'center' }}>
                                            <span className="stat-label" style={{ color: '#555', fontWeight: '500', fontSize: '14px' }}>
                                                {translateText('Study Time')}
                                            </span>
                                            <span className="stat-value" style={{ color: '#000000', fontWeight: '900', fontSize: '28px', textShadow: '0 1px 1px rgba(0,0,0,0.1)' }}>
                                                {formatTime(stats.timeSpent)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="stat-item" style={{ textAlign: 'center' }}>
                                        <i className="fas fa-check-circle" style={{ color: '#3498db', fontSize: '24px' }}></i>
                                        <div className="stat-content" style={{ textAlign: 'center' }}>
                                            <span className="stat-label" style={{ color: '#555', fontWeight: '500', fontSize: '14px' }}>
                                                {translateText('Known Cards')}
                                            </span>
                                            <span className="stat-value" style={{ color: '#000000', fontWeight: '900', fontSize: '28px', textShadow: '0 1px 1px rgba(0,0,0,0.1)' }}>
                                                {stats.correctCount}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="stat-item" style={{ textAlign: 'center' }}>
                                        <i className="fas fa-eye" style={{ color: '#3498db', fontSize: '24px' }}></i>
                                        <div className="stat-content" style={{ textAlign: 'center' }}>
                                            <span className="stat-label" style={{ color: '#555', fontWeight: '500', fontSize: '14px' }}>
                                                {translateText('Cards Viewed')}
                                            </span>
                                            <span className="stat-value" style={{ color: '#000000', fontWeight: '900', fontSize: '28px', textShadow: '0 1px 1px rgba(0,0,0,0.1)' }}>
                                                {stats.totalViewed}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="stat-item" style={{ textAlign: 'center' }}>
                                        <i className="fas fa-chart-line" style={{ color: '#3498db', fontSize: '24px' }}></i>
                                        <div className="stat-content" style={{ textAlign: 'center' }}>
                                            <span className="stat-label" style={{ color: '#555', fontWeight: '500', fontSize: '14px' }}>
                                                {translateText('Accuracy')}
                                            </span>
                                            <span className="stat-value" style={{ color: '#000000', fontWeight: '900', fontSize: '28px', textShadow: '0 1px 1px rgba(0,0,0,0.1)' }}>
                                                {stats.totalViewed > 0 ? Math.round((stats.correctCount / stats.totalViewed) * 100) : 0}%
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div style={{ color: 'white', textAlign: 'center' }}>
                                <h2>No flashcards found</h2>
                                <p>This set doesn't have any flashcards yet.</p>
                                <button 
                                    className="exit-fullscreen" 
                                    onClick={toggleFullscreen}
                                    style={{ marginTop: '20px' }}
                                >
                                    <i className="fas fa-arrow-left"></i> Return to Set
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default FlashcardLearningPage; 