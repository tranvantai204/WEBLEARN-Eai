import React, { createContext, useState, useEffect, useContext } from 'react';
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


  const updateStreak = async () => {
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
        return response.ok;
    } catch (error) {
        console.error('Alternative updateStreak also failed:', error);
        return false;
    }
  };

  // Hàm đăng xuất
  const logout = async () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    
    // Trả về true để component cha có thể xử lý điều hướng
    return true;
  };

  // Hàm lưu API key Gemini
  const storeApiKey = async (apiKey) => {
    if (!accessToken) {
      console.error('Không có token xác thực, không thể lưu API key');
      return { 
        success: false, 
        status: 401,
        statusText: 'Unauthorized',
        message: 'Bạn cần đăng nhập để lưu API key',
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
        
        toast.success('API key đã được lưu thành công! Bạn có thể sử dụng các tính năng AI trong 2 giờ.');
        return { 
          success: true,
          status: response.status,
          statusText: response.statusText, 
          message: 'API key đã được lưu thành công! Bạn có thể sử dụng các tính năng AI trong 2 giờ.',
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

  // Kiểm tra token khi component mount
  useEffect(() => {
    const checkAuth = async () => {
      if (accessToken) {
        // Có thể thêm logic kiểm tra tính hợp lệ của token ở đây
        setLoading(false);
      } else {
        setLoading(false);
      }
    };

    checkAuth();
  }, [accessToken]);

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
    isAuthenticated: !!accessToken,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : <div>Loading...</div>}
    </AuthContext.Provider>
  );
}; 