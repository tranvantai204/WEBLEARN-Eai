import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../css/components/Reading.css';

function CreateReadingPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        language: 'en',
        difficulty: 'beginner',
        category: 'news',
        type: 'current_events',
        content: '',
        source: '',
        publicationDate: '',
        author: '',
        vocabularyList: [{ word: '', definition: '', example: '' }],
        questions: [{ question: '', answer: '' }],
        summary: '',
        keyPoints: [''],
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleKeyPointChange = (index, value) => {
        const newKeyPoints = [...formData.keyPoints];
        newKeyPoints[index] = value;
        setFormData(prev => ({
            ...prev,
            keyPoints: newKeyPoints
        }));
    };

    const addKeyPoint = () => {
        setFormData(prev => ({
            ...prev,
            keyPoints: [...prev.keyPoints, '']
        }));
    };

    const removeKeyPoint = (index) => {
        setFormData(prev => ({
            ...prev,
            keyPoints: prev.keyPoints.filter((_, i) => i !== index)
        }));
    };

    const handleVocabularyChange = (index, field, value) => {
        const newVocabularyList = [...formData.vocabularyList];
        newVocabularyList[index] = {
            ...newVocabularyList[index],
            [field]: value
        };
        setFormData(prev => ({
            ...prev,
            vocabularyList: newVocabularyList
        }));
    };

    const addVocabularyItem = () => {
        setFormData(prev => ({
            ...prev,
            vocabularyList: [...prev.vocabularyList, { word: '', definition: '', example: '' }]
        }));
    };

    const removeVocabularyItem = (index) => {
        setFormData(prev => ({
            ...prev,
            vocabularyList: prev.vocabularyList.filter((_, i) => i !== index)
        }));
    };

    const handleQuestionChange = (index, field, value) => {
        const newQuestions = [...formData.questions];
        newQuestions[index] = {
            ...newQuestions[index],
            [field]: value
        };
        setFormData(prev => ({
            ...prev,
            questions: newQuestions
        }));
    };

    const addQuestion = () => {
        setFormData(prev => ({
            ...prev,
            questions: [...prev.questions, { question: '', answer: '' }]
        }));
    };

    const removeQuestion = (index) => {
        setFormData(prev => ({
            ...prev,
            questions: prev.questions.filter((_, i) => i !== index)
        }));
    };

    const handleCancel = () => {
        const confirmLeave = window.confirm('Are you sure you want to cancel? Any unsaved changes will be lost.');
        if (confirmLeave) {
            navigate('/readings');
        }
    };

    const handleSave = () => {
        if (!formData.title.trim() || !formData.content.trim()) {
            toast.error('Please fill in both title and content before saving.');
            return;
        }

        toast.success('Reading saved successfully!', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
        });
        
        navigate('/readings/multiple-choice/create', { 
            state: { 
                readingTitle: formData.title,
                readingContent: formData.content,
                readingLanguage: formData.language
            } 
        });
    };

    return (
        <div className="create-reading-container">
            <div className="create-reading-header">
                <h1 className="create-reading-title">New Reading</h1>
                <div className="header-actions">
                    <button 
                        className="cancel-button" 
                        onClick={handleCancel}
                    >
                        <i className="fas fa-times"></i>
                        Cancel
                    </button>
                    <button 
                        className="save-button"
                        onClick={handleSave}
                    >
                        <i className="fas fa-save"></i>
                        Save
                    </button>
                </div>
            </div>

            <div className="reading-create-form">
                <div className="form-section basic-info">
                    <h2>Basic Information</h2>
                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            placeholder="Enter reading title"
                            value={formData.title}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="type">Content Type</label>
                            <select 
                                id="type" 
                                name="type"
                                value={formData.type}
                                onChange={handleInputChange}
                            >
                                <option value="current_events">Current Events & News</option>
                                <option value="fiction">Fiction Stories</option>
                                <option value="non_fiction">Non-Fiction Stories</option>
                                <option value="business">Professional & Business</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="language">Language</label>
                            <select 
                                id="language" 
                                name="language"
                                value={formData.language}
                                onChange={handleInputChange}
                            >
                                <option value="en">English</option>
                                <option value="vi">Vietnamese</option>
                                <option value="zh">Chinese</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="difficulty">Difficulty Level</label>
                            <select 
                                id="difficulty" 
                                name="difficulty"
                                value={formData.difficulty}
                                onChange={handleInputChange}
                            >
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">Intermediate</option>
                                <option value="advanced">Advanced</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="author">Author</label>
                            <input
                                type="text"
                                id="author"
                                name="author"
                                placeholder="Enter author name"
                                value={formData.author}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="source">Source</label>
                            <input
                                type="text"
                                id="source"
                                name="source"
                                placeholder="Enter source/reference"
                                value={formData.source}
                                onChange={handleInputChange}
                            />
                        </div>

                        {formData.type === 'current_events' && (
                            <div className="form-group">
                                <label htmlFor="publicationDate">Publication Date</label>
                                <input
                                    type="date"
                                    id="publicationDate"
                                    name="publicationDate"
                                    value={formData.publicationDate}
                                    onChange={handleInputChange}
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div className="form-section content">
                    <h2>Content</h2>
                    <div className="form-group">
                        <label htmlFor="description">Brief Description</label>
                        <textarea
                            id="description"
                            name="description"
                            rows="2"
                            placeholder="Enter a brief description"
                            value={formData.description}
                            onChange={handleInputChange}
                        ></textarea>
                    </div>

                    <div className="form-group">
                        <label>Main Content</label>
                        <textarea
                            name="content"
                            rows="12"
                            placeholder="Enter the main content"
                            value={formData.content}
                            onChange={handleInputChange}
                        ></textarea>
                    </div>
                </div>

                <div className="form-section learning-materials">
                    <h2>Learning Materials</h2>
                    <div className="form-group">
                        <label htmlFor="summary">Summary</label>
                        <textarea
                            id="summary"
                            name="summary"
                            rows="3"
                            placeholder="Write a summary of the content"
                            value={formData.summary}
                            onChange={handleInputChange}
                        ></textarea>
                    </div>

                    <div className="key-points-section">
                        <h3>Key Points</h3>
                        <div className="key-points-list">
                            {formData.keyPoints.map((point, index) => (
                                <div key={index} className="key-point-item">
                                    <input
                                        type="text"
                                        placeholder="Add a key point"
                                        value={point}
                                        onChange={(e) => handleKeyPointChange(index, e.target.value)}
                                    />
                                    <button 
                                        className="remove-button"
                                        onClick={() => removeKeyPoint(index)}
                                    >
                                        <i className="fas fa-times"></i>
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button className="add-button" onClick={addKeyPoint}>
                            <i className="fas fa-plus"></i> Add Key Point
                        </button>
                    </div>

                    <div className="vocabulary-section">
                        <h3>Vocabulary</h3>
                        <div className="vocabulary-list">
                            {formData.vocabularyList.map((item, index) => (
                                <div key={index} className="vocabulary-item">
                                    <input
                                        type="text"
                                        placeholder="Word"
                                        value={item.word}
                                        onChange={(e) => handleVocabularyChange(index, 'word', e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Definition"
                                        value={item.definition}
                                        onChange={(e) => handleVocabularyChange(index, 'definition', e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Example"
                                        value={item.example}
                                        onChange={(e) => handleVocabularyChange(index, 'example', e.target.value)}
                                    />
                                    <button 
                                        className="remove-button"
                                        onClick={() => removeVocabularyItem(index)}
                                    >
                                        <i className="fas fa-times"></i>
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button className="add-button" onClick={addVocabularyItem}>
                            <i className="fas fa-plus"></i> Add Word
                        </button>
                    </div>

                    <div className="questions-section">
                        <h3>Comprehension Questions</h3>
                        <div className="questions-list">
                            {formData.questions.map((item, index) => (
                                <div key={index} className="question-item">
                                    <input
                                        type="text"
                                        placeholder="Question"
                                        value={item.question}
                                        onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Answer"
                                        value={item.answer}
                                        onChange={(e) => handleQuestionChange(index, 'answer', e.target.value)}
                                    />
                                    <button 
                                        className="remove-button"
                                        onClick={() => removeQuestion(index)}
                                    >
                                        <i className="fas fa-times"></i>
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button className="add-button" onClick={addQuestion}>
                            <i className="fas fa-plus"></i> Add Question
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateReadingPage; 