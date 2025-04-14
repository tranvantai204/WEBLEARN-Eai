import React, { useEffect, useState } from 'react';
import { useWritingExercise } from '../contexts/WritingExerciseContext';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Spinner from './common/Spinner';
import '../css/components/WritingExercises.css';

const WritingExerciseList = () => {
  const { 
    writingExercises, 
    loading, 
    error,
    totalPages,
    currentPage,
    itemsPerPage,
    getAllWritingExercises 
  } = useWritingExercise();
  
  const { currentUser, isAuthenticated } = useAuth();
  const [userLoaded, setUserLoaded] = useState(false);
  
  // Debug writing exercises state
  useEffect(() => {
    console.log('WritingExerciseList - Current state:', { 
      writingExercises, 
      loading, 
      error, 
      totalPages, 
      currentPage,
      isAuthenticated,
      currentUserId: currentUser?.userId
    });
  }, [writingExercises, loading, error, totalPages, currentPage, isAuthenticated, currentUser]);
  
  // Load writing exercises on component mount
  useEffect(() => {
    // Just attempt to load exercises - the context will now handle getting userId if needed
    console.log('Attempting to load writing exercises...');
    loadWritingExercises(1);
  }, [isAuthenticated]);
  
  // Function to load writing exercises with pagination
  const loadWritingExercises = async (page) => {
    try {
      console.log(`Attempting to load page ${page}`);
      await getAllWritingExercises(currentUser?.userId, page, itemsPerPage);
    } catch (err) {
      // Error handling is already done in context
      console.error('Error in component:', err);
    }
  };
  
  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      loadWritingExercises(newPage);
    }
  };
  
  // Format date to a readable string
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };
  
  // Get status label with appropriate styling
  const getStatusLabel = (status) => {
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

  // Get language name from code
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
  
  // Get flag URL for language
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
  
  // Handle rendering based on different states
  if (!isAuthenticated) {
    return (
      <div className="alert alert-warning">
        Vui lòng đăng nhập để xem bài tập viết của bạn.
      </div>
    );
  }
  
  if (loading) {
    return <Spinner />;
  }
  
  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }
  
  if (!writingExercises || writingExercises.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">
          <i className="fas fa-pen-alt"></i>
        </div>
        <h5 className="title">Không có bài tập viết nào</h5>
        <p className="description">
          Bạn chưa có bài tập viết nào. Các bài tập sẽ xuất hiện ở đây khi được tạo.
        </p>
      </div>
    );
  }
  
  return (
    <div className="writing-exercises-container">
      <div className="row">
        {writingExercises.map(exercise => (
          <div className="col-md-6 col-lg-4 mb-4" key={exercise.writingExerciseId}>
            <div className="card exercise-card">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <div className="language-badge">
                    <img 
                      src={getLanguageFlag(exercise.learningLanguage)} 
                      alt={getLanguageName(exercise.learningLanguage)} 
                      width="16" 
                      height="16"
                    />
                    {getLanguageName(exercise.learningLanguage)}
                  </div>
                  {getStatusLabel(exercise.status)}
                </div>
                
                <h5 className="card-title">
                  {exercise.topic.length > 100 
                    ? exercise.topic.substring(0, 100) + '...' 
                    : exercise.topic}
                </h5>
                
                <div className="created-date">
                  <i className="far fa-calendar-alt me-2"></i>
                  {formatDate(exercise.createAt)}
                </div>
                
                <div className="metadata">
                  <div className="mb-1">
                    <strong className="me-2">Ngôn ngữ học:</strong> 
                    {getLanguageName(exercise.learningLanguage)}
                  </div>
                  <div>
                    <strong className="me-2">Ngôn ngữ mẹ đẻ:</strong> 
                    {getLanguageName(exercise.nativeLanguage)}
                  </div>
                </div>
                
                <Link 
                  to={`/writing/exercises/${exercise.writingExerciseId}`} 
                  className="btn btn-primary btn-action"
                >
                  {exercise.status === 'Not Started' ? (
                    <>
                      <i className="fas fa-pen me-2"></i>
                      Bắt đầu làm bài
                    </>
                  ) : (
                    <>
                      <i className="fas fa-eye me-2"></i>
                      Xem chi tiết
                    </>
                  )}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="pagination-container d-flex justify-content-center mt-4">
          <nav aria-label="Writing exercises pagination">
            <ul className="pagination">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button 
                  className="page-link" 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <span aria-hidden="true">&laquo;</span>
                  <span className="visually-hidden">Previous</span>
                </button>
              </li>
              
              {[...Array(totalPages).keys()].map(page => (
                <li 
                  key={page + 1} 
                  className={`page-item ${currentPage === page + 1 ? 'active' : ''}`}
                >
                  <button 
                    className="page-link" 
                    onClick={() => handlePageChange(page + 1)}
                  >
                    {page + 1}
                  </button>
                </li>
              ))}
              
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button 
                  className="page-link" 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <span aria-hidden="true">&raquo;</span>
                  <span className="visually-hidden">Next</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
};

export default WritingExerciseList; 