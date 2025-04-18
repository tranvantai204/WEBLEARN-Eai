import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

// Create Context
const MultipleChoiceTestContext = createContext();

// Custom Hook for using MultipleChoiceTest Context
export const useMultipleChoiceTest = () => useContext(MultipleChoiceTestContext);

// MultipleChoiceTest Provider Component
export const MultipleChoiceTestProvider = ({ children }) => {
  const [multipleChoiceTests, setMultipleChoiceTests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentTest, setCurrentTest] = useState(null);

  const { accessToken, refreshAccessToken, isAuthenticated, checkTokenExpiration, handleAuthError } = useAuth();
  
  // Log when the provider mounts
  useEffect(() => {
    console.log("MultipleChoiceTestProvider mounted");
    return () => console.log("MultipleChoiceTestProvider unmounted");
  }, []);
  
  // Get API URL from environment variables or use ngrok URL from Postman request
  const baseUrl = process.env.REACT_APP_API_URL || 'https://6d2c-115-76-51-131.ngrok-free.app';
  // Remove trailing /api if it exists to avoid duplicate /api in endpoints
  const API_URL = baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
  
  // Log URL API
  useEffect(() => {
    console.log('MultipleChoiceTestContext using API URL:', API_URL);
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
        console.log('No token in localStorage');
        throw new Error('Authentication required');
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
  }, [checkTokenExpiration, handleAuthError]);

  // Get all multiple choice tests for a user
  const getAllMultipleChoiceTests = useCallback(async (userId = null, page = 1, itemPerPage = 5) => {
    try {
      console.log("getAllMultipleChoiceTests called with:", { userId, page, itemPerPage });
      // If userId is not provided, try to get it from localStorage
      let userIdToUse = userId;
      if (!userIdToUse) {
        try {
          // First try to get directly from userId key
          const directUserId = localStorage.getItem('userId');
          if (directUserId) {
            userIdToUse = directUserId;
            console.log('Using userId directly from localStorage:', userIdToUse);
          }
          // If not found, try from userData object
          else {
            const userDataString = localStorage.getItem('userData');
            if (userDataString) {
              const userData = JSON.parse(userDataString);
              userIdToUse = userData.userId;
              console.log('Using userId from userData in localStorage:', userIdToUse);
            }
          }
        } catch (parseError) {
          console.error('Error accessing/parsing userData from localStorage:', parseError);
        }
      }
      
      if (!userIdToUse) {
        console.log('No userId available, returning empty array');
        setMultipleChoiceTests([]);
        return { multipleChoiceTestSummaries: [], totalPage: 1, curentPage: 1, itemPerPage }; 
      }
      
      // Build query parameters
      const queryParams = new URLSearchParams();
      queryParams.append('page', page);
      queryParams.append('itemPerPage', itemPerPage);
      
      const requestUrl = `${API_URL}/MultipleChoiceTest/GetAll/${userIdToUse}?${queryParams.toString()}`;
      console.log(`Fetching multiple choice tests for user ${userIdToUse}: ${requestUrl}`);
      
      const result = await apiRequest(requestUrl);
      console.log('API returned result:', result); // Log full response for debugging
      
      // Update state with multiple choice tests data
      if (result) {
        // Use the proper API response structure according to documentation
        setMultipleChoiceTests(result.multipleChoiceTestSummaries || []);
        setCurrentPage(result.curentPage || 1); // Note: API has a typo in "curentPage"
        setTotalPages(result.totalPage || 1);
        setItemsPerPage(result.itemPerPage || 5);
        
        console.log('Multiple choice tests loaded:', {
          count: result.multipleChoiceTestSummaries?.length || 0,
          currentPage: result.curentPage,
          totalPages: result.totalPage,
          itemsPerPage: result.itemPerPage
        });
      }
      
      return result;
    } catch (err) {
      if (err.response?.status === 404 && err.message === 'No data found.') {
        // Handle case where user has no multiple choice tests
        console.log('No multiple choice tests found for user');
        setMultipleChoiceTests([]);
        setTotalPages(1);
        setCurrentPage(1);
        return { multipleChoiceTestSummaries: [], totalPage: 1, curentPage: 1, itemPerPage };
      }
      
      console.error('Failed to fetch multiple choice tests:', err);
      toast.error(`Error loading multiple choice tests: ${err.message}`);
      throw err;
    }
  }, [API_URL, apiRequest]);

  // Get a specific multiple choice test by ID
  const getMultipleChoiceTestById = useCallback(async (testId) => {
    try {
      console.log(`Attempting to get multiple choice test with ID: ${testId}`);
      
      const result = await apiRequest(`${API_URL}/MultipleChoiceTest/${testId}`);
      console.log('Multiple choice test detail retrieved:', result);
      
      // Set as current test
      setCurrentTest(result);
      
      return result;
    } catch (err) {
      console.error(`Failed to fetch multiple choice test ${testId}:`, err);
      toast.error(`Error loading multiple choice test: ${err.message}`);
      throw err;
    }
  }, [API_URL, apiRequest]);

  // Create a new multiple choice test
  const createMultipleChoiceTest = useCallback(async (testData) => {
    try {
      console.log('Creating new multiple choice test with data:', testData);
      
      const result = await apiRequest(`${API_URL}/MultipleChoiceTest/Create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testData)
      });
      
      console.log('Multiple choice test created successfully:', result);
      
      // Update the list if we have tests loaded already
      if (multipleChoiceTests.length > 0) {
        setMultipleChoiceTests(prev => [result, ...prev]);
      }
      
      return result;
    } catch (err) {
      console.error('Failed to create multiple choice test:', err);
      toast.error(`Error creating test: ${err.message}`);
      throw err;
    }
  }, [API_URL, apiRequest, multipleChoiceTests]);

  // Update a multiple choice test
  const updateMultipleChoiceTest = useCallback(async (testId, updateData) => {
    try {
      console.log(`Updating multiple choice test ${testId} with data:`, updateData);
      
      const result = await apiRequest(`${API_URL}/MultipleChoiceTest/Update/${testId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });
      
      console.log('Multiple choice test updated successfully:', result);
      
      // Update the current test if it's the one being edited
      if (currentTest && currentTest.multipleChoiceTestId === testId) {
        setCurrentTest(result);
      }
      
      // Update the list if we have tests loaded
      if (multipleChoiceTests.length > 0) {
        setMultipleChoiceTests(prev => 
          prev.map(test => test.multipleChoiceTestId === testId ? result : test)
        );
      }
      
      return result;
    } catch (err) {
      console.error(`Failed to update multiple choice test ${testId}:`, err);
      toast.error(`Error updating test: ${err.message}`);
      throw err;
    }
  }, [API_URL, apiRequest, currentTest, multipleChoiceTests]);

  // Delete a multiple choice test
  const deleteMultipleChoiceTest = useCallback(async (testId) => {
    try {
      console.log(`Deleting multiple choice test with ID: ${testId}`);
      
      await apiRequest(`${API_URL}/MultipleChoiceTest/Delete/${testId}`, {
        method: 'DELETE'
      });
      
      console.log('Multiple choice test deleted successfully');
      
      // Remove the deleted test from state if loaded
      if (multipleChoiceTests.length > 0) {
        setMultipleChoiceTests(prev => prev.filter(test => test.multipleChoiceTestId !== testId));
      }
      
      // Clear current test if it's the one being deleted
      if (currentTest && currentTest.multipleChoiceTestId === testId) {
        setCurrentTest(null);
      }
      
      return { success: true };
    } catch (err) {
      console.error(`Failed to delete multiple choice test ${testId}:`, err);
      toast.error(`Error deleting test: ${err.message}`);
      throw err;
    }
  }, [API_URL, apiRequest, currentTest, multipleChoiceTests]);

  // Toggle public/private status
  const togglePublicStatus = useCallback(async (testId) => {
    try {
      const endpoint = `${API_URL}/MultipleChoiceTest/ToPublic/${testId}`;
        
      console.log(`Toggling visibility with endpoint: ${endpoint}`);
      
      const result = await apiRequest(endpoint, {
        method: 'PUT'
      });
      
      console.log('Visibility toggled successfully:', result);
      
      // Update the current test if it's the one being toggled
      if (currentTest && currentTest.multipleChoiceTestId === testId) {
        setCurrentTest({
          ...currentTest,
          isPublic: !currentTest.isPublic
        });
      }
      
      // Update the list if we have tests loaded
      if (multipleChoiceTests.length > 0) {
        setMultipleChoiceTests(prev => 
          prev.map(test => test.multipleChoiceTestId === testId 
            ? {...test, isPublic: !test.isPublic} 
            : test
          )
        );
      }
      
      return result;
    } catch (err) {
      console.error(`Failed to toggle public status for test ${testId}:`, err);
      toast.error(`Error changing visibility: ${err.message}`);
      throw err;
    }
  }, [API_URL, apiRequest, currentTest, multipleChoiceTests]);

  // Clear current test
  const clearCurrentTest = useCallback(() => {
    setCurrentTest(null);
  }, []);

  // Generate multiple choice test with AI
  const generateMultipleChoiceTestWithAI = useCallback(async (generationData) => {
    try {
      console.log('Generating multiple choice test with AI using data:', generationData);
      
      const result = await apiRequest(`${API_URL}/MultipleChoiceTest/GenerateByAI`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(generationData)
      });
      
      console.log('Multiple choice test generated successfully:', result);
      
      // Update the list if we have tests loaded already
      if (multipleChoiceTests.length > 0) {
        setMultipleChoiceTests(prev => [result, ...prev]);
      }
      
      return result;
    } catch (err) {
      console.error('Failed to generate multiple choice test with AI:', err);
      
      // Check if error is due to missing API key
      if (err.message && err.message.includes('API key')) {
        toast.error('A valid Gemini API key is required. Please add your API key in the settings.');
      } else {
        toast.error(`Error generating test: ${err.message}`);
      }
      
      throw err;
    }
  }, [API_URL, apiRequest, multipleChoiceTests]);

  // Value object to be provided by context
  const contextValue = {
    multipleChoiceTests,
    currentTest,
    loading,
    error,
    totalPages,
    currentPage,
    itemsPerPage,
    getAllMultipleChoiceTests,
    getMultipleChoiceTestById,
    createMultipleChoiceTest,
    updateMultipleChoiceTest,
    deleteMultipleChoiceTest,
    togglePublicStatus,
    clearCurrentTest,
    generateMultipleChoiceTestWithAI
  };

  return (
    <MultipleChoiceTestContext.Provider value={contextValue}>
      {children}
    </MultipleChoiceTestContext.Provider>
  );
}; 