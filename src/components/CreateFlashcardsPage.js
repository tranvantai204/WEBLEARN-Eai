import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFlashcard } from '../contexts/FlashcardContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../css/components/Flashcards.css';
import LanguageSelector from './LanguageSelector';

// CSS animation for pulse effect
const pulseAnimation = `
@keyframes pulse {
    0% {
        box-shadow: 0 0 0 0 rgba(240, 173, 78, 0.4);
    }
    70% {
        box-shadow: 0 0 0 10px rgba(240, 173, 78, 0);
    }
    100% {
        box-shadow: 0 0 0 0 rgba(240, 173, 78, 0);
    }
}
`;

// Custom Modal Component for limit reached
const LimitReachedModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;
    
    return (
        <div className="modal-overlay">
            <div className="custom-modal limit-modal">
                <div className="modal-header">
                    <h4 className="modal-title">Giới hạn đã đạt</h4>
                </div>
                <div className="modal-body">
                    <div className="modal-icon">
                        <i className="fas fa-exclamation-triangle"></i>
                    </div>
                    <p>Bạn đã đạt đến giới hạn tối đa 5 bộ thẻ ghi nhớ. Bạn có muốn xem các bộ hiện có để xóa không?</p>
                </div>
                <div className="modal-footer">
                    <button 
                        className="btn btn-secondary" 
                        onClick={onClose}
                    >
                        Hủy
                    </button>
                    <button 
                        className="btn btn-primary" 
                        onClick={onConfirm}
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
};

// Custom styles for the max limit alert
const maxLimitAlertStyles = {
    border: '2px solid #f0ad4e',
    background: '#fcf8e3',
    padding: '15px',
    borderRadius: '5px',
    marginBottom: '20px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    animation: 'pulse 2s infinite'
};

// Debug helper function
const logErrorDetails = (err) => {
    console.group('Error Details:');
    console.error('Error object:', err);
    console.error('Error message:', err.message);
    console.error('Error name:', err.name);
    console.error('Response status:', err.response?.status);
    console.error('Response status text:', err.response?.statusText);
    console.error('Response URL:', err.response?.url);
    console.error('Error stack:', err.stack);
    console.groupEnd();
};

// Add more styles
const additionalStyles = `
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.custom-modal {
    background: white;
    border-radius: 10px;
    width: 90%;
    max-width: 400px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
}

.modal-header {
    padding: 15px 20px;
    border-bottom: 1px solid #eee;
    background-color: #6200ea;
    color: white;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
}

.modal-title {
    margin: 0;
    font-size: 18px;
    font-weight: 500;
}

.modal-body {
    padding: 20px;
    text-align: center;
}

.modal-icon {
    font-size: 36px;
    color: #f0ad4e;
    margin-bottom: 15px;
}

.modal-footer {
    padding: 15px 20px;
    border-top: 1px solid #eee;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}

.limit-modal .btn-primary {
    background-color: #6200ea;
    border-color: #6200ea;
}

.limit-modal .btn-primary:hover {
    background-color: #5000c8;
    border-color: #5000c8;
}

.limit-modal .btn-secondary {
    background-color: #e0e0e0;
    color: #333;
    border-color: #d0d0d0;
}

.limit-modal .btn-secondary:hover {
    background-color: #d0d0d0;
    border-color: #c0c0c0;
}

/* Alert styling */
.limit-alert-content {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
}

.limit-alert-icon {
    font-size: 24px;
    color: #f0ad4e;
    margin-right: 15px;
    flex-shrink: 0;
}

.limit-alert-text {
    font-size: 16px;
    line-height: 1.5;
}

.limit-alert-actions {
    display: flex;
    justify-content: center;
}

.max-limit-alert {
    border: 2px solid #f0ad4e !important;
    background-color: #fcf8e3 !important;
    padding: 20px !important;
    border-radius: 10px !important;
}
`;

// Add style tag to add the animation and modal styles
const StyleTag = () => (
    <style>
        {pulseAnimation}
        {additionalStyles}
    </style>
);

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
    const [isLimitReached, setIsLimitReached] = useState(false);
    const [showLimitModal, setShowLimitModal] = useState(false);
    
    const { createFlashcardSet, getFlashcardSets } = useFlashcard();
    const navigate = useNavigate();
    
    // Check if user has reached the limit of 5 flashcard sets
    const checkFlashcardSetLimit = useCallback(async () => {
        try {
            const result = await getFlashcardSets(1, 100); // Get all flashcard sets
            const userSets = result.items || [];
            return userSets.length >= 5;
        } catch (err) {
            console.error('Error checking flashcard set limit:', err);
            return false; // Assume limit not reached if error occurs
        }
    }, [getFlashcardSets]);
    
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
            // First check if user has reached the limit
            const limitReached = await checkFlashcardSetLimit();
            if (limitReached) {
                setIsLimitReached(true);
                setError('Bạn đã đạt đến giới hạn tối đa 5 bộ thẻ ghi nhớ. Vui lòng xóa một số bộ hiện có trước khi tạo mới.');
                toast.error('Bạn đã đạt đến giới hạn tối đa 5 bộ thẻ ghi nhớ!', {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    toastId: "max-limit-error"
                });
                setLoading(false); // Clear loading state
                return;
            }
            
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
            // Log detailed error information
            logErrorDetails(err);
            
            // Checking for specific error messages related to maximum limit
            const errorMessage = err.message || '';
            const statusCode = err.response?.status;
            
            // Check for maximum limit error in response or error message
            if (
                (errorMessage.includes('maximum limit') || errorMessage.includes('limit of 5 flashcard')) ||
                // Specific check for HTTP 400 Bad Request which often indicates validation errors like limits
                (statusCode === 400) ||
                // Generic errors that might be related to limits
                (errorMessage === 'An error occurred' || errorMessage === 'Bad Request')
            ) {
                console.log('Detected maximum flashcard limit error. Showing limit reached message.');
                // Set a more user-friendly error message in Vietnamese
                setError('Bạn đã đạt đến giới hạn tối đa 5 bộ thẻ ghi nhớ. Vui lòng xóa một số bộ hiện có trước khi tạo mới.');
                
                // Show error toast
                toast.error('Bạn đã đạt đến giới hạn tối đa 5 bộ thẻ ghi nhớ!', {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    toastId: "max-limit-error"
                });
                
                // Show custom modal instead of window.confirm
                setTimeout(() => {
                    setShowLimitModal(true);
                }, 500);
            } else {
                // For other types of errors
                setError(errorMessage || 'Failed to create flashcard set');
                
                // Show error toast
                toast.error(errorMessage || 'Failed to create flashcard set', {
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

    // Check if limit is reached on component mount
    useEffect(() => {
        const checkLimit = async () => {
            const reached = await checkFlashcardSetLimit();
            setIsLimitReached(reached);
            if (reached) {
                setError('Bạn đã đạt đến giới hạn tối đa 5 bộ thẻ ghi nhớ. Vui lòng xóa một số bộ hiện có trước khi tạo mới.');
                // Show toast notification for limit reached
                toast.warn('Bạn đã đạt đến giới hạn tối đa 5 bộ thẻ ghi nhớ!', {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    toastId: "max-limit-error-init"
                });
            }
        };
        checkLimit();
    }, [checkFlashcardSetLimit]);

    return (
        <div className="flashcards-container">
            {/* Add StyleTag for animations */}
            <StyleTag />
            
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
            
            {/* Custom Modal for Limit Reached */}
            <LimitReachedModal 
                isOpen={showLimitModal}
                onClose={() => setShowLimitModal(false)}
                onConfirm={() => {
                    navigate('/flashcards');
                    setShowLimitModal(false);
                }}
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
                            disabled={loading || titleError || !title.trim() || isLimitReached}
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
                
                {(error || isLimitReached) && (
                    <div 
                        className={`alert ${error.includes('giới hạn tối đa 5 bộ') || isLimitReached ? 'alert-warning max-limit-alert' : 'alert-danger'}`}
                        style={error.includes('giới hạn tối đa 5 bộ') || isLimitReached ? maxLimitAlertStyles : {}}
                    >
                        <div className="limit-alert-content">
                            <div className="limit-alert-icon">
                                <i className={`fas ${error.includes('giới hạn tối đa 5 bộ') || isLimitReached ? 'fa-exclamation-triangle' : 'fa-exclamation-circle'}`}></i>
                            </div>
                            <div className="limit-alert-text">
                                {error || 'Bạn đã đạt đến giới hạn tối đa 5 bộ thẻ ghi nhớ. Vui lòng xóa một số bộ hiện có trước khi tạo mới.'}
                            </div>
                        </div>
                        
                        {(error.includes('giới hạn tối đa 5 bộ') || isLimitReached) && (
                            <div className="mt-3 limit-alert-actions">
                                <button 
                                    className="btn btn-primary" 
                                    onClick={() => navigate('/flashcards')}
                                >
                                    <i className="fas fa-list-ul"></i> Quản lý bộ thẻ ghi nhớ hiện có
                                </button>
                            </div>
                        )}
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