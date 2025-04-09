import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useFlashcard } from '../contexts/FlashcardContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../css/components/Flashcards.css';

function FlashcardSetDetailsPage() {
    const { flashcardSetId } = useParams();
    const navigate = useNavigate();
    const { getFlashcardSet, createFlashcard, getFlashcardsForSet, loading, error } = useFlashcard();
    
    const [flashcardSet, setFlashcardSet] = useState(null);
    const [flashcards, setFlashcards] = useState([]);
    const [loadingFlashcards, setLoadingFlashcards] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newFlashcard, setNewFlashcard] = useState({
        term: '',
        definition: '',
        example: '',
        flashcardSetId: flashcardSetId
    });
    const [creatingCard, setCreatingCard] = useState(false);
    const [formErrors, setFormErrors] = useState({
        term: '',
        definition: '',
        example: ''
    });

    // Maximum character limits
    const MAX_TERM_LENGTH = 100;
    const MAX_DEFINITION_LENGTH = 300;
    const MAX_EXAMPLE_LENGTH = 500;

    // Default flashcard data for the sample term
    const defaultFlashcard = {
        term: "ball",
        definition: "Trái banh",
        example: "any object in the shape of a sphere, especially one used as a toy by children or in various sports such as tennis and football",
        flashcardSetId: flashcardSetId
    };

    // Fetch flashcard set details on component mount
    useEffect(() => {
        const fetchFlashcardSetDetails = async () => {
            try {
                // Fetch flashcard set details
                const data = await getFlashcardSet(flashcardSetId);
                setFlashcardSet(data);
                
                // Fetch flashcards for this set
                fetchFlashcardsForSet(flashcardSetId);
            } catch (err) {
                console.error('Error fetching flashcard set details:', err);
                toast.error(err.message || 'Failed to load flashcard set details');
            }
        };

        if (flashcardSetId) {
            fetchFlashcardSetDetails();
        }
    }, [flashcardSetId, getFlashcardSet]);

    // Function to fetch flashcards for a specific set
    const fetchFlashcardsForSet = async (setId) => {
        try {
            setLoadingFlashcards(true);
            
            // Use the context function to fetch flashcards
            const flashcardsData = await getFlashcardsForSet(setId);
            
            if (Array.isArray(flashcardsData)) {
                setFlashcards(flashcardsData);
            } else if (flashcardsData && Array.isArray(flashcardsData.flashcards)) {
                setFlashcards(flashcardsData.flashcards);
            } else {
                // If no flashcards or unexpected format, set to empty array
                setFlashcards([]);
            }
        } catch (err) {
            console.error('Error fetching flashcards:', err);
            toast.error('Failed to load flashcards');
            setFlashcards([]);
        } finally {
            setLoadingFlashcards(false);
        }
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Handle flashcard form input changes with validation
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        // Update form data
        setNewFlashcard(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Validate on change
        const errors = { ...formErrors };
        
        switch (name) {
            case 'term':
                if (!value.trim()) {
                    errors.term = 'Term is required';
                } else if (value.length > MAX_TERM_LENGTH) {
                    errors.term = `Term must be less than ${MAX_TERM_LENGTH} characters`;
                } else {
                    errors.term = '';
                }
                break;
            case 'definition':
                if (!value.trim()) {
                    errors.definition = 'Definition is required';
                } else if (value.length > MAX_DEFINITION_LENGTH) {
                    errors.definition = `Definition must be less than ${MAX_DEFINITION_LENGTH} characters`;
                } else {
                    errors.definition = '';
                }
                break;
            case 'example':
                if (value.length > MAX_EXAMPLE_LENGTH) {
                    errors.example = `Example must be less than ${MAX_EXAMPLE_LENGTH} characters`;
                } else {
                    errors.example = '';
                }
                break;
            default:
                break;
        }
        
        setFormErrors(errors);
    };

    // Validate form before submission
    const validateForm = () => {
        const errors = {
            term: '',
            definition: '',
            example: ''
        };
        let isValid = true;
        
        if (!newFlashcard.term.trim()) {
            errors.term = 'Term is required';
            isValid = false;
        } else if (newFlashcard.term.length > MAX_TERM_LENGTH) {
            errors.term = `Term must be less than ${MAX_TERM_LENGTH} characters`;
            isValid = false;
        }
        
        if (!newFlashcard.definition.trim()) {
            errors.definition = 'Definition is required';
            isValid = false;
        } else if (newFlashcard.definition.length > MAX_DEFINITION_LENGTH) {
            errors.definition = `Definition must be less than ${MAX_DEFINITION_LENGTH} characters`;
            isValid = false;
        }
        
        if (newFlashcard.example.length > MAX_EXAMPLE_LENGTH) {
            errors.example = `Example must be less than ${MAX_EXAMPLE_LENGTH} characters`;
            isValid = false;
        }
        
        setFormErrors(errors);
        return isValid;
    };

    // Add a new flashcard to the set
    const handleAddFlashcard = async (e) => {
        e.preventDefault();
        
        // Validate form before submission
        if (!validateForm()) {
            return;
        }
        
        setCreatingCard(true);
        
        try {
            // Create flashcard data object ensuring it has the correct structure
            const flashcardData = {
                flashcardSetId: flashcardSetId,
                term: newFlashcard.term.trim(),
                definition: newFlashcard.definition.trim(),
                example: newFlashcard.example.trim() || ''
            };
            
            console.log('Creating flashcard with data:', flashcardData);
            
            // Call API to create flashcard
            const result = await createFlashcard(flashcardData);
            
            // Reset form and close modal
            setNewFlashcard({
                term: '',
                definition: '',
                example: '',
                flashcardSetId: flashcardSetId
            });
            setFormErrors({
                term: '',
                definition: '',
                example: ''
            });
            setShowAddModal(false);
            
            // Show success message
            toast.success('Flashcard added successfully!');
            
            // Refresh the flashcards list
            fetchFlashcardsForSet(flashcardSetId);
        } catch (err) {
            console.error('Failed to add flashcard:', err);
            
            // Handle specific error cases
            if (err.message && err.message.includes('maximum limit of 50 flashcard')) {
                toast.error('You have reached the maximum limit of 50 flashcards for this set.');
            } else if (err.message && err.message.includes('Forbidden')) {
                toast.error('You do not have permission to add cards to this set.');
            } else {
                toast.error(err.message || 'Failed to add flashcard');
            }
        } finally {
            setCreatingCard(false);
        }
    };

    // Open the add flashcard modal
    const openAddModal = () => {
        setShowAddModal(true);
    };

    // Close the add flashcard modal
    const closeAddModal = () => {
        setShowAddModal(false);
    };

    return (
        <div className="flashcard-details-page">
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
            
            {/* Add Flashcard Modal */}
            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <div className="modal-header">
                            <h3>Add New Flashcard</h3>
                            <button className="modal-close-btn" onClick={closeAddModal}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleAddFlashcard}>
                                <div className="form-group">
                                    <label htmlFor="term">
                                        Term <span className="required">*</span>
                                        <small className="char-count">
                                            {newFlashcard.term.length}/{MAX_TERM_LENGTH}
                                        </small>
                                    </label>
                                    <input
                                        type="text"
                                        id="term"
                                        name="term"
                                        value={newFlashcard.term}
                                        onChange={handleInputChange}
                                        className={`form-control ${formErrors.term ? 'is-invalid' : ''}`}
                                        maxLength={MAX_TERM_LENGTH}
                                        required
                                    />
                                    {formErrors.term && (
                                        <div className="invalid-feedback">
                                            {formErrors.term}
                                        </div>
                                    )}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="definition">
                                        Definition <span className="required">*</span>
                                        <small className="char-count">
                                            {newFlashcard.definition.length}/{MAX_DEFINITION_LENGTH}
                                        </small>
                                    </label>
                                    <textarea
                                        id="definition"
                                        name="definition"
                                        value={newFlashcard.definition}
                                        onChange={handleInputChange}
                                        className={`form-control ${formErrors.definition ? 'is-invalid' : ''}`}
                                        rows="3"
                                        maxLength={MAX_DEFINITION_LENGTH}
                                        required
                                    ></textarea>
                                    {formErrors.definition && (
                                        <div className="invalid-feedback">
                                            {formErrors.definition}
                                        </div>
                                    )}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="example">
                                        Example (optional)
                                        <small className="char-count">
                                            {newFlashcard.example.length}/{MAX_EXAMPLE_LENGTH}
                                        </small>
                                    </label>
                                    <textarea
                                        id="example"
                                        name="example"
                                        value={newFlashcard.example}
                                        onChange={handleInputChange}
                                        className={`form-control ${formErrors.example ? 'is-invalid' : ''}`}
                                        rows="3"
                                        maxLength={MAX_EXAMPLE_LENGTH}
                                    ></textarea>
                                    {formErrors.example && (
                                        <div className="invalid-feedback">
                                            {formErrors.example}
                                        </div>
                                    )}
                                </div>
                                <div className="form-actions">
                                    <button 
                                        type="button" 
                                        className="btn btn-outline-secondary"
                                        onClick={closeAddModal}
                                        disabled={creatingCard}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary"
                                        disabled={creatingCard || !!formErrors.term || !!formErrors.definition || !!formErrors.example}
                                    >
                                        {creatingCard ? (
                                            <>
                                                <i className="fas fa-spinner fa-spin"></i> Adding...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-save"></i> Save Flashcard
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
            
            <div className="flashcards-container">
                <div className="page-header">
                    <div className="header-back">
                        <button 
                            className="back-btn"
                            onClick={() => navigate('/flashcards')}
                        >
                            <i className="fas fa-arrow-left"></i>
                            Back to Flashcards
                        </button>
                    </div>
                    
                    {loading ? (
                        <div className="loading-spinner">
                            <i className="fas fa-spinner fa-spin"></i> Loading...
                        </div>
                    ) : error ? (
                        <div className="error-message">
                            <i className="fas fa-exclamation-circle"></i> {error}
                        </div>
                    ) : flashcardSet ? (
                        <>
                            <div className="flashcard-set-header">
                                <h1 className="set-title">{flashcardSet.title}</h1>
                                <div className="set-meta">
                                    <div className="meta-item">
                                        <i className="fas fa-globe"></i>
                                        <span>{flashcardSet.learningLanguage} → {flashcardSet.nativeLanguage}</span>
                                    </div>
                                    <div className="meta-item">
                                        <i className="fas fa-calendar"></i>
                                        <span>Created: {formatDate(flashcardSet.createdAt)}</span>
                                    </div>
                                    <div className="meta-item">
                                        <i className="fas fa-users"></i>
                                        <span>{flashcardSet.learnerCount || 0} Learners</span>
                                    </div>
                                    <div className="meta-item">
                                        <i className={`fas fa-${flashcardSet.isPublic ? 'eye' : 'lock'}`}></i>
                                        <span>{flashcardSet.isPublic ? 'Public' : 'Private'}</span>
                                    </div>
                                </div>
                                {flashcardSet.description && (
                                    <p className="set-description">{flashcardSet.description}</p>
                                )}
                            </div>
                            
                            <div className="flashcard-details-actions">
                                <button className="btn btn-primary">
                                    <i className="fas fa-play"></i>
                                    Study Set
                                </button>
                                <button 
                                    className="btn btn-outline-secondary"
                                    onClick={openAddModal}
                                >
                                    <i className="fas fa-plus"></i>
                                    Add Card
                                </button>
                                <button className="btn btn-outline-secondary">
                                    <i className="fas fa-edit"></i>
                                    Edit Set
                                </button>
                                <button className="btn btn-outline-danger">
                                    <i className="fas fa-trash"></i>
                                    Delete
                                </button>
                            </div>
                            
                            <div className="flashcards-list-header">
                                <h2>Flashcards ({flashcards.length})</h2>
                                <div className="list-controls">
                                    <input 
                                        type="text" 
                                        className="search-input" 
                                        placeholder="Search cards..."
                                    />
                                    <select className="sort-select">
                                        <option value="alphabetical">Alphabetical</option>
                                        <option value="created">Recently Created</option>
                                    </select>
                                </div>
                            </div>
                            
                            {flashcards.length > 0 ? (
                                <div className="flashcards-table">
                                    <div className="table-header">
                                        <div className="term-cell">Term</div>
                                        <div className="definition-cell">Definition</div>
                                        <div className="example-cell">Example</div>
                                        <div className="actions-cell">Actions</div>
                                    </div>
                                    
                                    {flashcards.map((card, index) => (
                                        <div className="table-row" key={index}>
                                            <div className="term-cell">{card.term}</div>
                                            <div className="definition-cell">{card.definition}</div>
                                            <div className="example-cell">{card.example}</div>
                                            <div className="actions-cell">
                                                <button className="btn-icon" title="Edit">
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                <button className="btn-icon" title="Delete">
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="no-cards-message">
                                    <p>This set doesn't have any flashcards yet. Add your first card!</p>
                                    <button 
                                        className="btn btn-primary mt-3"
                                        onClick={openAddModal}
                                    >
                                        <i className="fas fa-plus mr-2"></i>
                                        Add First Card
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="not-found-message">
                            <h2>Flashcard Set Not Found</h2>
                            <p>The flashcard set you're looking for doesn't exist or has been removed.</p>
                            <button 
                                className="btn btn-primary mt-3"
                                onClick={() => navigate('/flashcards')}
                            >
                                Back to Flashcards
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default FlashcardSetDetailsPage; 