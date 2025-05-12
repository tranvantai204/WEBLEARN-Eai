import axios from 'axios';

// Create an axios instance with base configuration
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://api.wordwise.com', // Replace with your actual API base URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'ngrok-skip-browser-warning': 'true'
  }
});

// Add request interceptor to attach auth token for protected routes
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Authentication API calls
export const authService = {
  // Login
  login: async (credentials) => {
    try {
      const response = await API.post('/Auth/login', credentials);
      // Store token and user info in localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        localStorage.setItem('user', JSON.stringify({
          userId: response.data.userId,
          email: response.data.email,
          roles: response.data.roles,
        }));
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Logout
  logout: () => {
    localStorage.clear();
    // localStorage.removeItem('token');
    // localStorage.removeItem('refreshToken');
    // localStorage.removeItem('user');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Get current user
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Check if user has role
  hasRole: (role) => {
    const user = authService.getCurrentUser();
    return user && user.roles && user.roles.includes(role);
  },

  // Check if user has admin rights (Admin or SuperAdmin)
  hasAdminRole: () => {
    try {
      const token = authService.getToken();
      if (!token) return false;
      
      // Parse the token
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      const payload = JSON.parse(jsonPayload);
      
      // Check for role claims (handle different possible formats)
      const roleClaim = payload.role || payload.roles || payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      
      if (!roleClaim) return false;
      
      // Handle roles as array or single string
      const roles = Array.isArray(roleClaim) ? roleClaim : [roleClaim];
      
      // Check if roles include Admin or SuperAdmin
      return roles.some(r => r === 'Admin' || r === 'SuperAdmin');
    } catch (error) {
      console.error('Error checking admin role:', error);
      return false;
    }
  },

  // Get token
  getToken: () => {
    return localStorage.getItem('token');
  }
};

// User management API calls
export const userService = {
  // Get all users (admin only)
  getAllUsers: async (page = 1, itemPerPage = 20, emailUser = '', roleFilter = '') => {
    try {
      const response = await API.get('/Auth/get-all-user', {
        params: { page, itemPerPage, emailUser, roleFilter }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get paginated list of users
  getUserList: async (page = 0, pageSize = 20) => {
    try {
      const response = await API.get('/Auth/get-users', {
        params: { page, pageSize }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Register new admin user (SuperAdmin only)
  registerAdmin: async (adminData) => {
    try {
      const response = await API.post('/Auth/register-admin', adminData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get user by ID
  getUserById: async (userId) => {
    try {
      const response = await API.get(`/api/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Create new user
  createUser: async (userData) => {
    try {
      const response = await API.post('/Auth/register', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Update user
  updateUser: async (userId, userData) => {
    try {
      const response = await API.put(`/api/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Delete user
  deleteUser: async (userId) => {
    try {
      const response = await API.delete(`/Auth/DeleteUser/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting user ${userId}:`, error.response?.data || error.message);
      throw error;
    }
  }
};

// FlashCard sets API calls
export const flashCardService = {
  // Get all flashcard sets for a specific user
  getUserFlashcardSets: async (userId, page = 1, itemPerPage = 5) => {
    try {
      const response = await API.get(`/api/FlashCardSet/GetAll/${userId}`, {
        params: { page, itemPerPage }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get public flashcard sets (for explore page)
  getPublicFlashcardSets: async (page = 1, itemPerPage = 5) => {
    try {
      const response = await API.get('/api/FlashCardSet/Explore', {
        params: { page, itemPerPage }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get details for a specific flashcard set by ID
  getFlashcardSetDetails: async (flashcardSetId) => {
    try {
      const response = await API.get(`/api/FlashCardSet/${flashcardSetId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching flashcard set ${flashcardSetId}:`, error.response?.data || error.message);
      throw error;
    }
  },

  // Delete a flashcard set (Admin/SuperAdmin only)
  deleteFlashcardSet: async (flashcardSetId) => {
    try {
      const response = await API.delete(`/FlashCardSet/Delete/${flashcardSetId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting flashcard set ${flashcardSetId}:`, error.response?.data || error.message);
      throw error;
    }
  },

  getAllFlashcardSetsAdmin: async (params = {}) => {
    const {
      flashCardSetId,
      learningLanguage,
      nativeLanguage,
      page = 1,         
      itemPerPage = 20, 
    } = params;
  
    const queryParams = { page, itemPerPage };
    if (flashCardSetId) queryParams.flashCardSetId = flashCardSetId;
    if (learningLanguage) queryParams.learningLanguage = learningLanguage;
    if (nativeLanguage) queryParams.nativeLanguage = nativeLanguage;
  
    try {
      console.log("Calling GET /api/FlashCardSet/admin/GetAllAdmin with params:", queryParams);
      const response = await API.get('/FlashCardSet/admin/GetAllAdmin', {
        params: queryParams
      });
      console.log("Response from GET /api/FlashCardSet/admin/GetAllAdmin:", response.data);
      return response.data; 
    } catch (error) {
      console.error("Error fetching admin flashcard sets:", error.response?.data || error.message);
      throw error; 
    }
  }
};


// Content report API calls
export const reportService = {
  // Get all content reports with filtering options (admin only)
  getAllReports: async (filters = {}) => {
    const { 
      reportId, 
      userId, 
      contentType, 
      status, 
      sortBy, 
      isDesc, 
      currentPage = 1, 
      itemPerPage = 20 
    } = filters;
    
    try {
      const response = await API.get('/ContentReport/GetAllReport', {
        params: { 
          reportId, 
          userId, 
          contentType, 
          status, 
          sortBy, 
          isDesc, 
          currentPage, 
          itemPerPage 
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Update report status
  updateReportStatus: async (reportId, newStatus) => {
    try {
      const response = await API.put(`/ContentReport/ApproveReport/${reportId}`, null, {
        params: { reportStatus: newStatus }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get report details by ID
  getReportById: async (reportId) => {
    try {
      const response = await API.get(`/ContentReport/${reportId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

};


export const multipleChoiceTestService = {
  // Get all Multiplechoice test
  getAllMultipleChoiceTestsAdmin: async (params = {}) => {
    const {
      multipleChoiceTestId,
      learningLanguage,
      nativeLanguage,
      page = 1,         
      itemPerPage = 20, 
    } = params;

    // Xây dựng các tham số query chỉ bao gồm những giá trị được cung cấp
    const queryParams = { page, itemPerPage };
    if (multipleChoiceTestId) queryParams.multipleChoiceTestId = multipleChoiceTestId;
    if (learningLanguage) queryParams.learningLanguage = learningLanguage;
    if (nativeLanguage) queryParams.nativeLanguage = nativeLanguage;

    try {
      console.log("Calling GET /api/MultipleChoiceTest/admin/GetAllAdmin with params:", queryParams);
      const response = await API.get('/MultipleChoiceTest/admin/GetAllAdmin', {
        params: queryParams
      });
      console.log("Response from GET /api/MultipleChoiceTest/admin/GetAllAdmin:", response.data);
      return response.data; 
    } catch (error) {
      console.error("Error fetching admin multiple choice tests:", error.response?.data || error.message);
      throw error; 
    }
  },

  // Get details for a specific multiple choice test
  getMultipleChoiceTestDetails: async (testId) => {
    try {
      const response = await API.get(`/api/MultipleChoiceTest/${testId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching multiple choice test ${testId}:`, error.response?.data || error.message);
      throw error;
    }
  },

  // Delete a multiple choice test (Admin/SuperAdmin only)
  deleteMultipleChoiceTest: async (testId) => {
    try {
      const response = await API.delete(`/MultipleChoiceTest/DeleteById/${testId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting multiple choice test ${testId}:`, error.response?.data || error.message);
      throw error;
    }
  }
}

export const statisticsService = {
  // Get dashboard statistics (Admin/SuperAdmin only)
  getSystemStatistics: async () => {
    try {
      const response = await API.get('/UserLearningStats/Statistics');
      return response.data;
    } catch (error) {
      console.error("Error fetching system statistics:", error.response?.data || error.message);
      throw error;
    }
  }
};

export default API; 