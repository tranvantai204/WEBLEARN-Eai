import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../css/components/Writing.css';

function CreateWritingPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        type: 'journal',
        language: 'en',
        difficulty: 'beginner',
        prompt: '',
        content: '',
        vocabularyList: [{ word: '', notes: '' }],
        grammarNotes: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
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
            vocabularyList: [...prev.vocabularyList, { word: '', notes: '' }]
        }));
    };

    const removeVocabularyItem = (index) => {
        setFormData(prev => ({
            ...prev,
            vocabularyList: prev.vocabularyList.filter((_, i) => i !== index)
        }));
    };

    const handleCancel = () => {
        const confirmLeave = window.confirm('Are you sure you want to cancel? Any unsaved changes will be lost.');
        if (confirmLeave) {
            navigate('/writing');
        }
    };

    const handleSave = () => {
        if (!formData.title.trim() || !formData.content.trim()) {
            toast.error('Please fill in both title and content before saving.');
            return;
        }

        // Add save logic here
        toast.success('Writing saved successfully!', {
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
        navigate('/writing');
    };

    return (
        <div className="create-writing-container">
            <div className="create-writing-header">
                <h1 className="create-writing-title">New Writing</h1>
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

            <div className="writing-create-form">
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        placeholder="Enter writing title"
                        value={formData.title}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="type">Type</label>
                        <select 
                            id="type" 
                            name="type"
                            value={formData.type}
                            onChange={handleInputChange}
                        >
                            <option value="journal">Daily Journal</option>
                            <option value="story">Story</option>
                            <option value="essay">Essay</option>
                            <option value="letter">Letter</option>
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

                <div className="form-group">
                    <label htmlFor="prompt">Writing Prompt</label>
                    <textarea
                        id="prompt"
                        name="prompt"
                        rows="3"
                        placeholder="Enter writing prompt or topic"
                        value={formData.prompt}
                        onChange={handleInputChange}
                    ></textarea>
                </div>

                <div className="writing-content-section">
                    <h2>Writing Content</h2>
                    <div className="form-group">
                        <label>Content</label>
                        <textarea
                            name="content"
                            rows="15"
                            placeholder="Start writing your content here..."
                            value={formData.content}
                            onChange={handleInputChange}
                        ></textarea>
                    </div>

                    <div className="vocabulary-section">
                        <h3>Vocabulary Notes</h3>
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
                                        placeholder="Notes"
                                        value={item.notes}
                                        onChange={(e) => handleVocabularyChange(index, 'notes', e.target.value)}
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

                    <div className="grammar-section">
                        <h3>Grammar Notes</h3>
                        <textarea
                            name="grammarNotes"
                            rows="3"
                            placeholder="Add any grammar notes or corrections here..."
                            value={formData.grammarNotes}
                            onChange={handleInputChange}
                        ></textarea>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateWritingPage; 