import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuthenticatedRequest } from '../utils/apiUtils';
import '../css/components/MultipleChoiceTest.css';
import { useLanguage } from '../contexts/LanguageContext';

function CreateMultipleChoiceTestPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const makeRequest = useAuthenticatedRequest();
    const { currentLanguage } = useLanguage();
    const generatedContent = location.state?.generatedContent || null;
    
    // Get reading data passed through navigation if available
    const readingTitle = location.state?.readingTitle || '';
    const readingContent = location.state?.readingContent || '';
    const readingLanguage = location.state?.readingLanguage || 'en';
    
    // Map language code to API language format
    const mapLanguageCode = (code) => {
        const langMap = {
            'en': 'ENG',
            'vi': 'VIE',
            'ja': 'JPN',
            'ko': 'KOR',
            'zh': 'CHN',
            'fr': 'FRA',
            'de': 'DEU',
            'es': 'ESP'
        };
        return langMap[code] || 'ENG';
    };

    // Main test data
    const [testData, setTestData] = useState({
        title: generatedContent?.title || readingTitle || '',
        content: generatedContent?.content || readingContent || '',
        learningLanguage: mapLanguageCode(readingLanguage) || "ENG",
        nativeLanguage: "VIE",
        isPublic: true,
        level: 3,
    });

    // Question management
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState({
        questionText: '',
        answer_a: '',
        answer_b: '',
        answer_c: '',
        answer_d: '',
        correctAnswer: 1,
        explanation: ''
    });
    const [editingQuestionIndex, setEditingQuestionIndex] = useState(-1);
    const [testCreated, setTestCreated] = useState(false);
    const [testId, setTestId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [languageOptions, setLanguageOptions] = useState([
        { code: "ENG", name: "English" },
        { code: "VIE", name: "Vietnamese" },
        { code: "JPN", name: "Japanese" },
        { code: "KOR", name: "Korean" },
        { code: "CHN", name: "Chinese" },
        { code: "FRA", name: "French" },
        { code: "DEU", name: "German" },
        { code: "ESP", name: "Spanish" }
    ]);

    // Initialize with generated questions if available
    useEffect(() => {
        if (generatedContent?.questions) {
            const formattedQuestions = generatedContent.questions.map((q, index) => ({
                id: `temp-${index}`,
                questionText: q.text,
                answer_a: q.options[0],
                answer_b: q.options[1],
                answer_c: q.options[2],
                answer_d: q.options[3],
                correctAnswer: q.correctOption + 1, // Convert from 0-based to 1-based
                explanation: q.explanation || ''
            }));
            setQuestions(formattedQuestions);
        }
    }, [generatedContent]);

    const handleTestInputChange = (e) => {
        const { name, value } = e.target;
        setTestData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleQuestionInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentQuestion(prev => ({
            ...prev,
            [name]: name === 'correctAnswer' ? parseInt(value) : value
        }));
    };

    const handleAddQuestion = () => {
        // Validate question form
        if (!validateQuestionForm()) {
            return;
        }

        if (testCreated) {
            // If test already created, call API to add question
            addQuestionToTest();
        } else {
            // If not, just add to local state
            setQuestions(prev => [...prev, { ...currentQuestion, id: `temp-${Date.now()}` }]);
            resetQuestionForm();
        }
    };

    const validateQuestionForm = () => {
        const { questionText, answer_a, answer_b, answer_c, answer_d, correctAnswer } = currentQuestion;
        
        if (!questionText.trim()) {
            toast.error('Question text is required');
            return false;
        }
        
        if (!answer_a.trim() || !answer_b.trim() || !answer_c.trim() || !answer_d.trim()) {
            toast.error('All answer options are required');
            return false;
        }
        
        if (questionText.length > 2000) {
            toast.error('Question text must be less than 2000 characters');
            return false;
        }
        
        if ([answer_a, answer_b, answer_c, answer_d].some(answer => answer.length > 500)) {
            toast.error('Answer options must be less than 500 characters each');
            return false;
        }
        
        if (correctAnswer < 1 || correctAnswer > 4) {
            toast.error('Correct answer must be between 1 and 4');
            return false;
        }
        
        return true;
    };

    const validateTestForm = () => {
        const { title, content, learningLanguage, nativeLanguage, level } = testData;
        
        if (!title.trim()) {
            toast.error('Title is required');
            return false;
        }
        
        if (!content.trim()) {
            toast.error('Content is required');
            return false;
        }
        
        if (title.length > 250) {
            toast.error('Title must be less than 250 characters');
            return false;
        }
        
        if (!learningLanguage || !nativeLanguage) {
            toast.error('Both languages are required');
            return false;
        }
        
        if (level < 1 || level > 6) {
            toast.error('Level must be between 1 and 6');
            return false;
        }
        
        return true;
    };

    const resetQuestionForm = () => {
        setCurrentQuestion({
            questionText: '',
            answer_a: '',
            answer_b: '',
            answer_c: '',
            answer_d: '',
            correctAnswer: 1,
            explanation: ''
        });
        setEditingQuestionIndex(-1);
    };

    const handleEditQuestion = (index) => {
        const question = questions[index];
        setCurrentQuestion(question);
        setEditingQuestionIndex(index);
    };

    const handleUpdateQuestion = () => {
        if (!validateQuestionForm()) {
            return;
        }

        if (testCreated && questions[editingQuestionIndex].questionId) {
            // If this is a server-side question, update via API
            updateQuestionOnServer(questions[editingQuestionIndex].questionId);
        } else {
            // Otherwise just update local state
            const updatedQuestions = [...questions];
            updatedQuestions[editingQuestionIndex] = { ...currentQuestion };
            setQuestions(updatedQuestions);
            resetQuestionForm();
        }
    };

    const handleDeleteQuestion = (index) => {
        const question = questions[index];
        
        if (testCreated && question.questionId) {
            // If question exists on server, delete via API
            deleteQuestionFromServer(question.questionId);
        } else {
            // Otherwise just remove from local state
            setQuestions(prev => prev.filter((_, i) => i !== index));
        }
    };

    const createTest = async () => {
        if (!validateTestForm()) {
            return;
        }

        setLoading(true);
        try {
            const baseUrl = process.env.REACT_APP_API_URL || 'https://6d2c-115-76-51-131.ngrok-free.app';
            const apiUrl = baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
            
            const response = await makeRequest(`${apiUrl}/MultipleChoiceTest/Create`, {
                method: 'POST',
                body: JSON.stringify(testData)
            });

            if (response.success) {
                toast.success('Reading test created successfully! Now you can add questions.');
                // Navigate to edit page to add questions
                navigate(`/readings/multiple-choice/edit/${response.data.id}`);
            } else {
                toast.error(response.data?.message || 'Failed to create test');
                console.error('Create test error:', response);
            }
        } catch (error) {
            console.error('Error creating test:', error);
            toast.error('An error occurred while creating the test');
        } finally {
            setLoading(false);
        }
    };

    const addQuestionsInBatch = async (testId) => {
        // Add all local questions to the created test
        for (const question of questions) {
            try {
                await addQuestionToServer(testId, question);
            } catch (error) {
                console.error('Error adding question:', error);
                // Continue with next question even if this one fails
            }
        }
        
        // Refresh questions list from server
        fetchQuestions(testId);
    };

    const addQuestionToTest = async () => {
        if (!testId) {
            toast.error('No test ID available');
            return;
        }

        if (questions.length >= 5) {
            toast.error('Maximum of 5 questions reached');
            return;
        }

        try {
            setLoading(true);
            await addQuestionToServer(testId, currentQuestion);
            resetQuestionForm();
            fetchQuestions(testId);
        } catch (error) {
            console.error('Error adding question:', error);
        } finally {
            setLoading(false);
        }
    };

    const addQuestionToServer = async (testId, question) => {
        const baseUrl = process.env.REACT_APP_API_URL || 'https://6d2c-115-76-51-131.ngrok-free.app';
        const apiUrl = baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
        
        const response = await makeRequest(`${apiUrl}/Question/Create/${testId}`, {
            method: 'POST',
            body: JSON.stringify({
                questionText: question.questionText,
                answer_a: question.answer_a,
                answer_b: question.answer_b,
                answer_c: question.answer_c,
                answer_d: question.answer_d,
                correctAnswer: question.correctAnswer,
                explanation: question.explanation
            })
        });

        if (response.success) {
            toast.success('Question added successfully!');
            return response.data;
        } else {
            // Handle specific error responses
            if (response.status === 400) {
                const errorMessage = response.data?.message || 
                                    (response.data?.errors?.CorrectAnswer && 
                                     `Validation error: ${response.data.errors.CorrectAnswer[0]}`);
                                     
                if (response.data?.message?.includes('maximum limit of 5 questions')) {
                    toast.error('This test has reached the maximum limit of 5 questions');
                } else {
                    toast.error(errorMessage || 'Invalid question data');
                }
            } else {
                toast.error(response.data?.message || 'Failed to add question');
            }
            throw new Error('Failed to add question');
        }
    };

    const updateQuestionOnServer = async (questionId) => {
        setLoading(true);
        try {
            const baseUrl = process.env.REACT_APP_API_URL || 'https://6d2c-115-76-51-131.ngrok-free.app';
            const apiUrl = baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
            
            const response = await makeRequest(`${apiUrl}/Question/Update/${questionId}`, {
                method: 'PUT', 
                body: JSON.stringify(currentQuestion)
            });

            if (response.success) {
                toast.success('Question updated successfully!');
                resetQuestionForm();
                fetchQuestions(testId);
            } else {
                toast.error(response.data?.message || 'Failed to update question');
            }
        } catch (error) {
            console.error('Error updating question:', error);
            toast.error('An error occurred while updating the question');
        } finally {
            setLoading(false);
        }
    };

    const deleteQuestionFromServer = async (questionId) => {
        if (window.confirm('Are you sure you want to delete this question?')) {
            setLoading(true);
            try {
                const baseUrl = process.env.REACT_APP_API_URL || 'https://6d2c-115-76-51-131.ngrok-free.app';
                const apiUrl = baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
                
                const response = await makeRequest(`${apiUrl}/Question/Delete/${questionId}`, {
                    method: 'DELETE'
                });

                if (response.success) {
                    toast.success('Question deleted successfully!');
                    fetchQuestions(testId);
                } else {
                    toast.error(response.data?.message || 'Failed to delete question');
                }
            } catch (error) {
                console.error('Error deleting question:', error);
                toast.error('An error occurred while deleting the question');
            } finally {
                setLoading(false);
            }
        }
    };

    const fetchQuestions = async (testId) => {
        setLoading(true);
        try {
            const baseUrl = process.env.REACT_APP_API_URL || 'https://6d2c-115-76-51-131.ngrok-free.app';
            const apiUrl = baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
            
            const response = await makeRequest(`${apiUrl}/Question/GetAll/${testId}`, {
                method: 'GET'
            });

            if (response.success) {
                setQuestions(response.data || []);
            } else {
                toast.error(response.data?.message || 'Failed to fetch questions');
                setQuestions([]);
            }
        } catch (error) {
            console.error('Error fetching questions:', error);
            toast.error('An error occurred while fetching questions');
            setQuestions([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        const confirmLeave = window.confirm('Are you sure you want to cancel? Any unsaved changes will be lost.');
        if (confirmLeave) {
            window.location.href = '/readings';
        }
    };

    return (
        <div className="create-test-container">
            <div className="create-test-header">
                <h1 className="create-test-title">Create Reading Test</h1>
                <div className="header-actions">
                    <button 
                        className="cancel-button" 
                        onClick={handleCancel}
                        disabled={loading}
                    >
                        <i className="fas fa-times"></i>
                        Cancel
                    </button>
                    <button 
                        className="save-button"
                        onClick={createTest}
                        disabled={loading}
                    >
                        <i className="fas fa-save"></i>
                        {loading ? 'Creating...' : 'Create Reading Test'}
                    </button>
                </div>
            </div>

            <div className="test-create-form">
                <div className="form-section test-info">
                    <div className="test-info-header">
                        <h2>Reading Test Information</h2>
                    </div>
                    
                    <div className="workflow-info">
                        First, create your reading test. After saving, you'll be able to add questions.
                    </div>
                    
                    <div className="form-section-content">
                        <div className="title-field">
                            <div className="form-group">
                                <label htmlFor="title">Title</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    placeholder="Enter test title"
                                    value={testData.title}
                                    onChange={handleTestInputChange}
                                    maxLength={250}
                                />
                            </div>
                        </div>

                        <div className="language-fields">
                            <div className="form-group">
                                <label htmlFor="learningLanguage">Learning Language</label>
                                <select 
                                    id="learningLanguage" 
                                    name="learningLanguage"
                                    value={testData.learningLanguage}
                                    onChange={handleTestInputChange}
                                >
                                    {languageOptions.map(lang => (
                                        <option key={lang.code} value={lang.code}>
                                            {lang.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="nativeLanguage">Native Language</label>
                                <select 
                                    id="nativeLanguage" 
                                    name="nativeLanguage"
                                    value={testData.nativeLanguage}
                                    onChange={handleTestInputChange}
                                >
                                    {languageOptions.map(lang => (
                                        <option key={lang.code} value={lang.code}>
                                            {lang.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="isPublic">Visibility</label>
                                <select 
                                    id="isPublic" 
                                    name="isPublic"
                                    value={testData.isPublic}
                                    onChange={(e) => setTestData({...testData, isPublic: e.target.value === 'true'})}
                                >
                                    <option value="true">Public</option>
                                    <option value="false">Private</option>
                                </select>
                            </div>
                        </div>

                        <div className="difficulty-field">
                            <div className="form-group">
                                <label htmlFor="level">Difficulty Level</label>
                                <select 
                                    id="level" 
                                    name="level"
                                    value={testData.level}
                                    onChange={handleTestInputChange}
                                >
                                    <option value={1}>Level 1 - Beginner</option>
                                    <option value={2}>Level 2 - Elementary</option>
                                    <option value={3}>Level 3 - Intermediate</option>
                                    <option value={4}>Level 4 - Upper Intermediate</option>
                                    <option value={5}>Level 5 - Advanced</option>
                                    <option value={6}>Level 6 - Proficient</option>
                                </select>
                            </div>
                        </div>

                        <div className="content-field">
                            <div className="form-group">
                                <label htmlFor="content">Reading Content</label>
                                <textarea
                                    id="content"
                                    name="content"
                                    rows="10"
                                    placeholder="Enter the reading passage..."
                                    value={testData.content}
                                    onChange={handleTestInputChange}
                                ></textarea>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateMultipleChoiceTestPage; 