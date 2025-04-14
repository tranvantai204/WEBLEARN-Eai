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
        <div className="dashboard">
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
            
            <aside className="sidebar">
                <div className="sidebar-user">
                    <img
                        src="/images/avatar.png"
                        alt="User Avatar"
                        className="user-avatar"
                    />
                    <h3 className="user-name">John Doe</h3>
                    <p className="user-email">john@example.com</p>
                </div>
                <ul className="sidebar-nav">
                    <li className="sidebar-item">
                        <Link to="/dashboard" className="sidebar-link">
                            <i className="fas fa-home sidebar-icon"></i>
                            Dashboard
                        </Link>
                    </li>
                    <li className="sidebar-item">
                        <Link to="/flashcards" className="sidebar-link active">
                            <i className="fas fa-cards sidebar-icon"></i>
                            Flashcards
                        </Link>
                    </li>
                    <li className="sidebar-item">
                        <Link to="/readings" className="sidebar-link">
                            <i className="fas fa-book sidebar-icon"></i>
                            Readings
                        </Link>
                    </li>
                    <li className="sidebar-item">
                        <Link to="/writing" className="sidebar-link">
                            <i className="fas fa-pen sidebar-icon"></i>
                            Writing
                        </Link>
                    </li>
                    <li className="sidebar-item">
                        <Link to="/discover" className="sidebar-link">
                            <i className="fas fa-compass sidebar-icon"></i>
                            Discover
                        </Link>
                    </li>
                    <li className="sidebar-item">
                        <Link to="/profile" className="sidebar-link">
                            <i className="fas fa-user sidebar-icon"></i>
                            Profile
                        </Link>
                    </li>
                </ul>
            </aside>
            <main className="main-content">
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
                                    rows="3"
                                    placeholder="Enter set description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    maxLength={500}
                                ></textarea>
                                <small className="form-text text-muted">
                                    Optional. Maximum 500 characters.
                                </small>
                            </div>
                            
                            <div className="form-row">
                                <div className="form-group col-md-6">
                                    <LanguageSelector
                                        id="nativeLanguage"
                                        name="nativeLanguage"
                                        value={nativeLanguage}
                                        onChange={(e) => setNativeLanguage(e.target.value)}
                                        label="Native Language"
                                        required={true}
                                    />
                                </div>
                                
                                <div className="form-group col-md-6">
                                    <LanguageSelector
                                        id="learningLanguage"
                                        name="learningLanguage"
                                        value={learningLanguage}
                                        onChange={(e) => setLearningLanguage(e.target.value)}
                                        label="Learning Language"
                                        required={true}
                                    />
                                </div>
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="level">Difficulty Level <span className="text-danger">*</span></label>
                                <select 
                                    className="form-control" 
                                    id="level"
                                    value={level}
                                    onChange={(e) => setLevel(Number(e.target.value))}
                                    required
                                >
                                    {levelOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="form-group">
                                <div className="form-check">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="isPublic"
                                        checked={isPublic}
                                        onChange={(e) => setIsPublic(e.target.checked)}
                                    />
                                    <label className="form-check-label" htmlFor="isPublic">
                                        Make this set public (visible to other users)
                                    </label>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                
                <div className="mt-4 text-center">
                    <p>
                        After creating the flashcard set, you'll be able to add cards to it.
                    </p>
                </div>
            </main>
        </div>
    );
}

export default CreateFlashcardsPage; 