import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useWritingExercise } from '../contexts/WritingExerciseContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Spinner from './common/Spinner';
import ApiKeyForm from './ApiKeyForm';
import { useFlashcard } from '../contexts/FlashcardContext';
import '../css/components/WritingExercises.css';

const WritingExerciseDetailPageSimple = () => {
  const { exerciseId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { getWritingExerciseById } = useWritingExercise();
  const { getUserApiKey } = useFlashcard();
  
  const [exercise, setExercise] = useState(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiFeedback, setAiFeedback] = useState(null);
  const [showAiFeedback, setShowAiFeedback] = useState(false);
  const [showApiKeyForm, setShowApiKeyForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    topic: '',
    learningLanguage: '',
    nativeLanguage: ''
  });
  
  // Lưu tham chiếu đến nội dung gần nhất
  const latestContentRef = React.useRef('');
  
  // Cập nhật tham chiếu khi nội dung thay đổi
  useEffect(() => {
    latestContentRef.current = content;
  }, [content]);
  
  // Thiết lập tự động lưu mỗi 30 giây
  useEffect(() => {
    // Chỉ thiết lập tự động lưu khi đã load xong bài tập và người dùng đã đăng nhập
    if (!loading && exercise && isAuthenticated) {
      // Hàm tự động lưu
      const autoSave = async () => {
        // Bỏ qua nếu đang trong quá trình lưu thủ công, lưu tự động khác, hoặc nộp bài
        if (saving || autoSaving || submitting) return;
        
        // Bỏ qua nếu nội dung rỗng hoặc không thay đổi so với lần lưu gần nhất
        const currentContent = latestContentRef.current;
        if (!currentContent.trim()) return;
        if (currentContent === lastSaved) return;
        
        // Tiến hành tự động lưu
        setAutoSaving(true);
        try {
          const baseUrl = API_BASE_URL;
          const API_URL = baseUrl.endsWith('/api') ? baseUrl.slice(0, -4) : baseUrl;
          const token = localStorage.getItem('accessToken');
          
          if (!token) {
            console.warn('Không thể tự động lưu: Không tìm thấy token đăng nhập');
            return;
          }
          
          // Gọi API SaveWriting thay vì UpdateContent
          console.log("Auto-saving to API:", `${API_URL}/api/WritingExercise/SaveWriting/${exerciseId}`);
          const response = await fetch(`${API_URL}/api/WritingExercise/SaveWriting/${exerciseId}`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
              'ngrok-skip-browser-warning': 'true'
            },
            body: JSON.stringify({
              content: currentContent,
              feedback: aiFeedback || null
            })
          });
          
          if (response.ok) {
            console.log('Tự động lưu thành công:', new Date().toLocaleTimeString());
            setLastSaved(currentContent);
            
            // Không hiển thị toast khi tự động lưu, chỉ cập nhật UI trạng thái
            
            // Cập nhật trạng thái bài tập nếu cần
            if (exercise.status === 'Not Started') {
              setExercise({
                ...exercise,
                status: 'In Progress'
              });
            }
          } else {
            console.warn('Không thể tự động lưu:', response.status);
          }
        } catch (error) {
          console.error('Lỗi khi tự động lưu:', error);
        } finally {
          setAutoSaving(false);
        }
      };
      
      // Thiết lập interval
      const intervalId = setInterval(autoSave, 30000); // 30 giây
      
      // Dọn dẹp interval khi component unmount
      return () => clearInterval(intervalId);
    }
  }, [loading, exercise, isAuthenticated, exerciseId, saving, autoSaving, submitting, lastSaved, aiFeedback]);
  
  // Đảm bảo URL API giống nhau ở mọi nơi
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://6d2c-115-76-51-131.ngrok-free.app';

  
  // Load initial data
  useEffect(() => {
    const loadExercise = async () => {
      if (!isAuthenticated || !exerciseId) return;
      
      try {
        setLoading(true);
        const result = await getWritingExerciseById(exerciseId);
        
        if (result) {
          setExercise(result);
          
          // Check if the content is valid JSON
          if (result.content) {
            try {
              const parsedContent = JSON.parse(result.content);
              if (parsedContent && parsedContent.blocks) {
                // Extract plain text from EditorJS format
                const plainText = parsedContent.blocks
                  .map(block => {
                    if (block.type === 'paragraph' || block.type === 'header') {
                      return block.data.text;
                    }
                    return '';
                  })
                  .join('\n\n');
                setContent(plainText);
              } else {
                setContent(result.content);
              }
            } catch (e) {
              // If content is not valid JSON, just use it as is
              setContent(result.content);
            }
          } else {
            setContent('');
          }
          
          console.log("Checking for feedback:", result);
          
          // Load AI feedback if available and automatically show it
          if (result.aiFeedback && result.aiFeedback.trim() !== '') {
            console.log("Found feedback, setting aiFeedback:", result.aiFeedback.substring(0, 100) + "...");
            setAiFeedback(result.aiFeedback);
            setShowAiFeedback(true);
            
            // Thêm thông báo đã tải đánh giá AI sau khi trang đã tải xong hoàn toàn
            setTimeout(() => {
              toast.info("Đã tải đánh giá AI cho bài viết của bạn", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                icon: "🤖"
              });
              
              // Cuộn đến phần đánh giá AI sau khi trang đã tải xong và AI feedback đã render
              setTimeout(() => {
                const feedbackElement = document.querySelector('.ai-feedback-card');
                if (feedbackElement) {
                  // Thêm lớp CSS để nhấp nháy
                  feedbackElement.classList.add('highlight-feedback');
                  feedbackElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  
                  // Xóa lớp CSS sau 3 giây
                  setTimeout(() => {
                    feedbackElement.classList.remove('highlight-feedback');
                  }, 3000);
                } else {
                  console.warn("Feedback element not found in DOM after loading");
                }
              }, 1000);
            }, 1500);
          } else {
            console.log("No feedback found or feedback is empty");
            setShowAiFeedback(false);
            setAiFeedback(null);
          }
        }
      } catch (err) {
        console.error('Error loading exercise:', err);
        setError(err.message || 'Failed to load writing exercise');
        toast.error('Không thể tải bài tập viết. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };
    
    loadExercise();
  }, [exerciseId, isAuthenticated, getWritingExerciseById]);
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };
  
  // Get language name from code
  const getLanguageName = (code) => {
    switch (code) {
      case 'ENG': return 'English';
      case 'VIE': return 'Vietnamese';
      case 'KOR': return 'Korean';
      case 'JPN': return 'Japanese';
      case 'CN': return 'Chinese';
      case 'CHN': return 'Chinese';
      case 'FRA': return 'French';
      case 'GER': return 'German';
      case 'SPA': return 'Spanish';
      default: return code;
    }
  };
  
  // Get language flag from code
  const getLanguageFlag = (code) => {
    switch (code) {
      case 'ENG': return 'https://flagsapi.com/GB/flat/64.png';
      case 'VIE': return 'https://flagsapi.com/VN/flat/64.png';
      case 'KOR': return 'https://flagsapi.com/KR/flat/64.png';
      case 'JPN': return 'https://flagsapi.com/JP/flat/64.png';
      case 'CN': return 'https://flagsapi.com/CN/flat/64.png';
      case 'CHN': return 'https://flagsapi.com/CN/flat/64.png';
      case 'FRA': return 'https://flagsapi.com/FR/flat/64.png';
      case 'GER': return 'https://flagsapi.com/DE/flat/64.png';
      case 'SPA': return 'https://flagsapi.com/ES/flat/64.png';
      default: return null;
    }
  };
  
  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Not Started':
        return <span className="badge status-badge badge-not-started">Chưa bắt đầu</span>;
      case 'In Progress':
        return <span className="badge status-badge badge-in-progress">Đang thực hiện</span>;
      case 'Completed':
        return <span className="badge status-badge badge-completed">Đã hoàn thành</span>;
      default:
        return <span className="badge status-badge">{status}</span>;
    }
  };
  
  // Phương thức showToast để đảm bảo toast luôn hiển thị
  const showSuccessToast = (message) => {
    return toast.success(message, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };
  
  // Save content handler - hiển thị toast khi lưu thành công
  const handleSave = async () => {
    if (!content.trim()) {
      toast.warning("Nội dung không được để trống");
      return;
    }
    
    setSaving(true);
    
    try {
      const baseUrl = API_BASE_URL;
      const API_URL = baseUrl.endsWith('/api') ? baseUrl.slice(0, -4) : baseUrl;
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        toast.error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
        setSaving(false);
        return;
      }
      
      // Hiển thị toast trước khi gọi API để đảm bảo người dùng thấy ngay
      toast.info("Đang lưu bài viết...", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        toastId: "saving-toast"
      });
      
      console.log("Saving to API:", `${API_URL}/api/WritingExercise/SaveWriting/${exerciseId}`);
      
      // Sử dụng API SaveWriting thay vì UpdateContent do UpdateContent bị lỗi 404
      const response = await fetch(`${API_URL}/api/WritingExercise/SaveWriting/${exerciseId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({
          content: content,
          feedback: aiFeedback || null
        })
      });
      
      if (!response.ok) {
        toast.dismiss("saving-toast");
        if (response.status === 401) {
          toast.error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
        } else if (response.status === 400) {
          toast.error('Nội dung không hợp lệ.');
        } else if (response.status === 404) {
          toast.error('Không tìm thấy bài tập viết.');
        } else {
          throw new Error(`Network response was not ok: ${response.status}`);
        }
        return;
      }
      
      // Đọc phản hồi
      const responseText = await response.text();
      console.log("Save response:", responseText);
      
      // Đóng toast đang lưu và hiển thị thông báo lưu thành công
      toast.dismiss("saving-toast");
      toast.success("Bài viết đã được lưu thành công! 💾", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      
      // Update exercise status if needed
      if (exercise.status === 'Not Started') {
        setExercise({
          ...exercise,
          status: 'In Progress'
        });
      }
      
      // Cập nhật lại thời gian lưu tự động
      setLastSaved(content);
      
    } catch (error) {
      console.error("Error saving writing:", error);
      toast.dismiss("saving-toast");
      toast.error("Đã xảy ra lỗi khi lưu bài viết.");
    } finally {
      setSaving(false);
    }
  };
  
  // Handle API key form success
  const handleApiKeySuccess = () => {
    setShowApiKeyForm(false);
    toast.success('API key đã được lưu thành công!');
    
    // Đảm bảo API key được lưu vào localStorage với cả hai khóa
    const apiKey = localStorage.getItem('gemini_api_key');
    if (apiKey) {
      localStorage.setItem('api_key', apiKey);
    }
    
    // Continue with AI feedback submission
    submitForAiFeedback();
  };
  
  // Skip API key for now
  const handleSkipApiKey = () => {
    setShowApiKeyForm(false);
    toast.info('Bạn có thể thêm API key sau trong phần cài đặt. Tính năng phản hồi AI sẽ không hoạt động nếu không có API key.');
  };
  
  // Hàm đếm từ hỗ trợ đa ngôn ngữ
  const countWords = (text) => {
    if (!text || !text.trim()) return 0;
    
    // Nhận dạng ngôn ngữ dựa trên mã ngôn ngữ của bài tập
    const language = exercise?.learningLanguage || 'ENG';
    
    // Log để debug
    console.log("Counting words for language:", language);
    console.log("Text length:", text.length);
    console.log("Text sample:", text.substring(0, 50));
    
    // Đếm từ theo từng ngôn ngữ
    switch (language) {
      case 'CN': 
      case 'CHN': // Tiếng Trung - hỗ trợ cả hai mã
        // Đếm số ký tự sau khi loại bỏ dấu cách và dấu câu đơn giản
        // Không sử dụng Unicode property để đảm bảo tương thích
        const cleanChineseText = text.replace(/[\s.,!?;:'"()[\]{}，。！？；：""''（）【】「」]/g, '');
        console.log("Chinese text after cleanup:", cleanChineseText.length, "chars");
        return cleanChineseText.length;
        
      case 'JPN': // Tiếng Nhật
        // Tương tự như tiếng Trung
        const cleanJapaneseText = text.replace(/[\s.,!?;:'"()[\]{}，。！？；：""''（）【】「」]/g, '');
        console.log("Japanese text after cleanup:", cleanJapaneseText.length, "chars");
        return cleanJapaneseText.length;
        
      case 'KOR': // Tiếng Hàn
        // Tương tự như tiếng Trung
        const cleanKoreanText = text.replace(/[\s.,!?;:'"()[\]{}，。！？；：""''（）【】「」]/g, '');
        console.log("Korean text after cleanup:", cleanKoreanText.length, "chars");
        return cleanKoreanText.length;
        
      default: // Tiếng Anh, Việt, Pháp, Đức, Tây Ban Nha và các ngôn ngữ khác dùng khoảng trắng
        const words = text.split(/\s+/).filter(word => word.length > 0);
        console.log("Words count for Latin script:", words.length);
        return words.length;
    }
  };
  
  // Count words - phải đặt trước các hàm sử dụng nó
  const wordCount = countWords(content);
  
  // Sửa các giá trị tối thiểu cho các ngôn ngữ khác nhau
  const getMinimumWordCount = () => {
    if (!exercise) return 50;
    
    const language = exercise.learningLanguage;
    switch (language) {
      case 'CN':
      case 'CHN': // Tiếng Trung - mỗi ký tự là một từ
        return 15;
      case 'JPN': // Tiếng Nhật
        return 15;
      case 'KOR': // Tiếng Hàn
        return 15;
      default: // Các ngôn ngữ khác
        return 50;
    }
  };
  
  // Kiểm tra xem bài viết có đủ từ không
  const hasEnoughWords = () => {
    if (!exercise) return false;
    
    // Với tiếng Trung, Nhật, Hàn không cần kiểm tra số từ tối thiểu
    const language = exercise.learningLanguage;
    if (language === 'CN' || language === 'CHN' || language === 'JPN' || language === 'KOR') {
      return true;  // Luôn trả về true - không yêu cầu số từ tối thiểu
    }
    
    // Các ngôn ngữ khác vẫn kiểm tra số từ tối thiểu
    return wordCount >= getMinimumWordCount();
  };
  
  // Hàm kiểm tra xem có nên hiển thị cảnh báo về số từ tối thiểu hay không
  const shouldShowWordCountWarning = () => {
    if (!exercise) return false;
    
    // Với tiếng Trung, Nhật, Hàn không cần hiển thị cảnh báo
    const language = exercise.learningLanguage;
    if (language === 'CN' || language === 'CHN' || language === 'JPN' || language === 'KOR') {
      return false;
    }
    
    // Các ngôn ngữ khác hiển thị cảnh báo nếu không đủ từ
    return wordCount < getMinimumWordCount() && content.trim() !== '';
  };
  
  // Thay đổi cách gọi để đảm bảo cập nhật đúng số từ khi thay đổi nội dung
  useEffect(() => {
    if (exercise) {
      // Log số từ khi nội dung thay đổi để debug
      const counted = countWords(content);
      console.log(`Đã đếm được ${counted} từ cho ngôn ngữ ${exercise.learningLanguage}`);
    }
  }, [content, exercise]);
  
  // Submit for AI feedback
  const handleSubmitForAiFeedback = async () => {
    if (!content.trim()) {
      toast.warning("Nội dung không được để trống");
      return;
    }
    
    try {
      // Chỉ kiểm tra số từ cho các ngôn ngữ không phải Trung, Nhật, Hàn
      if (exercise.learningLanguage !== 'CN' && 
          exercise.learningLanguage !== 'CHN' && 
          exercise.learningLanguage !== 'JPN' && 
          exercise.learningLanguage !== 'KOR') {
          
        const currentWordCount = countWords(content);
        const minimumWords = getMinimumWordCount();
        
        if (currentWordCount < minimumWords) {
          toast.warning(`Bài viết cần có ít nhất ${minimumWords} từ để có thể nhận phản hồi từ AI.`);
          return;
        }
      }
      
      // Kiểm tra API key trong localStorage trước
      const localApiKey = localStorage.getItem('gemini_api_key');
      const timestamp = localStorage.getItem('gemini_api_key_timestamp');
      
      if (localApiKey && timestamp) {
        // Kiểm tra xem API key có còn hiệu lực không (2 giờ)
        const now = Date.now();
        const saved = parseInt(timestamp, 10);
        const twoHoursMs = 2 * 60 * 60 * 1000;
        
        if (now - saved <= twoHoursMs) {
          console.log('Sử dụng API key từ localStorage');
          // Thêm API key vào local storage để đảm bảo server có thể đọc
          localStorage.setItem('api_key', localApiKey);
          submitForAiFeedback();
          return;
        } else {
          // API key đã hết hạn, xóa khỏi localStorage
          console.log('API key trong localStorage đã hết hạn');
          localStorage.removeItem('gemini_api_key');
          localStorage.removeItem('gemini_api_key_timestamp');
          localStorage.removeItem('api_key');
        }
      }
      
      // Check if API key is set from server
      try {
        const key = await getUserApiKey();
        if (!key) {
          setShowApiKeyForm(true);
          toast.warn('Tính năng phản hồi AI yêu cầu API key');
          return;
        }
        
        // If we have an API key, proceed with submission
        submitForAiFeedback();
        
      } catch (error) {
        console.error('Error checking API key:', error);
        // Show API key form in case of error
        setShowApiKeyForm(true);
      }
      
    } catch (error) {
      console.error("Error submitting for AI feedback:", error);
      toast.error("Đã xảy ra lỗi khi chuẩn bị bài viết.");
    }
  };
  
  // Actual submission for AI feedback
  const submitForAiFeedback = async () => {
    try {
      setSubmitting(true);
      setAiLoading(true);
      
      const baseUrl = API_BASE_URL;
      const API_URL = baseUrl.endsWith('/api') ? baseUrl.slice(0, -4) : baseUrl;
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        toast.error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
        setSubmitting(false);
        setAiLoading(false);
        return;
      }
      
      toast.info("🤖 Đang phân tích bài viết của bạn...", {
        autoClose: false,
        toastId: "ai-analyzing"
      });

      console.log("Sending content to API:", content);
      
      // Call the AI feedback API
      const response = await fetch(`${API_URL}/api/WritingExercise/WriteAndGetFeedback/${exerciseId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({
          // Gửi nội dung dạng text thuần túy, không định dạng EditorJS
          content: content
        })
      });
      
      // Đóng toast thông báo đang phân tích
      toast.dismiss("ai-analyzing");
      
      if (!response.ok) {
        if (response.status === 400) {
          toast.error("Nội dung bài viết không hợp lệ. Vui lòng kiểm tra lại.");
        } else if (response.status === 404) {
          toast.error("Không tìm thấy bài tập viết.");
        } else if (response.status === 500) {
          // Thử đọc thông tin lỗi chi tiết từ phản hồi
          try {
            const errorData = await response.text();
            console.error("Server error details:", errorData);
            
            if (errorData.includes("API key not found") || errorData.includes("API key is invalid")) {
              toast.error("API key Gemini không tồn tại hoặc không hợp lệ. Vui lòng thêm API key hợp lệ.");
              setShowApiKeyForm(true);
            } else if (errorData.includes("Bad Request") || errorData.includes("rate limit")) {
              toast.error("Yêu cầu không hợp lệ hoặc đã vượt quá giới hạn tần suất Gemini API. Vui lòng thử lại sau vài phút.");
            } else {
              toast.error("Đã xảy ra lỗi ở máy chủ khi phân tích bài viết. Vui lòng thử lại sau.");
            }
          } catch (parseError) {
            toast.error("Đã xảy ra lỗi ở máy chủ khi phân tích bài viết. API key có thể không hợp lệ hoặc đã hết hạn.");
          }
        } else {
          toast.error(`Đã xảy ra lỗi: ${response.status}`);
        }
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      
      // Get feedback text from response
      const feedbackContent = await response.text();
      console.log("Received feedback:", feedbackContent.substring(0, 100) + "...");
      
      // Lưu phản hồi và hiển thị
      setAiFeedback(feedbackContent);
      setShowAiFeedback(true);
      
      // Lưu nội dung và cập nhật trạng thái bài tập
      // Format content as EditorJS JSON for saving
      const formattedContent = JSON.stringify({
        time: new Date().getTime(),
        blocks: content.split('\n\n').filter(p => p.trim()).map(p => ({
          type: 'paragraph',
          data: { text: p }
        }))
      });
      
      const saveResponse = await fetch(`${API_URL}/api/WritingExercise/UpdateContent/${exerciseId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({
          content: formattedContent,
          status: 'Completed',
          feedback: feedbackContent
        })
      });
      
      if (!saveResponse.ok) {
        console.error("Error saving feedback:", saveResponse.status);
        // Không hiển thị lỗi này cho người dùng vì phản hồi AI đã được hiển thị
      }
      
      // Cập nhật exercise trong state
      setExercise({
        ...exercise,
        status: 'Completed',
        feedback: feedbackContent
      });
      
      toast.success("Đã nhận phản hồi từ AI cho bài viết của bạn!");
      
    } catch (error) {
      console.error("Error submitting for AI feedback:", error);
      toast.error("Đã xảy ra lỗi khi gửi bài viết để nhận phản hồi AI.");
    } finally {
      setSubmitting(false);
      setAiLoading(false);
    }
  };
  
  // Cải thiện render Markdown
  const renderMarkdown = (markdown) => {
    if (!markdown) return '';
    
    return markdown
      .replace(/\n/g, '<br/>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/## (.*?)(?:<br\/>|$)/g, '<h2>$1</h2>')
      .replace(/# (.*?)(?:<br\/>|$)/g, '<h1>$1</h1>')
      .replace(/- (.*?)(?:<br\/>|$)/g, '<li>$1</li>')
      .replace(/<li>(.*?)<\/li>(?:<br\/>)*/g, '<li>$1</li>')
      .replace(/(?:<li>.*?<\/li>)+/g, '<ul>$&</ul>')
      .replace(/✅ (.*?)(?:<br\/>|$)/g, '<div class="feedback-item success"><i class="fas fa-check-circle text-success me-2"></i>$1</div>')
      .replace(/🌟 (.*?)(?:<br\/>|$)/g, '<div class="feedback-item highlight"><i class="fas fa-star text-warning me-2"></i>$1</div>')
      .replace(/🔧 (.*?)(?:<br\/>|$)/g, '<div class="feedback-item improvement"><i class="fas fa-tools text-primary me-2"></i>$1</div>');
  };
  
  // Tooltip giải thích cách đếm từ
  const getWordCountTooltip = () => {
    if (!exercise) return '';
    
    const language = exercise.learningLanguage;
    switch (language) {
      case 'CN':
      case 'CHN':
        return 'Đối với tiếng Trung, mỗi ký tự Hán tự được tính là một từ';
      case 'JPN':
        return 'Đối với tiếng Nhật, mỗi ký tự Kanji/Hiragana/Katakana được tính là một từ';
      case 'KOR':
        return 'Đối với tiếng Hàn, mỗi ký tự Hangul được tính là một từ';
      default:
        return 'Số từ được tính dựa trên khoảng trắng giữa các từ';
    }
  };
  
  // Định nghĩa CSS cho hiệu ứng nhấp nháy trong JSX
  const highlightStyle = `
    @keyframes highlightFeedback {
      0% { box-shadow: 0 0 10px rgba(0, 123, 255, 0.3); }
      50% { box-shadow: 0 0 20px rgba(0, 123, 255, 0.7); }
      100% { box-shadow: 0 0 10px rgba(0, 123, 255, 0.3); }
    }
    
    .highlight-feedback {
      animation: highlightFeedback 1s ease-in-out infinite;
      border: 1px solid rgba(0, 123, 255, 0.5) !important;
    }
  `;
  
  // Định nghĩa CSS cho modal xác nhận xóa
  const deleteModalStyles = `
    .delete-confirm-modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    
    .delete-confirm-content {
      background: white;
      border-radius: 8px;
      width: 400px;
      max-width: 90%;
      padding: 20px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    }
    
    .delete-confirm-title {
      color: #dc3545;
      margin-bottom: 15px;
      font-weight: bold;
    }
    
    .delete-confirm-buttons {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 20px;
    }
  `;
  
  // Định nghĩa hàm xử lý việc xóa bài tập viết
  const handleDelete = async () => {
    setDeleting(true);
    
    try {
      const baseUrl = API_BASE_URL;
      const API_URL = baseUrl.endsWith('/api') ? baseUrl.slice(0, -4) : baseUrl;
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        toast.error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
        setDeleting(false);
        return;
      }
      
      // Hiển thị toast trước khi gọi API để đảm bảo người dùng thấy ngay
      toast.info("Đang xóa bài tập viết...", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        toastId: "deleting-toast"
      });
      
      console.log("Deleting writing exercise:", exerciseId);
      
      // Gọi API xóa bài tập viết
      const response = await fetch(`${API_URL}/api/WritingExercise/Delete/${exerciseId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true'
        }
      });
      
      toast.dismiss("deleting-toast");
      
      if (!response.ok) {
        if (response.status === 401) {
          toast.error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
        } else if (response.status === 400 || response.status === 404) {
          toast.error('Không tìm thấy bài tập viết hoặc bạn không có quyền xóa nó.');
        } else {
          throw new Error(`Network response was not ok: ${response.status}`);
        }
        return;
      }
      
      // Đọc phản hồi
      const responseText = await response.text();
      console.log("Delete response:", responseText);
      
      // Hiển thị thông báo xóa thành công
      toast.success("Bài tập viết đã được xóa thành công!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      
      // Chuyển hướng người dùng về trang danh sách bài tập viết
      setTimeout(() => {
        navigate('/writing');
      }, 1000);
      
    } catch (error) {
      console.error("Error deleting writing exercise:", error);
      toast.error("Đã xảy ra lỗi khi xóa bài tập viết.");
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };
  
  // Các ngôn ngữ hỗ trợ để hiển thị trong form
  const supportedLanguages = [
    { code: 'ENG', name: 'English' },
    { code: 'VIE', name: 'Vietnamese' },
    { code: 'KOR', name: 'Korean' },
    { code: 'JPN', name: 'Japanese' },
    { code: 'CN', name: 'Chinese' },
    { code: 'CHN', name: 'Chinese' },
    { code: 'FRA', name: 'French' },
    { code: 'GER', name: 'German' },
    { code: 'SPA', name: 'Spanish' }
  ];
  
  // Xử lý hiển thị form chỉnh sửa
  const handleShowEditForm = () => {
    // Khởi tạo form data với dữ liệu hiện tại của bài tập
    setEditFormData({
      topic: exercise.topic || '',
      learningLanguage: exercise.learningLanguage || 'ENG',
      nativeLanguage: exercise.nativeLanguage || 'VIE'
    });
    setShowEditForm(true);
  };
  
  // Xử lý thay đổi trong các trường form
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Xử lý gửi form cập nhật thông tin
  const handleUpdateExercise = async (e) => {
    e.preventDefault();
    setEditing(true);
    
    try {
      const baseUrl = API_BASE_URL;
      const API_URL = baseUrl.endsWith('/api') ? baseUrl.slice(0, -4) : baseUrl;
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        toast.error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
        setEditing(false);
        return;
      }
      
      // Kiểm tra dữ liệu trước khi gửi
      if (!editFormData.topic || !editFormData.topic.trim()) {
        toast.error('Chủ đề không được để trống');
        setEditing(false);
        return;
      }
      
      if (!editFormData.learningLanguage) {
        toast.error('Vui lòng chọn ngôn ngữ học');
        setEditing(false);
        return;
      }
      
      if (!editFormData.nativeLanguage) {
        toast.error('Vui lòng chọn ngôn ngữ mẹ đẻ');
        setEditing(false);
        return;
      }
      
      // Hiển thị toast trước khi gọi API
      toast.info("Đang cập nhật thông tin bài tập...", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        toastId: "updating-toast"
      });
      
      console.log("Updating writing exercise:", exerciseId, editFormData);
      
      // Gọi API cập nhật thông tin bài tập
      const response = await fetch(`${API_URL}/api/WritingExercise/Update/${exerciseId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({
          topic: editFormData.topic,
          learningLanguage: editFormData.learningLanguage,
          nativeLanguage: editFormData.nativeLanguage
        })
      });
      
      toast.dismiss("updating-toast");
      
      if (!response.ok) {
        if (response.status === 401) {
          toast.error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
        } else if (response.status === 400) {
          toast.error('Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.');
        } else if (response.status === 404) {
          toast.error('Không tìm thấy bài tập viết.');
        } else if (response.status === 403) {
          toast.error('Bạn không có quyền chỉnh sửa bài tập này.');
        } else {
          throw new Error(`Network response was not ok: ${response.status}`);
        }
        return;
      }
      
      // Hiển thị thông báo cập nhật thành công
      toast.success("Thông tin bài tập viết đã được cập nhật thành công!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      
      // Cập nhật state exercise với thông tin mới
      setExercise({
        ...exercise,
        topic: editFormData.topic,
        learningLanguage: editFormData.learningLanguage,
        nativeLanguage: editFormData.nativeLanguage
      });
      
      // Đóng form
      setShowEditForm(false);
      
    } catch (error) {
      console.error("Error updating writing exercise:", error);
      toast.error("Đã xảy ra lỗi khi cập nhật thông tin bài tập viết.");
    } finally {
      setEditing(false);
    }
  };
  
  // CSS cho modal chỉnh sửa
  const editModalStyles = `
    .edit-form-modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    
    .edit-form-content {
      background: white;
      border-radius: 8px;
      width: 500px;
      max-width: 90%;
      padding: 20px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    }
    
    .edit-form-title {
      color: #007bff;
      margin-bottom: 15px;
      font-weight: bold;
    }
    
    .edit-form-body {
      margin-bottom: 20px;
    }
    
    .edit-form-buttons {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 20px;
    }
    
    .form-group {
      margin-bottom: 15px;
    }
    
    .form-label {
      font-weight: 600;
      margin-bottom: 5px;
      display: block;
    }
  `;
  
  if (loading) {
    return (
      <div className="main-content">
        <div className="container my-5 text-center">
          <Spinner />
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="main-content">
        <div className="container my-5">
          <div className="alert alert-danger">{error}</div>
          <Link to="/writing" className="btn btn-primary">
            <i className="fas fa-arrow-left me-2"></i>
            Quay lại danh sách bài tập
          </Link>
        </div>
      </div>
    );
  }
  
  if (!exercise) {
    return (
      <div className="main-content">
        <div className="container my-5">
          <div className="alert alert-warning">Không tìm thấy bài tập viết.</div>
          <Link to="/writing" className="btn btn-primary">
            <i className="fas fa-arrow-left me-2"></i>Quay lại danh sách bài tập
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="main-content">
      {/* Thêm style cho hiệu ứng nhấp nháy và modal xóa */}
      <style>{highlightStyle}</style>
      <style>{deleteModalStyles}</style>
      <style>{editModalStyles}</style>
      
      <div className="writing-exercise-detail-container container my-5">
        <div className="page-header d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center">
            <Link to="/writing" className="btn btn-outline-secondary me-3">
              <i className="fas fa-arrow-left"></i>
            </Link>
            <div>
              <h2 className="page-title mb-0">Chi tiết bài tập viết</h2>
            </div>
          </div>
          <div className="d-flex align-items-center">
            <div className="language-badge me-3">
              <img 
                src={getLanguageFlag(exercise.learningLanguage)} 
                alt={getLanguageName(exercise.learningLanguage)} 
                width="16" 
                height="16"
              />
              {getLanguageName(exercise.learningLanguage)}
            </div>
            <button 
              className="btn btn-outline-primary btn-sm me-2"
              onClick={handleShowEditForm}
            >
              <i className="fas fa-edit me-1"></i> Sửa
            </button>
            <button 
              className="btn btn-outline-danger btn-sm"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <i className="fas fa-trash-alt me-1"></i> Xóa
            </button>
          </div>
        </div>
        
        <div className="card exercise-info-card mb-4">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="card-title mb-0">Thông tin bài tập</h5>
            {getStatusBadge(exercise.status)}
          </div>
          <div className="card-body">
            <div className="exercise-topic">
              <h4>Chủ đề:</h4>
              <p className="topic-content">{exercise.topic}</p>
            </div>
            
            <div className="exercise-metadata mt-3">
              <div className="metadata-item">
                <i className="far fa-calendar-alt me-2"></i>
                <strong>Ngày tạo:</strong> {formatDate(exercise.createAt)}
              </div>
              <div className="metadata-item">
                <i className="fas fa-language me-2"></i>
                <strong>Ngôn ngữ viết:</strong> {getLanguageName(exercise.learningLanguage)}
              </div>
              <div className="metadata-item">
                <i className="fas fa-globe me-2"></i>
                <strong>Ngôn ngữ mẹ đẻ:</strong> {getLanguageName(exercise.nativeLanguage)}
              </div>
            </div>
          </div>
        </div>
        
        <div className="card writing-card mb-4">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="card-title mb-0">Nội dung bài viết</h5>
            <div className="word-count">
              <i className="fas fa-font me-1"></i>
              <span title={getWordCountTooltip()}>{wordCount} từ</span>
            </div>
          </div>
          <div className="card-body">
            <textarea
              className="form-control writing-textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Bắt đầu viết bài của bạn tại đây..."
              rows={10}
            ></textarea>
            
            {shouldShowWordCountWarning() && (
              <div className="alert alert-warning mt-2">
                <i className="fas fa-exclamation-circle me-2"></i>
                Bài viết cần có ít nhất {getMinimumWordCount()} từ để nhận phản hồi AI. Hiện tại: {wordCount} từ.
              </div>
            )}
            
            <div className="actions mt-3 d-flex justify-content-between gap-2">
              <div className="autosave-status small text-muted">
                {autoSaving ? (
                  <span><i className="fas fa-sync fa-spin me-1"></i> Đang tự động lưu...</span>
                ) : lastSaved ? (
                  <span><i className="fas fa-check-circle me-1 text-success"></i> Đã lưu tự động lúc {new Date().toLocaleTimeString()}</span>
                ) : null}
              </div>
              
              <div>
                <button 
                  className="btn btn-outline-primary me-2"
                  onClick={handleSave}
                  disabled={saving || autoSaving}
                >
                  {saving ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save me-2"></i>
                      Lưu bài viết
                    </>
                  )}
                </button>
                
                <button 
                  className="btn btn-primary"
                  onClick={handleSubmitForAiFeedback}
                  disabled={submitting || exercise.status === 'Completed' || !hasEnoughWords()}
                  title={!hasEnoughWords() && exercise.learningLanguage !== 'CN' && exercise.learningLanguage !== 'CHN' && exercise.learningLanguage !== 'JPN' && exercise.learningLanguage !== 'KOR' ? 
                    `Bài viết cần có ít nhất ${getMinimumWordCount()} từ để nhận phản hồi AI` : 
                    ""}
                >
                  {submitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Đang gửi...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-robot me-2"></i>
                      {exercise.status === 'Completed' ? 'Đã nộp bài' : 'Nộp bài & Nhận phản hồi AI'}
                    </>
                  )}
                </button>
              </div>
            </div>
            
            {!showAiFeedback && exercise.status !== 'Completed' && (
              <div className="mt-3 small text-muted">
                <i className="fas fa-info-circle me-2"></i>
                <strong>Lưu ý:</strong> Khi bạn nộp bài, hệ thống sẽ sử dụng AI để phân tích và đưa ra phản hồi chi tiết về bài viết của bạn. 
                Bạn cần có API key Gemini hợp lệ để sử dụng tính năng này.
              </div>
            )}
          </div>
        </div>
        
        {/* AI Feedback Display - chỉ hiển thị khi có feedback */}
        {showAiFeedback && aiFeedback && aiFeedback.trim() !== '' && (
          <div className="card ai-feedback-card mb-4">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">
                <i className="fas fa-robot me-2"></i>
                Phản hồi từ AI
              </h5>
              {aiLoading && (
                <div className="spinner-border spinner-border-sm text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              )}
            </div>
            <div className="card-body">
              <div className="feedback-content markdown-content">
                <div 
                  dangerouslySetInnerHTML={{ 
                    __html: renderMarkdown(aiFeedback)
                  }} 
                />
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Thêm modal xác nhận xóa */}
      {showDeleteConfirm && (
        <div className="delete-confirm-modal">
          <div className="delete-confirm-content">
            <h4 className="delete-confirm-title">
              <i className="fas fa-exclamation-triangle me-2"></i>
              Xác nhận xóa
            </h4>
            <p>Bạn có chắc chắn muốn xóa bài tập viết này? Hành động này không thể hoàn tác.</p>
            <div className="delete-confirm-buttons">
              <button 
                className="btn btn-outline-secondary" 
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
              >
                Hủy
              </button>
              <button 
                className="btn btn-danger"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Đang xóa...
                  </>
                ) : (
                  'Xóa bài tập'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* API Key form modal */}
      {showApiKeyForm && (
        <div className="modal-overlay">
          <div className="gemini-api-form">
            <ApiKeyForm onSuccess={handleApiKeySuccess} onSkip={handleSkipApiKey} />
          </div>
        </div>
      )}
      
      {/* Thêm modal chỉnh sửa thông tin bài tập */}
      {showEditForm && (
        <div className="edit-form-modal">
          <div className="edit-form-content">
            <h4 className="edit-form-title">
              <i className="fas fa-edit me-2"></i>
              Chỉnh sửa thông tin bài tập
            </h4>
            
            <form onSubmit={handleUpdateExercise}>
              <div className="edit-form-body">
                <div className="form-group">
                  <label htmlFor="topic" className="form-label">Chủ đề</label>
                  <textarea
                    id="topic"
                    name="topic"
                    className="form-control"
                    rows={3}
                    value={editFormData.topic}
                    onChange={handleEditFormChange}
                    required
                  ></textarea>
                </div>
                
                <div className="form-group">
                  <label htmlFor="learningLanguage" className="form-label">Ngôn ngữ học</label>
                  <select
                    id="learningLanguage"
                    name="learningLanguage"
                    className="form-select"
                    value={editFormData.learningLanguage}
                    onChange={handleEditFormChange}
                    required
                  >
                    {supportedLanguages.map(lang => (
                      <option key={`learning-${lang.code}`} value={lang.code}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="nativeLanguage" className="form-label">Ngôn ngữ mẹ đẻ</label>
                  <select
                    id="nativeLanguage"
                    name="nativeLanguage"
                    className="form-select"
                    value={editFormData.nativeLanguage}
                    onChange={handleEditFormChange}
                    required
                  >
                    {supportedLanguages.map(lang => (
                      <option key={`native-${lang.code}`} value={lang.code}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="edit-form-buttons">
                <button 
                  type="button"
                  className="btn btn-outline-secondary" 
                  onClick={() => setShowEditForm(false)}
                  disabled={editing}
                >
                  Hủy
                </button>
                <button 
                  type="submit"
                  className="btn btn-primary"
                  disabled={editing}
                >
                  {editing ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Đang cập nhật...
                    </>
                  ) : (
                    'Lưu thay đổi'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Thêm ToastContainer để đảm bảo toast hiển thị */}
      <ToastContainer />
    </div>
  );
};

export default WritingExerciseDetailPageSimple; 