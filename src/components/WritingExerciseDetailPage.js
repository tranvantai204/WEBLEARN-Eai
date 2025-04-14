import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useWritingExercise } from '../contexts/WritingExerciseContext';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import Spinner from './common/Spinner';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Paragraph from '@editorjs/paragraph';
import ApiKeyForm from './ApiKeyForm';
import '../css/components/WritingExercises.css';

const WritingExerciseDetailPage = () => {
  const { exerciseId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, currentUser } = useAuth();
  const { getWritingExerciseById } = useWritingExercise();
  
  const [exercise, setExercise] = useState(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiFeedback, setAiFeedback] = useState(null);
  const [showAiFeedback, setShowAiFeedback] = useState(false);
  const [showApiKeyForm, setShowApiKeyForm] = useState(false);
  const editorInstance = useRef(null);
  
  // Language mappings
  const languages = {
    'ENG': 'English',
    'VIE': 'Vietnamese',
    'KOR': 'Korean',
    'JPN': 'Japanese',
    'CHN': 'Chinese',
    'FRA': 'French',
    'GER': 'German',
    'SPA': 'Spanish'
  };
  
  useEffect(() => {
    const loadExercise = async () => {
      if (!isAuthenticated || !exerciseId) return;
      
      try {
        setLoading(true);
        const result = await getWritingExerciseById(exerciseId);
        
        if (result) {
          setExercise(result);
          setContent(result.content || '');
          
          // Không gọi initializeEditor ở đây, sẽ gọi trong useEffect khác
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
    
    return () => {
      if (editorInstance.current) {
        editorInstance.current.destroy();
        editorInstance.current = null;
      }
    };
  }, [exerciseId, isAuthenticated, getWritingExerciseById]);
  
  // Tách riêng effect khởi tạo editor để đảm bảo DOM đã render
  useEffect(() => {
    if (exercise && !loading) {
      console.log("Attempting to initialize editor for exercise:", exercise.writingExerciseId);
      console.log("Editor container exists:", !!document.getElementById('editorjs'));
      
      // Khởi tạo editor sau khi exercise đã load và component đã render
      setTimeout(() => {
        initializeEditor(exercise.content || '');
      }, 200);
    }
  }, [exercise, loading]);
  
  const initializeEditor = (initialContent) => {
    console.log("Initializing editor with content:", initialContent ? "content exists" : "no content");
    
    try {
      if (editorInstance.current) {
        console.log("Destroying existing editor instance");
        editorInstance.current.destroy();
        editorInstance.current = null;
      }
      
      // Đảm bảo rằng DOM đã được render
      const editorElement = document.getElementById('editorjs');
      if (!editorElement) {
        console.error('Editor container with id "editorjs" not found in DOM');
        toast.error("Không thể khởi tạo trình soạn thảo. Vui lòng tải lại trang.");
        return;
      }
      
      console.log("Editor container found, creating EditorJS instance");
      
      // Tạo cấu trúc dữ liệu mặc định nếu không có nội dung
      const defaultData = {
        time: new Date().getTime(),
        blocks: []
      };
      
      // Nếu có nội dung và là chuỗi, thử phân tích thành JSON
      let contentData = defaultData;
      if (initialContent && typeof initialContent === 'string') {
        try {
          const parsed = JSON.parse(initialContent);
          if (parsed && typeof parsed === 'object') {
            contentData = parsed;
          }
        } catch (e) {
          console.log("Could not parse content as JSON, using default structure");
          contentData = {
            time: new Date().getTime(),
            blocks: [
              {
                type: "paragraph",
                data: {
                  text: initialContent
                }
              }
            ]
          };
        }
      }
      
      console.log("Creating EditorJS with prepared content");
      
      // Sử dụng cấu hình đơn giản nhất có thể
      const editor = new EditorJS({
        holder: 'editorjs',
        data: contentData,
        placeholder: 'Bắt đầu viết bài của bạn tại đây...'
      });
      
      editorInstance.current = editor;
      console.log("EditorJS instance created and assigned to ref");
      
    } catch (error) {
      console.error("Error initializing editor:", error);
      toast.error("Có lỗi xảy ra khi khởi tạo trình soạn thảo.");
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Not Started':
        return <div className="badge badge-not-started"><i className="fas fa-hourglass-start me-1"></i>Chưa bắt đầu</div>;
      case 'In Progress':
        return <div className="badge badge-in-progress"><i className="fas fa-spinner me-1"></i>Đang thực hiện</div>;
      case 'Completed':
        return <div className="badge badge-completed"><i className="fas fa-check-circle me-1"></i>Hoàn thành</div>;
      default:
        return <div className="badge badge-secondary">{status}</div>;
    }
  };
  
  const handleSave = async () => {
    if (!editorInstance.current) {
      toast.error("Không thể lưu vì trình soạn thảo chưa được khởi tạo.");
      return;
    }
    
    try {
      setSaving(true);
      const savedData = await editorInstance.current.save();
      
      // Get plain text version for word count
      const plainText = savedData.blocks
        .map(block => {
          if (block.type === 'paragraph' || block.type === 'header') {
            return block.data.text;
          }
          return '';
        })
        .join(' ');
        
      const wordCount = plainText.split(/\s+/).filter(word => word.length > 0).length;
      
      if (wordCount < 10) {
        toast.warning("Bài viết cần có ít nhất 10 từ để có thể lưu.");
        setSaving(false);
        return;
      }
      
      const baseUrl = process.env.REACT_APP_API_URL || 'https://6d2c-115-76-51-131.ngrok-free.app';
      const API_URL = baseUrl.endsWith('/api') ? baseUrl.slice(0, -4) : baseUrl;
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        toast.error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
        setSaving(false);
        return;
      }
      
      const contentString = JSON.stringify(savedData);
      
      const response = await fetch(`${API_URL}/api/WritingExercise/UpdateContent/${exerciseId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({
          content: contentString
        })
      });
      
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      
      const data = await response.json();
      toast.success("Bài viết đã được lưu thành công!");
      
      // Update exercise status if needed
      if (exercise.status === 'Not Started') {
        setExercise({
          ...exercise,
          status: 'In Progress',
          content: contentString
        });
      } else {
        setExercise({
          ...exercise,
          content: contentString
        });
      }
      
    } catch (error) {
      console.error("Error saving writing:", error);
      toast.error("Đã xảy ra lỗi khi lưu bài viết.");
    } finally {
      setSaving(false);
    }
  };
  
  // Handle API key form success
  const handleApiKeySuccess = () => {
    setShowApiKeyForm(false);
    toast.success('API key đã được lưu thành công!');
    
    // Continue with AI feedback submission
    submitForAiFeedback();
  };
  
  // Skip API key for now
  const handleSkipApiKey = () => {
    setShowApiKeyForm(false);
    toast.info('Bạn có thể thêm API key sau trong phần cài đặt. Tính năng phản hồi AI sẽ không hoạt động nếu không có API key.');
  };
  
  // Submit for AI feedback
  const handleSubmitForAiFeedback = async () => {
    if (!editorInstance.current) {
      toast.error("Không thể gửi bài vì trình soạn thảo chưa được khởi tạo.");
      return;
    }
    
    try {
      const savedData = await editorInstance.current.save();
      
      // Get plain text version for word count
      const plainText = savedData.blocks
        .map(block => {
          if (block.type === 'paragraph' || block.type === 'header') {
            return block.data.text;
          }
          return '';
        })
        .join(' ');
        
      const wordCount = plainText.split(/\s+/).filter(word => word.length > 0).length;
      
      if (wordCount < 50) {
        toast.warning("Bài viết cần có ít nhất 50 từ để có thể nhận phản hồi từ AI.");
        return;
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
          // Bỏ qua hiển thị form API key
          submitForAiFeedback();
          return;
        } else {
          // API key đã hết hạn, xóa khỏi localStorage
          console.log('API key trong localStorage đã hết hạn');
          localStorage.removeItem('gemini_api_key');
          localStorage.removeItem('gemini_api_key_timestamp');
        }
      }
      
      // Check if API key is set from server
      try {
        const baseUrl = process.env.REACT_APP_API_URL || 'https://6d2c-115-76-51-131.ngrok-free.app';
        const API_URL = baseUrl.endsWith('/api') ? baseUrl.slice(0, -4) : baseUrl;
        const token = localStorage.getItem('accessToken');
        
        if (!token) {
          toast.error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
          return;
        }
        
        const keyCheckResponse = await fetch(`${API_URL}/api/Auth/check-key`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
          }
        });
        
        if (!keyCheckResponse.ok) {
          // Nếu không tìm thấy API key trên server, hiển thị form nhập API key
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
    if (!editorInstance.current) {
      toast.error("Không thể gửi bài vì trình soạn thảo chưa được khởi tạo.");
      return;
    }
    
    try {
      setSubmitting(true);
      setAiLoading(true);
      
      const savedData = await editorInstance.current.save();
      
      // Get plain text for submission
      const plainText = savedData.blocks
        .map(block => {
          if (block.type === 'paragraph' || block.type === 'header') {
            return block.data.text;
          }
          return '';
        })
        .join('\n\n');
      
      const baseUrl = process.env.REACT_APP_API_URL || 'https://6d2c-115-76-51-131.ngrok-free.app';
      const API_URL = baseUrl.endsWith('/api') ? baseUrl.slice(0, -4) : baseUrl;
      const token = localStorage.getItem('accessToken');
      
      toast.info("🤖 Đang phân tích bài viết của bạn...", {
        autoClose: false,
        toastId: "ai-analyzing"
      });
      
      const response = await fetch(`${API_URL}/api/WritingExercise/WriteAndGetFeedback/${exerciseId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({
          content: plainText
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
          toast.error("Đã xảy ra lỗi ở máy chủ khi phân tích bài viết. API key có thể không hợp lệ hoặc đã hết hạn.");
        } else {
          toast.error(`Đã xảy ra lỗi: ${response.status}`);
        }
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      
      const feedbackContent = await response.text();
      
      // Lưu phản hồi và hiển thị
      setAiFeedback(feedbackContent);
      setShowAiFeedback(true);
      
      // Lưu nội dung và cập nhật trạng thái bài tập
      // Cũng lưu phản hồi AI vào localStorage để hiển thị lại khi tải lại trang
      const contentString = JSON.stringify(savedData);
      
      const saveResponse = await fetch(`${API_URL}/api/WritingExercise/UpdateContent/${exerciseId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({
          content: contentString,
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
        content: contentString,
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
  
  // Hiển thị phản hồi AI đã lưu khi tải lại trang
  useEffect(() => {
    if (exercise && exercise.feedback) {
      setAiFeedback(exercise.feedback);
      setShowAiFeedback(true);
    }
  }, [exercise]);
  
  if (!isAuthenticated) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning">
          Vui lòng đăng nhập để xem bài tập viết của bạn.
        </div>
      </div>
    );
  }
  
  if (loading) {
    return <div className="container my-5"><Spinner /></div>;
  }
  
  if (error) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger">{error}</div>
        {error ? (
          <Link to="/writing" className="btn btn-primary">
            <i className="fas fa-arrow-left me-2"></i>
            Quay lại danh sách bài tập
          </Link>
        ) : (
          <Link to="/writing" className="btn btn-outline-primary">
            <i className="fas fa-arrow-left me-2"></i>
            Quay lại danh sách bài tập
          </Link>
        )}
      </div>
    );
  }
  
  if (!exercise) {
    return (
      <div className="container my-5">
        <div className="alert alert-warning">Không tìm thấy bài tập viết.</div>
        <Link to="/writing" className="btn btn-primary">
          <i className="fas fa-arrow-left me-2"></i>Quay lại danh sách bài tập
        </Link>
      </div>
    );
  }
  
  return (
    <div className="container my-5">
      <Helmet>
        <title>Bài tập viết | WebLearn-EAI</title>
      </Helmet>
      
      <div className="page-header mb-4">
        <div className="d-flex align-items-center">
          <Link to="/writing" className="btn btn-outline-secondary me-3">
            <i className="fas fa-arrow-left"></i>
          </Link>
          <div>
            <h2 className="page-title mb-0">Chi tiết bài tập viết</h2>
          </div>
        </div>
      </div>
      
      <div className="row">
        <div className="col-lg-12 mb-4">
          <div className="topic-card">
            <div className="card-header">
              <h5>Chủ đề</h5>
              <div className="d-flex align-items-center gap-2">
                <div className="language-badge">
                  <img 
                    src={getLanguageFlag(exercise.learningLanguage)} 
                    alt={getLanguageName(exercise.learningLanguage)} 
                    width="16" 
                    height="16"
                  />
                  {getLanguageName(exercise.learningLanguage)}
                </div>
              </div>
            </div>
            <div className="card-body">
              <p className="topic-content" style={{ whiteSpace: 'pre-line' }}>{exercise.topic}</p>
            </div>
          </div>
        </div>
        
        <div className="col-lg-12">
          <div className="writing-exercise-card">
            <div className="card-header">
              <h5>Bài viết của bạn</h5>
              <div className="d-flex align-items-center">
                {getStatusBadge(exercise.status)}
              </div>
            </div>
            <div className="card-body">
              <div id="editorjs" className="editor-container"></div>
              
              <div className="actions mt-3 d-flex justify-content-end gap-2">
                <button 
                  className="btn btn-outline-primary"
                  onClick={handleSave}
                  disabled={saving}
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
                  disabled={submitting || exercise.status === 'Completed'}
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
          </div>
        </div>
      </div>
      
      {/* AI Feedback Display */}
      {showAiFeedback && aiFeedback && (
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
              {/* Rendering markdown content using dangerouslySetInnerHTML should be used with caution */}
              {/* For a more robust solution, consider using a Markdown rendering library like react-markdown */}
              <div 
                dangerouslySetInnerHTML={{ 
                  __html: aiFeedback
                    .replace(/\n\n/g, '<br/><br/>')
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em>$1</em>')
                    .replace(/## (.*?)\n/g, '<h2>$1</h2>')
                    .replace(/# (.*?)\n/g, '<h1>$1</h1>')
                }} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Add helper functions for languages and flags
const getLanguageName = (code) => {
  switch (code) {
    case 'ENG':
      return 'English';
    case 'VIE':
      return 'Vietnamese';
    case 'KOR':
      return 'Korean';
    case 'JPN':
      return 'Japanese';
    case 'CHN':
      return 'Chinese';
    case 'FRA':
      return 'French';
    case 'GER':
      return 'German';
    case 'SPA':
      return 'Spanish';
    default:
      return code;
  }
};

const getLanguageFlag = (code) => {
  switch (code) {
    case 'ENG':
      return 'https://flagsapi.com/GB/flat/64.png';
    case 'VIE':
      return 'https://flagsapi.com/VN/flat/64.png';
    case 'KOR':
      return 'https://flagsapi.com/KR/flat/64.png';
    case 'JPN':
      return 'https://flagsapi.com/JP/flat/64.png';
    case 'CHN':
      return 'https://flagsapi.com/CN/flat/64.png';
    case 'FRA':
      return 'https://flagsapi.com/FR/flat/64.png';
    case 'GER':
      return 'https://flagsapi.com/DE/flat/64.png';
    case 'SPA':
      return 'https://flagsapi.com/ES/flat/64.png';
    default:
      return null;
  }
};

export default WritingExerciseDetailPage; 