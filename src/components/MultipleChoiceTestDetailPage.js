import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { useAuthenticatedRequest } from '../utils/apiUtils';
import '../css/components/MultipleChoiceTest.css';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { FaArrowLeft, FaShare, FaRedo, FaFlag } from 'react-icons/fa';
import ContentReportModal from './ContentReportModal';

function MultipleChoiceTestDetailPage() {
    const { testId, id } = useParams(); // Get both possible parameter names
    const navigate = useNavigate();
    const location = useLocation();
    const makeRequest = useAuthenticatedRequest();
    const { currentLanguage, translateText } = useLanguage();
    const { isAuthenticated } = useAuth();
    
    // Determine which ID to use (testId from public route or id from protected route)
    const actualTestId = testId || id;
    
    console.log("MultipleChoiceTestDetailPage - URL ID Parameter:", actualTestId);
    console.log("Current path:", location.pathname);
    
    // Check if this is accessed via public route
    const isPublicRoute = location.pathname.includes('/public-test/');
    
    const [testData, setTestData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedQuestion, setSelectedQuestion] = useState(0);
    const [userAnswers, setUserAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);
    const [score, setScore] = useState(0);
    
    // Get base URL from environment or use default
    const baseUrl = process.env.REACT_APP_API_URL || 'https://6d2c-115-76-51-131.ngrok-free.app';
    const API_URL = baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
    
    console.log("MultipleChoiceTestDetailPage - API_URL:", API_URL);
    
    // Timer reference to track session duration
    const learnStartTimeRef = useRef(null);

    // Add state for report modal
    const [showReportModal, setShowReportModal] = useState(false);

    useEffect(() => {
        // Fetch test data first
        if (actualTestId) {
            fetchTestData();
        } else {
            console.error("ID is missing in URL parameters");
            setError("No test ID provided");
            setLoading(false);
        }
        
        // End learning session when component unmounts
        return () => {
            endLearningSession();
        };
    }, [actualTestId]);
    
    // Function to start learning session
    const startLearningSession = async () => {
        learnStartTimeRef.current = new Date();
        
        // Only track for authenticated users
        if (isAuthenticated) {
            try {
                console.log('Starting learning session...');
                // Call API to start learning session
                const response = await fetch(`${API_URL}/UserLearningStats/StartLearn`, {
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
                
                console.log('Reading test learning session started successfully');
            } catch (err) {
                console.error('Failed to start learning session:', err);
                // Don't show error to user, let them continue anyway
            }
        }
    };
    
    // Function to end learning session
    const endLearningSession = async () => {
        // Only track for authenticated users
        if (isAuthenticated && learnStartTimeRef.current) {
            try {
                console.log('Ending learning session...');
                // Call API to end learning session
                const response = await fetch(`${API_URL}/UserLearningStats/EndLearn`, {
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
                
                console.log('Reading test learning session ended successfully');
            } catch (err) {
                console.error('Failed to end learning session:', err);
                // Don't show error to user
            }
        }
    };

    const fetchTestData = async () => {
        if (!actualTestId) {
            console.error('Missing test ID in URL parameters');
            setError('No test ID provided');
            setLoading(false);
            return;
        }

        try {
            // Ensure ID is properly formatted (not lower/upper case sensitivity)
            const formattedId = actualTestId.toString().trim();
            console.log(`Fetching test details for ID: ${formattedId}`);
            
            // Use exact API endpoint according to documentation
            const apiEndpoint = `${API_URL}/MultipleChoiceTest/GetById/${formattedId}`;
            console.log('Calling API endpoint:', apiEndpoint);
            
            // Call API to get test details - with detailed error handling
            const response = await fetch(apiEndpoint, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true',
                    'Authorization': isAuthenticated ? `Bearer ${localStorage.getItem('accessToken')}` : undefined
                }
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error(`API error (${response.status}):`, errorText);
                throw new Error(`Failed to fetch test: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Test data fetched successfully:', data);
            setTestData(data);
            
            // Initialize userAnswers object with empty values for each question
            const initialAnswers = {};
            if (data.questions && Array.isArray(data.questions)) {
                data.questions.forEach((q) => {
                    initialAnswers[q.questionId] = null;
                });
                setUserAnswers(initialAnswers);
                
                // Start learning session only after successfully loading test data
                startLearningSession();
            } else {
                console.error('No questions found in the test data or invalid format');
                setError('Invalid test data format: questions missing or not in array format');
            }
        } catch (error) {
            console.error('Error fetching test:', error);
            setError('An error occurred while fetching the test details: ' + (error.message || 'Unknown error'));
        } finally {
            setLoading(false);
        }
    };

    function copyToClipboard(link) {
        navigator.clipboard.writeText(link)
        toast.success("Link đã được copy!");   
    }

    const handleAnswerSelect = (questionId, answerIndex) => {
        setUserAnswers(prev => ({
            ...prev,
            [questionId]: answerIndex
        }));
    };

    const handleNextQuestion = () => {
        if (selectedQuestion < testData.questions.length - 1) {
            setSelectedQuestion(prev => prev + 1);
        }
    };

    const handlePrevQuestion = () => {
        if (selectedQuestion > 0) {
            setSelectedQuestion(prev => prev - 1);
        }
    };

    const handleSubmitTest = () => {
        // Check if all questions have been answered
        const unansweredQuestions = Object.values(userAnswers).filter(answer => answer === null).length;
        
        if (unansweredQuestions > 0) {
            if (window.confirm(`You have ${unansweredQuestions} unanswered questions. Are you sure you want to submit?`)) {
                calculateResults();
            }
        } else {
            calculateResults();
        }
    };

    const calculateResults = () => {
        let correctAnswers = 0;
        testData.questions.forEach(question => {
            if (userAnswers[question.questionId] === question.correctAnswer) {
                correctAnswers++;
            }
        });
        
        const finalScore = Math.round((correctAnswers / testData.questions.length) * 100);
        setScore(finalScore);
        setShowResults(true);
        
        // Không cần gọi RecordCompletion vì API này không tồn tại
        // Chỉ giữ lại logs để theo dõi
        console.log('Test completed with score:', finalScore);
    };

    const resetTest = () => {
        // Reset user answers
        const initialAnswers = {};
        testData.questions.forEach(q => {
            initialAnswers[q.questionId] = null;
        });
        setUserAnswers(initialAnswers);
        setSelectedQuestion(0);
        setShowResults(false);
        
        // Record the reset action in learning stats if authenticated
        if (isAuthenticated) {
            try {
                // End the current learning session
                endLearningSession();
                
                // Start a new learning session
                startLearningSession();
            } catch (err) {
                console.error('Error resetting learning session:', err);
            }
        }
    };

    // Add handlers for the report functionality
    const openReportModal = () => {
        if (!isAuthenticated) {
            toast.warning('Please log in to report content');
            return;
        }
        setShowReportModal(true);
    };
    
    const closeReportModal = () => {
        setShowReportModal(false);
    };

    if (loading) {
        return (
            <div className="main-content">
                <div className="loader"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="main-content">
                <div className="error-container">
                    <h2>Error</h2>
                    <p>{error}</p>
                    <button 
                        className="primary-button"
                        onClick={() => navigate('/readings')}
                    >
                        Back to Reading Tests
                    </button>
                </div>
            </div>
        );
    }

    if (!testData) {
        return (
            <div className="main-content">
                <div className="error-container">
                    <h2>Test Not Found</h2>
                    <p>The requested test could not be found.</p>
                    <button 
                        className="primary-button"
                        onClick={() => navigate('/readings')}
                    >
                        Back to Reading Tests
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="test-detail-container">
            <ToastContainer/>
            
            {!isAuthenticated && isPublicRoute && (
                <div className="guest-user-banner">
                    <div className="banner-content">
                        <i className="fas fa-info-circle"></i>
                        <div>
                            <p className="banner-title">{translateText('Taking Test as Guest')}</p>
                            <p>{translateText('You can take this test without an account, but your scores and progress will not be saved.')}</p>
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
            
            <div className="test-detail-header">
                <h1 className="test-detail-title">{testData.title}</h1>
                <div className="test-meta">
                    <span className="test-level">
                        Level: {testData.level === 0 ? 'Beginner' : 
                              testData.level === 1 ? 'Elementary' :
                              testData.level === 2 ? 'Pre-Intermediate' :
                              testData.level === 3 ? 'Intermediate' :
                              testData.level === 4 ? 'Upper Intermediate' :
                              testData.level === 5 ? 'Advanced' : 'Proficient'}
                    </span>
                    <span className="test-language">
                        {testData.learningLanguage === 'ENG' ? 'English' : 
                         testData.learningLanguage === 'VIE' ? 'Vietnamese' :
                         testData.learningLanguage === 'JPN' ? 'Japanese' :
                         testData.learningLanguage === 'KOR' ? 'Korean' :
                         testData.learningLanguage === 'CHN' ? 'Chinese' :
                         testData.learningLanguage === 'FRA' ? 'French' :
                         testData.learningLanguage === 'DEU' ? 'German' :
                         testData.learningLanguage === 'ESP' ? 'Spanish' : testData.learningLanguage}
                    </span>
                    <div className='header-actions'>
                        {isPublicRoute && (
                            <button 
                                className="back-button"
                                onClick={() => navigate('/readings/tests/explore')}
                            >
                                <FaArrowLeft /> {translateText('Back to Explore')}
                            </button>
                        )}
                        {
                            testData.isPublic ? 
                            <button className='share-button' onClick={() => copyToClipboard(window.location.href)}>
                                <FaShare /> {translateText('Share with friends')}
                            </button>:
                            <></>
                        }
                        {/* Add report button */}
                        {isAuthenticated && !testData.isOwner && (
                            <button 
                                className="report-button"
                                onClick={openReportModal}
                            >
                                <FaFlag /> {translateText('Report Content')}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="test-detail-content">
                <div className="reading-section">
                    <h2>Reading Content</h2>
                    <div className="reading-content-box">
                        <p className="reading-content">{testData.content}</p>
                    </div>
                </div>

                {showResults ? (
                    <div className="results-section">
                        <h2>Test Results</h2>
                        <div className="score-display">
                            <div className={`score-circle ${
                                score >= 80 ? 'excellent' :
                                score >= 60 ? 'good' :
                                score >= 40 ? 'average' : 'poor'
                            }`}>
                                <span className="score-number">{score}%</span>
                            </div>
                            <p className="score-text">
                                You answered {testData.questions.filter(q => userAnswers[q.questionId] === q.correctAnswer).length} 
                                out of {testData.questions.length} questions correctly.
                            </p>
                        </div>

                        <div className="results-details">
                            <h3>Detailed Answers</h3>
                            {testData.questions.map((question, index) => (
                                <div 
                                    key={question.questionId} 
                                    className={`result-item ${userAnswers[question.questionId] === question.correctAnswer ? 'correct' : 'incorrect'}`}
                                >
                                    <p className="result-question">
                                        <span className="question-number">{index + 1}.</span> {question.questionText}
                                    </p>
                                    <div className="result-answers">
                                        <p className={`result-answer ${question.correctAnswer === 1 ? 'correct-answer' : ''} ${userAnswers[question.questionId] === 1 ? 'user-answer' : ''}`}>
                                            <span className="option-label">A</span> {question.answer_a}
                                        </p>
                                        <p className={`result-answer ${question.correctAnswer === 2 ? 'correct-answer' : ''} ${userAnswers[question.questionId] === 2 ? 'user-answer' : ''}`}>
                                            <span className="option-label">B</span> {question.answer_b}
                                        </p>
                                        <p className={`result-answer ${question.correctAnswer === 3 ? 'correct-answer' : ''} ${userAnswers[question.questionId] === 3 ? 'user-answer' : ''}`}>
                                            <span className="option-label">C</span> {question.answer_c}
                                        </p>
                                        <p className={`result-answer ${question.correctAnswer === 4 ? 'correct-answer' : ''} ${userAnswers[question.questionId] === 4 ? 'user-answer' : ''}`}>
                                            <span className="option-label">D</span> {question.answer_d}
                                        </p>
                                    </div>
                                    {question.explanation && (
                                        <div className="result-explanation">
                                            <strong>Explanation:</strong>
                                            <p>{question.explanation}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="results-actions">
                            <button 
                                className="reset-test-btn"
                                onClick={resetTest}
                            >
                                <FaRedo /> {translateText('Try Again')}
                            </button>
                            <Link 
                                to={isPublicRoute ? "/readings/tests/explore" : "/readings"}
                                className="back-to-readings-btn"
                            >
                                <FaArrowLeft /> {isPublicRoute ? translateText('Back to Explore') : translateText('Back to Reading Tests')}
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="questions-section">
                        <div className="questions-header">
                            <h2>Questions</h2>
                            <div className="questions-progress">
                                <span>{selectedQuestion + 1} of {testData.questions.length}</span>
                                <div className="progress-bar">
                                    <div 
                                        className="progress-fill" 
                                        style={{width: `${((selectedQuestion + 1) / testData.questions.length) * 100}%`}}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        <div className="question-container">
                            {testData.questions.length > 0 && (
                                <div className="question-item">
                                    <p className="question-text">
                                        <span className="question-number">{selectedQuestion + 1}.</span> {testData.questions[selectedQuestion].questionText}
                                    </p>
                                    <div className="question-answers">
                                        <div 
                                            className={`answer-option ${userAnswers[testData.questions[selectedQuestion].questionId] === 1 ? 'selected' : ''}`}
                                            onClick={() => handleAnswerSelect(testData.questions[selectedQuestion].questionId, 1)}
                                        >
                                            <span className="option-label">A</span>
                                            <p className="option-text">{testData.questions[selectedQuestion].answer_a}</p>
                                        </div>
                                        <div 
                                            className={`answer-option ${userAnswers[testData.questions[selectedQuestion].questionId] === 2 ? 'selected' : ''}`}
                                            onClick={() => handleAnswerSelect(testData.questions[selectedQuestion].questionId, 2)}
                                        >
                                            <span className="option-label">B</span>
                                            <p className="option-text">{testData.questions[selectedQuestion].answer_b}</p>
                                        </div>
                                        <div 
                                            className={`answer-option ${userAnswers[testData.questions[selectedQuestion].questionId] === 3 ? 'selected' : ''}`}
                                            onClick={() => handleAnswerSelect(testData.questions[selectedQuestion].questionId, 3)}
                                        >
                                            <span className="option-label">C</span>
                                            <p className="option-text">{testData.questions[selectedQuestion].answer_c}</p>
                                        </div>
                                        <div 
                                            className={`answer-option ${userAnswers[testData.questions[selectedQuestion].questionId] === 4 ? 'selected' : ''}`}
                                            onClick={() => handleAnswerSelect(testData.questions[selectedQuestion].questionId, 4)}
                                        >
                                            <span className="option-label">D</span>
                                            <p className="option-text">{testData.questions[selectedQuestion].answer_d}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="questions-navigation">
                                <button 
                                    className="prev-question-btn"
                                    onClick={handlePrevQuestion}
                                    disabled={selectedQuestion === 0}
                                >
                                    <i className="fas fa-arrow-left"></i> Previous
                                </button>
                                
                                {selectedQuestion < testData.questions.length - 1 ? (
                                    <button 
                                        className="next-question-btn"
                                        onClick={handleNextQuestion}
                                    >
                                        Next <i className="fas fa-arrow-right"></i>
                                    </button>
                                ) : (
                                    <button 
                                        className="submit-test-btn"
                                        onClick={handleSubmitTest}
                                    >
                                        Submit Test
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="questions-indicators">
                            {testData.questions.map((question, index) => (
                                <div 
                                    key={question.questionId}
                                    className={`question-indicator ${selectedQuestion === index ? 'active' : ''} ${userAnswers[question.questionId] !== null ? 'answered' : ''}`}
                                    onClick={() => setSelectedQuestion(index)}
                                >
                                    {index + 1}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Add the ContentReportModal at the end of the component */}
            <ContentReportModal
                isOpen={showReportModal}
                onClose={closeReportModal}
                contentId={actualTestId}
                contentType={1} // 1 for MultipleChoice
                contentName={testData?.title || 'Multiple Choice Test'}
            />
        </div>
    );
}

export default MultipleChoiceTestDetailPage; 