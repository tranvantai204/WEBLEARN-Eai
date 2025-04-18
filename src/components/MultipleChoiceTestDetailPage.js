import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuthenticatedRequest } from '../utils/apiUtils';
import '../css/components/MultipleChoiceTest.css';
import { useLanguage } from '../contexts/LanguageContext';

function MultipleChoiceTestDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const makeRequest = useAuthenticatedRequest();
    const { currentLanguage } = useLanguage();
    
    const [testData, setTestData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedQuestion, setSelectedQuestion] = useState(0);
    const [userAnswers, setUserAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);
    const [score, setScore] = useState(0);

    useEffect(() => {
        fetchTestData();
    }, [id]);

    const fetchTestData = async () => {
        if (!id) {
            setError('No test ID provided');
            setLoading(false);
            return;
        }

        try {
            console.log(`Fetching test details for ID: ${id}`);
            
            // Get base URL from environment or use default
            const baseUrl = process.env.REACT_APP_API_URL || 'https://6d2c-115-76-51-131.ngrok-free.app';
            const apiUrl = baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
            
            // First try GetById endpoint
            let response = await makeRequest(`${apiUrl}/MultipleChoiceTest/GetById/${id}`, {
                method: 'GET'
            }, false); // The false parameter indicates authentication is optional

            // If that fails, try the Get endpoint
            if (!response.success) {
                console.log('Initial endpoint failed, trying alternative endpoint');
                response = await makeRequest(`${apiUrl}/MultipleChoiceTest/Get/${id}`, {
                    method: 'GET'
                }, false);
            }

            if (response.success) {
                console.log('Test data fetched successfully:', response.data);
                setTestData(response.data);
                // Initialize userAnswers object with empty values for each question
                const initialAnswers = {};
                response.data.questions.forEach((q, index) => {
                    initialAnswers[q.questionId] = null;
                });
                setUserAnswers(initialAnswers);
            } else {
                console.error('Failed to fetch test:', response);
                setError(response.data?.message || 'Failed to fetch test data');
            }
        } catch (error) {
            console.error('Error fetching test:', error);
            setError('An error occurred while fetching the test details: ' + (error.message || 'Unknown error'));
        } finally {
            setLoading(false);
        }
    };

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
                                <i className="fas fa-redo"></i> Try Again
                            </button>
                            <Link 
                                to="/readings"
                                className="back-to-readings-btn"
                            >
                                <i className="fas fa-arrow-left"></i> Back to Reading Tests
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
        </div>
    );
}

export default MultipleChoiceTestDetailPage; 