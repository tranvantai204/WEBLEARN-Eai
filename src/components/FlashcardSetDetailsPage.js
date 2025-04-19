import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useFlashcard } from '../contexts/FlashcardContext';
import { useAuth } from '../contexts/AuthContext';
import ApiKeyForm from './ApiKeyForm';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../css/components/Flashcards.css';
import FlashcardReviews from './FlashcardReviews';
import LanguageSelector from './LanguageSelector';

// Thêm CSS cho animations
const modalStyles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideDown {
    from { transform: translateY(-50px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
`;

const baseUrl = process.env.REACT_APP_API_URL;

function copyToClipboard(link) {
    navigator.clipboard.writeText(link)
    toast.success("Link đã được copy!");   
}

// Tạo một component Modal riêng biệt
function Modal({ show, onClose, children }) {
    if (!show) return null;
    
    return (
        <div 
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 999999
            }}
            onClick={onClose}
        >
            <div 
                style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    width: '90%',
                    maxWidth: '600px',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
                    position: 'relative',
                    margin: '2rem auto'
                }}
                onClick={e => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
}

function FlashcardSetDetailsPage() {
    const { flashcardSetId } = useParams();
    const navigate = useNavigate();
    const { getFlashcardSet, createFlashcard, directCreateFlashcard, getFlashcardsForSet, deleteFlashcardSet, updateFlashcardSet, togglePublicStatus, loading, error, getUserApiKey, deleteFlashcard, updateFlashcard } = useFlashcard();
    const { isAuthenticated } = useAuth();
    
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("alphabetical");
    const [flashcardSet, setFlashcardSet] = useState(null);
    const [flashcards, setFlashcards] = useState([]);
    const [loadingFlashcards, setLoadingFlashcards] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditSetModal, setShowEditSetModal] = useState(false);
    const [showVisibilityModal, setShowVisibilityModal] = useState(false);
    const [changingVisibility, setChangingVisibility] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [deletingFlashcardId, setDeletingFlashcardId] = useState(null);
    const [deletingFlashcard, setDeletingFlashcard] = useState(false);
    const [newFlashcard, setNewFlashcard] = useState({
        term: '',
        definition: '',
        example: '',
        flashcardSetId: flashcardSetId
    });
    const [editSetData, setEditSetData] = useState({
        title: '',
        description: '',
        learningLanguage: '',
        nativeLanguage: '',
        level: 1
    });
    const [updatingSet, setUpdatingSet] = useState(false);
    const [editSetErrors, setEditSetErrors] = useState({
        title: '',
        description: '',
        learningLanguage: '',
        nativeLanguage: '',
        level: ''
    });
    const [creatingCard, setCreatingCard] = useState(false);
    const [formErrors, setFormErrors] = useState({
        term: '',
        definition: '',
        example: ''
    });
    const [generatingWithAI, setGeneratingWithAI] = useState(false);
    const [showApiKeyForm, setShowApiKeyForm] = useState(false);
    
    // States for editing flashcard
    const [showEditFlashcardModal, setShowEditFlashcardModal] = useState(false);
    const [editingFlashcardId, setEditingFlashcardId] = useState(null);
    const [editFlashcard, setEditFlashcard] = useState({
        term: '',
        definition: '',
        example: ''
    });
    const [updatingFlashcard, setUpdatingFlashcard] = useState(false);
    const [editFlashcardErrors, setEditFlashcardErrors] = useState({
        term: '',
        definition: '',
        example: ''
    });

    // Maximum character limits
    const MAX_TERM_LENGTH = 100;
    const MAX_DEFINITION_LENGTH = 300;
    const MAX_EXAMPLE_LENGTH = 500;
    const MAX_TITLE_LENGTH = 100;
    const MAX_DESCRIPTION_LENGTH = 500;

    // Default flashcard data for the sample term
    const defaultFlashcard = {
        term: "ball",
        definition: "Trái banh",
        example: "any object in the shape of a sphere, especially one used as a toy by children or in various sports such as tennis and football",
        flashcardSetId: flashcardSetId
    };

    // Add a state to store reviews
    const [reviews, setReviews] = useState([]);

    // Fetch flashcard set details on component mount
    useEffect(() => {
        const fetchFlashcardSetDetails = async () => {
            try {
                // Fetch flashcard set details
                const data = await getFlashcardSet(flashcardSetId);
                setFlashcardSet(data);
                
                // Store reviews from the response if they exist
                if (data && data.flashcardReviews) {
                    setReviews(data.flashcardReviews);
                }
                
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
            
            console.log('Fetched flashcards data:', flashcardsData);
            
            if (Array.isArray(flashcardsData)) {
                setFlashcards(flashcardsData);
            } else if (flashcardsData && Array.isArray(flashcardsData.flashcards)) {
                setFlashcards(flashcardsData.flashcards);
            } else {
                // If no flashcards or unexpected format, set to empty array
                console.warn('No flashcards found or unexpected format:', flashcardsData);
                setFlashcards([]);
            }
        } catch (err) {
            console.error('Error fetching flashcards:', err);
            toast.error('Failed to load flashcards: ' + (err.message || 'Unknown error'));
            setFlashcards([]);
        } finally {
            setLoadingFlashcards(false);
        }
    };
    
    // Opens delete confirmation modal for a specific flashcard
    const handleConfirmDeleteFlashcard = (flashcardId) => {
        setDeletingFlashcardId(flashcardId);
        setShowDeleteConfirmation(true);
    };
    
    // Closes the delete confirmation modal
    const closeDeleteConfirmation = () => {
        setShowDeleteConfirmation(false);
        setDeletingFlashcardId(null);
    };
    
    // Handles the actual deletion of a flashcard
    const handleDeleteFlashcard = async () => {
        if (!deletingFlashcardId) return;
        
        try {
            setDeletingFlashcard(true);
            
            // Call the delete flashcard function from context
            const result = await deleteFlashcard(deletingFlashcardId);
            
            if (result && result.success) {
                // Remove the deleted flashcard from the state
                setFlashcards(prev => prev.filter(card => card.flashcardId !== deletingFlashcardId));
                toast.success('Flashcard deleted successfully');
            }
        } catch (err) {
            console.error('Error deleting flashcard:', err);
            toast.error(`Failed to delete flashcard: ${err.message || 'Unknown error'}`);
        } finally {
            setDeletingFlashcard(false);
            closeDeleteConfirmation();
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

    const filteredFlashcards = flashcards
        .filter((flashcard) =>
            flashcard.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
            flashcard.definition.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            if (sortBy === "alphabetical") {
                return a.term.localeCompare(b.term);
            } else if (sortBy === "created") {
                return new Date(b.createdAt) - new Date(a.createdAt);
            }
            return 0;
        });

        const handleDeleteFlashCardSet = async (flashcardSetId) => {
            try {
                // Call the deleteFlashcardSet function and wait for the result
                const result = await deleteFlashcardSet(flashcardSetId);
        
                // Check if the deletion was successful
                if (result) {
                    navigate('/flashcards'); // Redirect to the /flashcards page
                }
            } catch (err) {
                console.error('Error while deleting flashcard set:', err);
                alert('Failed to delete flashcard set. Please try again.');
            }
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
        e.preventDefault(); // Ngăn chặn hành vi mặc định của form
        console.log('handleAddFlashcard called, form submitted');
        
        // Validate form before submission
        if (!validateForm()) {
            toast.error('Please fix the errors in the form before submitting.');
            return;
        }
        
        setCreatingCard(true);
        
        try {
            // Create flashcard data object following API requirements
            const flashcardData = {
                flashcardSetId: flashcardSetId,
                term: newFlashcard.term.trim(),
                definition: newFlashcard.definition.trim(),
                example: newFlashcard.example.trim() || ''
            };
            
            console.log('Creating flashcard with data:', flashcardData);
            
            // Sử dụng API endpoint từ yêu cầu của người dùng
            const response = await fetch(`${baseUrl}/FlashCard/Create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'ngrok-skip-browser-warning': 'true',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken') || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjZiNGU5YTcyLWJkMTUtNDAzMy1iYzk1LWI4M2Q1ZDI4ODJhYyIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6IjIyNTExMjAzMzlAdXQuZWR1LnZuIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6IlBodWNEYWkiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJVc2VyIiwiZXhwIjoxNzQyMzIwOTI1LCJpc3MiOiJXb3JkV2lzZSIsImF1ZCI6IldvcmRXaXNlIn0.J7S79y1QY0e0QQL1TydQeOGYI3I06AjY-Xdj2f8yrdM"}`
                },
                body: JSON.stringify(flashcardData)
            });
            
            console.log('Response status:', response.status);
            console.log('Response headers:', Object.fromEntries(response.headers.entries()));
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response:', errorText);
                
                // Kiểm tra giới hạn 50 flashcard
                if (errorText.includes('maximum limit') || errorText.includes('limit of 50') || errorText.includes('exceeds the maximum')) {
                    throw new Error('You have reached the maximum limit of 50 flashcards for this set.');
                } else if (errorText.includes('Unauthorized') || errorText.includes('401')) {
                    throw new Error('Your session has expired. Please login again.');
                } else if (errorText.includes('Forbidden') || errorText.includes('403')) {
                    throw new Error('You do not have permission to add cards to this set.');
                }
                
                throw new Error(`Failed to add card: ${response.status} ${response.statusText}`);
            }
            
            const result = await response.json();
            console.log('API response:', result);
            
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
            toast.error(`Error: ${err.message || 'An unknown error occurred'}`);
        } finally {
            setCreatingCard(false);
        }
    };

    // Open the add flashcard modal
    const openAddModal = () => {
        console.log('Opening add flashcard modal');
        
        // Reset form data
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
        
        // Set state to show modal
        setShowAddModal(true);
    };

    // Close the add flashcard modal
    const closeAddModal = () => {
        console.log('closeAddModal called - setting showAddModal to false');
        setShowAddModal(false);
    };

    // Open the edit set modal
    const openEditSetModal = () => {
        console.log('Opening edit set modal');
        
        // Initialize form with current flashcardSet data
        if (flashcardSet) {
            setEditSetData({
                title: flashcardSet.title || '',
                description: flashcardSet.description || '',
                learningLanguage: flashcardSet.learningLanguage || '',
                nativeLanguage: flashcardSet.nativeLanguage || '',
                level: flashcardSet.level || 1
            });
        }
        
        setEditSetErrors({
            title: '',
            description: '',
            learningLanguage: '',
            nativeLanguage: '',
            level: ''
        });
        
        // Show the modal
        setShowEditSetModal(true);
    };

    // Close the edit set modal
    const closeEditSetModal = () => {
        console.log('Closing edit set modal');
        setShowEditSetModal(false);
    };

    // Handle edit set form input changes
    const handleEditSetInputChange = (e) => {
        const { name, value } = e.target;
        
        // Update form data
        setEditSetData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Validate on change
        const errors = { ...editSetErrors };
        
        switch (name) {
            case 'title':
                if (!value.trim()) {
                    errors.title = 'Title is required';
                } else if (value.length > MAX_TITLE_LENGTH) {
                    errors.title = `Title must be less than ${MAX_TITLE_LENGTH} characters`;
                } else {
                    errors.title = '';
                }
                break;
            case 'description':
                if (value.length > MAX_DESCRIPTION_LENGTH) {
                    errors.description = `Description must be less than ${MAX_DESCRIPTION_LENGTH} characters`;
                } else {
                    errors.description = '';
                }
                break;
            case 'learningLanguage':
                if (!value.trim()) {
                    errors.learningLanguage = 'Learning language is required';
                } else {
                    errors.learningLanguage = '';
                }
                break;
            case 'nativeLanguage':
                if (!value.trim()) {
                    errors.nativeLanguage = 'Native language is required';
                } else {
                    errors.nativeLanguage = '';
                }
                break;
            case 'level':
                if (isNaN(value) || value < 1 || value > 10) {
                    errors.level = 'Level must be a number between 1 and 10';
                } else {
                    errors.level = '';
                }
                break;
            default:
                break;
        }
        
        setEditSetErrors(errors);
    };

    // Validate edit set form
    const validateEditSetForm = () => {
        const errors = {
            title: '',
            description: '',
            learningLanguage: '',
            nativeLanguage: '',
            level: ''
        };
        let isValid = true;
        
        if (!editSetData.title.trim()) {
            errors.title = 'Title is required';
            isValid = false;
        } else if (editSetData.title.length > MAX_TITLE_LENGTH) {
            errors.title = `Title must be less than ${MAX_TITLE_LENGTH} characters`;
            isValid = false;
        }
        
        if (editSetData.description.length > MAX_DESCRIPTION_LENGTH) {
            errors.description = `Description must be less than ${MAX_DESCRIPTION_LENGTH} characters`;
            isValid = false;
        }
        
        if (!editSetData.learningLanguage.trim()) {
            errors.learningLanguage = 'Learning language is required';
            isValid = false;
        }
        
        if (!editSetData.nativeLanguage.trim()) {
            errors.nativeLanguage = 'Native language is required';
            isValid = false;
        }
        
        if (isNaN(editSetData.level) || editSetData.level < 1 || editSetData.level > 10) {
            errors.level = 'Level must be a number between 1 and 10';
            isValid = false;
        }
        
        setEditSetErrors(errors);
        return isValid;
    };

    // Handle edit set form submission
    const handleEditSetSubmit = async (e) => {
        e.preventDefault();
        console.log('Edit set form submitted');
        
        // Validate form
        if (!validateEditSetForm()) {
            toast.error('Please fix the errors in the form before submitting.');
            return;
        }
        
        setUpdatingSet(true);
        
        try {
            // Format the data as required by the API
            const updateData = {
                title: editSetData.title.trim(),
                description: editSetData.description.trim(),
                learningLanguage: editSetData.learningLanguage.trim(),
                nativeLanguage: editSetData.nativeLanguage.trim(),
                level: parseInt(editSetData.level)
            };
            
            console.log('Updating flashcard set with data:', updateData);
            
            // Call the API to update the flashcard set
            const response = await fetch(`${baseUrl}/FlashCardSet/Update/${flashcardSetId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'ngrok-skip-browser-warning': 'true',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken') || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjZiNGU5YTcyLWJkMTUtNDAzMy1iYzk1LWI4M2Q1ZDI4ODJhYyIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6IjIyNTExMjAzMzlAdXQuZWR1LnZuIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6IlBodWNEYWkiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJVc2VyIiwiZXhwIjoxNzQzNzQ0OTg4LCJpc3MiOiJXb3JkV2lzZSIsImF1ZCI6IldvcmRXaXNlIn0.PMvf8eJOGcF8A-ag_6frqgDFbft6YRxnAdvxoTDZ2KI"}`
                },
                body: JSON.stringify(updateData)
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response:', errorText);
                
                if (response.status === 401) {
                    throw new Error('Your session has expired. Please login again.');
                } else if (response.status === 403) {
                    throw new Error('You do not have permission to edit this set.');
                }
                
                throw new Error(`Failed to update set: ${response.status} ${response.statusText}`);
            }
            
            const result = await response.json();
            console.log('API response:', result);
            
            // Update state with the updated flashcard set
            setFlashcardSet(result);
            
            // Close modal and show success message
            setShowEditSetModal(false);
            toast.success('Flashcard set updated successfully!');
            
        } catch (err) {
            console.error('Failed to update flashcard set:', err);
            toast.error(`Error: ${err.message || 'An unknown error occurred'}`);
        } finally {
            setUpdatingSet(false);
        }
    };

    // Helper function to determine character count class
    const getCharCountClass = (current, max) => {
        const percentage = (current / max) * 100;
        if (percentage >= 90) return 'char-count limit-reached';
        if (percentage >= 75) return 'char-count limit-approaching';
        return 'char-count';
    };

    // Add a console.log function for debugging
    const debugLog = (message, data = null) => {
        if (data) {
            console.log(`[DEBUG] ${message}`, data);
        } else {
            console.log(`[DEBUG] ${message}`);
        }
    };

    // Add effect to monitor button clicks for debugging
    useEffect(() => {
        debugLog('Component mounted');
        
        // Thêm event listener toàn cục để debug các sự kiện click
        const handleGlobalClick = (e) => {
            if (e.target.closest('#addCardButton')) {
                debugLog('Add Card button clicked via global event listener');
            }
        };
        
        document.addEventListener('click', handleGlobalClick);
        
        return () => {
            document.removeEventListener('click', handleGlobalClick);
            debugLog('Component unmounted');
        };
    }, []);

    // Add effect to monitor showAddModal state changes
    useEffect(() => {
        debugLog('showAddModal state changed to:', showAddModal);
        
        // Khi modal mở, ngăn chặn cuộn trang nền
        if (showAddModal) {
            document.body.style.overflow = 'hidden';
            debugLog('Body scroll disabled');
        } else {
            document.body.style.overflow = 'unset';
            debugLog('Body scroll enabled');
        }
        
        // Cleanup function
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [showAddModal]);

    // Function to add a default flashcard directly without using modal
    const addDefaultFlashcard = async () => {
        try {
            // Show loading notification
            const toastId = toast.info('Adding default flashcard...', { autoClose: false });
            
            // Create a default flashcard with sample data
            const flashcardData = {
                flashcardSetId: flashcardSetId,
                term: "New Term",
                definition: "Definition for the new term",
                example: "This is an example sentence using the new term."
            };
            
            console.log('Creating default flashcard with data:', flashcardData);
            
            // Call API directly
            const result = await directCreateFlashcard(flashcardData);
            
            console.log('API response for default card:', result);
            
            // Update toast with success message
            toast.update(toastId, { 
                render: 'Flashcard added successfully!', 
                type: 'success',
                autoClose: 3000
            });
            
            // Refresh the flashcards list
            fetchFlashcardsForSet(flashcardSetId);
        } catch (err) {
            console.error('Failed to add default flashcard:', err);
            
            // Handle specific error cases
            if (err.message) {
                if (err.message.includes('maximum limit')) {
                    toast.error('You have reached the maximum limit of 50 flashcards for this set.');
                } else if (err.message.includes('Forbidden')) {
                    toast.error('You do not have permission to add cards to this set.');
                } else if (err.message.includes('Authentication required')) {
                    toast.error('Your session has expired. Please log in again.');
                } else if (err.message.includes('Server error')) {
                    toast.error('Server error occurred. Please try again later.');
                } else {
                    toast.error(err.message || 'Failed to add flashcard');
                }
            } else {
                toast.error('An unknown error occurred. Please try again.');
            }
        }
    };

    // Function to add a sample flashcard directly without using modal
    const addSampleFlashcard = async () => {
        try {
            // Create a random index to select different sample data
            const sampleData = [
                {
                    term: "hello",
                    definition: "xin chào",
                    example: "Hello, how are you today?"
                },
                {
                    term: "book",
                    definition: "quyển sách",
                    example: "I'm reading an interesting book about science."
                },
                {
                    term: "computer",
                    definition: "máy tính",
                    example: "She uses her computer for online classes."
                },
                {
                    term: "water",
                    definition: "nước",
                    example: "Please drink more water when it's hot."
                },
                {
                    term: "friend",
                    definition: "bạn bè",
                    example: "My friend helped me with my homework."
                }
            ];
            
            // Pick a random sample
            const randomIndex = Math.floor(Math.random() * sampleData.length);
            const sample = sampleData[randomIndex];
            
            // Show loading notification
            const toastId = toast.info('Adding sample flashcard...', { autoClose: false });
            
            // Create flashcard with sample data
            const flashcardData = {
                flashcardSetId: flashcardSetId,
                term: sample.term,
                definition: sample.definition,
                example: sample.example
            };
            
            console.log('Creating sample flashcard with data:', flashcardData);
            
            // Call API directly
            const result = await directCreateFlashcard(flashcardData);
            
            console.log('API response for sample card:', result);
            
            // Update toast with success message
            toast.update(toastId, { 
                render: `Sample flashcard "${sample.term}" added successfully!`, 
                type: 'success',
                autoClose: 3000
            });
            
            // Refresh the flashcards list
            fetchFlashcardsForSet(flashcardSetId);
        } catch (err) {
            console.error('Failed to add sample flashcard:', err);
            
            // Handle errors (same as addDefaultFlashcard)
            if (err.message) {
                if (err.message.includes('maximum limit')) {
                    toast.error('You have reached the maximum limit of 50 flashcards for this set.');
                } else if (err.message.includes('Forbidden')) {
                    toast.error('You do not have permission to add cards to this set.');
                } else if (err.message.includes('Authentication required')) {
                    toast.error('Your session has expired. Please log in again.');
                } else if (err.message.includes('Server error')) {
                    toast.error('Server error occurred. Please try again later.');
                } else {
                    toast.error(err.message || 'Failed to add flashcard');
                }
            } else {
                toast.error('An unknown error occurred. Please try again.');
            }
        }
    };

    // Function to add a flashcard directly with the sample data from Postman
    const addFlashcardDirect = async () => {
        try {
            // Show loading notification
            const toastId = toast.info('Adding flashcard using direct API request...', { autoClose: false });
            
            console.log('Current flashcardSetId:', flashcardSetId);
            
            // Check if flashcardSetId is valid, otherwise use the hardcoded ID
            const targetSetId = flashcardSetId ? flashcardSetId : "7154D6D5-3389-4DB9-B1C0-08DD661EECAF";
            
            // Create flashcard with sample data
            const flashcardData = {
                term: "ball",
                definition: "Trái banh",
                example: "any object in the shape of a sphere, especially one used as a toy by children or in various sports such as tennis and football",
                flashcardSetId: targetSetId // Use the current set ID or fallback to Postman ID
            };
            
            console.log('Creating flashcard with data:', flashcardData);
            
            // Call direct API method to bypass middleware
            const result = await directCreateFlashcard(flashcardData);
            
            console.log('API response:', result);
            
            // Update toast with success message
            toast.update(toastId, { 
                render: 'Flashcard "ball" added successfully!', 
                type: 'success',
                autoClose: 3000
            });
            
            // Refresh the flashcards list
            fetchFlashcardsForSet(targetSetId);
        } catch (err) {
            console.error('Failed to add flashcard:', err);
            
            // Special handling for 401 Unauthorized
            if (err.response && err.response.status === 401) {
                toast.error('Authorization failed. Please log in again to refresh your session.');
                // You could redirect to login page here
            } else {
                toast.error(`Error: ${err.message || 'Unknown error occurred'}`);
            }
            
            // Additional debugging information in console
            if (err.response) {
                console.error('Error response details:', err.response);
            }
        }
    };

    // Simple function to add a card without toast or complex logic
    const addSimpleCard = async () => {
        try {
            console.log('Adding a simple card directly...');
            
            // Fixed data that matches the API requirements
            const flashcardData = {
                term: "simple card " + Math.floor(Math.random() * 1000),  // Thêm số ngẫu nhiên để tạo thẻ khác nhau
                definition: "đơn giản",
                example: "This is a simple example.",
                flashcardSetId: flashcardSetId || "7154D6D5-3389-4DB9-B1C0-08DD661EECAF"
            };
            
            console.log('Flashcard data:', flashcardData);
            
            // Make the API call directly
            const response = await fetch("https://6d2c-115-76-51-131.ngrok-free.app/api/FlashCard/Create", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'ngrok-skip-browser-warning': 'true',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken') || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjZiNGU5YTcyLWJkMTUtNDAzMy1iYzk1LWI4M2Q1ZDI4ODJhYyIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6IjIyNTExMjAzMzlAdXQuZWR1LnZuIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6IlBodWNEYWkiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJVc2VyIiwiZXhwIjoxNzQyMzIwOTI1LCJpc3MiOiJXb3JkV2lzZSIsImF1ZCI6IldvcmRXaXNlIn0.J7S79y1QY0e0QQL1TydQeOGYI3I06AjY-Xdj2f8yrdM"}`
                },
                body: JSON.stringify(flashcardData)
            });
            
            console.log('Response status:', response.status);
            console.log('Response headers:', Object.fromEntries(response.headers.entries()));
            
            // Handle response
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response:', errorText);
                toast.error(`Failed to add card: ${response.status} ${response.statusText}`);
                return;
            }
            
            const result = await response.json();
            console.log('Success response:', result);
            
            // Show success toast
            toast.success('Flashcard added successfully!');
            
            // Refresh the flashcards list
            fetchFlashcardsForSet(flashcardData.flashcardSetId);
            
        } catch (err) {
            console.error('Error adding card:', err);
            toast.error(`Error: ${err.message}`);
        }
    };

    // Handle flashcard set visibility change
    const handleVisibilityChange = async () => {
        try {
            setChangingVisibility(true);
            
            console.log('Changing visibility for flashcard set ID:', flashcardSetId);
            console.log('Current visibility:', flashcardSet.isPublic ? 'Public' : 'Private');
            
            // Use the context function to toggle visibility
            await togglePublicStatus(flashcardSetId);
            
            // Update the flashcard set state with the new visibility
            setFlashcardSet(prev => ({
                ...prev,
                isPublic: !prev.isPublic
            }));
            
            // Close modal and show success message
            setShowVisibilityModal(false);
            toast.success(`Flashcard set is now ${flashcardSet.isPublic ? 'private' : 'public'}`);
            
        } catch (err) {
            console.error('Failed to change visibility:', err);
            toast.error(`Error: ${err.message || 'An unknown error occurred'}`);
        } finally {
            setChangingVisibility(false);
        }
    };

    // Open visibility confirmation modal
    const openVisibilityModal = () => {
        setShowVisibilityModal(true);
    };

    // Close visibility confirmation modal
    const closeVisibilityModal = () => {
        setShowVisibilityModal(false);
    };

    // Kiểm tra API key và hiển thị form nếu cần
    const handleGenerateWithAI = async () => {
        // Kiểm tra xem từ đã được nhập hay chưa
        if (!newFlashcard.term.trim()) {
            toast.error('Vui lòng nhập từ để tạo nội dung với AI');
            return;
        }
        
        // Nếu chưa đăng nhập, chuyển hướng đến trang đăng nhập
        if (!isAuthenticated) {
            toast.error('Bạn cần đăng nhập để sử dụng tính năng này');
            navigate('/login');
            return;
        }
        
        // Kiểm tra API key trong localStorage
        const localApiKey = localStorage.getItem('gemini_api_key');
        const timestamp = localStorage.getItem('gemini_api_key_timestamp');
        
        if (localApiKey && timestamp) {
            // Kiểm tra xem API key có còn hiệu lực không (2 giờ)
            const now = Date.now();
            const saved = parseInt(timestamp, 10);
            const twoHoursMs = 2 * 60 * 60 * 1000;
            
            if (now - saved <= twoHoursMs) {
                console.log('Sử dụng API key từ localStorage');
                // Bỏ qua hiển thị form API key
                handleGenerateContentWithAI();
                return;
            } else {
                // API key đã hết hạn, xóa khỏi localStorage
                console.log('API key trong localStorage đã hết hạn');
                localStorage.removeItem('gemini_api_key');
                localStorage.removeItem('gemini_api_key_timestamp');
            }
        }
        
        // Hiển thị form nhập API key nếu không có trong localStorage
        setShowApiKeyForm(true);
    };
    
    // Xử lý khi người dùng nhập API key thành công
    const handleApiKeySuccess = () => {
        setShowApiKeyForm(false);
        toast.success('API key đã được lưu thành công!');
        
        // Tự động tiếp tục tạo nội dung flashcard
        if (newFlashcard.term.trim()) {
            handleGenerateContentWithAI();
        }
    };
    
    // Xử lý khi người dùng bỏ qua việc nhập API key
    const handleSkipApiKey = () => {
        setShowApiKeyForm(false);
        toast.info('Bạn có thể thêm API key sau trong phần cài đặt. Lưu ý rằng các tính năng AI sẽ không hoạt động nếu không có API key.');
    };
    
    // Hàm thực tế tạo nội dung bằng AI
    const handleGenerateContentWithAI = async () => {
        // Kiểm tra lại xem từ đã được nhập hay chưa
        if (!newFlashcard.term.trim()) {
            toast.error('Vui lòng nhập từ để tạo nội dung với AI');
            return;
        }
        
        setGeneratingWithAI(true);
        
        try {
            const response = await fetch(`${baseUrl}/api/FlashCardSet/GenerateByAI`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'ngrok-skip-browser-warning': 'true',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                },
                body: JSON.stringify({
                    term: newFlashcard.term,
                    learningLanguage: flashcardSet?.learningLanguage || 'en',
                    nativeLanguage: flashcardSet?.nativeLanguage || 'vi'
                })
            });
            
            if (!response.ok) {
                // Nếu không thành công, kiểm tra lỗi
                const errorText = await response.text();
                
                if (errorText.includes('No API key available')) {
                    // Nếu không có API key, hiển thị form nhập API key
                    setShowApiKeyForm(true);
                    throw new Error('Bạn cần nhập API key Gemini để sử dụng tính năng AI');
                }
                
                throw new Error(`Không thể tạo nội dung: ${response.status} ${response.statusText}`);
            }
            
            const result = await response.json();
            
            // Cập nhật form với nội dung từ AI
            setNewFlashcard(prev => ({
                ...prev,
                definition: result.definition || prev.definition,
                example: result.example || prev.example
            }));
            
            toast.success('Đã tạo nội dung thành công!');
        } catch (error) {
            console.error('Lỗi khi tạo nội dung với AI:', error);
            toast.error(error.message || 'Đã xảy ra lỗi khi tạo nội dung với AI');
        } finally {
            setGeneratingWithAI(false);
        }
    };

    // Opens edit flashcard modal
    const handleOpenEditModal = (flashcard) => {
        setEditingFlashcardId(flashcard.flashcardId);
        setEditFlashcard({
            term: flashcard.term,
            definition: flashcard.definition,
            example: flashcard.example || ''
        });
        setEditFlashcardErrors({
            term: '',
            definition: '',
            example: ''
        });
        setShowEditFlashcardModal(true);
    };
    
    // Closes the edit flashcard modal
    const closeEditFlashcardModal = () => {
        setShowEditFlashcardModal(false);
        setEditingFlashcardId(null);
    };
    
    // Handle flashcard edit form input changes with validation
    const handleEditFlashcardChange = (e) => {
        const { name, value } = e.target;
        
        // Update form data
        setEditFlashcard(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Validate on change
        const errors = { ...editFlashcardErrors };
        
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
        
        setEditFlashcardErrors(errors);
    };
    
    // Validate edit flashcard form before submission
    const validateEditFlashcardForm = () => {
        const errors = {
            term: '',
            definition: '',
            example: ''
        };
        let isValid = true;
        
        if (!editFlashcard.term.trim()) {
            errors.term = 'Term is required';
            isValid = false;
        } else if (editFlashcard.term.length > MAX_TERM_LENGTH) {
            errors.term = `Term must be less than ${MAX_TERM_LENGTH} characters`;
            isValid = false;
        }
        
        if (!editFlashcard.definition.trim()) {
            errors.definition = 'Definition is required';
            isValid = false;
        } else if (editFlashcard.definition.length > MAX_DEFINITION_LENGTH) {
            errors.definition = `Definition must be less than ${MAX_DEFINITION_LENGTH} characters`;
            isValid = false;
        }
        
        if (editFlashcard.example.length > MAX_EXAMPLE_LENGTH) {
            errors.example = `Example must be less than ${MAX_EXAMPLE_LENGTH} characters`;
            isValid = false;
        }
        
        setEditFlashcardErrors(errors);
        return isValid;
    };
    
    // Handle edit flashcard form submission
    const handleUpdateFlashcard = async (e) => {
        e.preventDefault();
        
        // Validate form before submission
        if (!validateEditFlashcardForm()) {
            toast.error('Please fix the errors in the form before submitting.');
            return;
        }
        
        setUpdatingFlashcard(true);
        
        try {
            // Create flashcard data object
            const flashcardData = {
                term: editFlashcard.term.trim(),
                definition: editFlashcard.definition.trim(),
                example: editFlashcard.example.trim() || ''
            };
            
            console.log('Updating flashcard with data:', flashcardData);
            
            // Call the updateFlashcard function from context
            const result = await updateFlashcard(editingFlashcardId, flashcardData);
            
            if (result && result.success) {
                // Update the flashcard in the state
                setFlashcards(prev => prev.map(card => 
                    card.flashcardId === editingFlashcardId 
                        ? { ...card, ...flashcardData }
                        : card
                ));
                
                toast.success('Flashcard updated successfully');
                closeEditFlashcardModal();
            } else {
                toast.error(result.error || 'Failed to update flashcard');
            }
        } catch (err) {
            console.error('Error updating flashcard:', err);
            toast.error(`Failed to update flashcard: ${err.message || 'Unknown error'}`);
        } finally {
            setUpdatingFlashcard(false);
        }
    };

    // Handler for when a new review is added or updated
    const handleReviewAdded = (newReview, updatedReviews) => {
        if (updatedReviews) {
            // Nếu đây là cập nhật đánh giá, sử dụng danh sách đánh giá đã cập nhật
            setReviews(updatedReviews);
        } else {
            // Nếu đây là thêm đánh giá mới
            setReviews(prevReviews => [...prevReviews, newReview]);
        }
    };

    return (
        <div className="flashcard-details-page">
            {/* Thêm style cho animations */}
            <style>{modalStyles}</style>
            
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
            
            {/* Hiển thị form nhập API key khi cần */}
            {showApiKeyForm && (
                <ApiKeyForm 
                    onSuccess={handleApiKeySuccess} 
                    onSkip={handleSkipApiKey} 
                />
            )}
            
            {/* Modal for adding a new flashcard */}
            <Modal show={showAddModal} onClose={() => setShowAddModal(false)}>
                <div className="modal-header" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1.5rem',
                    borderBottom: '1px solid #e0e0e0'
                }}>
                    <h3 style={{
                        margin: 0,
                        fontSize: '1.25rem',
                        fontWeight: '600'
                    }}>Add New Flashcard</h3>
                    <button 
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '1.25rem',
                            color: '#6c757d',
                            cursor: 'pointer',
                            padding: '0.5rem'
                        }}
                        onClick={() => setShowAddModal(false)}
                    >
                        <i className="fas fa-times"></i>
                    </button>
                </div>
                <div className="modal-body" style={{
                    padding: '1.5rem'
                }}>
                    <div className="modal-instructions" style={{
                        backgroundColor: '#f8f9fa',
                        padding: '1rem',
                        borderRadius: '8px',
                        marginBottom: '1.5rem'
                    }}>
                        <p style={{
                            margin: 0,
                            fontSize: '0.95rem',
                            color: '#495057'
                        }}><i className="fas fa-info-circle"></i> Create a new flashcard for your set. Term and Definition are required fields. You can use AI Generate to automatically create definitions and examples.</p>
                    </div>
                    <form onSubmit={handleAddFlashcard}>
                        <div className="form-group" style={{
                            marginBottom: '1.25rem'
                        }}>
                            <label htmlFor="term" style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '0.5rem',
                                fontWeight: '500'
                            }}>
                                Term <span style={{ color: '#dc3545' }}>*</span>
                                <small style={{ color: '#6c757d', fontSize: '0.8rem' }}>
                                    {newFlashcard.term.length}/{MAX_TERM_LENGTH}
                                </small>
                            </label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input
                                    type="text"
                                    id="term"
                                    name="term"
                                    value={newFlashcard.term}
                                    onChange={handleInputChange}
                                    style={{
                                        flex: 1,
                                        padding: '0.75rem 1rem',
                                        border: formErrors.term ? '1px solid #dc3545' : '1px solid #ced4da',
                                        borderRadius: '6px',
                                        fontSize: '1rem'
                                    }}
                                    maxLength={MAX_TERM_LENGTH}
                                    placeholder="Enter the word or phrase to learn"
                                    autoFocus
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={handleGenerateWithAI}
                                    disabled={generatingWithAI || !newFlashcard.term.trim()}
                                    title="Tạo định nghĩa và ví dụ bằng AI. Yêu cầu API key của Google Gemini."
                                    style={{
                                        padding: '0.75rem 1rem',
                                        backgroundColor: '#4285f4',
                                        border: 'none',
                                        borderRadius: '6px',
                                        color: 'white',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        opacity: generatingWithAI || !newFlashcard.term.trim() ? 0.7 : 1
                                    }}
                                >
                                    {generatingWithAI ? (
                                        <>
                                            <i className="fas fa-spinner fa-spin"></i> Đang tạo...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-magic"></i> AI Generate
                                        </>
                                    )}
                                </button>
                            </div>
                            {formErrors.term && (
                                <div style={{ color: '#dc3545', fontSize: '0.875em', marginTop: '0.25rem' }}>
                                    {formErrors.term}
                                </div>
                            )}
                        </div>
                        <div className="form-group" style={{
                            marginBottom: '1.25rem'
                        }}>
                            <label htmlFor="definition" style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '0.5rem',
                                fontWeight: '500'
                            }}>
                                Definition <span style={{ color: '#dc3545' }}>*</span>
                                <small style={{ color: '#6c757d', fontSize: '0.8rem' }}>
                                    {newFlashcard.definition.length}/{MAX_DEFINITION_LENGTH}
                                </small>
                            </label>
                            <textarea
                                id="definition"
                                name="definition"
                                value={newFlashcard.definition}
                                onChange={handleInputChange}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem',
                                    border: formErrors.definition ? '1px solid #dc3545' : '1px solid #ced4da',
                                    borderRadius: '6px',
                                    fontSize: '1rem',
                                    minHeight: '100px',
                                    resize: 'vertical'
                                }}
                                rows="3"
                                maxLength={MAX_DEFINITION_LENGTH}
                                placeholder="Enter the meaning or explanation"
                                required
                            ></textarea>
                            {formErrors.definition && (
                                <div style={{ color: '#dc3545', fontSize: '0.875em', marginTop: '0.25rem' }}>
                                    {formErrors.definition}
                                </div>
                            )}
                        </div>
                        <div className="form-group" style={{
                            marginBottom: '1.25rem'
                        }}>
                            <label htmlFor="example" style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '0.5rem',
                                fontWeight: '500'
                            }}>
                                Example (optional)
                                <small style={{ color: '#6c757d', fontSize: '0.8rem' }}>
                                    {newFlashcard.example.length}/{MAX_EXAMPLE_LENGTH}
                                </small>
                            </label>
                            <textarea
                                id="example"
                                name="example"
                                value={newFlashcard.example}
                                onChange={handleInputChange}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem',
                                    border: formErrors.example ? '1px solid #dc3545' : '1px solid #ced4da',
                                    borderRadius: '6px',
                                    fontSize: '1rem',
                                    minHeight: '100px',
                                    resize: 'vertical'
                                }}
                                rows="3"
                                maxLength={MAX_EXAMPLE_LENGTH}
                                placeholder="Add a sample sentence or usage example"
                            ></textarea>
                            {formErrors.example && (
                                <div style={{ color: '#dc3545', fontSize: '0.875em', marginTop: '0.25rem' }}>
                                    {formErrors.example}
                                </div>
                            )}
                        </div>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: '1rem',
                            marginTop: '2rem'
                        }}>
                            <button 
                                type="button" 
                                style={{
                                    padding: '0.5rem 1rem',
                                    borderRadius: '6px',
                                    backgroundColor: '#f8f9fa',
                                    border: '1px solid #ced4da',
                                    color: '#212529',
                                    cursor: 'pointer'
                                }}
                                onClick={() => setShowAddModal(false)}
                                disabled={creatingCard}
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                style={{
                                    padding: '0.5rem 1rem',
                                    borderRadius: '6px',
                                    backgroundColor: '#16a085',
                                    border: 'none',
                                    color: 'white',
                                    cursor: 'pointer',
                                    opacity: (creatingCard || !!formErrors.term || !!formErrors.definition || !!formErrors.example) ? 0.7 : 1
                                }}
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
            </Modal>
            
            {/* Modal for editing the flashcard set */}
            <Modal show={showEditSetModal} onClose={closeEditSetModal}>
                <div className="modal-header" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1.5rem',
                    borderBottom: '1px solid #e0e0e0'
                }}>
                    <h3 style={{
                        margin: 0,
                        fontSize: '1.25rem',
                        fontWeight: '600'
                    }}>Edit Flashcard Set</h3>
                    <button 
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '1.25rem',
                            color: '#6c757d',
                            cursor: 'pointer',
                            padding: '0.5rem'
                        }}
                        onClick={closeEditSetModal}
                    >
                        <i className="fas fa-times"></i>
                    </button>
                </div>
                <div className="modal-body" style={{
                    padding: '1.5rem'
                }}>
                    <div className="modal-instructions" style={{
                        backgroundColor: '#f8f9fa',
                        padding: '1rem',
                        borderRadius: '8px',
                        marginBottom: '1.5rem'
                    }}>
                        <p style={{
                            margin: 0,
                            fontSize: '0.95rem',
                            color: '#495057'
                        }}><i className="fas fa-info-circle"></i> Edit your flashcard set details. Title, Learning Language, and Native Language are required fields.</p>
                    </div>
                    <form onSubmit={handleEditSetSubmit}>
                        <div className="form-group" style={{
                            marginBottom: '1.25rem'
                        }}>
                            <label htmlFor="title" style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '0.5rem',
                                fontWeight: '500'
                            }}>
                                Title <span style={{ color: '#dc3545' }}>*</span>
                                <small style={{ color: '#6c757d', fontSize: '0.8rem' }}>
                                    {editSetData.title.length}/{MAX_TITLE_LENGTH}
                                </small>
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={editSetData.title}
                                onChange={handleEditSetInputChange}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem',
                                    border: editSetErrors.title ? '1px solid #dc3545' : '1px solid #ced4da',
                                    borderRadius: '6px',
                                    fontSize: '1rem'
                                }}
                                maxLength={MAX_TITLE_LENGTH}
                                placeholder="Enter set title"
                                required
                            />
                            {editSetErrors.title && (
                                <div style={{ color: '#dc3545', fontSize: '0.875em', marginTop: '0.25rem' }}>
                                    {editSetErrors.title}
                                </div>
                            )}
                        </div>
                        <div className="form-group" style={{
                            marginBottom: '1.25rem'
                        }}>
                            <label htmlFor="description" style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '0.5rem',
                                fontWeight: '500'
                            }}>
                                Description (optional)
                                <small style={{ color: '#6c757d', fontSize: '0.8rem' }}>
                                    {editSetData.description.length}/{MAX_DESCRIPTION_LENGTH}
                                </small>
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={editSetData.description}
                                onChange={handleEditSetInputChange}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem',
                                    border: editSetErrors.description ? '1px solid #dc3545' : '1px solid #ced4da',
                                    borderRadius: '6px',
                                    fontSize: '1rem',
                                    minHeight: '80px',
                                    resize: 'vertical'
                                }}
                                rows="3"
                                maxLength={MAX_DESCRIPTION_LENGTH}
                                placeholder="Enter description (optional)"
                            ></textarea>
                            {editSetErrors.description && (
                                <div style={{ color: '#dc3545', fontSize: '0.875em', marginTop: '0.25rem' }}>
                                    {editSetErrors.description}
                                </div>
                            )}
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem' }}>
                            <LanguageSelector
                                id="learningLanguage"
                                name="learningLanguage"
                                value={editSetData.learningLanguage}
                                onChange={handleEditSetInputChange}
                                label="Learning Language"
                                required={true}
                                error={editSetErrors.learningLanguage}
                            />
                            
                            <LanguageSelector
                                id="nativeLanguage"
                                name="nativeLanguage"
                                value={editSetData.nativeLanguage}
                                onChange={handleEditSetInputChange}
                                label="Native Language"
                                required={true}
                                error={editSetErrors.nativeLanguage}
                            />
                        </div>
                        <div className="form-group" style={{
                            marginBottom: '1.25rem'
                        }}>
                            <label htmlFor="level" style={{
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontWeight: '500'
                            }}>
                                Level <span style={{ color: '#dc3545' }}>*</span>
                            </label>
                            <input
                                type="number"
                                id="level"
                                name="level"
                                value={editSetData.level}
                                onChange={handleEditSetInputChange}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem',
                                    border: editSetErrors.level ? '1px solid #dc3545' : '1px solid #ced4da',
                                    borderRadius: '6px',
                                    fontSize: '1rem'
                                }}
                                min="1"
                                max="10"
                                step="1"
                                placeholder="Enter level (1-10)"
                                required
                            />
                            {editSetErrors.level && (
                                <div style={{ color: '#dc3545', fontSize: '0.875em', marginTop: '0.25rem' }}>
                                    {editSetErrors.level}
                                </div>
                            )}
                        </div>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: '1rem',
                            marginTop: '2rem'
                        }}>
                            <button 
                                type="button" 
                                style={{
                                    padding: '0.5rem 1rem',
                                    borderRadius: '6px',
                                    backgroundColor: '#f8f9fa',
                                    border: '1px solid #ced4da',
                                    color: '#212529',
                                    cursor: 'pointer'
                                }}
                                onClick={closeEditSetModal}
                                disabled={updatingSet}
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                style={{
                                    padding: '0.5rem 1rem',
                                    borderRadius: '6px',
                                    backgroundColor: '#16a085',
                                    border: 'none',
                                    color: 'white',
                                    cursor: 'pointer',
                                    opacity: (updatingSet || !!editSetErrors.title || !!editSetErrors.description || !!editSetErrors.learningLanguage || !!editSetErrors.nativeLanguage || !!editSetErrors.level) ? 0.7 : 1
                                }}
                                disabled={updatingSet || !!editSetErrors.title || !!editSetErrors.description || !!editSetErrors.learningLanguage || !!editSetErrors.nativeLanguage || !!editSetErrors.level}
                            >
                                {updatingSet ? (
                                    <>
                                        <i className="fas fa-spinner fa-spin"></i> Updating...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-save"></i> Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
            
            {/* Modal for changing visibility */}
            <Modal show={showVisibilityModal} onClose={closeVisibilityModal}>
                <div className="modal-header" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1.5rem',
                    borderBottom: '1px solid #e0e0e0'
                }}>
                    <h3 style={{
                        margin: 0,
                        fontSize: '1.25rem',
                        fontWeight: '600'
                    }}>Change Visibility</h3>
                    <button 
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '1.25rem',
                            color: '#6c757d',
                            cursor: 'pointer',
                            padding: '0.5rem'
                        }}
                        onClick={closeVisibilityModal}
                    >
                        <i className="fas fa-times"></i>
                    </button>
                </div>
                <div className="modal-body" style={{
                    padding: '1.5rem'
                }}>
                    <div style={{
                        backgroundColor: '#f8f9fa',
                        padding: '1rem',
                        borderRadius: '8px',
                        marginBottom: '1.5rem'
                    }}>
                        <p style={{
                            margin: 0,
                            fontSize: '1rem',
                            color: '#495057'
                        }}>
                            <i className="fas fa-info-circle"></i> Are you sure you want to make this flashcard set 
                            {flashcardSet?.isPublic ? ' private' : ' public'}?
                        </p>
                        
                        {flashcardSet?.isPublic ? (
                            <p style={{
                                margin: '1rem 0 0 0',
                                fontSize: '0.9rem',
                                color: '#6c757d'
                            }}>
                                <i className="fas fa-lock"></i> Making it private means only you can access it.
                            </p>
                        ) : (
                            <p style={{
                                margin: '1rem 0 0 0',
                                fontSize: '0.9rem',
                                color: '#6c757d'
                            }}>
                                <i className="fas fa-eye"></i> Making it public means anyone can view and study this set.
                            </p>
                        )}
                    </div>
                    
                    <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: '1rem',
                        marginTop: '2rem'
                    }}>
                        <button 
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '6px',
                                backgroundColor: '#f8f9fa',
                                border: '1px solid #ced4da',
                                color: '#212529',
                                cursor: 'pointer'
                            }}
                            onClick={closeVisibilityModal}
                            disabled={changingVisibility}
                        >
                            Cancel
                        </button>
                        <button 
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '6px',
                                backgroundColor: flashcardSet?.isPublic ? '#6c757d' : '#16a085',
                                border: 'none',
                                color: 'white',
                                cursor: 'pointer',
                                opacity: changingVisibility ? 0.7 : 1
                            }}
                            onClick={handleVisibilityChange}
                            disabled={changingVisibility}
                        >
                            {changingVisibility ? (
                                <>
                                    <i className="fas fa-spinner fa-spin"></i> Updating...
                                </>
                            ) : (
                                <>
                                    <i className={`fas fa-${flashcardSet?.isPublic ? 'lock' : 'eye'}`}></i> Make {flashcardSet?.isPublic ? 'Private' : 'Public'}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </Modal>
            
            {/* Delete Flashcard Confirmation Modal */}
            <Modal show={showDeleteConfirmation} onClose={closeDeleteConfirmation}>
                <div className="modal-header" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1.5rem',
                    borderBottom: '1px solid #e0e0e0'
                }}>
                    <h3 style={{
                        margin: 0,
                        fontSize: '1.25rem',
                        fontWeight: '600'
                    }}>Delete Flashcard</h3>
                    <button 
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '1.25rem',
                            color: '#6c757d',
                            cursor: 'pointer',
                            padding: '0.5rem'
                        }}
                        onClick={closeDeleteConfirmation}
                    >
                        <i className="fas fa-times"></i>
                    </button>
                </div>
                <div className="modal-body" style={{
                    padding: '1.5rem'
                }}>
                    <p style={{ marginBottom: '1.5rem' }}>Are you sure you want to delete this flashcard? This action cannot be undone.</p>
                    
                    <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: '1rem'
                    }}>
                        <button 
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '6px',
                                backgroundColor: '#f8f9fa',
                                border: '1px solid #ced4da',
                                color: '#212529',
                                cursor: 'pointer'
                            }}
                            onClick={closeDeleteConfirmation}
                            disabled={deletingFlashcard}
                        >
                            Cancel
                        </button>
                        <button 
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '6px',
                                backgroundColor: '#dc3545',
                                border: 'none',
                                color: 'white',
                                cursor: 'pointer',
                                opacity: deletingFlashcard ? 0.7 : 1
                            }}
                            onClick={handleDeleteFlashcard}
                            disabled={deletingFlashcard}
                        >
                            {deletingFlashcard ? (
                                <>
                                    <i className="fas fa-spinner fa-spin"></i> Deleting...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-trash"></i> Delete
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </Modal>
            
            {/* Edit Flashcard Modal */}
            <Modal show={showEditFlashcardModal} onClose={closeEditFlashcardModal}>
                <div className="modal-header" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1.5rem',
                    borderBottom: '1px solid #e0e0e0'
                }}>
                    <h3 style={{
                        margin: 0,
                        fontSize: '1.25rem',
                        fontWeight: '600'
                    }}>Edit Flashcard</h3>
                    <button 
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '1.25rem',
                            color: '#6c757d',
                            cursor: 'pointer',
                            padding: '0.5rem'
                        }}
                        onClick={closeEditFlashcardModal}
                    >
                        <i className="fas fa-times"></i>
                    </button>
                </div>
                <div className="modal-body" style={{
                    padding: '1.5rem'
                }}>
                    <div className="modal-instructions" style={{
                        backgroundColor: '#f8f9fa',
                        padding: '1rem',
                        borderRadius: '8px',
                        marginBottom: '1.5rem'
                    }}>
                        <p style={{
                            margin: 0,
                            fontSize: '0.95rem',
                            color: '#495057'
                        }}><i className="fas fa-info-circle"></i> Edit your flashcard. Term and Definition are required fields.</p>
                    </div>
                    <form onSubmit={handleUpdateFlashcard}>
                        <div className="form-group" style={{
                            marginBottom: '1.25rem'
                        }}>
                            <label htmlFor="edit-term" style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '0.5rem',
                                fontWeight: '500'
                            }}>
                                Term <span style={{ color: '#dc3545' }}>*</span>
                                <small style={{ color: '#6c757d', fontSize: '0.8rem' }}>
                                    {editFlashcard.term.length}/{MAX_TERM_LENGTH}
                                </small>
                            </label>
                            <input
                                type="text"
                                id="edit-term"
                                name="term"
                                value={editFlashcard.term}
                                onChange={handleEditFlashcardChange}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem',
                                    border: editFlashcardErrors.term ? '1px solid #dc3545' : '1px solid #ced4da',
                                    borderRadius: '6px',
                                    fontSize: '1rem'
                                }}
                                maxLength={MAX_TERM_LENGTH}
                                placeholder="Enter the word or phrase to learn"
                                autoFocus
                                required
                            />
                            {editFlashcardErrors.term && (
                                <div style={{ color: '#dc3545', fontSize: '0.875em', marginTop: '0.25rem' }}>
                                    {editFlashcardErrors.term}
                                </div>
                            )}
                        </div>
                        <div className="form-group" style={{
                            marginBottom: '1.25rem'
                        }}>
                            <label htmlFor="edit-definition" style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '0.5rem',
                                fontWeight: '500'
                            }}>
                                Definition <span style={{ color: '#dc3545' }}>*</span>
                                <small style={{ color: '#6c757d', fontSize: '0.8rem' }}>
                                    {editFlashcard.definition.length}/{MAX_DEFINITION_LENGTH}
                                </small>
                            </label>
                            <textarea
                                id="edit-definition"
                                name="definition"
                                value={editFlashcard.definition}
                                onChange={handleEditFlashcardChange}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem',
                                    border: editFlashcardErrors.definition ? '1px solid #dc3545' : '1px solid #ced4da',
                                    borderRadius: '6px',
                                    fontSize: '1rem',
                                    minHeight: '100px',
                                    resize: 'vertical'
                                }}
                                rows="3"
                                maxLength={MAX_DEFINITION_LENGTH}
                                placeholder="Enter the meaning or explanation"
                                required
                            ></textarea>
                            {editFlashcardErrors.definition && (
                                <div style={{ color: '#dc3545', fontSize: '0.875em', marginTop: '0.25rem' }}>
                                    {editFlashcardErrors.definition}
                                </div>
                            )}
                        </div>
                        <div className="form-group" style={{
                            marginBottom: '1.25rem'
                        }}>
                            <label htmlFor="edit-example" style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '0.5rem',
                                fontWeight: '500'
                            }}>
                                Example (optional)
                                <small style={{ color: '#6c757d', fontSize: '0.8rem' }}>
                                    {editFlashcard.example.length}/{MAX_EXAMPLE_LENGTH}
                                </small>
                            </label>
                            <textarea
                                id="edit-example"
                                name="example"
                                value={editFlashcard.example}
                                onChange={handleEditFlashcardChange}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem',
                                    border: editFlashcardErrors.example ? '1px solid #dc3545' : '1px solid #ced4da',
                                    borderRadius: '6px',
                                    fontSize: '1rem',
                                    minHeight: '100px',
                                    resize: 'vertical'
                                }}
                                rows="3"
                                maxLength={MAX_EXAMPLE_LENGTH}
                                placeholder="Add a sample sentence or usage example"
                            ></textarea>
                            {editFlashcardErrors.example && (
                                <div style={{ color: '#dc3545', fontSize: '0.875em', marginTop: '0.25rem' }}>
                                    {editFlashcardErrors.example}
                                </div>
                            )}
                        </div>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: '1rem',
                            marginTop: '2rem'
                        }}>
                            <button 
                                type="button" 
                                style={{
                                    padding: '0.5rem 1rem',
                                    borderRadius: '6px',
                                    backgroundColor: '#f8f9fa',
                                    border: '1px solid #ced4da',
                                    color: '#212529',
                                    cursor: 'pointer'
                                }}
                                onClick={closeEditFlashcardModal}
                                disabled={updatingFlashcard}
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                style={{
                                    padding: '0.5rem 1rem',
                                    borderRadius: '6px',
                                    backgroundColor: '#16a085',
                                    border: 'none',
                                    color: 'white',
                                    cursor: 'pointer',
                                    opacity: (updatingFlashcard || !!editFlashcardErrors.term || !!editFlashcardErrors.definition || !!editFlashcardErrors.example) ? 0.7 : 1
                                }}
                                disabled={updatingFlashcard || !!editFlashcardErrors.term || !!editFlashcardErrors.definition || !!editFlashcardErrors.example}
                            >
                                {updatingFlashcard ? (
                                    <>
                                        <i className="fas fa-spinner fa-spin"></i> Updating...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-save"></i> Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

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
                                <ToastContainer/>
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
                                        <i className={`fas fa-${flashcardSet.isPublic ? 'eye' : 'lock'}`}></i>
                                        <span>{flashcardSet.isPublic ? 'Public' : 'Private'}</span>
                                    </div>
                                    {/* Hiển thị thông tin user */}
                                    {flashcardSet.user && (
                                        <>
                                            <div className="meta-item">
                                                <i className="fas fa-user"></i>
                                                <span>User: {flashcardSet.user.userName}</span>
                                            </div>
                                            <div className="meta-item">
                                                <i className="fas fa-level-up-alt"></i>
                                                <span>Level: {flashcardSet.user.level}</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                                {flashcardSet.description && (
                                    <p className="set-description">{flashcardSet.description}</p>
                                )}
                                <div className='share'>
                                {
                                    flashcardSet.isPublic ? 
                                    <button className='btn' onClick={() => copyToClipboard(window.location.href)}>Share to your friend</button>:
                                    <></>
                                }
                                </div>
                            </div>
                            
                            <div className="flashcard-details-actions">
                                <button 
                                    className="btn btn-primary"
                                    onClick={() => navigate(`/learn-flashcards/${flashcardSetId}`)}
                                >
                                    <i className="fas fa-play"></i>
                                    Study Set
                                </button>
                                <button 
                                    className="btn btn-primary"
                                    id="addCardButton"
                                    onClick={() => setShowAddModal(true)}
                                    style={{ 
                                        position: 'relative', 
                                        overflow: 'hidden',
                                        backgroundColor: '#16a085',
                                        color: 'white',
                                        border: 'none',
                                        padding: '10px 20px',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        fontWeight: '500',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                    }}
                                >
                                    <i className="fas fa-plus"></i>
                                    Add Card
                                </button>
                                <button 
                                    className="btn btn-outline-secondary"
                                    onClick={() => openEditSetModal()}
                                >
                                    <i className="fas fa-edit"></i>
                                    Edit Set
                                </button>
                                <button 
                                    className="btn btn-outline-secondary"
                                    onClick={() => openVisibilityModal()}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}
                                >
                                    <i className={`fas fa-${flashcardSet?.isPublic ? 'lock' : 'eye'}`}></i>
                                    Make {flashcardSet?.isPublic ? 'Private' : 'Public'}
                                </button>
                                <button className="btn btn-outline-danger" onClick={() => {handleDeleteFlashCardSet(flashcardSet.flashcardSetId)}}>
                                    <i className="fas fa-trash"></i>
                                    Delete
                                </button>
                            </div>
                            
                            <div className="flashcards-list-header">
                                <h2>Flashcards ({filteredFlashcards.length})</h2>
                                <div className="list-controls">
                                    <input
                                        type="text"
                                        className="search-input"
                                        placeholder="Search cards..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <select
                                        className="sort-select"
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                    >
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
                                    
                                    {filteredFlashcards.map((card, index) => (
                                        <div className="table-row" key={index}>
                                            <div className="term-cell">{card.term}</div>
                                            <div className="definition-cell">{card.definition}</div>
                                            <div className="example-cell">{card.example}</div>
                                            <div className="actions-cell">
                                                <button 
                                                    style={{
                                                        background: 'none',
                                                        border: 'none',
                                                        padding: '0.5rem 0.75rem',
                                                        cursor: 'pointer',
                                                        color: '#16a085',
                                                        borderRadius: '4px',
                                                        transition: 'all 0.2s',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        minWidth: '36px',
                                                        minHeight: '36px'
                                                    }}
                                                    title="Edit"
                                                    onClick={() => handleOpenEditModal(card)}
                                                >
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                <button 
                                                    style={{
                                                        background: 'none',
                                                        border: 'none',
                                                        padding: '0.5rem 0.75rem',
                                                        cursor: 'pointer',
                                                        color: '#dc3545',
                                                        borderRadius: '4px',
                                                        transition: 'all 0.2s',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        minWidth: '36px',
                                                        minHeight: '36px'
                                                    }}
                                                    title="Delete"
                                                    onClick={() => handleConfirmDeleteFlashcard(card.flashcardId)}
                                                >
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
                                        id="addFirstCardButton"
                                        onClick={() => setShowAddModal(true)}
                                        style={{
                                            backgroundColor: '#16a085',
                                            color: 'white',
                                            border: 'none',
                                            padding: '10px 20px',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            fontSize: '16px',
                                            marginTop: '15px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                        }}
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
            
            {/* After the flashcards list section */}
            {flashcardSet && (
                <FlashcardReviews 
                    reviews={reviews} 
                    flashcardSetId={flashcardSetId}
                    onReviewAdded={handleReviewAdded}
                />
            )}
        </div>
    );
}

export default FlashcardSetDetailsPage; 