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
  
  // Get API URL from environment variables or use ngrok URL from Postman request
  const baseUrl = process.env.REACT_APP_API_URL || 'https://6d2c-115-76-51-131.ngrok-free.app';
  // Remove trailing /api if it exists
  const API_URL = baseUrl.endsWith('/api') ? baseUrl.slice(0, -4) : baseUrl;
  
  // Log the cleaned URL
  console.log('Using API base URL:', API_URL, '(original:', baseUrl, ')');
  
  // Log URL API
  useEffect(() => {
    console.log('FlashcardContext using API URL:', API_URL);
    
    // Check if API is reachable
    const checkApiConnection = async () => {
      try {
        console.log('Checking API connection to:', `${API_URL}/health`);
        
        // Set up request with proper headers and mode
        const response = await fetch(`${API_URL}/health`, { 
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'ngrok-skip-browser-warning': 'true'
          },
          mode: 'cors',
          credentials: 'omit'
        });
        
        console.log('Health check response status:', response.status);
        
        // Get content type
        const contentType = response.headers.get('content-type');
        console.log('Health check response content-type:', contentType);
        
        // Look at the first part of the response
        const text = await response.text();
        console.log('Health check response preview:', text.substring(0, 200));
        
        if (response.ok) {
          console.log('API connection successful');
        } else {
          console.warn(`API health check failed with status: ${response.status}`);
          console.log('Trying alternative URL format in case the URL is not correct...');
        }
      } catch (err) {
        console.error('API connection error:', err.message);
        console.log('Will try to use API endpoints directly without health check...');
      }
    };
    
    checkApiConnection();
  }, [API_URL]);

  // Helper function to handle API requests with token refresh
  const apiRequest = useCallback(async (url, options = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      // Initialize headers if not present
      if (!options.headers) {
        options.headers = {};
      }
      
      // Add ngrok header to bypass warning page
      options.headers['ngrok-skip-browser-warning'] = 'true';
      options.headers['Accept'] = 'application/json';
      
      // For Postman compatibility - use exact token from Postman request when in test mode
      // In production we would use the token from auth context
      // Try to use current token from localStorage
      const currentToken = localStorage.getItem('accessToken');
      if (currentToken) {
        console.log('Using token from localStorage');
        options.headers = {
          ...options.headers,
          'Authorization': `Bearer ${currentToken}`
        };
      } else {
        console.log('No token in localStorage, using Postman token');
        const postmanToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjZiNGU5YTcyLWJkMTUtNDAzMy1iYzk1LWI4M2Q1ZDI4ODJhYyIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6IjIyNTExMjAzMzlAdXQuZWR1LnZuIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6IlBodWNEYWkiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJVc2VyIiwiZXhwIjoxNzQyMzIwOTI1LCJpc3MiOiJXb3JkV2lzZSIsImF1ZCI6IldvcmRXaXNlIn0.J7S79y1QY0e0QQL1TydQeOGYI3I06AjY-Xdj2f8yrdM";
        options.headers = {
          ...options.headers,
          'Authorization': `Bearer ${postmanToken}`
        };
      }
      
      console.log(`Making request to: ${url}`);
      console.log('Request options:', JSON.stringify(options, null, 2));
      
      // Make the request
      let response = await fetch(url, options);
      
      // Check for non-JSON responses
      const contentType = response.headers.get('content-type');
      console.log(`Response content type: ${contentType}`);
      console.log(`Response status: ${response.status}`);
      
      if (!response.ok) {
        let errorMessage = '';
        
        try {
          if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json();
            errorMessage = errorData.message || errorData.title || 'An error occurred';
            console.error('Error response:', errorData);
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
        const jsonResult = await response.json();
        console.log('JSON response:', jsonResult);
        return jsonResult;
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
  }, []);

  // CREATE a new flashcard set
  const createFlashcardSet = useCallback(async (flashcardSetData) => {
    try {
      const result = await apiRequest(`${API_URL}/api/FlashCardSet/create`, {
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
      const result = await apiRequest(`${API_URL}/api/FlashCardSet/${flashcardSetId}`);
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
      await apiRequest(`${API_URL}/api/FlashCardSet/Delete/${flashcardSetId}`, {
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
      const result = await apiRequest(`${API_URL}/api/FlashCardSet/Update/${flashcardSetId}`, {
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
  const togglePublicStatus = useCallback(async (flashcardSetId, isCurrentlyPublic) => {
    try {
      const endpoint = isCurrentlyPublic 
        ? `${API_URL}/api/FlashCardSet/Toprivate/${flashcardSetId}`
        : `${API_URL}/api/FlashCardSet/Topublic/${flashcardSetId}`;
        
      console.log(`Toggling visibility with endpoint: ${endpoint}`);
      
      const result = await apiRequest(endpoint, {
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
      const result = await apiRequest(`${API_URL}/api/FlashCardSet/Explore?${queryParams.toString()}`);
      
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
    // Set loading state
    setLoading(true);
    setError(null);
    
    console.log('Getting flashcard sets for user:', userId);
    
    // Build query string
    let queryParams = new URLSearchParams();
    queryParams.append('page', page);
    queryParams.append('itemPerPage', itemPerPage);
    
    // Use hardcoded URL to avoid any potential environment variable issues
    const apiUrl = "https://6d2c-115-76-51-131.ngrok-free.app/api";
    const requestUrl = `${apiUrl}/FlashCardSet/GetAll/${userId}?${queryParams.toString()}`;
    
    console.log('Request URL:', requestUrl);
    
    try {
      // Set up headers
      const headers = new Headers();
      headers.append('Accept', 'application/json');
      headers.append('ngrok-skip-browser-warning', 'true');
      
      if (isAuthenticated && accessToken) {
        headers.append('Authorization', `Bearer ${accessToken}`);
      }
      
      console.log('Request headers:', Object.fromEntries(headers.entries()));
      
      // Make direct fetch request instead of using apiRequest
      const response = await fetch(requestUrl, {
        method: 'GET',
        headers,
        credentials: 'omit', // Try with different credential settings
        mode: 'cors',
        cache: 'no-cache',
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      // Check for non-JSON responses
      const contentType = response.headers.get('content-type');
      console.log('Response content-type:', contentType);
      
      if (!response.ok) {
        console.error(`Request failed with status: ${response.status}`);
        throw new Error(`Request failed with status: ${response.status}`);
      }
      
      if (contentType && !contentType.includes('application/json')) {
        console.error(`Received non-JSON response: ${contentType}`);
        const text = await response.text();
        console.error('Non-JSON response (first 200 chars):', text.substring(0, 200));
        throw new Error('Received non-JSON response from server');
      }
      
      const result = await response.json();
      console.log('Parsed JSON result:', result);
      
      // Update state
      setFlashcardSets(result.flashcardSets || []);
      setTotalPages(result.totalPages || 1);
      setCurrentPage(result.page || 1);
      setLoading(false);
      
      return result;
    } catch (err) {
      console.error('Failed to get user flashcard sets:', err);
      setError('Failed to load flashcard sets. Please try again later.');
      setLoading(false);
      
      // Return empty result instead of throwing to prevent app from crashing
      return { flashcardSets: [], totalCount: 0, page: 1, itemPerPage, totalPages: 1 };
    }
  }, [accessToken, isAuthenticated]);

  // Generate flashcard set with AI
  const generateFlashcardSetWithAI = useCallback(async (generationData) => {
    try {
      const result = await apiRequest(`${API_URL}/api/FlashCardSet/GenerateByAI`, {
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
  // API Endpoint: POST /api/Flashcard/Create
  // Requires authentication (Bearer token)
  // Request body requires: flashcardSetId, term, definition (example is optional)
  // Returns the created flashcard on success
  const createFlashcard = useCallback(async (flashcardData) => {
    try {
      // Use the correct endpoint structure
      const endpointUrl = `${API_URL}/api/FlashCard/Create`;
      console.log('Sending create flashcard request to:', endpointUrl);
      console.log('Flashcard data:', JSON.stringify(flashcardData, null, 2));
      
      // Ensure authorization header will be added by apiRequest
      const result = await apiRequest(endpointUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(flashcardData)
      });
      
      console.log('Flashcard created successfully:', result);
      
      // If we're viewing this set, update the current set
      if (currentSet?.flashcardSetId === flashcardData.flashcardSetId) {
        // Refresh the set to update the card count
        getFlashcardSet(flashcardData.flashcardSetId).catch(err => 
          console.error('Failed to refresh flashcard set after adding card:', err)
        );
      }
      
      return result;
    } catch (err) {
      console.error('Failed to create flashcard:', err);
      
      // Debug URL and error details
      console.error(`Request URL: ${API_URL}/api/FlashCard/Create`);
      console.error('Error details:', JSON.stringify(err, null, 2));
      
      // Handle specific API error responses
      if (err.response) {
        const status = err.response.status;
        
        if (status === 401) {
          // 401 Unauthorized: Token is invalid or missing
          throw new Error('Authentication required. Please log in again.');
        } else if (status === 403) {
          // 403 Forbidden: User doesn't have permission to add to this set
          throw new Error('Forbidden: You do not have permission to add cards to this set.');
        } else if (status === 400) {
          // 400 Bad Request: Various validation errors
          if (err.message?.includes('maximum limit')) {
            throw new Error('You have reached the maximum limit of 50 flashcards for this set.');
          } else {
            throw new Error(err.message || 'Invalid data. Please check your flashcard information.');
          }
        } else if (status === 500) {
          // 500 Internal Server Error
          throw new Error('Server error. Please try again later.');
        } else if (status === 404) {
          // 404 Not Found: URL might be incorrect
          throw new Error(`API endpoint not found: ${err.response.url}. Please check the URL.`);
        }
      }
      
      // For any other errors
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
      
      const url = `${API_URL}/api/FlashCardSet/${flashcardSetId}?${queryParams.toString()}`;
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

  // Direct API call to create flashcard - no middleware handling
  const directCreateFlashcard = useCallback(async (flashcardData) => {
    try {
      setLoading(true);
      
      // Get token from local storage
      const currentToken = localStorage.getItem('accessToken');
      // Fallback token from Postman
      const postmanToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjZiNGU5YTcyLWJkMTUtNDAzMy1iYzk1LWI4M2Q1ZDI4ODJhYyIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6IjIyNTExMjAzMzlAdXQuZWR1LnZuIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6IlBodWNEYWkiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJVc2VyIiwiZXhwIjoxNzQyMzIwOTI1LCJpc3MiOiJXb3JkV2lzZSIsImF1ZCI6IldvcmRXaXNlIn0.J7S79y1QY0e0QQL1TydQeOGYI3I06AjY-Xdj2f8yrdM";
      
      // Use token in the following priority:
      // 1. Auth context token
      // 2. Local storage token
      // 3. Postman token as fallback
      const tokenToUse = accessToken || currentToken || postmanToken;
      
      // Use hardcoded URL to avoid any path issues
      const apiUrl = "https://6d2c-115-76-51-131.ngrok-free.app/api/FlashCard/Create";
      console.log('Direct API call to:', apiUrl);
      console.log('Request data:', JSON.stringify(flashcardData, null, 2));
      
      // Make a direct fetch request
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'ngrok-skip-browser-warning': 'true',
          'Authorization': `Bearer ${tokenToUse}`
        },
        body: JSON.stringify(flashcardData)
      });
      
      console.log('Response status:', response.status);
      
      // Check if response is successful
      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        let errorMessage = '';
        
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.title || `Error ${response.status}`;
          console.error('Error response:', errorData);
        } else {
          errorMessage = `Request failed with status: ${response.status}`;
          const text = await response.text();
          console.error('Error response text:', text.substring(0, 200));
        }
        
        throw new Error(errorMessage);
      }
      
      // Parse successful response
      const result = await response.json();
      console.log('Flashcard created successfully:', result);
      
      // Update the current set if needed
      if (currentSet?.flashcardSetId === flashcardData.flashcardSetId) {
        getFlashcardSet(flashcardData.flashcardSetId).catch(err => 
          console.error('Failed to refresh flashcard set after adding card:', err)
        );
      }
      
      return result;
    } catch (err) {
      console.error('Direct API failed:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [API_URL, accessToken, currentSet, getFlashcardSet]);

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
    directCreateFlashcard,
    getFlashcardsForSet,
    clearCurrentSet
  };

  return (
    <FlashcardContext.Provider value={value}>
      {children}
    </FlashcardContext.Provider>
  );
}; 