import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { toast } from 'react-toastify';

// Tạo Context
const AuthContext = createContext();

// Custom Hook để sử dụng Auth Context dễ dàng hơn
export const useAuth = () => useContext(AuthContext);

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken') || null);
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken') || null);
  const [loading, setLoading] = useState(true);
  const [isUpdateStreek, setIsUpdateStreek] = useState(false);
  
  // Lấy API URL từ biến môi trường
  const baseUrl = process.env.REACT_APP_API_URL || 'https://3599-115-76-51-131.ngrok-free.app';
  // Remove trailing /api if it exists to avoid duplicate /api in endpoints
  const API_URL = baseUrl.endsWith('/api') ? baseUrl.slice(0, -4) : baseUrl;
  
  // Log URL API đang sử dụng
  useEffect(() => {
    console.log('AuthContext using API URL:', API_URL);
  }, [API_URL]);

  // Hàm đăng nhập
  const login = async (userData, newAccessToken, newRefreshToken) => {
    setUser(userData);
    setAccessToken(newAccessToken);
    setRefreshToken(newRefreshToken);
    localStorage.setItem('accessToken', newAccessToken);
    localStorage.setItem('refreshToken', newRefreshToken);
    
    // Trả về true để component cha có thể xử lý điều hướng
    return true;
  };

  // Hàm đăng xuất
  const logout = async () => {
    // Save current language setting
    const currentLanguage = localStorage.getItem('selectedLanguage') || 'en';
    
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    
    // Clear authentication-related data but preserve language setting
    const keysToKeep = ['selectedLanguage'];
    const keysToRemove = [
      'accessToken', 
      'refreshToken', 
      'userId', 
      'userData', 
      'gemini_api_key', 
      'gemini_api_key_timestamp', 
      'api_key', 
      'redirectAfterLogin', 
      'userInfo'
    ];
    
    // Remove specific keys
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    // Restore language setting
    localStorage.setItem('selectedLanguage', currentLanguage);
    
    // Trả về true để component cha có thể xử lý điều hướng
    return true;
  };

  // Hàm làm mới token
  const refreshAccessToken = async () => {
    if (!refreshToken) {
      console.log('No refresh token available');
      await logout();
      return null;
    }

    try {
      const refreshUrl = `${API_URL}/Auth/refresh-token`;
      console.log('Sending refresh token request to:', refreshUrl);
      
      const response = await fetch(refreshUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        setAccessToken(data.token);
        localStorage.setItem('accessToken', data.token);
        console.log('Token refresh successful');
        return data.token;
      } else {
        // Nếu làm mới token thất bại, đăng xuất người dùng
        console.error('Token refresh failed');
        await logout();
        return null;
      }
    } catch (error) {
      console.error('Lỗi khi làm mới token:', error);
      await logout();
      return null;
    }
  };

  // Hàm xử lý lỗi xác thực
  const handleAuthError = useCallback(async (status) => {
    console.log('Handling auth error with status:', status);
    
    // Nếu status là 401 (Unauthorized), thử làm mới token
    if (status === 401) {
      console.log('Token expired, attempting to refresh...');
      const newToken = await refreshAccessToken();
      
      // Nếu làm mới thành công, trả về token mới
      if (newToken) {
        console.log('Token refreshed successfully');
        return newToken;
      } else {
        // Nếu làm mới thất bại, đăng xuất người dùng
        console.log('Token refresh failed, logging out user');
        await logout();
        // Thông báo cho người dùng
        toast.error('Login session has expired. Please log in again.');
        return null;
      }
    }
    
    // Các lỗi xác thực khác, đăng xuất
    if (status === 403) {
      console.log('User not authorized for this resource');
      toast.error('You don\'t have permission to access this resource.');
    }
    
    return null;
  }, [refreshToken]);

  // Check token expiration before making API calls
  const checkTokenExpiration = useCallback(async () => {
    if (!accessToken) {
      console.log('No access token available');
      return false;
    }
    
    // Get token payload
    try {
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      const expiry = payload.exp * 1000; // Convert to milliseconds
      const currentTime = Date.now();
      
      // If token is expired or close to expiry (within 5 minutes)
      if (expiry - currentTime < 300000) {
        console.log('Token expired or about to expire, refreshing...');
        const newToken = await refreshAccessToken();
        return !!newToken;
      }
      
      return true;
    } catch (error) {
      console.error('Failed to parse token:', error);
      return false;
    }
  }, [accessToken, refreshToken]);

  const updateStreak = async () => {
    // Check token before making API call
    const isTokenValid = await checkTokenExpiration();
    if (!isTokenValid) {
      console.warn('No valid token available for updateStreak');
      return false;
    }
    
    // Make sure to use the correct URL format
    const url = `${API_URL}/UserLearningStats/UpdateStreak`; 
    console.log('Calling updateStreak at URL:', url);
    
    try {
        // Get token from localStorage
        const token = localStorage.getItem('accessToken');
        
        if (!token) {
            console.warn('No access token available for updateStreak');
            return false;
        }
        
        console.log('Using token for updateStreak (first 10 chars):', token.substring(0, 10) + '...');
        
        // Send POST request with the Authorization header
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'ngrok-skip-browser-warning': 'true'
            },
            // Add small timeout to prevent long waits
            signal: AbortSignal.timeout(5000)
        });

        console.log('UpdateStreak response status:', response.status);
        
        // Handle auth errors
        if (response.status === 401 || response.status === 403) {
          await handleAuthError(response.status);
          return false;
        }
        
        // Check if the request was successful
        if (response.ok) {
            try {
                const data = await response.json(); // Parse JSON response if necessary
                console.log('Streak updated successfully:', data);
                return true;
            } catch (jsonError) {
                // If server doesn't return JSON, that's OK
                console.log('Streak updated (no JSON response)');
                return true;
            }
        } else {
            // Try alternative URL format
            console.error('Failed to update streak. Status:', response.status);
            if (!url.includes('/api/')) {
                console.log('Trying alternative URL with /api/ prefix...');
                const altUrl = `${API_URL}/api/UserLearningStats/UpdateStreak`;
                return await tryAlternativeUpdateStreak(altUrl, token);
            }
            return false;
        }
    } catch (error) {
        console.error('An error occurred while updating streak:', error);
        return false;
    }
  };
  
  // Helper function to try alternative URL
  const tryAlternativeUpdateStreak = async (url, token) => {
    try {
        console.log('Trying alternative updateStreak URL:', url);
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'ngrok-skip-browser-warning': 'true'
            },
            signal: AbortSignal.timeout(5000)
        });
        
        console.log('Alternative updateStreak response status:', response.status);
        
        // Handle auth errors
        if (response.status === 401 || response.status === 403) {
          await handleAuthError(response.status);
          return false;
        }
        
        return response.ok;
    } catch (error) {
        console.error('Alternative updateStreak also failed:', error);
        return false;
    }
  };

  // Hàm lưu API key Gemini
  const storeApiKey = async (apiKey) => {
    // Check token before making API call
    const isTokenValid = await checkTokenExpiration();
    if (!isTokenValid) {
      console.error('Không có token xác thực, không thể lưu API key');
      return { 
        success: false, 
        status: 401,
        statusText: 'Unauthorized',
        message: 'You need to log in to save the API key',
        data: null
      };
    }

    try {
      // Đảm bảo URL chứa /api/ prefix
      let storeKeyUrl = `${API_URL}/Auth/store-key`;
      if (!storeKeyUrl.includes('/api/')) {
        storeKeyUrl = `${API_URL}/api/Auth/store-key`;
      }
      
      console.log('Gửi yêu cầu lưu API key đến URL:', storeKeyUrl);
      console.log('Sử dụng accessToken (10 ký tự đầu):', accessToken.substring(0, 10) + '...');
      
      // Thực hiện gọi API để lưu key
      const response = await fetch(storeKeyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'ngrok-skip-browser-warning': 'true',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ apiKey }),
      });

      console.log('Phản hồi từ server:', response.status, response.statusText);
      
      // Handle auth errors
      if (response.status === 401 || response.status === 403) {
        await handleAuthError(response.status);
        return { 
          success: false, 
          status: response.status,
          statusText: response.statusText,
          message: 'Login session has expired. Please log in again.',
          data: null
        };
      }
      
      // Read response body
      let data = null;
      let text = '';
      
      try {
        text = await response.text();
        data = text ? JSON.parse(text) : null;
      } catch (e) {
        console.warn('Could not parse response as JSON:', e);
      }
      
      if (response.ok) {
        console.log('Lưu API key thành công');
        
        // Lưu API key vào localStorage nếu status là 200
        if (response.status === 200) {
          localStorage.setItem('gemini_api_key', apiKey);
          localStorage.setItem('gemini_api_key_timestamp', Date.now().toString());
          console.log('Đã lưu API key vào localStorage');
        }
        
        toast.success('API key has been saved successfully! You can use AI features for 2 hours.');
        return { 
          success: true,
          status: response.status,
          statusText: response.statusText, 
          message: 'API key has been saved successfully! You can use AI features for 2 hours.',
          data,
          text
        };
      } else {
        console.error('Lưu API key thất bại:', response.status);
        toast.error(`Lỗi khi lưu API key: ${response.status} ${response.statusText}`);
        return { 
          success: false,
          status: response.status,
          statusText: response.statusText,
          message: `Lỗi khi lưu API key: ${response.status} ${response.statusText}`,
          data,
          text
        };
      }
    } catch (error) {
      console.error('Lỗi khi lưu API key:', error);
      toast.error(`Lỗi khi lưu API key: ${error.message}`);
      return { 
        success: false, 
        status: 0,
        statusText: 'Network Error',
        message: `Lỗi khi lưu API key: ${error.message}`,
        data: null,
        error: error.toString()
      };
    }
  };

  // Kiểm tra token khi component mount và định kỳ
  useEffect(() => {
    const checkAuth = async () => {
      if (accessToken) {
        // Kiểm tra tính hợp lệ của token
        const isValid = await checkTokenExpiration();
        if (!isValid) {
          console.log('Token invalid or expired');
          await logout();
        }
        setLoading(false);
      } else {
        setLoading(false);
      }
    };

    checkAuth();
    
    // Kiểm tra token theo định kỳ (mỗi 15 phút)
    const tokenCheckInterval = setInterval(() => {
      if (accessToken) {
        checkTokenExpiration().catch(console.error);
      }
    }, 15 * 60 * 1000); // 15 minutes
    
    return () => clearInterval(tokenCheckInterval);
  }, [accessToken, checkTokenExpiration]);

  // Kiểm tra xem đã có API key trong localStorage chưa
  const checkLocalApiKey = () => {
    const apiKey = localStorage.getItem('gemini_api_key');
    const timestamp = localStorage.getItem('gemini_api_key_timestamp');
    
    if (!apiKey || !timestamp) {
      return null;
    }
    
    // Kiểm tra xem API key có còn hiệu lực không (2 giờ)
    const now = Date.now();
    const saved = parseInt(timestamp, 10);
    const twoHoursMs = 2 * 60 * 60 * 1000;
    
    if (now - saved > twoHoursMs) {
      // API key đã hết hạn, xóa khỏi localStorage
      console.log('API key đã hết hạn, xóa khỏi localStorage');
      localStorage.removeItem('gemini_api_key');
      localStorage.removeItem('gemini_api_key_timestamp');
      return null;
    }
    
    return apiKey;
  };

  const value = {
    user,
    accessToken,
    login,
    logout,
    refreshAccessToken,
    updateStreak,
    storeApiKey,
    checkLocalApiKey,
    handleAuthError,
    checkTokenExpiration,
    isAuthenticated: !!accessToken,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : <div>Loading...</div>}
    </AuthContext.Provider>
  );
};