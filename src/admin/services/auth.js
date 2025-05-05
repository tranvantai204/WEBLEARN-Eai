// Authentication utility functions

/**
 * Get the authentication token from localStorage
 * @returns {string|null} The auth token or null if not found
 */
export const getToken = () => {
  return localStorage.getItem('token');
};

/**
 * Get the refresh token from localStorage
 * @returns {string|null} The refresh token or null if not found
 */
export const getRefreshToken = () => {
  return localStorage.getItem('refreshToken');
};

/**
 * Save authentication data to localStorage
 * @param {Object} authData - The authentication data from the server
 */
export const saveAuthData = (authData) => {
  if (authData.token) {
    localStorage.setItem('token', authData.token);
  }
  
  if (authData.refreshToken) {
    localStorage.setItem('refreshToken', authData.refreshToken);
  }
  
  if (authData.userId && authData.email) {
    localStorage.setItem('user', JSON.stringify({
      userId: authData.userId,
      email: authData.email,
      roles: authData.roles || [],
    }));
  }
};

/**
 * Clear all authentication data from localStorage
 */
export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
};

/**
 * Check if the user is authenticated
 * @returns {boolean} True if authenticated, false otherwise
 */
export const isAuthenticated = () => {
  return !!getToken();
};

/**
 * Get current user data from localStorage
 * @returns {Object|null} User data or null if not available
 */
export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

/**
 * Check if the current user has a specific role
 * @param {string} role - The role to check for
 * @returns {boolean} True if user has the role, false otherwise
 */
export const hasRole = (role) => {
  const user = getCurrentUser();
  return user && user.roles && user.roles.includes(role);
}; 