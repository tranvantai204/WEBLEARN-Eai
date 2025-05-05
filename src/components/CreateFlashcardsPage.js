import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFlashcard } from '../contexts/FlashcardContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../css/components/Flashcards.css';
import LanguageSelector from './LanguageSelector';

function CreateFlashcardsPage() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [nativeLanguage, setNativeLanguage] = useState('VIE');
    const [learningLanguage, setLearningLanguage] = useState('ENG');
    const [isPublic, setIsPublic] = useState(true);
    const [level, setLevel] = useState(3);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [titleError, setTitleError] = useState('');
    
    const { createFlashcardSet } = useFlashcard();
    const navigate = useNavigate();
    
    // Validate title on change
    const handleTitleChange = (e) => {
        const value = e.target.value;
        setTitle(value);
        
        if (!value.trim()) {
            setTitleError('Title is required');
        } else if (value.length > 100) {
            setTitleError('Title must be less than 100 characters');
        } else {
            setTitleError('');
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Client-side validation
        if (!title.trim()) {
            setTitleError('Title is required');
            return;
        }
        
        setLoading(true);
        setError('');
        
        try {
            // Create flashcard set data object
            const flashcardSetData = {
                title,
                description: description || '', // Handle empty description
                nativeLanguage,
                learningLanguage,
                isPublic,
                level
            };
            
            console.log('Creating flashcard set with data:', flashcardSetData);
            
            // Call the createFlashcardSet function from context
            const result = await createFlashcardSet(flashcardSetData);
            
            // Show success toast
            toast.success('Flashcard set created successfully!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            
            // Navigate to flashcards page or the newly created set
            setTimeout(() => {
                navigate('/flashcards');
            }, 1500);
            
        } catch (err) {
            console.error('Error creating flashcard set:', err);
            
            // Check for specific error about maximum limit
            if (err.message && err.message.includes('maximum limit of 5 flashcard sets')) {
                setError('You have reached the maximum limit of 5 flashcard sets.');
                toast.error('You have reached the maximum limit of 5 flashcard sets.', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            } else {
                setError(err.message || 'Failed to create flashcard set');
                // Show error toast
                toast.error(err.message || 'Failed to create flashcard set', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            }
        } finally {
            setLoading(false);
        }
    };
    
    const handleCancel = () => {
        navigate('/flashcards');
    };
    
    // Level options
    const levelOptions = [
        { value: 1, label: 'Level 1 - Beginner' },
        { value: 2, label: 'Level 2 - Elementary' },
        { value: 3, label: 'Level 3 - Pre-Intermediate' },
        { value: 4, label: 'Level 4 - Intermediate' },
        { value: 5, label: 'Level 5 - Upper Intermediate' },
        { value: 6, label: 'Level 6 - Advanced' }
    ];

    return (
        <div className="flashcards-container">
            {/* Add ToastContainer for notifications */}
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            
            <div className="create-flashcard-content">
                <div className="page-header">
                    <h1 className="page-title">Create New Flashcard Set</h1>
                    <div className="page-actions">
                        <button 
                            className="btn btn-outline mr-2" 
                            onClick={handleCancel}
                            disabled={loading}
                        >
                            <i className="fas fa-times"></i> Cancel
                        </button>
                        <button 
                            className="btn btn-primary"
                            onClick={handleSubmit}
                            disabled={loading || titleError || !title.trim()}
                        >
                            {loading ? (
                                <>
                                    <i className="fas fa-spinner fa-spin"></i> Creating...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-save"></i> Save Set
                                </>
                            )}
                        </button>
                    </div>
                </div>
                
                {error && (
                    <div className="alert alert-danger">
                        <i className="fas fa-exclamation-circle"></i> {error}
                    </div>
                )}
                
                <div className="card">
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="setTitle">Set Title <span className="text-danger">*</span></label>
                                <input
                                    type="text"
                                    className={`form-control ${titleError ? 'is-invalid' : ''}`}
                                    id="setTitle"
                                    placeholder="Enter set title"
                                    value={title}
                                    onChange={handleTitleChange}
                                    required
                                    maxLength={100}
                                />
                                {titleError && (
                                    <div className="invalid-feedback">
                                        {titleError}
                                    </div>
                                )}
                                <small className="form-text text-muted">
                                    Required. Maximum 100 characters.
                                </small>
                            </div>
                            <div className="form-group">
                                <label htmlFor="setDescription">Description</label>
                                <textarea
                                    className="form-control"
                                    id="setDescription"
                                    placeholder="Enter set description (optional)"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows="3"
                                    maxLength={500}
                                ></textarea>
                                <small className="form-text text-muted">
                                    Optional. Maximum 500 characters.
                                </small>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="nativeLanguage">Native Language</label>
                                        <LanguageSelector
                                            id="nativeLanguage"
                                            className="form-control"
                                            value={nativeLanguage}
                                            onChange={(e) => setNativeLanguage(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="learningLanguage">Learning Language</label>
                                        <LanguageSelector
                                            id="learningLanguage"
                                            className="form-control"
                                            value={learningLanguage}
                                            onChange={(e) => setLearningLanguage(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="difficultyLevel">Difficulty Level</label>
                                        <select
                                            className="form-control"
                                            id="difficultyLevel"
                                            value={level}
                                            onChange={(e) => setLevel(parseInt(e.target.value))}
                                        >
                                            {levelOptions.map(option => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label className="d-block">Visibility</label>
                                        <div className="form-check form-check-inline">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                id="publicAccess"
                                                checked={isPublic}
                                                onChange={() => setIsPublic(true)}
                                            />
                                            <label className="form-check-label" htmlFor="publicAccess">
                                                Public
                                            </label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                id="privateAccess"
                                                checked={!isPublic}
                                                onChange={() => setIsPublic(false)}
                                            />
                                            <label className="form-check-label" htmlFor="privateAccess">
                                                Private
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                        <hr className="my-4" />
                        <p className="help-text text-muted">
                            After creating your flashcard set, you will be able to add individual flashcards.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateFlashcardsPage; 