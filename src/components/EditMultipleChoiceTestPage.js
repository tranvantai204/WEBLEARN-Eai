import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuthenticatedRequest } from '../utils/apiUtils';
import '../css/components/MultipleChoiceTest.css';
import { useLanguage } from '../contexts/LanguageContext';
import { useMultipleChoiceTest } from '../contexts/MultipleChoiceTestContext';
import { FaLock, FaLockOpen } from 'react-icons/fa';

function EditMultipleChoiceTestPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const makeRequest = useAuthenticatedRequest();
    const { currentLanguage } = useLanguage();
    const { togglePublicStatus } = useMultipleChoiceTest();

    // Main test data
    const [testData, setTestData] = useState({
        title: '',
        content: '',
        learningLanguage: '',
        nativeLanguage: '',
        isPublic: true,
        level: 1,
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
    const [loading, setLoading] = useState(false);
    const [testLoaded, setTestLoaded] = useState(false);
    const [activeTab, setActiveTab] = useState('reading'); // 'reading' or 'questions'

    // Thêm state để theo dõi chế độ chỉnh sửa cho phần nội dung bài đọc
    const [isEditingContent, setIsEditingContent] = useState(false);

    // Fetch test data when component mounts
    useEffect(() => {
        fetchTestData();
    }, [id]);

    const fetchTestData = async () => {
        if (!id) {
            toast.error('No test ID provided');
            navigate('/readings');
            return;
        }

        setLoading(true);
        try {
            console.log(`Fetching test data for ID: ${id}`);
            
            // Get API base URL from environment or default
            const baseUrl = process.env.REACT_APP_API_URL || 'https://6d2c-115-76-51-131.ngrok-free.app';
            const apiUrl = baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
            
            // First, try to get the test details using Get endpoint
            let response = await makeRequest(`${apiUrl}/MultipleChoiceTest/Get/${id}`, {
                method: 'GET'
            });

            // If the first request fails, try with GetById endpoint as fallback
            if (!response.success) {
                console.log('Initial fetch failed, trying alternative endpoint');
                response = await makeRequest(`${apiUrl}/MultipleChoiceTest/GetById/${id}`, {
                    method: 'GET'
                });
            }

            if (response.success) {
                console.log('Test data fetched successfully:', response.data);
                setTestData(response.data);
                setTestLoaded(true);
                // Also fetch questions
                fetchQuestions(id);
            } else {
                console.error('Failed to fetch test data:', response);
                toast.error(response.data?.message || 'Failed to fetch test data');
                setTimeout(() => {
                    navigate('/readings');
                }, 1500);
            }
        } catch (error) {
            console.error('Error fetching test:', error);
            toast.error('An error occurred while fetching the test: ' + (error.message || 'Unknown error'));
            setTimeout(() => {
                navigate('/readings');
            }, 1500);
        } finally {
            setLoading(false);
        }
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

        if (questions.length >= 5) {
            toast.error('Đã đạt giới hạn tối đa 5 câu hỏi cho mỗi bài kiểm tra');
            return;
        }

        // Add question to the server
        addQuestionToTest();
    };

    const validateQuestionForm = () => {
        const { questionText, answer_a, answer_b, answer_c, answer_d, correctAnswer } = currentQuestion;
        
        if (!questionText.trim()) {
            toast.error('Nội dung câu hỏi không được để trống');
            return false;
        }
        
        if (!answer_a.trim() || !answer_b.trim() || !answer_c.trim() || !answer_d.trim()) {
            toast.error('Tất cả các phương án trả lời đều phải có nội dung');
            return false;
        }
        
        if (questionText.length > 2000) {
            toast.error('Nội dung câu hỏi không được vượt quá 2000 ký tự');
            return false;
        }
        
        if ([answer_a, answer_b, answer_c, answer_d].some(answer => answer.length > 500)) {
            toast.error('Mỗi phương án trả lời không được vượt quá 500 ký tự');
            return false;
        }
        
        if (correctAnswer < 1 || correctAnswer > 4) {
            toast.error('Đáp án đúng phải là một trong các giá trị từ 1 đến 4');
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
        setActiveTab('questions');
    };

    const handleUpdateQuestion = () => {
        if (!validateQuestionForm()) {
            return;
        }

        if (questions[editingQuestionIndex]?.questionId) {
            // Update via API
            updateQuestionOnServer(questions[editingQuestionIndex].questionId);
        } else {
            toast.error('Cannot update question - missing question ID');
        }
    };

    const handleDeleteQuestion = (index) => {
        const question = questions[index];
        
        if (question?.questionId) {
            // Delete via API
            deleteQuestionFromServer(question.questionId);
        } else {
            toast.error('Cannot delete question - missing question ID');
        }
    };

    const addQuestionToTest = async () => {
        if (!id) {
            toast.error('No test ID available');
            return;
        }

        if (questions.length >= 5) {
            toast.error('Maximum of 5 questions reached');
            return;
        }

        try {
            setLoading(true);
            await addQuestionToServer(id, currentQuestion);
            resetQuestionForm();
            fetchQuestions(id);
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
                explanation: question.explanation || ''
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
                fetchQuestions(id);
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
        if (window.confirm('Are you sure you want to delete this question? This action cannot be undone.')) {
            setLoading(true);
            try {
                const baseUrl = process.env.REACT_APP_API_URL || 'https://6d2c-115-76-51-131.ngrok-free.app';
                const apiUrl = baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
                
                const response = await makeRequest(`${apiUrl}/Question/Delete/${questionId}`, {
                    method: 'DELETE'
                });

                if (response.success) {
                    toast.success('Question deleted successfully!');
                    // Refresh questions list after deletion
                    fetchQuestions(id);
                } else {
                    // Handle specific error cases
                    if (response.status === 400) {
                        if (response.data?.message?.includes("can't delete")) {
                            toast.error("You don't have permission to delete this question");
                        } else {
                            toast.error(response.data?.message || 'Question not found or could not be deleted');
                        }
                    } else if (response.status === 401) {
                        toast.error('Your session has expired. Please login again.');
                        setTimeout(() => {
                            navigate('/login');
                        }, 1500);
                    } else {
                        toast.error(response.data?.message || 'Failed to delete question');
                    }
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
            console.log(`Fetching questions for test ID: ${testId}`);
            
            const baseUrl = process.env.REACT_APP_API_URL || 'https://6d2c-115-76-51-131.ngrok-free.app';
            const apiUrl = baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
            
            const response = await makeRequest(`${apiUrl}/Question/GetAll/${testId}`, {
                method: 'GET'
            });

            if (response.success) {
                console.log('Questions fetched successfully:', response.data);
                setQuestions(response.data || []);
            } else {
                console.error('Failed to fetch questions:', response);
                toast.error(response.data?.message || 'Failed to fetch questions');
                // Fall back to empty questions list if fetch fails
                setQuestions([]);
            }
        } catch (error) {
            console.error('Error fetching questions:', error);
            toast.error('An error occurred while fetching questions: ' + (error.message || 'Unknown error'));
            setQuestions([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDoneEditing = () => {
        navigate('/readings');
    };

    const handleTestPreview = () => {
        navigate(`/readings/test/${id}`);
    };

    // Hàm xử lý khi thay đổi dữ liệu bài kiểm tra
    const handleTestInputChange = (e) => {
        const { name, value } = e.target;
        setTestData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Hàm để cập nhật thông tin bài kiểm tra
    const updateTestContent = async () => {
        setLoading(true);
        try {
            const baseUrl = process.env.REACT_APP_API_URL || 'https://6d2c-115-76-51-131.ngrok-free.app';
            const apiUrl = baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
            
            const response = await makeRequest(`${apiUrl}/MultipleChoiceTest/Update/${id}`, {
                method: 'PUT',
                body: JSON.stringify(testData)
            });

            if (response.success) {
                toast.success('Test content updated successfully!');
                setIsEditingContent(false);
            } else {
                toast.error(response.data?.message || 'Failed to update test content');
            }
        } catch (error) {
            console.error('Error updating test content:', error);
            toast.error('An error occurred while updating the test content');
        } finally {
            setLoading(false);
        }
    };

    // Add the deleteTest function
    const deleteTest = async () => {
        if (window.confirm('Are you sure you want to delete this test? This action cannot be undone and will delete all questions.')) {
            setLoading(true);
            try {
                const baseUrl = process.env.REACT_APP_API_URL || 'https://6d2c-115-76-51-131.ngrok-free.app';
                const apiUrl = baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
                
                const response = await makeRequest(`${apiUrl}/MultipleChoiceTest/DeleteById/${id}`, {
                    method: 'DELETE'
                });

                if (response.success) {
                    toast.success('Test deleted successfully!');
                    // Navigate back to the readings page after successful deletion
                    navigate('/readings');
                } else {
                    // Handle specific error cases
                    if (response.status === 400) {
                        if (response.data?.message?.includes("can not remove")) {
                            toast.error("You don't have permission to delete this test");
                        } else {
                            toast.error(response.data?.message || 'Test not found or could not be deleted');
                        }
                    } else if (response.status === 401) {
                        toast.error('Your session has expired. Please login again.');
                        setTimeout(() => {
                            navigate('/login');
                        }, 1500);
                    } else {
                        toast.error(response.data?.message || 'Failed to delete test');
                    }
                }
            } catch (error) {
                console.error('Error deleting test:', error);
                toast.error('An error occurred while deleting the test');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleToggleVisibility = async () => {
        try {
            await togglePublicStatus(id);
            // Update state locally
            setTestData(prev => ({
                ...prev,
                isPublic: !prev.isPublic
            }));
            toast.success('Test visibility status has been changed');
        } catch (err) {
            toast.error('Failed to change test visibility');
        }
    };

    if (loading && !testLoaded) {
        return (
            <div className="main-content">
                <div className="loader"></div>
            </div>
        );
    }

    return (
        <div className="create-test-container">
            <div className="create-test-header">
                <h1 className="create-test-title">Chỉnh sửa: {testData.title}</h1>
                <div className="header-actions">
                    <button 
                        className="back-button" 
                        onClick={() => navigate('/readings')}
                        disabled={loading}
                    >
                        <i className="fas fa-arrow-left"></i>
                        Trở lại
                    </button>
                    <button 
                        className="delete-test-button" 
                        onClick={deleteTest}
                        disabled={loading}
                    >
                        <i className="fas fa-trash"></i>
                        Delete Test
                    </button>
                    <button 
                        className="preview-button" 
                        onClick={handleTestPreview}
                        disabled={loading}
                    >
                        <i className="fas fa-eye"></i>
                        Xem trước
                    </button>
                    <button 
                        className="done-button" 
                        onClick={handleDoneEditing}
                        disabled={loading}
                    >
                        <i className="fas fa-check"></i>
                        Hoàn tất
                    </button>
                </div>
            </div>

            <div className="edit-test-tabs">
                <button 
                    className={`tab-button ${activeTab === 'reading' ? 'active' : ''}`}
                    onClick={() => setActiveTab('reading')}
                >
                    <i className="fas fa-book"></i> Nội dung bài đọc
                </button>
                <button 
                    className={`tab-button ${activeTab === 'questions' ? 'active' : ''}`}
                    onClick={() => setActiveTab('questions')}
                >
                    <i className="fas fa-question"></i> Câu hỏi ({questions.length}/5)
                </button>
            </div>

            <div className="test-create-form">
                {activeTab === 'reading' ? (
                    <div className="form-section test-info">
                        <div className="test-info-header">
                            <h2>Nội dung bài đọc</h2>
                            <div className="header-actions">
                                {!isEditingContent ? (
                                    <button 
                                        className="edit-content-btn"
                                        onClick={() => setIsEditingContent(true)}
                                        disabled={loading}
                                    >
                                        <i className="fas fa-edit"></i> Sửa nội dung
                                    </button>
                                ) : (
                                    <>
                                        <button 
                                            className="save-content-btn"
                                            onClick={updateTestContent}
                                            disabled={loading}
                                        >
                                            <i className="fas fa-save"></i> Lưu thay đổi
                                        </button>
                                        <button 
                                            className="cancel-edit-btn"
                                            onClick={() => setIsEditingContent(false)}
                                            disabled={loading}
                                        >
                                            <i className="fas fa-times"></i> Hủy
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                        
                        {isEditingContent ? (
                            <div className="content-edit-form">
                                <div className="form-group">
                                    <label htmlFor="title">Tiêu đề</label>
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        value={testData.title}
                                        onChange={handleTestInputChange}
                                        maxLength={200}
                                        disabled={loading}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="content">Nội dung bài đọc</label>
                                    <textarea
                                        id="content"
                                        name="content"
                                        rows="15"
                                        value={testData.content}
                                        onChange={handleTestInputChange}
                                        disabled={loading}
                                    ></textarea>
                                </div>
                                
                                <div className="form-group">
                                    <label>Trạng thái hiển thị</label>
                                    <button
                                        className={`visibility-toggle-button ${testData.isPublic ? 'public' : 'private'}`}
                                        onClick={handleToggleVisibility}
                                        disabled={loading}
                                        type="button"
                                    >
                                        {testData.isPublic ? <FaLockOpen /> : <FaLock />}
                                        {testData.isPublic ? 'Công khai' : 'Riêng tư'}
                                    </button>
                                    <p className="visibility-helper-text">
                                        {testData.isPublic 
                                            ? 'Bài kiểm tra đang ở chế độ công khai, người dùng khác có thể thấy và làm bài kiểm tra này.' 
                                            : 'Bài kiểm tra đang ở chế độ riêng tư, chỉ bạn mới có thể thấy bài kiểm tra này.'}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="test-preview">
                                <h3>{testData.title}</h3>
                                <div className="test-meta">
                                    <span className="language-badge">{testData.learningLanguage}</span>
                                    <span className="level-badge">Cấp độ: {testData.level}</span>
                                    <span className="visibility-badge status-indicator">
                                        {testData.isPublic ? <FaLockOpen /> : <FaLock />}
                                        {testData.isPublic ? 'Công khai' : 'Riêng tư'}
                                    </span>
                                    <button
                                        className={`visibility-toggle-button ${testData.isPublic ? 'public' : 'private'}`}
                                        onClick={handleToggleVisibility}
                                        disabled={loading}
                                        type="button"
                                    >
                                        Chuyển sang chế độ {testData.isPublic ? 'riêng tư' : 'công khai'}
                                    </button>
                                </div>
                                <div className="reading-content-wrapper">
                                    <p className="reading-content">{testData.content}</p>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="form-section existing-questions">
                            <div className="test-info-header">
                                <h2>Danh sách câu hỏi</h2>
                            </div>
                            
                            {questions.length === 0 ? (
                                <div className="no-questions">
                                    <p>Chưa có câu hỏi nào. Thêm tối đa 5 câu hỏi bên dưới.</p>
                                </div>
                            ) : (
                                <div className="questions-list">
                                    {questions.map((question, index) => (
                                        <div key={question.questionId || index} className="question-item">
                                            <div className="question-header">
                                                <h3>Câu hỏi {index + 1}</h3>
                                                <div className="question-actions">
                                                    <button 
                                                        className="edit-btn" 
                                                        onClick={() => handleEditQuestion(index)}
                                                        title="Sửa câu hỏi"
                                                    >
                                                        <i className="fas fa-edit"></i>
                                                    </button>
                                                    <button 
                                                        className="delete-btn" 
                                                        onClick={() => handleDeleteQuestion(index)}
                                                        title="Xóa câu hỏi"
                                                    >
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                </div>
                                            </div>
                                            <p className="question-text">{question.questionText}</p>
                                            <div className="answer-options">
                                                <div className={`answer ${question.correctAnswer === 1 ? 'correct' : ''}`}>
                                                    <span className="option-label">A</span> {question.answer_a}
                                                </div>
                                                <div className={`answer ${question.correctAnswer === 2 ? 'correct' : ''}`}>
                                                    <span className="option-label">B</span> {question.answer_b}
                                                </div>
                                                <div className={`answer ${question.correctAnswer === 3 ? 'correct' : ''}`}>
                                                    <span className="option-label">C</span> {question.answer_c}
                                                </div>
                                                <div className={`answer ${question.correctAnswer === 4 ? 'correct' : ''}`}>
                                                    <span className="option-label">D</span> {question.answer_d}
                                                </div>
                                            </div>
                                            {question.explanation && (
                                                <div className="explanation">
                                                    <strong>Giải thích:</strong>
                                                    <p>{question.explanation}</p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="form-section question-form">
                            <div className="test-info-header">
                                <h2>{editingQuestionIndex >= 0 ? 'Sửa câu hỏi' : 'Thêm câu hỏi'}</h2>
                            </div>
                            
                            {questions.length >= 5 && editingQuestionIndex < 0 && (
                                <div className="max-questions-warning">
                                    Đã đạt giới hạn tối đa 5 câu hỏi. Hãy sửa hoặc xóa câu hỏi hiện có.
                                </div>
                            )}
                            
                            <div className="form-section-content">
                                <div className="form-group">
                                    <label htmlFor="questionText">Nội dung câu hỏi</label>
                                    <textarea
                                        id="questionText"
                                        name="questionText"
                                        rows="3"
                                        placeholder="Nhập nội dung câu hỏi..."
                                        value={currentQuestion.questionText}
                                        onChange={handleQuestionInputChange}
                                        maxLength={2000}
                                        disabled={loading || (questions.length >= 5 && editingQuestionIndex < 0)}
                                    ></textarea>
                                </div>
                                
                                <div className="form-group" style={{ marginBottom: '25px' }}>
                                    <label htmlFor="correctAnswer">Đáp án đúng</label>
                                    <select
                                        id="correctAnswer"
                                        name="correctAnswer"
                                        value={currentQuestion.correctAnswer}
                                        onChange={handleQuestionInputChange}
                                        disabled={loading || (questions.length >= 5 && editingQuestionIndex < 0)}
                                        style={{ maxWidth: '200px' }}
                                    >
                                        <option value={1}>A</option>
                                        <option value={2}>B</option>
                                        <option value={3}>C</option>
                                        <option value={4}>D</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="answer_a">Phương án A</label>
                                    <input
                                        type="text"
                                        id="answer_a"
                                        name="answer_a"
                                        placeholder="Phương án A"
                                        value={currentQuestion.answer_a}
                                        onChange={handleQuestionInputChange}
                                        maxLength={500}
                                        disabled={loading || (questions.length >= 5 && editingQuestionIndex < 0)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="answer_b">Phương án B</label>
                                    <input
                                        type="text"
                                        id="answer_b"
                                        name="answer_b"
                                        placeholder="Phương án B"
                                        value={currentQuestion.answer_b}
                                        onChange={handleQuestionInputChange}
                                        maxLength={500}
                                        disabled={loading || (questions.length >= 5 && editingQuestionIndex < 0)}
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label htmlFor="answer_c">Phương án C</label>
                                    <input
                                        type="text"
                                        id="answer_c"
                                        name="answer_c"
                                        placeholder="Phương án C"
                                        value={currentQuestion.answer_c}
                                        onChange={handleQuestionInputChange}
                                        maxLength={500}
                                        disabled={loading || (questions.length >= 5 && editingQuestionIndex < 0)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="answer_d">Phương án D</label>
                                    <input
                                        type="text"
                                        id="answer_d"
                                        name="answer_d"
                                        placeholder="Phương án D"
                                        value={currentQuestion.answer_d}
                                        onChange={handleQuestionInputChange}
                                        maxLength={500}
                                        disabled={loading || (questions.length >= 5 && editingQuestionIndex < 0)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="explanation">Giải thích (Tùy chọn)</label>
                                    <textarea
                                        id="explanation"
                                        name="explanation"
                                        rows="2"
                                        placeholder="Giải thích tại sao đây là đáp án đúng..."
                                        value={currentQuestion.explanation}
                                        onChange={handleQuestionInputChange}
                                        maxLength={1000}
                                        disabled={loading || (questions.length >= 5 && editingQuestionIndex < 0)}
                                    ></textarea>
                                </div>
                            </div>

                            <div className="question-form-actions">
                                {editingQuestionIndex >= 0 ? (
                                    <>
                                        <button 
                                            className="update-question-btn"
                                            onClick={handleUpdateQuestion}
                                            disabled={loading}
                                        >
                                            <i className="fas fa-check"></i> Cập nhật câu hỏi
                                        </button>
                                        <button 
                                            className="cancel-edit-btn"
                                            onClick={resetQuestionForm}
                                            disabled={loading}
                                        >
                                            <i className="fas fa-times"></i> Hủy chỉnh sửa
                                        </button>
                                    </>
                                ) : (
                                    <button 
                                        className="add-question-btn"
                                        onClick={handleAddQuestion}
                                        disabled={loading || questions.length >= 5}
                                    >
                                        <i className="fas fa-plus"></i> Thêm câu hỏi
                                    </button>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default EditMultipleChoiceTestPage; 