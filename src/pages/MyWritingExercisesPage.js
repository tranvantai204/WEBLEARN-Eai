import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Helmet } from 'react-helmet';
import WritingExerciseList from '../components/WritingExerciseList';
import { WritingExerciseProvider } from '../contexts/WritingExerciseContext';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const MyWritingExercisesPage = () => {
  const { isAuthenticated, currentUser } = useAuth();
  
  // Debug user information
  useEffect(() => {
    console.log('MyWritingExercisesPage - Auth state:', { isAuthenticated, currentUser });
    if (!currentUser?.userId) {
      console.warn('User ID is missing or undefined');
    }
  }, [isAuthenticated, currentUser]);
  
  // Debug localStorage
  useEffect(() => {
    console.log('Checking localStorage for user data...');
    try {
      const directUserId = localStorage.getItem('userId');
      const userData = localStorage.getItem('userData');
      const accessToken = localStorage.getItem('accessToken');
      console.log('localStorage data:', { 
        userId: directUserId ? directUserId : 'missing',
        userData: userData ? 'present' : 'missing',
        accessToken: accessToken ? 'present' : 'missing' 
      });
      
      if (userData) {
        try {
          const parsedUserData = JSON.parse(userData);
          console.log('Parsed userData:', { 
            userId: parsedUserData.userId || 'missing',
            hasUserId: !!parsedUserData.userId
          });
        } catch (e) {
          console.error('Error parsing userData:', e);
        }
      }
    } catch (e) {
      console.error('Error accessing localStorage:', e);
    }
  }, []);
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [topic, setTopic] = useState('');
  const [learningLanguage, setLearningLanguage] = useState('ENG');
  const [nativeLanguage, setNativeLanguage] = useState('VIE');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countries, setCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Fetch countries data on component mount
  useEffect(() => {
    const fetchCountries = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('https://open.oapi.vn/location/countries');
        if (!response.ok) {
          throw new Error('Failed to fetch countries');
        }
        
        const result = await response.json();
        if (result.code === 'success' && Array.isArray(result.data)) {
          // Sort countries by name
          const sortedCountries = result.data.sort((a, b) => 
            a.niceName.localeCompare(b.niceName)
          );
          setCountries(sortedCountries);
        } else {
          console.error('Invalid API response format:', result);
        }
      } catch (error) {
        console.error('Error fetching countries:', error);
        toast.error('Không thể tải danh sách quốc gia. Đang sử dụng danh sách mặc định.');
        // Set fallback countries if API fails
        setCountries([
          { id: "1", iso3: "VIE", niceName: "Vietnam", flag: "https://flagsapi.com/VN/flat/64.png" },
          { id: "2", iso3: "ENG", niceName: "United Kingdom", flag: "https://flagsapi.com/GB/flat/64.png" },
          { id: "3", iso3: "USA", niceName: "United States", flag: "https://flagsapi.com/US/flat/64.png" },
          { id: "4", iso3: "JPN", niceName: "Japan", flag: "https://flagsapi.com/JP/flat/64.png" },
          { id: "5", iso3: "KOR", niceName: "South Korea", flag: "https://flagsapi.com/KR/flat/64.png" },
          { id: "6", iso3: "CHN", niceName: "China", flag: "https://flagsapi.com/CN/flat/64.png" },
          { id: "7", iso3: "FRA", niceName: "France", flag: "https://flagsapi.com/FR/flat/64.png" },
          { id: "8", iso3: "GER", niceName: "Germany", flag: "https://flagsapi.com/DE/flat/64.png" }
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCountries();
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning">
          Vui lòng đăng nhập để xem bài tập viết của bạn.
        </div>
      </div>
    );
  }
  
  const handleCreateExercise = async (e) => {
    e.preventDefault();
    
    if (!topic.trim()) {
      toast.error('Vui lòng nhập chủ đề cho bài tập viết');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Try to get userId from localStorage - either directly or from userData object
      let userId = currentUser?.userId;
      if (!userId) {
        // First try direct userId key
        userId = localStorage.getItem('userId');
        if (userId) {
          console.log('Using userId directly from localStorage for exercise creation');
        } else {
          // Then try from userData object
          try {
            const userDataString = localStorage.getItem('userData');
            if (userDataString) {
              const userData = JSON.parse(userDataString);
              userId = userData.userId;
              console.log('Using userId from userData in localStorage for exercise creation');
            }
          } catch (parseError) {
            console.error('Error parsing userData from localStorage:', parseError);
          }
        }
      }
      
      if (!userId) {
        toast.error('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
        setIsSubmitting(false);
        return;
      }
      
      // Get API URL from environment variables or use default
      const baseUrl = process.env.REACT_APP_API_URL || 'https://6d2c-115-76-51-131.ngrok-free.app';
      const API_URL = baseUrl.endsWith('/api') ? baseUrl.slice(0, -4) : baseUrl;
      
      // Get token from localStorage
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        toast.error('Bạn cần đăng nhập lại để thực hiện chức năng này');
        setIsSubmitting(false);
        return;
      }
      
      // Include userId in the request body if needed by your API
      const response = await fetch(`${API_URL}/api/WritingExercise/Create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({
          topic,
          learningLanguage,
          nativeLanguage,
          userId  // Include userId if your API needs it in the body
        })
      });
      
      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 400) {
          const errorData = await response.json();
          if (errorData.message && errorData.message.includes('maximum limit')) {
            toast.error('Bạn đã đạt đến giới hạn tối đa 5 bài tập viết cùng lúc.');
          } else {
            toast.error(`Lỗi: ${errorData.message || 'Dữ liệu không hợp lệ'}`);
          }
        } else if (response.status === 401) {
          toast.error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
        } else {
          toast.error('Đã xảy ra lỗi khi tạo bài tập viết.');
        }
        setIsSubmitting(false);
        return;
      }
      
      const data = await response.json();
      
      // Success
      toast.success('Tạo bài tập viết mới thành công!');
      
      // Reset form and hide it
      setTopic('');
      setShowCreateForm(false);
      
      // Force reload of writing exercises list
      window.location.reload();
      
    } catch (error) {
      console.error('Error creating writing exercise:', error);
      toast.error('Đã xảy ra lỗi khi kết nối đến máy chủ.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <WritingExerciseProvider>
      <div className="container my-5">
        <Helmet>
          <title>Bài tập viết của tôi | WebLearn-EAI</title>
        </Helmet>
        
        <div className="page-header d-flex justify-content-between align-items-center">
          <div>
            <Link to="/writing" className="back-link">
              <i className="fas fa-arrow-left me-2"></i>Quay lại
            </Link>
            <h2 className="page-title">Bài tập viết của tôi</h2>
          </div>
          <button 
            className="btn create-btn" 
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            {showCreateForm ? (
              <>
                <i className="fas fa-times me-2"></i>
                Hủy
              </>
            ) : (
              <>
                <i className="fas fa-plus me-2"></i>
                Tạo bài tập viết mới
              </>
            )}
          </button>
        </div>
        
        {showCreateForm && (
          <div className="card create-exercise-form mb-4">
            <div className="card-header">
              <h5 className="card-title">Tạo bài tập viết mới</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleCreateExercise}>
                <div className="mb-3">
                  <label htmlFor="topic" className="form-label">Chủ đề bài tập viết</label>
                  <textarea
                    id="topic"
                    className="form-control"
                    rows="3"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Nhập chủ đề hoặc đề bài chi tiết của bài tập viết"
                    required
                  ></textarea>
                </div>
                
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="learningLanguage" className="form-label">Ngôn ngữ viết bài</label>
                    {/* Note: Standard HTML select/option elements don't support images inside options properly.
                        For a better UI with flags, we would need to implement a custom dropdown component. */}
                    <select
                      id="learningLanguage"
                      className="form-select"
                      value={learningLanguage}
                      onChange={(e) => setLearningLanguage(e.target.value)}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <option>Đang tải...</option>
                      ) : (
                        countries.map(country => (
                          <option key={country.id} value={country.iso3}>
                            {country.niceName}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label htmlFor="nativeLanguage" className="form-label">Ngôn ngữ mẹ đẻ</label>
                    <select
                      id="nativeLanguage"
                      className="form-select"
                      value={nativeLanguage}
                      onChange={(e) => setNativeLanguage(e.target.value)}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <option>Đang tải...</option>
                      ) : (
                        countries.map(country => (
                          <option key={country.id} value={country.iso3}>
                            {country.niceName}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                </div>
                
                <div className="text-end">
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary me-2"
                    onClick={() => setShowCreateForm(false)}
                  >
                    Hủy
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={isSubmitting || isLoading}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Đang tạo...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-check me-2"></i>
                        Tạo bài tập viết
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        <p className="text-muted mb-4">
          Dưới đây là danh sách các bài tập viết của bạn. 
          Mỗi người dùng chỉ được phép có tối đa 5 bài tập viết cùng lúc.
        </p>
        
        <WritingExerciseList />
      </div>
    </WritingExerciseProvider>
  );
};

export default MyWritingExercisesPage; 