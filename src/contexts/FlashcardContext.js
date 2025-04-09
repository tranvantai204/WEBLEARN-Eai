import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

// Create Context
const FlashcardContext = createContext();

// Custom Hook for using Flashcard Context
export const useFlashcard = () => useContext(FlashcardContext);

// Flashcard Provider Component
export const FlashcardProvider = ({ children }) => {
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentSet, setCurrentSet] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const { accessToken, refreshAccessToken, isAuthenticated } = useAuth();
  
  // Get API URL from environment variables
  const API_URL = process.env.REACT_APP_API_URL || 'https://1abd-42-118-114-121.ngrok-free.app/api';
  
  // Log URL API
  useEffect(() => {
    console.log('FlashcardContext using API URL:', API_URL);
    
    // Check if API is reachable
    const checkApiConnection = async () => {
      try {
        const response = await fetch(`${API_URL}/health`, { method: 'GET' });
        if (response.ok) {
          console.log('API connection successful');
        } else {
          console.warn(`API health check failed with status: ${response.status}`);
        }
      } catch (err) {
        console.error('API connection error:', err.message);
        setError(`API connection error: ${err.message}. If using ngrok, the URL may have expired. Update the URL in your .env file or context provider.`);
      }
    };
    
    checkApiConnection();
  }, [API_URL]);

  // Helper function to handle API requests with token refresh
  const apiRequest = useCallback(async (url, options = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      // Add authorization header if user is authenticated
      if (isAuthenticated && accessToken) {
        options.headers = {
          ...options.headers,
          'Authorization': `Bearer ${accessToken}`
        };
      }
      
      console.log(`Making request to: ${url}`);
      
      // Make the request
      let response = await fetch(url, options);
      
      // Check for non-JSON responses
      const contentType = response.headers.get('content-type');
      if (contentType && !contentType.includes('application/json')) {
        console.error(`Received non-JSON response: ${contentType}`);
        const rawText = await response.text();
        console.error(`Response content (first 200 chars): ${rawText.substring(0, 200)}`);
        throw new Error(`Server returned non-JSON response (${contentType}). The server might be down or the API URL may have changed.`);
      }
      
      // If unauthorized, try to refresh token and retry
      if (response.status === 401 && isAuthenticated) {
        console.log('Token expired, attempting to refresh...');
        const newToken = await refreshAccessToken();
        
        if (newToken) {
          // Update headers with new token
          options.headers = {
            ...options.headers,
            'Authorization': `Bearer ${newToken}`
          };
          
          // Retry the request
          response = await fetch(url, options);
        }
      }
      
      // Handle common error responses
      if (!response.ok) {
        let errorMessage = '';
        
        try {
          if (response.headers.get('content-type')?.includes('application/json')) {
            const errorData = await response.json();
            errorMessage = errorData.message || errorData.title || 'An error occurred';
          } else {
            // For non-JSON errors
            errorMessage = `Request failed with status: ${response.status}`;
            const text = await response.text();
            console.error('Non-JSON error response:', text.substring(0, 200));
          }
        } catch (parseError) {
          console.error('Error parsing error response:', parseError);
          errorMessage = `Request failed with status: ${response.status}`;
        }
        
        // Create custom error with response details
        const error = new Error(errorMessage);
        error.response = {
          status: response.status,
          statusText: response.statusText,
          url: response.url
        };
        
        throw error;
      }
      
      // For successful response, handle no-content and parse JSON
      if (response.status === 204) {
        return null;
      }
      
      try {
        return await response.json();
      } catch (jsonError) {
        console.error('Error parsing JSON from response:', jsonError);
        const rawText = await response.text();
        console.error(`Response content (first 200 chars): ${rawText.substring(0, 200)}`);
        throw new Error('Failed to parse JSON response from server');
      }
    } catch (err) {
      console.error('API Request Error:', err);
      setError(err.message || 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [API_URL, accessToken, isAuthenticated, refreshAccessToken]);

  // CREATE a new flashcard set
  const createFlashcardSet = useCallback(async (flashcardSetData) => {
    try {
      const result = await apiRequest(`${API_URL}/FlashCardSet/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(flashcardSetData)
      });
      
      // Update state with new flashcard set
      setFlashcardSets(prev => [result, ...prev]);
      return result;
    } catch (err) {
      console.error('Failed to create flashcard set:', err);
      throw err;
    }
  }, [API_URL, apiRequest]);

  // GET a specific flashcard set by ID
  const getFlashcardSet = useCallback(async (flashcardSetId) => {
    try {
      const result = await apiRequest(`${API_URL}/FlashCardSet/${flashcardSetId}`);
      setCurrentSet(result);
      return result;
    } catch (err) {
      console.error('Failed to fetch flashcard set:', err);
      throw err;
    }
  }, [API_URL, apiRequest]);

  // DELETE a flashcard set
  const deleteFlashcardSet = useCallback(async (flashcardSetId) => {
    try {
      await apiRequest(`${API_URL}/FlashCardSet/Delete/${flashcardSetId}`, {
        method: 'DELETE'
      });
      
      // Remove from state
      setFlashcardSets(prev => prev.filter(set => set.flashcardSetId !== flashcardSetId));
      if (currentSet?.flashcardSetId === flashcardSetId) {
        setCurrentSet(null);
      }
      return true;
    } catch (err) {
      console.error('Failed to delete flashcard set:', err);
      throw err;
    }
  }, [API_URL, apiRequest, currentSet]);

  // UPDATE a flashcard set
  const updateFlashcardSet = useCallback(async (flashcardSetId, updateData) => {
    try {
      const result = await apiRequest(`${API_URL}/FlashCardSet/Update/${flashcardSetId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });
      
      // Update state
      setFlashcardSets(prev => 
        prev.map(set => set.flashcardSetId === flashcardSetId ? result : set)
      );
      
      if (currentSet?.flashcardSetId === flashcardSetId) {
        setCurrentSet(result);
      }
      
      return result;
    } catch (err) {
      console.error('Failed to update flashcard set:', err);
      throw err;
    }
  }, [API_URL, apiRequest, currentSet]);

  // Toggle public/private status
  const togglePublicStatus = useCallback(async (flashcardSetId) => {
    try {
      const result = await apiRequest(`${API_URL}/FlashCardSet/Topublic/${flashcardSetId}`, {
        method: 'PUT'
      });
      
      // Refresh the flashcard set data
      await getFlashcardSet(flashcardSetId);
      return result;
    } catch (err) {
      console.error('Failed to toggle public status:', err);
      throw err;
    }
  }, [API_URL, apiRequest, getFlashcardSet]);

  // EXPLORE public flashcard sets (with optional filters)
  const exploreFlashcardSets = useCallback(async (filters = {}) => {
    const { learningLanguage, nativeLanguage, page = 1, itemPerPage = 20 } = filters;
    
    // Build query string
    let queryParams = new URLSearchParams();
    if (learningLanguage) queryParams.append('learningLanguage', learningLanguage);
    if (nativeLanguage) queryParams.append('nativeLanguage', nativeLanguage);
    queryParams.append('page', page);
    queryParams.append('itemPerPage', itemPerPage);
    
    try {
      const result = await apiRequest(`${API_URL}/FlashCardSet/Explore?${queryParams.toString()}`);
      
      // Update state
      setFlashcardSets(result.flashcardSets || []);
      setTotalPages(result.totalPages || 1);
      setCurrentPage(result.page || 1);
      
      return result;
    } catch (err) {
      console.error('Failed to explore flashcard sets:', err);
      // If 404 with "No data found", return empty result instead of throwing
      if (err.message === 'No data found.') {
        setFlashcardSets([]);
        setTotalPages(1);
        setCurrentPage(1);
        return { flashcardSets: [], totalCount: 0, page: 1, itemPerPage, totalPages: 1 };
      }
      throw err;
    }
  }, [API_URL, apiRequest]);

  // Get all flashcard sets for a user
  const getUserFlashcardSets = useCallback(async (userId, page = 1, itemPerPage = 5) => {
    // Build query string
    let queryParams = new URLSearchParams();
    queryParams.append('page', page);
    queryParams.append('itemPerPage', itemPerPage);
    
    try {
      const result = await apiRequest(`${API_URL}/FlashCardSet/GetAll/${userId}?${queryParams.toString()}`);
      
      // Update state
      setFlashcardSets(result.flashcardSets || []);
      setTotalPages(result.totalPages || 1);
      setCurrentPage(result.page || 1);
      
      return result;
    } catch (err) {
      console.error('Failed to get user flashcard sets:', err);
      // If 404 with "No data found", return empty result instead of throwing
      if (err.message === 'No data found.') {
        setFlashcardSets([]);
        setTotalPages(1);
        setCurrentPage(1);
        return { flashcardSets: [], totalCount: 0, page: 1, itemPerPage, totalPages: 1 };
      }
      throw err;
    }
  }, [API_URL, apiRequest]);

  // Generate flashcard set with AI
  const generateFlashcardSetWithAI = useCallback(async (generationData) => {
    try {
      const result = await apiRequest(`${API_URL}/FlashCardSet/GenerateByAI`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(generationData)
      });
      
      // Update state with the new AI-generated set
      setFlashcardSets(prev => [result, ...prev]);
      return result;
    } catch (err) {
      console.error('Failed to generate flashcard set with AI:', err);
      throw err;
    }
  }, [API_URL, apiRequest]);

  // CREATE a new flashcard in a set
  const createFlashcard = useCallback(async (flashcardData) => {
    try {
      console.log('Sending create flashcard request to:', `${API_URL}/Flashcard/Create`);
      
      const result = await apiRequest(`${API_URL}/Flashcard/Create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(flashcardData)
      });
      
      console.log('Flashcard created successfully:', result);
      
      // If we're viewing this set, update the current set
      if (currentSet?.flashcardSetId === flashcardData.flashcardSetId) {
        // In a real app, we might want to refresh the entire set data to get the updated list
        // For now, just fetch the set again to update the card count
        getFlashcardSet(flashcardData.flashcardSetId).catch(err => 
          console.error('Failed to refresh flashcard set after adding card:', err)
        );
      }
      
      return result;
    } catch (err) {
      console.error('Failed to create flashcard:', err);
      
      // Handle specific API error responses
      if (err.response) {
        const status = err.response.status;
        
        if (status === 401) {
          throw new Error('Authentication required. Please log in again.');
        } else if (status === 403) {
          throw new Error('Forbidden: You do not have permission to add cards to this set.');
        } else if (status === 400 && err.message.includes('maximum limit')) {
          throw new Error('You have reached the maximum limit of 50 flashcard.');
        }
      }
      
      throw err;
    }
  }, [API_URL, apiRequest, currentSet, getFlashcardSet]);

  // GET all flashcards for a specific set
  const getFlashcardsForSet = useCallback(async (flashcardSetId, page = 1, itemsPerPage = 50) => {
    try {
      // Build query parameters
      const queryParams = new URLSearchParams();
      queryParams.append('page', page);
      queryParams.append('itemsPerPage', itemsPerPage);
      
      const url = `${API_URL}/Flashcard/GetBySetId/${flashcardSetId}?${queryParams.toString()}`;
      console.log('Fetching flashcards for set:', flashcardSetId, 'URL:', url);
      
      const result = await apiRequest(url);
      
      console.log('Flashcards fetched successfully:', result);
      return result;
    } catch (err) {
      console.error('Failed to fetch flashcards for set:', err);
      
      // Check for specific error signatures indicating HTML response
      if (err.message && (
          err.message.includes('non-JSON response') || 
          err.message.includes('Failed to parse JSON') ||
          err.message.includes('<!DOCTYPE')
      )) {
        console.error('Server returned HTML instead of JSON. The API URL may be invalid or the server is down.');
        toast.error('API connection error. Please check your internet connection or contact support.');
      }
      
      // Handle specific error cases
      if (err.response && err.response.status === 404) {
        // If no flashcards found, return empty array instead of throwing
        return { flashcards: [], totalCount: 0, page: 1, totalPages: 1 };
      }
      
      // Return empty result for any error to prevent app crashing
      return { flashcards: [], totalCount: 0, page: 1, totalPages: 1 };
    }
  }, [API_URL, apiRequest]);

  // Clear current set
  const clearCurrentSet = useCallback(() => {
    setCurrentSet(null);
  }, []);

  // Value provided by the context
  const value = {
    flashcardSets,
    currentSet,
    loading,
    error,
    totalPages,
    currentPage,
    createFlashcardSet,
    getFlashcardSet,
    deleteFlashcardSet,
    updateFlashcardSet,
    togglePublicStatus,
    exploreFlashcardSets,
    getUserFlashcardSets,
    generateFlashcardSetWithAI,
    createFlashcard,
    getFlashcardsForSet,
    clearCurrentSet
  };

  return (
    <FlashcardContext.Provider value={value}>
      {children}
    </FlashcardContext.Provider>
  );
}; 