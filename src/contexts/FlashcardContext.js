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

  const { accessToken, refreshAccessToken, isAuthenticated, checkTokenExpiration, handleAuthError } = useAuth();
  
  // Get API URL from environment variables or use ngrok URL from Postman request
  const baseUrl = process.env.REACT_APP_API_URL || 'https://6d2c-115-76-51-131.ngrok-free.app';
  // Remove trailing /api if it exists to avoid duplicate /api in endpoints
  const API_URL = baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
  
  // Log the cleaned URL
  console.log('Using API base URL:', API_URL, '(original:', baseUrl, ')');
  
  // Log URL API
  useEffect(() => {
    console.log('FlashcardContext using API URL:', API_URL);
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
      
      // Check token validity before making request
      const isTokenValid = await checkTokenExpiration();
      if (!isTokenValid) {
        console.log('Token invalid or expired before API request');
        throw new Error('Authentication required');
      }
      
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
      
      // Handle auth errors
      if (response.status === 401 || response.status === 403) {
        console.log(`Auth error ${response.status} from ${url}`);
        // Try to refresh the token
        await handleAuthError(response.status);
        throw new Error('Authentication error');
      }
      
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
      setLoading(true);
      setError(null);
      
      // This endpoint should work with or without authentication
      const requestUrl = `${API_URL}/FlashCardSet/${flashcardSetId}`;
      console.log('Getting flashcard set details:', requestUrl);
      
      // Set up headers
      const headers = new Headers();
      headers.append('Accept', 'application/json');
      headers.append('ngrok-skip-browser-warning', 'true');
      
      // Add authorization if authenticated
      if (isAuthenticated && accessToken) {
        headers.append('Authorization', `Bearer ${accessToken}`);
      }
      
      const response = await fetch(requestUrl, {
        method: 'GET',
        headers,
        credentials: 'omit',
        mode: 'cors',
        cache: 'no-cache',
      });
      
      console.log('Response status:', response.status);
      
      // Check for errors
      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('This flashcard set is private. You do not have permission to view it.');
        } else if (response.status === 404) {
          throw new Error('Flashcard set not found.');
        } else {
          throw new Error(`Request failed with status: ${response.status}`);
        }
      }
      
      // Parse the JSON response
      const result = await response.json();
      console.log('Flashcard set details:', result);
      
      setCurrentSet(result);
      setLoading(false);
      return result;
    } catch (err) {
      console.error('Failed to fetch flashcard set:', err);
      setError(err.message || 'Failed to fetch flashcard set');
      setLoading(false);
      throw err;
    }
  }, [API_URL, accessToken, isAuthenticated]);

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
  const togglePublicStatus = useCallback(async (flashcardSetId, isCurrentlyPublic) => {
    try {
      const endpoint = isCurrentlyPublic 
        ? `${API_URL}/FlashCardSet/Toprivate/${flashcardSetId}`
        : `${API_URL}/FlashCardSet/Topublic/${flashcardSetId}`;
        
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
      setLoading(true);
      setError(null);
      
      // This endpoint doesn't require authentication, so make a direct fetch request
      const requestUrl = `${API_URL}/FlashCardSet/Explore?${queryParams.toString()}`;
      console.log('Exploring public flashcard sets:', requestUrl);
      
      // Set up headers (no auth token needed)
      const headers = new Headers();
      headers.append('Accept', 'application/json');
      headers.append('ngrok-skip-browser-warning', 'true');
      
      const response = await fetch(requestUrl, {
        method: 'GET',
        headers,
        credentials: 'omit',
        mode: 'cors',
        cache: 'no-cache',
      });
      
      console.log('Explore response status:', response.status);
      
      // Check for errors
      if (!response.ok) {
        if (response.status === 404) {
          // Not found is expected when no sets match filters
          setFlashcardSets([]);
          setTotalPages(1);
          setCurrentPage(1);
          setLoading(false);
          return { flashcardSets: [], totalCount: 0, page: 1, itemPerPage, totalPage: 1 };
        }
        
        throw new Error(`Request failed with status: ${response.status}`);
      }
      
      // Parse the JSON response
      const result = await response.json();
      console.log('Explore results:', result);
      
      // Update state
      setFlashcardSets(result.flashcardSets || []);
      setTotalPages(result.totalPage || 1);
      setCurrentPage(result.curentPage || 1);
      setLoading(false);
      
      return result;
    } catch (err) {
      console.error('Failed to explore flashcard sets:', err);
      setError('Failed to load public flashcard sets. Please try again later.');
      setLoading(false);
      
      // Return empty result instead of throwing to prevent app from crashing
      return { flashcardSets: [], totalPage: 1, curentPage: 1 };
    }
  }, [API_URL]);

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
    
    // Use API_URL variable for consistent URL structure
    const requestUrl = `${API_URL}/FlashCardSet/GetAll/${userId}?${queryParams.toString()}`;
    
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
  }, [accessToken, isAuthenticated, API_URL]);

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
  // API Endpoint: POST /api/Flashcard/Create
  // Requires authentication (Bearer token)
  // Request body requires: flashcardSetId, term, definition (example is optional)
  // Returns the created flashcard on success
  const createFlashcard = useCallback(async (flashcardData) => {
    try {
      // Use the correct endpoint structure
      const endpointUrl = `${API_URL}/FlashCard/Create`;
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
      console.error(`Request URL: ${API_URL}/FlashCard/Create`);
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
      setLoading(true);
      setError(null);
      
      // Build query parameters
      const queryParams = new URLSearchParams();
      queryParams.append('page', page);
      queryParams.append('itemsPerPage', itemsPerPage);
      
      // This endpoint should work with or without authentication
      const requestUrl = `${API_URL}/FlashCardSet/${flashcardSetId}?${queryParams.toString()}`;
      console.log('Fetching flashcards for set:', flashcardSetId, 'URL:', requestUrl);
      
      // Set up headers
      const headers = new Headers();
      headers.append('Accept', 'application/json');
      headers.append('ngrok-skip-browser-warning', 'true');
      
      // Add authorization if authenticated
      if (isAuthenticated && accessToken) {
        headers.append('Authorization', `Bearer ${accessToken}`);
      }
      
      const response = await fetch(requestUrl, {
        method: 'GET',
        headers,
        credentials: 'omit',
        mode: 'cors',
        cache: 'no-cache',
      });
      
      console.log('Response status:', response.status);
      
      // Check for errors
      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('This flashcard set is private. You do not have permission to view it.');
        } else if (response.status === 404) {
          // If no flashcards found, return empty array
          return { flashcards: [], totalCount: 0, page: 1, totalPages: 1 };
        } else {
          throw new Error(`Request failed with status: ${response.status}`);
        }
      }
      
      // Parse the JSON response
      const result = await response.json();
      console.log('Flashcards fetched successfully:', result);
      
      setLoading(false);
      return result;
    } catch (err) {
      console.error('Failed to fetch flashcards for set:', err);
      setError('Failed to load flashcards. Please try again later.');
      setLoading(false);
      
      // Return empty result to prevent app from crashing
      return { flashcards: [], totalCount: 0, page: 1, totalPages: 1 };
    }
  }, [API_URL, accessToken, isAuthenticated]);

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
      
      // Use constructed API URL
      const apiUrl = `${API_URL}/FlashCard/Create`;
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

  // Endpoint to get/check user's API key - kiểm tra từ localStorage trước
  const getUserApiKey = useCallback(async () => {
    try {
      // Đầu tiên kiểm tra localStorage
      const localApiKey = localStorage.getItem('gemini_api_key');
      const timestamp = localStorage.getItem('gemini_api_key_timestamp');
      
      if (localApiKey && timestamp) {
        // Kiểm tra xem API key có còn hiệu lực không (2 giờ)
        const now = Date.now();
        const saved = parseInt(timestamp, 10);
        const twoHoursMs = 2 * 60 * 60 * 1000;
        
        if (now - saved <= twoHoursMs) {
          console.log('Sử dụng API key từ localStorage');
          return localApiKey;
        } else {
          // API key đã hết hạn, xóa khỏi localStorage
          console.log('API key trong localStorage đã hết hạn');
          localStorage.removeItem('gemini_api_key');
          localStorage.removeItem('gemini_api_key_timestamp');
        }
      }
      
      // Nếu không có trong localStorage, quay lại giá trị true để cho phép tiếp tục sử dụng chức năng AI
      console.log('Không tìm thấy API key trong localStorage, giả định đã có API key trên server');
      return true;
    } catch (err) {
      console.error('Lỗi khi kiểm tra API key:', err);
      return null;
    }
  }, []);
  
  // Update user's API key
  const updateUserApiKey = useCallback(async (apiKey) => {
    try {
      if (!isAuthenticated || !accessToken) {
        throw new Error('User not authenticated, cannot update API key');
      }
      
      // Use the correct API URL format
      const storeKeyUrl = `${API_URL}/Auth/store-key`;
      
      console.log('Gửi API key đến server:', storeKeyUrl);
      
      // Sử dụng fetch trực tiếp thay vì apiRequest để đảm bảo gọi đúng API
      const response = await fetch(storeKeyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'ngrok-skip-browser-warning': 'true',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ apiKey })
      });
      
      console.log('Kết quả lưu API key:', response.status, response.statusText);
      return response.ok;
    } catch (err) {
      console.error('Lỗi khi cập nhật API key của người dùng:', err);
      throw err;
    }
  }, [API_URL, isAuthenticated, accessToken]);

  // Delete a flashcard by ID
  const deleteFlashcard = useCallback(async (flashcardId) => {
    try {
      setLoading(true);
      
      // Get token from various sources
      const currentToken = localStorage.getItem('accessToken');
      const tokenToUse = accessToken || currentToken;
      
      if (!tokenToUse) {
        throw new Error('Authentication required to delete flashcard');
      }
      
      // Construct the API URL
      const apiUrl = `${API_URL}/FlashCard/Delete/${flashcardId}`;
      console.log(`Deleting flashcard with ID ${flashcardId} from: ${apiUrl}`);
      
      // Send DELETE request
      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'ngrok-skip-browser-warning': 'true',
          'Authorization': `Bearer ${tokenToUse}`
        }
      });
      
      console.log(`Delete flashcard response status: ${response.status}`);
      
      // Check if response is successful
      if (!response.ok) {
        let errorMessage = `Error deleting flashcard: ${response.status} ${response.statusText}`;
        
        // Try to get detailed error from response
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.title || errorMessage;
          console.error('Error response:', errorData);
        } catch (parseError) {
          console.error('Could not parse error response:', parseError);
        }
        
        throw new Error(errorMessage);
      }
      
      // Parse successful response
      let deletedFlashcard = null;
      try {
        deletedFlashcard = await response.json();
        console.log('Successfully deleted flashcard:', deletedFlashcard);
      } catch (parseError) {
        // Some APIs return 200 with no content for delete operations
        console.log('No content returned after successful delete');
      }
      
      // If the flashcard is in the current set, remove it
      if (currentSet) {
        const updatedFlashcards = currentSet.flashcards?.filter(
          card => card.flashcardId !== flashcardId
        ) || [];
        
        setCurrentSet({
          ...currentSet,
          flashcards: updatedFlashcards
        });
      }
      
      return { success: true, deletedFlashcard };
    } catch (error) {
      console.error('Failed to delete flashcard:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [API_URL, accessToken, currentSet]);

  // Update a flashcard
  const updateFlashcard = useCallback(async (flashcardId, flashcardData) => {
    setLoading(true);
    
    try {
      // Get access token from localStorage or context
      const accessToken = localStorage.getItem('accessToken') || "";
      
      if (!accessToken) {
        throw new Error('Authentication required. Please log in.');
      }
      
      // Construct API URL
      const apiUrl = `${API_URL}/FlashCard/Update/${flashcardId}`;
      console.log(`Updating flashcard at: ${apiUrl}`);
      
      // Send request to update the flashcard
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'ngrok-skip-browser-warning': 'true',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(flashcardData)
      });
      
      console.log(`Update flashcard response status: ${response.status}`);
      
      // Check for successful response
      if (!response.ok) {
        let errorMessage = `Failed to update flashcard: ${response.status} ${response.statusText}`;
        
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          try {
            // Try to parse error response as JSON
            const errorData = await response.json();
            if (errorData.message) {
              errorMessage = errorData.message;
            }
          } catch (parseError) {
            console.error('Error parsing error response:', parseError);
          }
        } else {
          try {
            // If not JSON, try to get error as text
            const errorText = await response.text();
            if (errorText) {
              errorMessage = errorText;
            }
          } catch (textError) {
            console.error('Error reading error response text:', textError);
          }
        }
        
        throw new Error(errorMessage);
      }
      
      // Parse response data
      const updatedFlashcard = await response.json();
      console.log('Flashcard updated successfully:', updatedFlashcard);
      
      // If the flashcard is in the current set, update it
      if (currentSet) {
        setCurrentSet(prevSet => {
          if (!prevSet || !prevSet.flashcards) return prevSet;
          
          // Create a new array with the updated flashcard
          const updatedFlashcards = prevSet.flashcards.map(card => 
            card.flashcardId === flashcardId ? {...card, ...flashcardData} : card
          );
          
          return {...prevSet, flashcards: updatedFlashcards};
        });
      }
      
      return {
        success: true,
        flashcard: updatedFlashcard
      };
      
    } catch (err) {
      console.error('Error updating flashcard:', err);
      setError(err.message || 'Failed to update flashcard');
      
      return {
        success: false,
        error: err.message || 'Unknown error occurred'
      };
    } finally {
      setLoading(false);
    }
  }, [API_URL, currentSet]);

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
    clearCurrentSet,
    getUserApiKey,
    updateUserApiKey,
    deleteFlashcard,
    updateFlashcard
  };

  return (
    <FlashcardContext.Provider value={value}>
      {children}
    </FlashcardContext.Provider>
  );
}; 