import React, { createContext, useState, useEffect, useContext } from 'react';

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
  const API_URL = process.env.REACT_APP_API_URL || 'https://1abd-42-118-114-121.ngrok-free.app/api';
  
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
    const url = `${API_URL}/UserLearningStats/UpdateStreak`; // API endpoint
    try {
        // Send POST request with the Authorization header
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, // Replace with your actual token
                'Content-Type': 'application/json', // Ensure correct content type
            },
        });

        // Check if the request was successful
        if (response.ok) {
            const data = await response.json(); // Parse JSON response if necessary
            console.log('Streak updated successfully:', data);
        } else {
            console.error('Failed to update streak. Status:', response.status);
        }
    } catch (error) {
        console.error('An error occurred while updating streak:', error);
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

  const value = {
    user,
    accessToken,
    login,
    logout,
    refreshAccessToken,
    updateStreak,
    isAuthenticated: !!accessToken,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : <div>Loading...</div>}
    </AuthContext.Provider>
  );
}; 