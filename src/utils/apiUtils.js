import { useAuth } from '../contexts/AuthContext';

/**
 * Helper function to make authenticated API requests with token refresh handling
 * 
 * @param {string} url - API endpoint URL
 * @param {object} options - Fetch options (method, headers, body, etc.)
 * @param {function} authContext - Auth context with token methods
 * @returns {Promise<object>} - Response data or error
 */
export const makeAuthenticatedRequest = async (url, options = {}, authContext) => {
  // Check if we have an auth context passed in
  if (!authContext) {
    console.error('No auth context provided for authenticated request');
    throw new Error('Authentication context is required');
  }
  
  const { accessToken, checkTokenExpiration, handleAuthError } = authContext;
  
  try {
    // Check if token is valid before making the request
    const isTokenValid = await checkTokenExpiration();
    if (!isTokenValid) {
      throw new Error('Invalid or expired token');
    }
    
    // Setup headers
    if (!options.headers) {
      options.headers = {};
    }
    
    // Add standard headers
    options.headers = {
      ...options.headers,
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': options.headers['Content-Type'] || 'application/json',
      'Accept': 'application/json',
      'ngrok-skip-browser-warning': 'true'
    };
    
    // Make the request
    const response = await fetch(url, options);
    
    // Handle authentication errors
    if (response.status === 401 || response.status === 403) {
      console.log(`Auth error ${response.status} from ${url}`);
      await handleAuthError(response.status);
      throw new Error(`Authentication error: ${response.status}`);
    }
    
    // Parse response based on content type
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      try {
        data = await response.json();
      } catch (e) {
        console.warn('Failed to parse JSON response:', e);
        data = null;
      }
    } else {
      try {
        data = await response.text();
      } catch (e) {
        console.warn('Failed to parse text response:', e);
        data = null;
      }
    }
    
    // Return complete response info
    return {
      success: response.ok,
      status: response.status,
      statusText: response.statusText,
      data,
      headers: Object.fromEntries(response.headers.entries())
    };
  } catch (error) {
    console.error('API request failed:', error);
    // Return error info
    return {
      success: false,
      status: 0,
      statusText: 'Request Failed',
      message: error.message,
      error: error.toString()
    };
  }
};

/**
 * React hook to use authenticated API requests
 * @returns {function} makeRequest - Function to make authenticated API requests
 */
export const useAuthenticatedRequest = () => {
  const auth = useAuth();
  
  const makeRequest = async (url, options = {}) => {
    return makeAuthenticatedRequest(url, options, auth);
  };
  
  return makeRequest;
}; 